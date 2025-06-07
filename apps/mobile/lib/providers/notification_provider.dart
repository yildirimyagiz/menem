import 'dart:async';
import 'dart:developer';

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';

import '../models/notification.dart';
import '../services/notification_service.dart';
import 'api_providers.dart';
import 'auth_provider.dart';

part 'notification_provider.g.dart';

/// Provider for the NotificationService
@riverpod
// ignore: deprecated_member_use_from_same_package
NotificationService notificationService(NotificationServiceRef ref) {
  final apiService = ref.watch(apiServiceProvider);
  return NotificationService(apiService);
}

/// Notifier for managing a list of notifications
@riverpod
class NotificationsNotifier extends _$NotificationsNotifier {
  late final NotificationService _notificationService;
  Timer? _refreshTimer;
  StreamSubscription? _webSocketSubscription;
  String? _currentUserId;

  // Using authNotifierProvider directly from auth_provider.dart
  ProviderListenable<AsyncValue<Map<String, dynamic>?>> get authProvider =>
      authNotifierProvider;

  @override
  Future<List<Notification>> build() async {
    _notificationService = ref.watch(notificationServiceProvider);
    final authState = ref.watch(authProvider);
    _currentUserId = authState.asData?.value?['id']?.toString();

    if (_currentUserId != null) {
      _setupWebSocket();
      _setupPeriodicRefresh();
    }

    ref.onDispose(() {
      _refreshTimer?.cancel();
      _webSocketSubscription?.cancel();
    });

    return _loadNotifications();
  }

  Future<List<Notification>> _loadNotifications() async {
    try {
      final response = await _notificationService.getNotifications(
        '', // Required string parameter
        page: 1,
        limit: 50, // Adjust limit as needed
      );
      return response.data;
    } catch (e, st) {
      state = AsyncValue.error(e, st);
      rethrow;
    }
  }

  void _setupWebSocket() {
    if (_currentUserId == null) return;

    _webSocketSubscription?.cancel();
    _webSocketSubscription =
        _notificationService.subscribeToNotifications(_currentUserId!).listen(
              (notification) => _handleNewNotification(notification),
              onError: (error) => _handleWebSocketError(error),
            );
  }

  void _setupPeriodicRefresh() {
    _refreshTimer?.cancel();
    _refreshTimer = Timer.periodic(const Duration(minutes: 5), (_) {
      if (_currentUserId != null) {
        refresh();
      }
    });
  }

  void _handleNewNotification(Notification notification) {
    state.whenData((notifications) {
      state = AsyncValue.data([notification, ...notifications]);
    });
  }

  void _handleWebSocketError(dynamic error) {
    log('WebSocket error: $error',
        error: error, stackTrace: StackTrace.current);
    _setupWebSocket(); // Try to reconnect
  }

  Future<void> refresh() async {
    state = const AsyncValue.loading();
    state = await AsyncValue.guard(_loadNotifications);
  }

  Future<void> markAsRead(String id) async {
    try {
      await _notificationService.markAsRead(id);
      state = await AsyncValue.guard(_loadNotifications);
    } catch (e, st) {
      state = AsyncValue.error(e, st);
      rethrow;
    }
  }

  Future<void> markAllAsRead() async {
    try {
      if (_currentUserId != null) {
        await _notificationService.markAllAsRead(_currentUserId!);
        state = await AsyncValue.guard(_loadNotifications);
      }
    } catch (e, st) {
      state = AsyncValue.error(e, st);
      rethrow;
    }
  }

  Future<void> delete(String id) async {
    try {
      await _notificationService.deleteNotification(id);
      final currentList = state.value ?? [];
      state = AsyncValue.data(
        currentList.where((n) => n.id != id).toList(),
      );
    } catch (e, st) {
      state = AsyncValue.error(e, st);
      rethrow;
    }
  }
}

/// Notifier for managing unread notifications
@riverpod
class UnreadNotificationsNotifier extends _$UnreadNotificationsNotifier {
  late final NotificationService _notificationService;

  @override
  Future<List<Notification>> build() async {
    _notificationService = ref.watch(notificationServiceProvider);
    return _loadUnreadNotifications();
  }

  Future<List<Notification>> _loadUnreadNotifications() async {
    try {
      final response = await _notificationService.getUnreadNotifications();
      return response.data;
    } catch (e, st) {
      state = AsyncValue.error(e, st);
      rethrow;
    }
  }

  Future<void> markAsRead(String id) async {
    try {
      await _notificationService.markAsRead(id);
      state = await AsyncValue.guard(_loadUnreadNotifications);
    } catch (e, st) {
      state = AsyncValue.error(e, st);
      rethrow;
    }
  }

  Future<void> markAllAsRead() async {
    try {
      final authState = ref.read(authNotifierProvider);
      final userId = authState.asData?.value?['id']?.toString();
      if (userId != null) {
        await _notificationService.markAllAsRead(userId);
        state = await AsyncValue.guard(_loadUnreadNotifications);
      }
    } catch (e, st) {
      state = AsyncValue.error(e, st);
      rethrow;
    }
  }
}

/// Notifier for managing a single notification
@riverpod
class NotificationNotifier extends _$NotificationNotifier {
  late final NotificationService _notificationService;
  String? _notificationId;

  @override
  Future<Notification?> build(String id) async {
    _notificationId = id;
    _notificationService = ref.watch(notificationServiceProvider);

    if (id.isEmpty) return null;

    try {
      // Get notifications and find the one with matching ID
      final response = await _notificationService.getNotifications(
        '', // Required string parameter
        page: 1,
        limit: 1,
        entityId: id,
      );

      if (response.data.isNotEmpty) {
        return response.data.first;
      }
      return null;
    } catch (e) {
      if (e.toString().contains('not found')) return null;
      rethrow;
    }
  }

  Future<void> refresh() async {
    if (_notificationId != null) {
      state = await AsyncValue.guard(() => build(_notificationId!));
    }
  }

  Future<void> markAsRead() async {
    if (_notificationId != null) {
      await _notificationService.markAsRead(_notificationId!);
      await refresh();
    }
  }

  Future<void> delete() async {
    if (_notificationId != null) {
      await _notificationService.deleteNotification(_notificationId!);
      state = const AsyncValue.data(null);
    }
  }
}
