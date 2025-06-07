import 'dart:core';
import 'dart:developer';

import 'package:flutter/foundation.dart';

import '../models/mention.dart'; // Ensure this path is correct
import '../api/api_service.dart';
import '../models/pagination.dart'; // Ensure this path is correct

/// Custom exception for mention-related errors.
class MentionException implements Exception {
  final String message;
  final String? code; // Added for consistency
  MentionException(this.message, {this.code});

  /// Creates a "not found" mention exception.
  factory MentionException.notFound(String message) =>
      MentionException(message, code: 'NOT_FOUND');
  @override
  String toString() =>
      'MentionException: $message${code != null ? ' (Code: $code)' : ''}';
}

/// Service for handling mention-related API operations via TRPC.
class MentionService {
  final ApiService _apiService;

  MentionService(this._apiService);

  /// Fetches mentions with filtering and pagination.
  /// Corresponds to the `mention.filter` TRPC procedure.
  Future<PaginatedResponse<Mention>> getMentions({
    int page = 1,
    int limit = 10, // This will be mapped to 'pageSize' for the API call
    String? mentionedById,
    String? mentionedToId,
    MentionType? type,
    String? taskId,
    String? propertyId,
    bool? isRead,
    String? agencyId,
    String? userId,
    DateTime? createdAtFrom,
    DateTime? createdAtTo,
    DateTime? deletedAt, // To filter by soft-deletion status
    String? sortBy, // e.g., "createdAt", "type", "isRead"
    String sortOrder = 'desc',
  }) async {
    try {
      final Map<String, dynamic> params = {
        'page': page,
        'pageSize': limit, // `mention.filter` uses `pageSize`
        'sortOrder': sortOrder,
      };
      if (mentionedById != null) params['mentionedById'] = mentionedById;
      if (mentionedToId != null) params['mentionedToId'] = mentionedToId;
      if (type != null) {
        params['type'] =
            type.name; // Assuming MentionType is an enum with a .name getter
      }
      if (taskId != null) params['taskId'] = taskId;
      if (propertyId != null) params['propertyId'] = propertyId;
      if (isRead != null) params['isRead'] = isRead;
      if (agencyId != null) params['agencyId'] = agencyId;
      if (userId != null) params['userId'] = userId;
      if (createdAtFrom != null) {
        params['createdAtFrom'] = createdAtFrom.toIso8601String();
      }
      if (createdAtTo != null) {
        params['createdAtTo'] = createdAtTo.toIso8601String();
      }
      if (deletedAt != null) params['deletedAt'] = deletedAt.toIso8601String();
      if (sortBy != null) params['sortBy'] = sortBy;

      final response = await _apiService.query(
        'mention.filter',
        params,
      );

      if (response == null) {
        throw MentionException(
            'No data returned from getMentions (mention.filter)');
      }

      // The 'mention.filter' endpoint returns { data: [...], total, page, pageSize }
      // We need to map the response to match PaginatedResponse's expected format
      final mappedResponse = {
        'data': response['data'],
        'page': response['page'],
        'limit': response['pageSize'], // Map pageSize to limit
        'total': response['total'],
      };

      return PaginatedResponse<Mention>.fromJson(
        mappedResponse,
        (json) => Mention.fromJson(json as Map<String, dynamic>),
        dataKey: 'data',
      );
    } catch (e, st) {
      _logError('getMentions', e, st);
      throw MentionException('Failed to get mentions: $e');
    }
  }

  /// Fetches a single mention by ID.
  /// Corresponds to the `mention.byId` TRPC procedure.
  Future<Mention> getMentionById(String id) async {
    try {
      final response = await _apiService.query(
        'mention.byId',
        {'id': id},
      );
      if (response == null) {
        throw MentionException.notFound(
            'Mention not found with ID: $id. No data returned.');
      }
      return Mention.fromJson(response as Map<String, dynamic>);
    } catch (e, st) {
      _logError('getMentionById', e, st);
      if (e is MentionException && e.code == 'NOT_FOUND') rethrow;
      if (e.toString().contains('not found') ||
          e.toString().contains('P2025')) {
        throw MentionException.notFound('Mention not found with ID: $id');
      }
      throw MentionException('Failed to get mention by ID: $e');
    }
  }

