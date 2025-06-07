import 'dart:async';

import 'package:flutter/foundation.dart';
import 'dart:developer';

import '../api/api_service.dart';
import '../models/facility.dart';
import '../models/pagination.dart'; // For PaginatedResponse

/// Custom exception for facility-related errors.
class FacilityException implements Exception {
  final String message;
  final String? code;

  FacilityException(this.message, {this.code});

  /// Creates a "not found" facility exception.
  factory FacilityException.notFound(String message) =>
      FacilityException(message, code: 'NOT_FOUND');

  @override
  String toString() =>
      'FacilityException: $message${code != null ? ' (Code: $code)' : ''}';
}

/// Service for handling facility-related API operations.
class FacilityService {
  final ApiService _apiService;
  FacilityService(this._apiService);

  /// Fetches all facilities.
  Future<PaginatedResponse<Facility>> getFacilities({
    int page = 1,
    int limit = 10,
    String? name,
    DateTime? createdAtFrom,
    DateTime? createdAtTo,
    DateTime? updatedAtFrom,
    DateTime? updatedAtTo,
    DateTime? deletedAt,
    String? sortBy,
    String sortOrder = 'asc',
  }) async {
    try {
      final Map<String, dynamic> params = {
        'page': page,
        'limit': limit,
        'sortOrder': sortOrder,
      };
      if (name != null) params['name'] = name;
      if (createdAtFrom != null) {
        params['createdAtFrom'] = createdAtFrom.toIso8601String();
      }
      if (createdAtTo != null) {
        params['createdAtTo'] = createdAtTo.toIso8601String();
      }
      if (updatedAtFrom != null) {
        params['updatedAtFrom'] = updatedAtFrom.toIso8601String();
      }
      if (updatedAtTo != null) {
        params['updatedAtTo'] = updatedAtTo.toIso8601String();
      }
      if (deletedAt != null) params['deletedAt'] = deletedAt.toIso8601String();
      if (sortBy != null) params['sortBy'] = sortBy;

      final response = await _apiService.query('facility.all', params);
      if (response == null) {
        throw FacilityException('No data returned from getFacilities');
      }
      // Backend returns { items: [...], ... }
      return PaginatedResponse<Facility>.fromJson(
        response,
        (json) => Facility.fromJson(json as Map<String, dynamic>),
        dataKey: 'items',
      );
    } catch (e, st) {
      _logError('getFacilities', e, st);
      throw FacilityException('Failed to get facilities: $e');
    }
  }

  /// Fetches a facility by ID.
  Future<Facility> getFacility(String id) async {
    try {
      final response = await _apiService.query('facility.byId', {'id': id});
      if (response == null) {
        throw FacilityException.notFound(
            'Facility not found with ID: $id. No data returned.');
      }
      return Facility.fromJson(response as Map<String, dynamic>);
    } catch (e, st) {
      _logError('getFacility', e, st);
      if (e is FacilityException && e.code == 'NOT_FOUND') rethrow;
      if (e.toString().contains('not found') ||
          e.toString().contains('P2025') ||
          e.toString().contains('Facility not found')) {
        throw FacilityException.notFound(
          'Facility not found with ID: $id.',
        );
      }
      throw FacilityException('Failed to get facility: $e');
    }
  }

  /// Creates a new facility.
  Future<Facility> createFacility({
    // Parameters based on CreateFacilitySchema
    required String name,
    String? description,
    String? icon,
    String? logo,
    String? locationId,
    String? type, // Assuming FacilityType enum or String
    String? status, // Assuming FacilityStatus enum or String
  }) async {
    try {
      final Map<String, dynamic> params = {
        'name': name,
      };
      if (description != null) params['description'] = description;
      if (icon != null) params['icon'] = icon;
      if (logo != null) params['logo'] = logo;
      if (locationId != null) params['locationId'] = locationId;
      if (type != null) params['type'] = type;
      if (status != null) params['status'] = status;

      final response = await _apiService.mutation('facility.create', params);
      if (response == null) {
        throw FacilityException('No data returned from createFacility');
      }
      return Facility.fromJson(response as Map<String, dynamic>);
    } catch (e, st) {
      _logError('createFacility', e, st);
      throw FacilityException('Failed to create facility: $e');
    }
  }

