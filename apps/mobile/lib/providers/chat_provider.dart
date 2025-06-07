import 'dart:async';
import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';
import '../models/communication_log.dart';
import '../services/chat_service.dart';
import '../services/websocket_service.dart';
import 'api_provider.dart';
import 'auth_provider.dart';

part 'chat_provider.g.dart';

// Provider for the current chat thread ID
final chatThreadIdProvider = StateProvider<String>((ref) => '');

@riverpod
WebSocketService webSocketService(Ref ref) {
  final apiService = ref.watch(apiServiceProvider);
  return WebSocketService(apiService.baseUrl);
}

@riverpod
ChatService chatService(Ref ref) {
  final apiService = ref.watch(apiServiceProvider);
  return ChatService(apiService);
}

// Manages messages for a specific chat thread
@riverpod
class ChatThreadMessages
    extends AutoDisposeAsyncNotifier<List<CommunicationLog>> {
  StreamSubscription<CommunicationLog>? _subscription;
  String? _currentUserId;

  @override
  Future<List<CommunicationLog>> build() async {
    final threadId = ref.watch(chatThreadIdProvider);
    final authNotifier = ref.read(authNotifierProvider);
    _currentUserId = authNotifier.value?.id;

    _listenToMessages(threadId);

    final chatService = ref.read(chatServiceProvider);
    final response = await chatService.getMessages(
      threadId: threadId,
      limit: 50,
    );

    return response.data.reversed.toList();
  }

  void _listenToMessages(String threadId) {
    _subscription?.cancel();
    final chatService = ref.read(chatServiceProvider);

    _subscription = chatService.onMessage(threadId: threadId).listen(
      (newMessage) {
        state = state.whenData((messages) {
          if (!messages.any((m) => m.id == newMessage.id)) {
            return [...messages, newMessage];
          }
          return messages
              .map((m) => m.id == newMessage.id ? newMessage : m)
              .toList();
        });
      },
      onError: (error, stackTrace) {
        state = AsyncValue.error(error, stackTrace);
      },
    );

    ref.onDispose(() {
      _subscription?.cancel();
    });
  }

  Future<void> fetchMoreMessages(String threadId) async {
    if (state.isLoading || !state.hasValue) return;

    final currentMessages = state.value!;
    final currentPage = (currentMessages.length / 50).ceil() + 1;

    try {
      final chatService = ref.read(chatServiceProvider);
      final paginatedResponse = await chatService.getMessages(
          threadId: threadId, page: currentPage, limit: 50);
      if (paginatedResponse.data.isNotEmpty) {
        state = AsyncValue.data([
          ...paginatedResponse.data.reversed,
          ...currentMessages
        ]); // Prepend older messages
      }
    } catch (e) {
      // Handle error, maybe log or show a snackbar
      if (kDebugMode) {
        print('Failed to fetch more messages: $e');
      }
    }
  }

  Future<void> sendMessage({
    required String threadId,
    required String content,
    required String receiverId,
    String? channelId,
    String? entityId,
    String? entityType,
  }) async {
    // Optimistic update can be added here:
    // 1. Create a temporary message with a local ID.
    // 2. Add it to the state.
    // 3. Make the API call.
    // 4. On success, replace the temporary message with the real one from the server.
    // 5. On failure, remove the temporary message or mark it as failed.

    try {
      final chatService = ref.read(chatServiceProvider);
      await chatService.sendMessage(
        threadId: threadId,
        content: content,
        receiverId: receiverId,
        channelId: channelId,
        entityId: entityId,
        entityType: entityType,
      );
      // The WebSocket listener should ideally handle adding the new message to the state.
      // If not, or for immediate feedback:
      // state = state.whenData((messages) => [...messages, sentMessage]);
    } catch (e, st) {
      // Handle send failure (e.g., show error, revert optimistic update)
      state = AsyncValue.error(e, st);
    }
  }

  Future<void> markMessagesAsRead(String threadId) async {
    if (_currentUserId == null) return;
    try {
      final chatService = ref.read(chatServiceProvider);
      await chatService.markAsRead(threadId: threadId);

      state = state.whenData((messages) {
        return messages.map((msg) {
          if (msg.receiverId == _currentUserId && !msg.isRead) {
            return msg.copyWith(isRead: true, readAt: DateTime.now());
          }
          return msg;
        }).toList();
      });
    } catch (e) {
      // Error is handled by the state management
      rethrow;
    }
  }

  Future<void> markAsUnread(String id) async {}

  Future<void> deleteChat(String id) async {}
}

extension on Map<String, dynamic>? {
  String? get id => null;
}

// Removed unnecessary extension

// Provider for chat list
@riverpod
class ChatList extends AutoDisposeAsyncNotifier<List<CommunicationLog>> {
  @override
  Future<List<CommunicationLog>> build() async {
    final chatService = ref.read(chatServiceProvider);

    try {
      final response = await chatService.getMessages(
        page: 1,
        limit: 50,
      );
      return response.data;
    } catch (e, st) {
      state = AsyncValue.error(e, st);
      rethrow;
    }
  }

  Future<void> refresh() async {
    state = const AsyncValue.loading();
    final chatService = ref.read(chatServiceProvider);

    try {
      final response = await chatService.getMessages(
        page: 1,
        limit: 50,
      );
      state = AsyncValue.data(response.data);
    } catch (e, st) {
      state = AsyncValue.error(e, st);
      rethrow;
    }
  }

  Future<void> filterChats({
    String? query,
    String? filter,
    int page = 1,
    int limit = 20,
  }) async {
    state = const AsyncValue.loading();
    final chatService = ref.read(chatServiceProvider);

    try {
      final response = await chatService.getMessages(
        page: page,
        limit: limit,
        otherUserId: query,
      );
      state = AsyncValue.data(response.data);
    } catch (e, st) {
      state = AsyncValue.error(e, st);
      rethrow;
    }
  }

  Future<void> markAsUnread(String id) async {}

  Future<void> deleteChat(String id) async {}
}
