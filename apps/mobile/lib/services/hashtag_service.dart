import 'package:flutter/foundation.dart';
import 'package:mobile/api/api_service.dart';
import '../models/hashtag.dart';
import 'dart:developer';
import 'package:mobile/models/pagination.dart'; // For PaginatedResponse

/// Custom exception for hashtag-related errors.
class HashtagException implements Exception {
  final String message;
  final String? code;

  HashtagException(this.message, {this.code});

  /// Creates a "not found" hashtag exception.
  factory HashtagException.notFound(String message) =>
      HashtagException(message, code: 'NOT_FOUND');

  @override
  String toString() =>
      'HashtagException: $message${code != null ? ' (Code: $code)' : ''}';
}

class HashtagService {
  final ApiService _apiService;

  HashtagService(this._apiService);

  /// Fetches all hashtags.
  Future<PaginatedResponse<Hashtag>> getHashtags({
    int page = 1,
    int limit = 10,
    String? name,
    String? type, // Assuming HashtagType enum or String
    String? createdById,
    String? agencyId,
    int? usageCountMin,
    int? usageCountMax,
    DateTime? createdAtFrom,
    DateTime? createdAtTo,
    DateTime? deletedAt,
    String? sortBy,
    String sortOrder = 'desc',
  }) async {
    try {
      final Map<String, dynamic> params = {
        'page': page,
        'limit': limit,
        'sortOrder': sortOrder,
      };
      if (name != null) params['name'] = name;
      if (type != null) params['type'] = type;
      if (createdById != null) params['createdById'] = createdById;
      if (agencyId != null) params['agencyId'] = agencyId;
      if (usageCountMin != null) params['usageCountMin'] = usageCountMin;
      if (usageCountMax != null) params['usageCountMax'] = usageCountMax;
      if (createdAtFrom != null) {
        params['createdAtFrom'] = createdAtFrom.toIso8601String();
      }
      if (createdAtTo != null) {
        params['createdAtTo'] = createdAtTo.toIso8601String();
      }
      if (deletedAt != null) params['deletedAt'] = deletedAt.toIso8601String();
      if (sortBy != null) params['sortBy'] = sortBy;

      final response = await _apiService.query(
        'hashtag.all', // Corrected procedure name
        params,
      );
      if (response == null) {
        throw HashtagException('No data returned from getHashtags');
      }
      return PaginatedResponse<Hashtag>.fromJson(
        response,
        (json) => Hashtag.fromJson(json as Map<String, dynamic>),
        dataKey: '',
      );
    } catch (e, st) {
      _logError('getAllHashtags', e, st);
      throw HashtagException('Failed to get hashtags: $e');
    }
  }

  /// Fetch a single hashtag by ID.
  ///
  /// Returns a [Hashtag] object.
  Future<Hashtag> getHashtag(String id) async {
    try {
      final response = await _apiService.query(
        'hashtag.byId', // Corrected procedure name
        {'id': id},
      );
      if (response == null) {
        throw HashtagException.notFound(
            'Hashtag not found with ID: $id. No data returned.');
      }
      return Hashtag.fromJson(response as Map<String, dynamic>);
    } catch (e, st) {
      _logError('getHashtag', e, st);
      if (e is HashtagException && e.code == 'NOT_FOUND') rethrow;
      if (e.toString().contains('not found') ||
          e.toString().contains('P2025') ||
          e.toString().contains('Hashtag not found')) {
        throw HashtagException.notFound('Hashtag not found with ID: $id.');
      }
      throw HashtagException('Failed to get hashtag: $e');
    }
  }

  /// Create a new hashtag.
  ///
  /// Returns a [Hashtag] object.
  Future<Hashtag> createHashtag({
    // Parameters based on CreateHashtagSchema
    required String name,
    required String type, // e.g., "PROPERTY", "POST", "GENERAL"
    String? description,
    List<String>? relatedTags,
    String? createdById,
    String? agencyId,
  }) async {
    try {
      final Map<String, dynamic> params = {
        'name': name,
        'type': type,
      };
      if (description != null) params['description'] = description;
      if (relatedTags != null) params['relatedTags'] = relatedTags;
      if (createdById != null) params['createdById'] = createdById;
      if (agencyId != null) params['agencyId'] = agencyId;

      final response = await _apiService.mutation(
        'hashtag.create',
        params,
      );
      if (response == null) {
        throw HashtagException('No data returned from createHashtag');
      }
      return Hashtag.fromJson(response as Map<String, dynamic>);
    } catch (e, st) {
      _logError('createHashtag', e, st);
      throw HashtagException('Failed to create hashtag: $e');
    }
  }

  /// Update an existing hashtag.
  ///
  /// Returns a [Hashtag] object.
  Future<Hashtag> updateHashtag({
    // Parameters based on UpdateHashtagSchema
    required String id,
    String? name,
    String? type,
    String? description,
    List<String>? relatedTags,
    DateTime? deletedAt, // For soft delete
  }) async {
    try {
      final Map<String, dynamic> params = {'id': id};
      if (name != null) params['name'] = name;
      if (type != null) params['type'] = type;
      if (description != null) params['description'] = description;
      if (relatedTags != null) params['relatedTags'] = relatedTags;
      if (deletedAt != null) params['deletedAt'] = deletedAt.toIso8601String();

      final response = await _apiService.mutation(
        'hashtag.update',
        params,
      );
      if (response == null) {
        throw HashtagException('No data returned from updateHashtag');
      }
      return Hashtag.fromJson(response as Map<String, dynamic>);
    } catch (e, st) {
      _logError('updateHashtag', e, st);
      if (e is HashtagException && e.code == 'NOT_FOUND') rethrow;
      if (e.toString().contains('not found') ||
          e.toString().contains('P2025')) {
        throw HashtagException.notFound(
            'Hashtag not found for update with ID: $id.');
      }
      throw HashtagException('Failed to update hashtag: $e');
    }
  }

  /// Delete a hashtag by ID.
  ///
  /// Returns a void future.
  Future<void> deleteHashtag(String id) async {
    try {
      // Backend performs a soft delete (sets deletedAt)
      await _apiService.mutation(
        'hashtag.delete',
        {'id': id},
      );
    } catch (e, st) {
      _logError('deleteHashtag', e, st);
      if (e is HashtagException && e.code == 'NOT_FOUND') rethrow;
      if (e.toString().contains('not found') ||
          e.toString().contains('P2025')) {
        throw HashtagException.notFound(
            'Hashtag not found or already deleted with ID: $id');
      }
      throw HashtagException('Failed to delete hashtag: $e');
    }
  }

  void _logError(String method, Object error, StackTrace st) {
    log('[HashtagService][$method] $error', error: error, stackTrace: st);
    if (kDebugMode) {
      print('HashtagService.$method error: $error\n$st');
    }
    // Logging is handled here. Rethrowing or wrapping is done in the calling catch block.
  }

  Future getAllHashtags() async {}
}
