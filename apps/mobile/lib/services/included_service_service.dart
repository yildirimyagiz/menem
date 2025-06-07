import 'package:flutter/foundation.dart';
import 'package:mobile/api/api_service.dart';
import '../models/included_service.dart';
import 'dart:developer';
import 'package:mobile/models/pagination.dart'; // For PaginatedResponse

/// Custom exception for included service-related errors.
class IncludedServiceException implements Exception {
  final String message;
  final String? code;

  IncludedServiceException(this.message, {this.code});

  /// Creates a "not found" included service exception.
  factory IncludedServiceException.notFound(String message) =>
      IncludedServiceException(message, code: 'NOT_FOUND');

  @override
  String toString() =>
      'IncludedServiceException: $message${code != null ? ' (Code: $code)' : ''}';
}

/// Service for handling included service-related API operations via TRPC.
class IncludedServiceService {
  final ApiService _apiService;

  IncludedServiceService(this._apiService);

  /// Fetches all included services (optionally filtered).
  Future<PaginatedResponse<IncludedService>> getIncludedServices({
    int page = 1,
    int limit = 10, // Corresponds to pageSize in schema
    String? name,
    String? facilityId,
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
        'pageSize': limit, // Schema uses pageSize
        'sortOrder': sortOrder,
      };
      if (name != null) params['name'] = name;
      if (facilityId != null) params['facilityId'] = facilityId;
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

      final response = await _apiService.query(
        'includedService.all', // Corrected procedure name
        params,
      );
      if (response == null) {
        throw IncludedServiceException(
            'No data returned from getIncludedServices');
      }
      // Backend returns { items: [...], ... }
      return PaginatedResponse<IncludedService>.fromJson(
        response,
        (json) => IncludedService.fromJson(json as Map<String, dynamic>),
        dataKey: 'items',
      );
    } catch (e, st) {
      _logError('getIncludedServices', e, st);
      throw IncludedServiceException('Failed to get included services: $e');
    }
  }

  /// Fetches a single included service by ID.
  Future<IncludedService> getIncludedService(String id) async {
    try {
      final response = await _apiService.query(
        'includedService.byId', // Corrected procedure name
        {'id': id},
      );
      if (response == null) {
        throw IncludedServiceException.notFound(
            'IncludedService not found with ID: $id. No data returned.');
      }
      return IncludedService.fromJson(response as Map<String, dynamic>);
    } catch (e, st) {
      _logError('getIncludedService', e, st);
      if (e is IncludedServiceException && e.code == 'NOT_FOUND') rethrow;
      if (e.toString().contains('not found') ||
          e.toString().contains('P2025') ||
          e.toString().contains('IncludedService not found')) {
        throw IncludedServiceException.notFound(
            'IncludedService not found with ID: $id.');
      }
      throw IncludedServiceException('Failed to get included service: $e');
    }
  }

  /// Creates a new included service.
  Future<IncludedService> createIncludedService({
    // Parameters based on CreateIncludedServiceSchema
    required String name,
    String? description,
    String? facilityId,
    String? icon,
    String? logo,
  }) async {
    try {
      final Map<String, dynamic> params = {
        'name': name,
      };
      if (description != null) params['description'] = description;
      if (facilityId != null) params['facilityId'] = facilityId;
      if (icon != null) params['icon'] = icon;
      if (logo != null) params['logo'] = logo;

      final response = await _apiService.mutation(
        'includedService.create',
        params,
      );
      if (response == null) {
        throw IncludedServiceException(
            'No data returned from createIncludedService');
      }
      return IncludedService.fromJson(response as Map<String, dynamic>);
    } catch (e, st) {
      _logError('createIncludedService', e, st);
      throw IncludedServiceException('Failed to create included service: $e');
    }
  }

  /// Updates an existing included service by ID.
  Future<IncludedService> updateIncludedService({
    // Parameters based on UpdateIncludedServiceSchema
    required String id,
    String? name,
    String? description,
    String? facilityId, // Can be null to disconnect
    String? icon,
    String? logo,
    DateTime? deletedAt, // For soft delete
  }) async {
    try {
      final Map<String, dynamic> params = {'id': id};
      if (name != null) params['name'] = name;
      if (description != null) params['description'] = description;
      // For facilityId, if you want to allow unsetting it, pass null.
      if (params.containsKey('facilityId') || facilityId != null) {
        params['facilityId'] = facilityId;
      }
      if (icon != null) params['icon'] = icon;
      if (logo != null) params['logo'] = logo;
      if (deletedAt != null) params['deletedAt'] = deletedAt.toIso8601String();

      final response = await _apiService.mutation(
        'includedService.update',
        params,
      );
      if (response == null) {
        throw IncludedServiceException(
            'No data returned from updateIncludedService');
      }
      return IncludedService.fromJson(response as Map<String, dynamic>);
    } catch (e, st) {
      _logError('updateIncludedService', e, st);
      if (e is IncludedServiceException && e.code == 'NOT_FOUND') rethrow;
      if (e.toString().contains('not found') ||
          e.toString().contains('P2025')) {
        throw IncludedServiceException.notFound(
            'IncludedService not found for update with ID: $id');
      }
      throw IncludedServiceException('Failed to update included service: $e');
    }
  }

  /// Deletes an included service by ID.
  Future<void> deleteIncludedService(String id) async {
    try {
      await _apiService.mutation('includedService.delete', {'id': id});
    } catch (e, st) {
      _logError('deleteIncludedService', e, st);
      if (e is IncludedServiceException && e.code == 'NOT_FOUND') rethrow;
      if (e.toString().contains('not found') ||
          e.toString().contains('P2025')) {
        throw IncludedServiceException.notFound(
            'IncludedService not found or already deleted with ID: $id');
      }
      throw IncludedServiceException('Failed to delete included service: $e');
    }
  }

  void _logError(String method, Object error, StackTrace st) {
    log('[IncludedServiceService][$method] $error',
        error: error, stackTrace: st);
    if (kDebugMode) {
      print('IncludedServiceService.$method error: $error\n$st');
    }
    // Logging is handled here. Rethrowing or wrapping is done in the calling catch block.
  }
}
