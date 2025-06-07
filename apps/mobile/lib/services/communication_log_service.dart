import 'package:flutter/foundation.dart';

import '../models/communication_log.dart';
import 'dart:developer';

/// Custom exception for communication log-related errors.
class CommunicationLogException implements Exception {
  final String message;
  CommunicationLogException(this.message);
  @override
  String toString() => 'CommunicationLogException: $message';
}

/// Service for handling communication log-related API operations via TRPC.
class CommunicationLogService {
  final TrpcClient _client;

  CommunicationLogService(this._client);

  /// Fetches all communication logs (optionally filtered).
  Future<List<CommunicationLog>> getLogs(
      {String? senderId, String? receiverId}) async {
    try {
      final response = await _client.query<List<dynamic>>(
        'communicationLog.getAll',
        {
          if (senderId != null) 'senderId': senderId,
          if (receiverId != null) 'receiverId': receiverId,
        },
      );
      if (response == null) {
        throw CommunicationLogException('No data returned from getLogs');
      }
      final logsJson = List<Map<String, dynamic>>.from(response);
      return logsJson.map((json) => CommunicationLog.fromJson(json)).toList();
    } catch (e, st) {
      _logError('getLogs', e, st);
      throw CommunicationLogException('Failed to get communication logs: $e');
    }
  }

  /// Fetches a single communication log by ID.
  Future<CommunicationLog> getLog(String id) async {
    try {
      final response = await _client.query<Map<String, dynamic>>(
        'communicationLog.get',
        {'id': id},
      );
      if (response == null) {
        throw CommunicationLogException('No data returned from getLog');
      }
      return CommunicationLog.fromJson(response);
    } catch (e, st) {
      _logError('getLog', e, st);
      throw CommunicationLogException('Failed to get communication log: $e');
    }
  }

  /// Creates a new communication log.
  Future<CommunicationLog> createLog({
    required String senderId,
    required String receiverId,
    required CommunicationType type,
    required String content,
    String? entityId,
    String? entityType,
    Map<String, dynamic>? metadata,
    bool isRead = false,
  }) async {
    try {
      final response = await _client.mutation<Map<String, dynamic>>(
        'communicationLog.create',
        {
          'senderId': senderId,
          'receiverId': receiverId,
          'type': type.toString().split('.').last,
          'content': content,
          'entityId': entityId,
          'entityType': entityType,
          'metadata': metadata,
          'isRead': isRead,
        },
      );
      if (response == null) {
        throw CommunicationLogException('No data returned from createLog');
      }
      return CommunicationLog.fromJson(response);
    } catch (e, st) {
      _logError('createLog', e, st);
      throw CommunicationLogException('Failed to create communication log: $e');
    }
  }

  /// Updates an existing communication log by ID.
  Future<CommunicationLog> updateLog({
    required String id,
    CommunicationType? type,
    String? content,
    String? entityId,
    String? entityType,
    Map<String, dynamic>? metadata,
    bool? isRead,
  }) async {
    try {
      final response = await _client.mutation<Map<String, dynamic>>(
        'communicationLog.update',
        {
          'id': id,
          if (type != null) 'type': type.toString().split('.').last,
          if (content != null) 'content': content,
          if (entityId != null) 'entityId': entityId,
          if (entityType != null) 'entityType': entityType,
          if (metadata != null) 'metadata': metadata,
          if (isRead != null) 'isRead': isRead,
        },
      );
      if (response == null) {
        throw CommunicationLogException('No data returned from updateLog');
      }
      return CommunicationLog.fromJson(response);
    } catch (e, st) {
      _logError('updateLog', e, st);
      throw CommunicationLogException('Failed to update communication log: $e');
    }
  }

  /// Deletes a communication log by ID.
  Future<void> deleteLog(String id) async {
    try {
      await _client.mutation<void>('communicationLog.delete', {'id': id});
    } catch (e, st) {
      _logError('deleteLog', e, st);
      throw CommunicationLogException('Failed to delete communication log: $e');
    }
  }

  void _logError(String method, Object error, StackTrace st) {
    log('[CommunicationLogService][$method] $error',
        error: error, stackTrace: st);
    // Optionally log errors to a logging service or console
    if (kDebugMode) {
      print('CommunicationLogService.$method error: $error\n$st');
    }
  }
}

class TrpcClient {
  Future<T?> query<T>(String procedure, Map<String, Object?> params) async {
    return null;
  }

  Future<T?> mutation<T>(String procedure, Map<String, Object?> params) async {
    return null;
  }
}
