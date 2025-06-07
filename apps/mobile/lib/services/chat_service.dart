import 'dart:developer';

import '../api/api_service.dart';
import '../exceptions/api_exception.dart';
import '../models/communication_log.dart';
import '../models/pagination.dart';

class ChatService {
  final ApiService _apiService;

  ChatService(this._apiService);

  /// Fetches messages with pagination and filtering
  Future<PaginatedResponse<CommunicationLog>> getMessages({
    String? threadId,
    String? otherUserId,
    int page = 1,
    int limit = 50,
  }) async {
    try {
      final response = await _apiService.query(
        'chat.getMessages',
        {
          if (threadId != null) 'threadId': threadId,
          if (otherUserId != null) 'otherUserId': otherUserId,
          'page': page,
          'limit': limit,
        },
      );

      if (response == null) {
        throw ApiException.server('No data returned from getMessages');
      }

      return PaginatedResponse<CommunicationLog>.fromJson(
        response,
        (json) => CommunicationLog.fromJson(json as Map<String, dynamic>),
        dataKey: '',
      );
    } catch (e, st) {
      _logError('getMessages', e, st);
      throw ApiException.server('Failed to get messages: $e');
    }
  }

  /// Gets support agents with optional filtering
  Future<PaginatedResponse<Map<String, dynamic>>> getSupportAgents({
    String? agencyId,
    int page = 1,
    int limit = 50,
  }) async {
    try {
      final response = await _apiService.query(
        'chat.getSupportAgents',
        {
          if (agencyId != null) 'agencyId': agencyId,
          'page': page,
          'limit': limit,
        },
      );

      if (response == null) {
        throw ApiException.server('No data returned from getSupportAgents');
      }

      return PaginatedResponse<Map<String, dynamic>>.fromJson(
        response,
        (json) => Map<String, dynamic>.from(json as Map),
        dataKey: '',
      );
    } catch (e, st) {
      _logError('getSupportAgents', e, st);
      throw ApiException.server('Failed to get support agents: $e');
    }
  }

  /// Sends a new message
  Future<CommunicationLog> sendMessage({
    required String content,
    required String receiverId,
    String? threadId,
    String? channelId,
    String? entityId,
    String? entityType,
    String? name,
    String? email,
  }) async {
    try {
      final response = await _apiService.mutation(
        'chat.sendMessage',
        {
          'content': content,
          'receiverId': receiverId,
          if (threadId != null) 'threadId': threadId,
          if (channelId != null) 'channelId': channelId,
          if (entityId != null) 'entityId': entityId,
          if (entityType != null) 'entityType': entityType,
          if (name != null) 'name': name,
          if (email != null) 'email': email,
        },
      );

      if (response == null) {
        throw ApiException.server('No data returned from sendMessage');
      }

      return CommunicationLog.fromJson(response);
    } catch (e, st) {
      _logError('sendMessage', e, st);
      throw ApiException.server('Failed to send message: $e');
    }
  }

  /// Marks messages as read
  Future<void> markAsRead({
    String? senderId,
    String? threadId,
  }) async {
    try {
      await _apiService.mutation(
        'chat.markAllAsRead',
        {
          if (senderId != null) 'senderId': senderId,
          if (threadId != null) 'threadId': threadId,
        },
      );
    } catch (e, st) {
      _logError('markAsRead', e, st);
      throw ApiException.server('Failed to mark messages as read: $e');
    }
  }

  /// Deletes a message
  Future<CommunicationLog> deleteMessage(String messageId) async {
    try {
      final response = await _apiService.mutation(
        'chat.deleteMessage',
        {'id': messageId},
      );

      if (response == null) {
        throw ApiException.server('No data returned from deleteMessage');
      }

      return CommunicationLog.fromJson(response);
    } catch (e, st) {
      _logError('deleteMessage', e, st);
      if (e.toString().contains('not found') ||
          e.toString().contains('P2025')) {
        throw ApiException.notFound('Message not found');
      }
      throw ApiException.server('Failed to delete message: $e');
    }
  }

  /// Updates a message
  Future<CommunicationLog> updateMessage({
    required String id,
    bool? isRead,
    Map<String, dynamic>? metadata,
  }) async {
    try {
      final response = await _apiService.mutation(
        'chat.updateMessage',
        {
          'id': id,
          if (isRead != null) 'isRead': isRead,
          if (metadata != null) 'metadata': metadata,
        },
      );

      if (response == null) {
        throw ApiException.server('No data returned from updateMessage');
      }

      return CommunicationLog.fromJson(response);
    } catch (e, st) {
      _logError('updateMessage', e, st);
      if (e.toString().contains('not found') ||
          e.toString().contains('P2025')) {
        throw ApiException.notFound('Message not found');
      }
      throw ApiException.server('Failed to update message: $e');
    }
  }

  /// Subscribes to real-time message updates
  Stream<CommunicationLog> onMessage({required String threadId}) {
    // Implementation depends on your real-time setup
    // This is a placeholder that would be implemented with your WebSocket/SSE client
    return const Stream.empty();
  }

  void _logError(String method, Object error, StackTrace st) {
    log('[ChatService][$method] $error', error: error, stackTrace: st);
  }
}
