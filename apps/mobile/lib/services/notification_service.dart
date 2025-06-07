import 'dart:async';
import 'dart:convert';
import 'dart:developer';

import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:web_socket_channel/web_socket_channel.dart';

import '../api/api_service.dart';
import '../models/notification.dart';
import '../models/pagination.dart';

/// Custom exception for notification-related errors.
class NotificationException implements Exception {
  final String message;
  final String? code;

  NotificationException(this.message, {this.code});

  /// Creates a "not found" notification exception.
  factory NotificationException.notFound(String message) =>
      NotificationException(message, code: 'NOT_FOUND');
  @override
  String toString() =>
      'NotificationException: $message${code != null ? ' (Code: $code)' : ''}';
}

class NotificationService {
  final ApiService _apiService;
  WebSocketChannel? _channel;
  final _notificationController = StreamController<Notification>.broadcast();
  late final Future<SharedPreferences> _preferences;
  Timer? _reconnectTimer;
  int _reconnectAttempts = 0;
  static const int _maxReconnectAttempts = 5;
  static const Duration _reconnectDelay = Duration(seconds: 5);

  NotificationService(ApiService apiService) : _apiService = apiService {
    _preferences = SharedPreferences.getInstance();
  }

  /// Subscribes to notifications for the given user ID.
  ///
  /// Returns a stream of notifications.
  Stream<Notification> subscribeToNotifications(String userId) {
    _connectWebSocket(userId);
    return _notificationController.stream;
  }

  void _connectWebSocket(String userId) {
    if (_channel != null) {
      _channel!.sink.close();
      _channel = null;
    }

    // Use the wsUrl from ApiService and ensure the path is appended correctly.
    // Assuming _apiService.wsUrl is like "ws://localhost:3001" (without a trailing path for notifications)
    final fullWsUrl = Uri.parse('${_apiService.wsUrl}/notifications/$userId');
    _channel = WebSocketChannel.connect(fullWsUrl);

    _channel!.stream.listen(
      (message) {
        try {
          final data = json.decode(message);
          final notification = Notification.fromJson(data);

          // Check notification preferences before adding to stream
          _shouldShowNotification(notification).then((shouldShow) {
            if (shouldShow) {
              _notificationController.add(notification);
            }
          });
        } catch (e) {
          log('Error parsing notification: $e');
        }
      },
      onError: (error) {
        log('WebSocket error: $error');
        _handleReconnect(userId);
      },
      onDone: () {
        log('WebSocket connection closed');
        _handleReconnect(userId);
      },
    );
  }

  void _handleReconnect(String userId) {
    if (_reconnectAttempts < _maxReconnectAttempts) {
      _reconnectTimer?.cancel();
      _reconnectTimer = Timer(_reconnectDelay, () {
        _reconnectAttempts++;
        _connectWebSocket(userId);
      });
    } else {
      log('Max reconnection attempts reached');
      _reconnectAttempts = 0;
    }
  }

  Future<bool> _shouldShowNotification(Notification notification) async {
    final prefs = await _preferences;
    final type = notification.type.toString().split('.').last;
    return prefs.getBool('notifications.$type') ?? true;
  }

  Future<void> updateNotificationPreferences(
    String type,
    bool enabled,
  ) async {
    final prefs = await _preferences;
    await prefs.setBool('notifications.$type', enabled);
  }

  Future<Map<String, bool>> getNotificationPreferences() async {
    final prefs = await _preferences;
    final preferences = <String, bool>{};

    for (final type in NotificationType.values) {
      final key = 'notifications.${type.toString().split('.').last}';
      preferences[key] = prefs.getBool(key) ?? true;
    }

    return preferences;
  }