  /// Updates an existing facility by ID.
  Future<Facility> updateFacility({
    // Parameters based on UpdateFacilitySchema
    required String id,
    String? name,
    String? description,
    String? icon,
    String? logo,
    String? locationId,
    String? type,
    String? status,
    DateTime? deletedAt, // For soft delete
  }) async {
    try {
      final Map<String, dynamic> params = {'id': id};
      if (name != null) params['name'] = name;
      if (description != null) params['description'] = description;
      if (icon != null) params['icon'] = icon;
      if (logo != null) params['logo'] = logo;
      if (locationId != null) params['locationId'] = locationId;
      if (type != null) params['type'] = type;
      if (status != null) params['status'] = status;
      if (deletedAt != null) params['deletedAt'] = deletedAt.toIso8601String();

      final response = await _apiService.mutation('facility.update', params);
      if (response == null) {
        throw FacilityException('No data returned from updateFacility');
      }
      return Facility.fromJson(response as Map<String, dynamic>);
    } catch (e, st) {
      _logError('updateFacility', e, st);
      if (e is FacilityException && e.code == 'NOT_FOUND') rethrow;
      if (e.toString().contains('not found') ||
          e.toString().contains('P2025')) {
        throw FacilityException.notFound(
            'Facility not found for update with ID: $id.');
      }
      throw FacilityException('Failed to update facility: $e');
    }
  }

  /// Updates the status of an existing facility.
  Future<Facility> updateFacilityStatus({
    required String id,
    required String
        status, // Assuming status is a String, adjust if it's an enum
  }) async {
    try {
      final response = await _apiService.mutation(
        'facility.update', // Uses the general update endpoint
        {
          'id': id,
          'status': status,
        },
      );

      if (response == null) {
        throw FacilityException('No data returned from updateFacilityStatus');
      }

      return Facility.fromJson(response as Map<String, dynamic>);
    } catch (e, st) {
      _logError('updateFacilityStatus', e, st);
      if (e.toString().contains('not found') ||
          e.toString().contains('P2025')) {
        throw FacilityException.notFound(
            'Facility not found for status update with ID: $id.');
      }
      throw FacilityException('Failed to update facility status: $e');
    }
  }

  /// Deletes a facility by ID.
  Future<void> deleteFacility(String id) async {
    try {
      await _apiService.mutation('facility.delete', {'id': id});
    } catch (e, st) {
      _logError('deleteFacility', e, st);
      if (e is FacilityException && e.code == 'NOT_FOUND') rethrow;
      if (e.toString().contains('not found') ||
          e.toString().contains('P2025')) {
        throw FacilityException.notFound(// Consistent error message
            'Facility not found or already deleted with ID: $id');
      }
      throw FacilityException('Failed to delete facility: $e');
    }
  }

  void _logError(String method, Object error, StackTrace st) {
    log('[FacilityService][$method] $error', error: error, stackTrace: st);
    if (kDebugMode) {
      print('FacilityService.$method error: $error\n$st');
    }
    // Logging is handled here. Rethrowing or wrapping is done in the calling catch block.
  }

  /// Fetches all facilities by making multiple paginated requests if needed.
  ///
  /// Returns a list of all facilities available.
  Future<List<Facility>> getAll() async {
    try {
      final List<Facility> allFacilities = [];
      int currentPage = 1;
      const int pageSize = 50; // Use a reasonable page size
      bool hasMore = true;

      while (hasMore) {
        final response = await getFacilities(
          page: currentPage,
          limit: pageSize,
        );

        allFacilities.addAll(response.data);
        // Check if there are more pages
        hasMore = response.hasMore;
        currentPage++;
      }

      return allFacilities;
    } catch (e, st) {
      _logError('getAll', e, st);
      if (e is FacilityException) rethrow;
      throw FacilityException('Failed to fetch all facilities: $e');
    }
  }
}
