import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';
import '../models/message.dart';
import '../models/pagination.dart';
import '../services/message_service.dart';
import 'api_providers.dart';

part 'message_provider.g.dart';

@riverpod
MessageService messageService(Ref ref) {
  return MessageService(ref.watch(apiServiceProvider));
}

@riverpod
class MessageNotifier extends _$MessageNotifier {
  late final MessageService _messageService;

  @override
  Future<List<Message>> build() async {
    _messageService = ref.watch(messageServiceProvider);
    // Return empty list initially, use getMessagesByChannel to fetch messages
    return [];
  }

  Future<void> refresh() async {
    state = const AsyncValue.loading();
    state = await AsyncValue.guard(() async {
      final response = await _messageService.getMessages();
      return response.data;
    });
  }

  /// Fetch messages by channel ID
  Future<PaginatedResponse<Message>> getMessagesByChannel(
    String channelId, {
    int page = 1,
    int limit = 20,
  }) async {
    state = const AsyncValue.loading();
    final response = await _messageService.getMessages(
      channelId: channelId,
      page: page,
      limit: limit,
    );
    state = AsyncValue.data(response.data);
    return response;
  }

  /// Create a new message
  Future<Message> createMessage({
    required String content,
    required String senderId,
    required String channelId,
    String? type,
    Map<String, dynamic>? metadata,
  }) async {
    try {
      final message = await _messageService.createMessage(
        content: content,
        senderId: senderId,
        channelId: channelId,
        type: type,
        metadata: metadata,
      );
      
      // Update the state with the new message
      if (state.hasValue) {
        final messages = List<Message>.from(state.value!);
        messages.add(message);
        state = AsyncValue.data(messages);
      }
      
      return message;
    } catch (e, st) {
      state = AsyncValue.error(e, st);
      rethrow;
    }
  }

  /// Update an existing message
  Future<Message> updateMessage({
    required String id,
    String? content,
    Map<String, dynamic>? metadata,
  }) async {
    try {
      final updatedMessage = await _messageService.updateMessage(
        id: id,
        content: content,
        metadata: metadata,
      );
      
      // Update the state with the updated message
      if (state.hasValue) {
        final messages = List<Message>.from(state.value!);
        final index = messages.indexWhere((msg) => msg.id == id);
        if (index != -1) {
          messages[index] = updatedMessage;
          state = AsyncValue.data(messages);
        }
      }
      
      return updatedMessage;
    } catch (e, st) {
      state = AsyncValue.error(e, st);
      rethrow;
    }
  }

  /// Delete a message
  Future<void> deleteMessage(String id) async {
    try {
      await _messageService.deleteMessage(id);
      
      // Update the state by removing the deleted message
      if (state.hasValue) {
        final messages = state.value!.where((msg) => msg.id != id).toList();
        state = AsyncValue.data(messages);
      }
    } catch (e, st) {
      state = AsyncValue.error(e, st);
      rethrow;
    }
  }
}

@riverpod
class MessageDetailNotifier extends _$MessageDetailNotifier {
  late final MessageService _messageService;
  String? _messageId;

  @override
  Future<Message?> build(String id) async {
    _messageService = ref.watch(messageServiceProvider);
    _messageId = id;
    if (id.isEmpty) return null;
    return _messageService.getMessage(id);
  }

  Future<void> refresh() async {
    if (_messageId == null) return;
    state = const AsyncValue.loading();
    state = await AsyncValue.guard(() => _messageService.getMessage(_messageId!));
  }

  /// Update the current message
  Future<Message> updateMessage({
    String? content,
    Map<String, dynamic>? metadata,
  }) async {
    if (_messageId == null) {
      throw StateError('No message ID available');
    }
    
    final message = await _messageService.updateMessage(
      id: _messageId!,
      content: content,
      metadata: metadata,
    );
    
    // Update the state with the updated message
    state = AsyncValue.data(message);
    return message;
  }

  /// Delete the current message
  Future<void> delete() async {
    if (_messageId == null) return;
    
    await _messageService.deleteMessage(_messageId!);
    state = const AsyncValue.data(null);
  }
}
