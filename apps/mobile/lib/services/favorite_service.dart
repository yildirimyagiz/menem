import 'package:flutter/foundation.dart';
import 'package:mobile/api/api_service.dart';
import 'package:mobile/models/favorite.dart';
import 'dart:developer';
import 'package:mobile/models/pagination.dart'; // For PaginatedResponse

/// Custom exception for favorite-related errors.
class FavoriteException implements Exception {
  final String message;
  final String? code;

  FavoriteException(this.message, {this.code});

  /// Creates a "not found" favorite exception.
  factory FavoriteException.notFound(String message) =>
      FavoriteException(message, code: 'NOT_FOUND');

  @override
  String toString() => 'FavoriteException: $message${code != null ? ' (Code: $code)' : ''}';
}

class FavoriteService {
  final ApiService _apiService;

  FavoriteService(this._apiService);

  /// Retrieves all favorite items.
  Future<PaginatedResponse<Favorite>> getFavorites({
    int page = 1,
    int limit = 10,
    String? userId,
    String? propertyId,
    DateTime? createdAtFrom,
    DateTime? createdAtTo,
    DateTime? updatedAtFrom,
    DateTime? updatedAtTo,
    DateTime? deletedAtFrom, // Assuming these are for filtering soft-deleted
    DateTime? deletedAtTo,
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
      if (propertyId != null) params['propertyId'] = propertyId;
      if (createdAtFrom != null) params['createdAtFrom'] = createdAtFrom.toIso8601String();
      if (createdAtTo != null) params['createdAtTo'] = createdAtTo.toIso8601String();
      if (updatedAtFrom != null) params['updatedAtFrom'] = updatedAtFrom.toIso8601String();
      if (updatedAtTo != null) params['updatedAtTo'] = updatedAtTo.toIso8601String();
      if (deletedAtFrom != null) params['deletedAtFrom'] = deletedAtFrom.toIso8601String();
      if (deletedAtTo != null) params['deletedAtTo'] = deletedAtTo.toIso8601String();
      if (sortBy != null) params['sortBy'] = sortBy;

      final response = await _apiService.query(
        'favorite.all', // Corrected procedure name
        params,
      );
      if (response == null) {
        throw FavoriteException('No data returned from getFavorites');
      }
      return PaginatedResponse<Favorite>.fromJson(
        response,
        (json) => Favorite.fromJson(json as Map<String, dynamic>), dataKey: '',
      );
    } catch (e, st) {
      _logError('getAllFavorites', e, st);
      throw FavoriteException('Failed to get favorites: $e');
    }
  }

  /// Retrieves a favorite item by its ID.
  Future<Favorite?> getFavoriteById(String id) async {
    try {
      final response = await _apiService.query(
        'favorite.byId', // Corrected procedure name
        {'id': id},
      );
      if (response != null && response is Map<String, dynamic>) {
        return Favorite.fromJson(response);
      }
      // Backend now throws TRPCError with NOT_FOUND, ApiService might convert it.
      // If response is null, it's a clear "not found" or an issue before that.
      throw FavoriteException.notFound('Favorite not found with ID: $id. No data returned.');
    } catch (e, st) {
      _logError('getFavoriteById', e, st);
      if (e is FavoriteException && e.code == 'NOT_FOUND') rethrow;
      if (e.toString().contains('not found') || e.toString().contains('P2025')) {
        throw FavoriteException.notFound('Favorite not found with ID: $id');
      }
      throw FavoriteException('Failed to get favorite by ID: $e');
    }
  }

  /// Retrieves a favorite by user and property ID.
  Future<Favorite?> getFavoriteByUserAndProperty({
    required String userId,
    required String propertyId,
  }) async {
    try {
      final response = await _apiService.query(
        'favorite.byUserAndProperty',
        {'userId': userId, 'propertyId': propertyId},
      );
      if (response != null && response is Map<String, dynamic>) {
        return Favorite.fromJson(response);
      }
      return null; // Can be null if not favorited
    } catch (e, st) {
      _logError('getFavoriteByUserAndProperty', e, st);
      throw FavoriteException('Failed to get favorite by user and property: $e'); // Backend might return NOT_FOUND
    }
  }

