import 'dart:developer';

import 'package:mobile/api/api_service.dart';
import '../models/message.dart';
import 'package:mobile/models/pagination.dart';

/// Custom exception for message-related errors.
class MessageException implements Exception {
  final String message;
  final String? code;

  MessageException(this.message, {this.code});

  /// Creates a "not found" message exception.
  factory MessageException.notFound(String message) =>
      MessageException(message, code: 'NOT_FOUND');

  @override
  String toString() =>
      'MessageException: $message${code != null ? ' (Code: $code)' : ''}';
}

/// Service for handling message-related API operations via TRPC.
class MessageService {
  final ApiService _apiService;

  MessageService(this._apiService);

  /// Fetches all messages (optionally filtered).
  Future<PaginatedResponse<Message>> getMessages({
    int page = 1,
    int limit = 10,
    String? channelId,
    String? senderId,
    String? sortBy,
    String sortOrder = 'desc', // Common default for messages
  }) async {
    try {
      final params = {
        'page': page,
        'limit': limit,
        if (channelId != null) 'channelId': channelId,
        if (senderId != null) 'senderId': senderId,
        if (sortBy != null) 'sortBy': sortBy,
        'sortOrder': sortOrder,
      };
      // Assuming the endpoint 'message.all' for paginated/filterable messages
      final response = await _apiService.query('message.all', params);

      if (response == null) {
        throw MessageException('No data returned from getMessages');
      }
      return PaginatedResponse<Message>.fromJson(
        response,
        (json) => Message.fromJson(json as Map<String, dynamic>),
        dataKey:
            '', // Assuming data is at the root, adjust if nested (e.g., 'data')
      );
    } catch (e, st) {
      _logError('getMessages', e, st);
      throw MessageException('Failed to get messages: $e');
    }
  }

  /// Fetches a single message by ID.
  Future<Message> getMessage(String id) async {
    try {
      // Assuming the endpoint 'message.byId' for fetching a single message
      final response = await _apiService.query(
        'message.byId',
        {'id': id},
      );
      if (response == null) {
        throw MessageException.notFound(
            'Message not found with ID: $id. No data returned.');
      }
      return Message.fromJson(response as Map<String, dynamic>);
    } catch (e, st) {
      _logError('getMessage', e, st);
      if (e is MessageException && e.code == 'NOT_FOUND') rethrow;
      if (e.toString().contains('not found') ||
          e.toString().contains('P2025')) {
        throw MessageException.notFound('Message not found with ID: $id.');
      }
      throw MessageException('Failed to get message: $e');
    }
  }

  /// Creates a new message.
  Future<Message> createMessage({
    required String content,
    required String senderId,
    required String channelId, // Example: A common field for messages
    String? type, // e.g., 'text', 'image'
    Map<String, dynamic>? metadata,
  }) async {
    try {
      final params = {
        'content': content,
        'senderId': senderId,
        'channelId': channelId,
        if (type != null) 'type': type,
        if (metadata != null) 'metadata': metadata,
      };
      final response = await _apiService.mutation(
        'message.create',
        params,
      );
      if (response == null) {
        throw MessageException('No data returned from createMessage');
      }
      return Message.fromJson(response as Map<String, dynamic>);
    } catch (e, st) {
      _logError('createMessage', e, st);
      throw MessageException('Failed to create message: $e');
    }
  }

  /// Updates an existing message by ID.
  Future<Message> updateMessage({
    required String id,
    String? content,
    Map<String, dynamic>? metadata,
    // Add other updatable fields as needed
  }) async {
    try {
      final params = {
        'id': id,
        if (content != null) 'content': content,
        if (metadata != null) 'metadata': metadata,
      };
      final response = await _apiService.mutation(
        'message.update',
        params,
      );
      if (response == null) {
        throw MessageException('No data returned from updateMessage');
      }
      return Message.fromJson(response as Map<String, dynamic>);
    } catch (e, st) {
      _logError('updateMessage', e, st);
      if (e.toString().contains('not found') ||
          e.toString().contains('P2025')) {
        throw MessageException.notFound(
            'Message not found for update with ID: $id.');
      }
      throw MessageException('Failed to update message: $e');
    }
  }

  /// Deletes a message by ID.
  Future<void> deleteMessage(String id) async {
    try {
      await _apiService.mutation('message.delete', {'id': id});
    } catch (e, st) {
      _logError('deleteMessage', e, st);
      if (e.toString().contains('not found') ||
          e.toString().contains('P2025')) {
        throw MessageException.notFound(
            'Message not found or already deleted with ID: $id.');
      }
      throw MessageException('Failed to delete message: $e');
    }
  }

  void _logError(String method, Object error, StackTrace st) {
    log('[MessageService][$method] $error', error: error, stackTrace: st);
  }
}
