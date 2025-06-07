import 'package:flutter/foundation.dart';
import '../models/increase.dart';
import 'dart:developer';
import '../api/api_service.dart';
import '../models/pagination.dart'; // For PaginatedResponse

/// Custom exception for increase-related errors.
class IncreaseException implements Exception {
  final String message;
  final String? code;

  IncreaseException(this.message, {this.code});

  /// Creates a "not found" increase exception.
  factory IncreaseException.notFound(String message) =>
      IncreaseException(message, code: 'NOT_FOUND');

  @override
  String toString() =>
      'IncreaseException: $message${code != null ? ' (Code: $code)' : ''}';
}

/// Service for handling increase-related API operations via TRPC.
class IncreaseService {
  final ApiService _apiService;

  IncreaseService(this._apiService);

  /// Fetches all increases (optionally filtered).
  Future<PaginatedResponse<Increase>> getIncreases({
    int page = 1,
    int limit = 10,
    String? propertyId,
    String? tenantId,
    String? proposedBy, // Assuming this is a userId or similar identifier
    IncreaseStatus? status,
    DateTime? effectiveDateFrom,
    DateTime? effectiveDateTo,
    double? oldRentMin,
    double? oldRentMax,
    double? newRentMin,
    double? newRentMax,
    DateTime? createdAtFrom,
    DateTime? createdAtTo,
    String? sortBy,
    String sortOrder = 'desc',
  }) async {
    try {
      final Map<String, dynamic> params = {
        'page': page,
        'limit': limit,
        'sortOrder': sortOrder,
      };
      if (propertyId != null) params['propertyId'] = propertyId;
      if (tenantId != null) params['tenantId'] = tenantId;
      if (proposedBy != null) params['proposedBy'] = proposedBy;
      if (status != null) params['status'] = status.name; // Assuming enum.name
      if (effectiveDateFrom != null) {
        params['effectiveDateFrom'] = effectiveDateFrom.toIso8601String();
      }
      if (effectiveDateTo != null) {
        params['effectiveDateTo'] = effectiveDateTo.toIso8601String();
      }
      if (oldRentMin != null) {
        params['oldRentMin'] = oldRentMin;
      }
      if (oldRentMax != null) {
        params['oldRentMax'] = oldRentMax;
      }
      if (newRentMin != null) {
        params['newRentMin'] = newRentMin;
      }
      if (newRentMax != null) {
        params['newRentMax'] = newRentMax;
      }
      if (createdAtFrom != null) {
        params['createdAtFrom'] = createdAtFrom.toIso8601String();
      }
      if (createdAtTo != null) {
        params['createdAtTo'] = createdAtTo.toIso8601String();
      }
      if (sortBy != null) params['sortBy'] = sortBy;

      final response = await _apiService.query(
        'increase.all', // Corrected procedure name
        params,
      );
      if (response == null) {
        throw IncreaseException('No data returned from getIncreases');
      }
      return PaginatedResponse<Increase>.fromJson(
        response,
        (json) => Increase.fromJson(json as Map<String, dynamic>),
        dataKey: '',
      );
    } catch (e, st) {
      _logError('getIncreases', e, st);
      throw IncreaseException('Failed to get increases: $e');
    }
  }

  /// Fetches a single increase by ID.
  Future<Increase> getIncrease(String id) async {
    try {
      final response = await _apiService.query(
        'increase.byId', // Corrected procedure name
        {'id': id},
      );
      if (response == null) {
        throw IncreaseException.notFound(
            'Increase not found with ID: $id. No data returned.');
      }
      return Increase.fromJson(response as Map<String, dynamic>);
    } catch (e, st) {
      _logError('getIncrease', e, st);
      if (e is IncreaseException && e.code == 'NOT_FOUND') rethrow;
      if (e.toString().contains('not found') ||
          e.toString().contains('P2025')) {
        throw IncreaseException.notFound('Increase not found with ID: $id.');
      }
      throw IncreaseException('Failed to get increase: $e');
    }
  }