  /// Creates a new favorite item.
  Future<Favorite> createFavorite({
    // Parameters based on CreateFavoriteSchema
    required String userId,
    required String propertyId,
  }) async {
    try {
      final Map<String, dynamic> params = {
        'userId': userId,
        'propertyId': propertyId,
      };
      final response = await _apiService.mutation(
        'favorite.create',
        params,
      );
      if (response != null && response is Map<String, dynamic>) {
        return Favorite.fromJson(response);
      }
      throw FavoriteException('No data returned from createFavorite');
    } catch (e, st) {
      _logError('createFavorite', e, st);
      throw FavoriteException('Failed to create favorite: $e');
    }
  }

  /// Updates an existing favorite item.
  /// Note: The backend UpdateFavoriteSchema only takes 'id'.
  /// If other fields are updatable, the schema and this method need adjustment.
  /// For now, assuming it's just for marking as updated or similar.
  Future<Favorite> updateFavorite({required String id}) async {
    try {
      final response = await _apiService.mutation(
        'favorite.update',
        {'id': id}, // Backend schema only takes ID for update.
      );
      if (response != null && response is Map<String, dynamic>) {
        return Favorite.fromJson(response);
      }
      throw FavoriteException('No data returned from updateFavorite');
    } catch (e, st) {
      _logError('updateFavorite', e, st);
      if (e is FavoriteException && e.code == 'NOT_FOUND') rethrow;
      if (e.toString().contains('not found') || e.toString().contains('P2025')) {
        throw FavoriteException.notFound('Favorite not found for update with ID: $id');
      }
      throw FavoriteException('Failed to update favorite: $e'); // General error
    }
  }

  /// Deletes a favorite item.
  Future<void> deleteFavorite(String id) async {
    try {
      await _apiService.mutation(
        'favorite.delete',
        {'id': id},
      );
    } catch (e, st) {
      _logError('deleteFavorite', e, st);
      if (e is FavoriteException && e.code == 'NOT_FOUND') rethrow;
      if (e.toString().contains('not found') || e.toString().contains('P2025')) {
        throw FavoriteException.notFound('Favorite not found or already deleted with ID: $id');
      }
      throw FavoriteException('Failed to delete favorite: $e');
    }
  }

  /// Toggles a favorite status for a user and property.
  /// Returns 'added' or 'removed'.
  Future<String> toggleFavorite({
    required String userId,
    required String propertyId,
  }) async {
    try {
      final response = await _apiService.mutation(
        'favorite.toggle',
        {'userId': userId, 'propertyId': propertyId},
      );
      if (response != null && response is Map<String, dynamic> && response.containsKey('action')) {
        return response['action'] as String;
      }
      throw FavoriteException('Unexpected response from toggleFavorite');
    } catch (e, st) {
      _logError('toggleFavorite', e, st);
      throw FavoriteException('Failed to toggle favorite: $e');
    }
  }

  /// Clears all favorites for the current user.
  Future<({bool success, int deletedCount})> clearAllFavorites() async {
    try {
      final response = await _apiService.mutation('favorite.clearAll', {});
      if (response != null && response is Map<String, dynamic>) {
        return (
          success: response['success'] as bool? ?? false,
          deletedCount: response['deletedCount'] as int? ?? 0,
        );
      }
      throw FavoriteException('Unexpected response from clearAllFavorites');
    } catch (e, st) {
      _logError('clearAllFavorites', e, st);
      throw FavoriteException('Failed to clear all favorites: $e');
    }
  }

  void _logError(String method, Object error, StackTrace st) {
    log('[FavoriteService][$method] $error', error: error, stackTrace: st);
    if (kDebugMode) {
      print('[FavoriteService][$method] $error\n$st');
    }
    // Logging is handled here. Rethrowing or wrapping is done in the calling catch block.
  }
}