  /// Creates a new mention.
  /// Corresponds to the `mention.create` TRPC procedure.
  Future<Mention> createMention({
    // Parameters based on CreateMentionSchema
    required String mentionedById,
    required String mentionedToId,
    required MentionType type,
    String? content,
    String? taskId,
    String? propertyId,
    String? agencyId,
    String? userId,
  }) async {
    try {
      final Map<String, dynamic> params = {
        'mentionedById': mentionedById,
        'mentionedToId': mentionedToId,
        'type': type.name, // Assuming enum.name or appropriate serialization
      };
      if (content != null) params['content'] = content;
      if (taskId != null) params['taskId'] = taskId;
      if (propertyId != null) params['propertyId'] = propertyId;
      if (agencyId != null) params['agencyId'] = agencyId;
      if (userId != null) params['userId'] = userId;

      final response = await _apiService.mutation(
        'mention.create',
        params,
      );
      if (response == null) {
        throw MentionException('No data returned from createMention');
      }
      return Mention.fromJson(response as Map<String, dynamic>);
    } catch (e, st) {
      _logError('createMention', e, st);
      throw MentionException('Failed to create mention: $e');
    }
  }

  /// Updates an existing mention by ID.
  /// Corresponds to the `mention.update` TRPC procedure.
  Future<Mention> updateMention({
    // Parameters based on UpdateMentionSchema
    required String id,
    String? content,
    bool? isRead,
    DateTime? deletedAt, // For soft delete
  }) async {
    try {
      final Map<String, dynamic> params = {'id': id};
      if (content != null) params['content'] = content;
      if (isRead != null) params['isRead'] = isRead;
      if (deletedAt != null) params['deletedAt'] = deletedAt.toIso8601String();

      final response = await _apiService.mutation(
        'mention.update',
        params,
      );
      if (response == null) {
        throw MentionException('No data returned from updateMention');
      }
      return Mention.fromJson(response as Map<String, dynamic>);
    } catch (e, st) {
      _logError('updateMention', e, st);
      if (e is MentionException && e.code == 'NOT_FOUND') rethrow;
      if (e.toString().contains('not found') ||
          e.toString().contains('P2025')) {
        throw MentionException.notFound(
            'Mention not found for update with ID: $id');
      }
      throw MentionException('Failed to update mention: $e');
    }
  }

  /// Deletes a mention by ID.
  /// Corresponds to the `mention.delete` TRPC procedure.
  /// The backend returns the deleted mention.
  Future<Mention> deleteMention(String id) async {
    try {
      final response = await _apiService.mutation('mention.delete', {'id': id});
      if (response == null) {
        // This might indicate the mention was already deleted or never existed.
        throw MentionException('Mention not found or already deleted, ID: $id',
            code: 'NOT_FOUND');
      }
      return Mention.fromJson(response as Map<String, dynamic>);
    } catch (e, st) {
      _logError('deleteMention', e, st);
      if (e is MentionException && e.code == 'NOT_FOUND') rethrow;
      if (e.toString().contains('not found') ||
          e.toString().contains('P2025')) {
        throw MentionException(
            'Mention not found or already deleted with ID: $id',
            code: 'NOT_FOUND');
      }
      throw MentionException('Failed to delete mention: $e');
    }
  }

  void _logError(String method, Object error, StackTrace st) {
    log('[MentionService][$method] $error', error: error, stackTrace: st);
    if (kDebugMode) {
      print('MentionService.$method error: $error\n$st');
    }
    // Logging is handled here. Rethrowing or wrapping is done in the calling catch block.
  }

  /// Fetches all mentions with pagination.
  /// Returns a list of [Mention] objects.
  Future<List<Mention>> getAll() async {
    try {
      // Start with an empty list to hold all mentions
      List<Mention> allMentions = [];
      int page = 1;
      const int limit = 50; // Adjust batch size as needed
      bool hasMore = true;

      // Keep fetching until we've retrieved all pages
      while (hasMore) {
        final response = await getMentions(
          page: page,
          limit: limit,
        );

        // Add the fetched mentions to our list
        allMentions.addAll(response.data);

        // Check if there are more pages to fetch
        hasMore = page * limit < response.total;
        page++;
      }

      return allMentions;
    } catch (e, st) {
      _logError('getAll', e, st);
      rethrow;
    }
  }

  /// Fetches all unread mentions.
  /// Returns a list of unread [Mention] objects.
  Future<List<Mention>> getUnreadMentions() async {
    try {
      // Start with an empty list to hold all unread mentions
      List<Mention> allUnreadMentions = [];
      int page = 1;
      const int limit = 50; // Adjust batch size as needed
      bool hasMore = true;

      // Keep fetching until we've retrieved all pages of unread mentions
      while (hasMore) {
        final response = await getMentions(
          page: page,
          limit: limit,
          isRead: false, // Only fetch unread mentions
        );

        // Add the fetched unread mentions to our list
        allUnreadMentions.addAll(response.data);

        // Check if there are more pages to fetch
        hasMore = page * limit < response.total;
        page++;
      }


      return allUnreadMentions;
    } catch (e, st) {
      _logError('getUnreadMentions', e, st);
      rethrow;
    }
  }
}