  /// Creates a new increase.
  Future<Increase> createIncrease({
    // Parameters based on CreateIncreaseSchema
    required String propertyId,
    required String tenantId,
    required String proposedBy, // User ID of the proposer
    required double oldRent,
    required double newRent,
    required DateTime effectiveDate,
    IncreaseStatus? status, // Optional, defaults to PENDING in schema
    String? contractId, // Optional
  }) async {
    try {
      final Map<String, dynamic> params = {
        'propertyId': propertyId,
        'tenantId': tenantId,
        'proposedBy': proposedBy,
        'oldRent': oldRent,
        'newRent': newRent,
        'effectiveDate': effectiveDate.toIso8601String(),
      };
      if (status != null) {
        params['status'] = status.name;
      }
      if (contractId != null) {
        params['contractId'] = contractId;
      }

      final response = await _apiService.mutation(
        'increase.create',
        params,
      );
      if (response == null) {
        throw IncreaseException('No data returned from createIncrease');
      }
      return Increase.fromJson(response as Map<String, dynamic>);
    } catch (e, st) {
      _logError('createIncrease', e, st);
      throw IncreaseException('Failed to create increase: $e');
    }
  }

  /// Updates an existing increase by ID.
  Future<Increase> updateIncrease({
    // Parameters based on UpdateIncreaseSchema
    required String id,
    double? newRent,
    DateTime? effectiveDate,
    IncreaseStatus? status,
  }) async {
    try {
      final Map<String, dynamic> params = {'id': id};
      if (newRent != null) {
        params['newRent'] = newRent;
      }
      if (effectiveDate != null) {
        params['effectiveDate'] = effectiveDate.toIso8601String();
      }
      if (status != null) {
        params['status'] = status.name;
      }

      final response = await _apiService.mutation(
        'increase.update',
        params,
      );
      if (response == null) {
        throw IncreaseException('No data returned from updateIncrease');
      }
      return Increase.fromJson(response as Map<String, dynamic>);
    } catch (e, st) {
      _logError('updateIncrease', e, st);
      if (e is IncreaseException && e.code == 'NOT_FOUND') rethrow;
      if (e.toString().contains('not found') ||
          e.toString().contains('P2025')) {
        throw IncreaseException.notFound(
            'Increase not found for update with ID: $id.');
      }
      throw IncreaseException('Failed to update increase: $e');
    }
  }

  /// Deletes an increase by ID.
  Future<void> deleteIncrease(String id) async {
    try {
      await _apiService.mutation('increase.delete', {'id': id});
    } catch (e, st) {
      _logError('deleteIncrease', e, st);
      if (e is IncreaseException && e.code == 'NOT_FOUND') rethrow;
      if (e.toString().contains('not found') ||
          e.toString().contains('P2025')) {
        throw IncreaseException.notFound(
            'Increase not found or already deleted with ID: $id');
      }
      throw IncreaseException('Failed to delete increase: $e');
    }
  }

  void _logError(String method, Object error, StackTrace st) {
    log('[IncreaseService][$method] $error', error: error, stackTrace: st);
    if (kDebugMode) {
      print('IncreaseService.$method error: $error\n$st');
    }
    // Logging is handled here. Rethrowing or wrapping is done in the calling catch block.
  }

  /// Fetches all increases with default pagination
  Future<List<Increase>> getAll() async {
    try {
      final response = await getIncreases();
      return response.data;
    } catch (e, st) {
      _logError('getAll', e, st);
      rethrow;
    }
  }

  /// Fetches increases filtered by status
  Future<List<Increase>> getIncreasesByStatus(IncreaseStatus status) async {
    try {
      final response = await getIncreases(status: status);
      return response.data;
    } catch (e, st) {
      _logError('getIncreasesByStatus', e, st);
      rethrow;
    }
  }
}