  /// Fetches notifications using the TRPC endpoint.
  Future<PaginatedResponse<Notification>> getNotifications(
    String s, {
    int page = 1,
    int limit = 10,
    String? userId,
    NotificationType? type,
    String? entityId,
    String? entityType,
    bool? isRead,
    String? tenantId,
    String? agencyId,
    String? reviewId,
    String? agentId,
    DateTime? createdAtFrom,
    DateTime? createdAtTo,
    DateTime? deletedAt, // For filtering soft-deleted
    String? sortBy,
    String sortOrder = 'desc',
  }) async {
    try {
      final Map<String, dynamic> params = {
        'page': page,
        'limit': limit,
        'sortOrder': sortOrder,
      };
      if (userId != null) params['userId'] = userId;
      if (type != null) params['type'] = type.name;
      if (entityId != null) params['entityId'] = entityId;
      if (entityType != null) params['entityType'] = entityType;
      if (isRead != null) params['isRead'] = isRead;
      if (tenantId != null) params['tenantId'] = tenantId;
      if (agencyId != null) params['agencyId'] = agencyId;
      if (reviewId != null) params['reviewId'] = reviewId;
      if (agentId != null) params['agentId'] = agentId;
      if (createdAtFrom != null) {
        params['createdAtFrom'] = createdAtFrom.toIso8601String();
      }
      if (createdAtTo != null) {
        params['createdAtTo'] = createdAtTo.toIso8601String();
      }
      if (deletedAt != null) params['deletedAt'] = deletedAt.toIso8601String();
      if (sortBy != null) params['sortBy'] = sortBy;

      final response = await _apiService.query('notification.all', params);
      if (response == null) {
        throw NotificationException('No data returned from getNotifications');
      }
      return PaginatedResponse<Notification>.fromJson(
        response,
        (json) => Notification.fromJson(json as Map<String, dynamic>),
        dataKey:
            'data', // tRPC response has items under a 'data' key in the paginated structure
      );
    } catch (e, st) {
      _logError('getNotifications', e, st);
      throw NotificationException('Failed to fetch notifications: $e');
    }
  }

  Future<void> markAsRead(String notificationId) async {
    try {
      // Assuming 'notification.update' can be used to mark as read
      await _apiService.mutation('notification.update', {
        'id': notificationId,
        'isRead': true,
      });
    } catch (e, st) {
      _logError('markAsRead', e, st);
      throw NotificationException('Failed to mark notification as read: $e');
    }
  }

  Future<void> markAllAsRead(String userId) async {
    try {
      // This might require a specific backend endpoint or iterating through unread notifications.
      // For simplicity, assuming a hypothetical 'notification.markAllRead' endpoint.
      // If not available, this method would need to fetch unread notifications and update them individually.
      // await _apiService.mutation('notification.markAllRead', {});
      log('markAllAsRead: This functionality might require a dedicated backend endpoint or client-side iteration.');
      throw UnimplementedError(
          'markAllAsRead is not fully implemented without a dedicated backend endpoint.');
    } catch (e, st) {
      _logError('markAllAsRead', e, st);
      throw NotificationException(
          'Failed to mark all notifications as read: $e');
    }
  }

  Future<void> deleteNotification(String notificationId) async {
    try {
      await _apiService.mutation('notification.delete', {'id': notificationId});
    } catch (e, st) {
      _logError('deleteNotification', e, st);
      if (e is NotificationException && e.code == 'NOT_FOUND') rethrow;
      if (e.toString().contains('not found') ||
          e.toString().contains('P2025')) {
        throw NotificationException.notFound(
            'Notification not found or already deleted with ID: $notificationId.');
      }
      throw NotificationException('Failed to delete notification: $e');
    }
  }

  void _logError(String method, Object error, StackTrace st) {
    log('[NotificationService][$method] $error', error: error, stackTrace: st);
    if (kDebugMode) {
      print('NotificationService.$method error: $error\n$st');
    }
    // Logging is handled here. Rethrowing or wrapping is done in the calling catch block.
  }

  void dispose() {
    _reconnectTimer?.cancel();
    _channel?.sink.close();
    _notificationController.close();
  }

  /// Fetches unread notifications for the current user
  Future<PaginatedResponse<Notification>> getUnreadNotifications({
    int page = 1,
    int limit = 10,
  }) async {
    try {
      return await getNotifications(
        '', // Required string parameter
        page: page,
        limit: limit,
        isRead: false,
      );
    } catch (e, st) {
      _logError('getUnreadNotifications', e, st);
      rethrow;
    }
  }

  Future<List<Notification>> getAll() async {
    return [];
  }

  Future<void> markAllAsReadForUser(String s) async {}
}
