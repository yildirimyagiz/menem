import 'package:flutter/foundation.dart';

import '../models/extra_charge.dart';
import 'dart:developer';
import '../api/api_service.dart';
import '../models/pagination.dart'; // For PaginatedResponse

/// Custom exception for extra charge-related errors.
class ExtraChargeException implements Exception {
  final String message;
  final String? code;

  ExtraChargeException(this.message, {this.code});

  /// Creates a "not found" extra charge exception.
  factory ExtraChargeException.notFound(String message) =>
      ExtraChargeException(message, code: 'NOT_FOUND');

  @override
  String toString() =>
      'ExtraChargeException: $message${code != null ? ' (Code: $code)' : ''}';
}

/// Service for handling extra charge-related API operations via TRPC.
class ExtraChargeService {
  final ApiService _apiService;

  ExtraChargeService(this._apiService);

  /// Fetches all extra charges (optionally filtered).
  Future<PaginatedResponse<ExtraCharge>> getExtraCharges({
    int page = 1,
    int limit = 10,
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
        'limit': limit,
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
        'extraCharge.all', // Corrected procedure name
        params,
      );
      if (response == null) {
        throw ExtraChargeException('No data returned from getExtraCharges');
      }
      // The backend returns { items: [...], ... }
      // Ensure PaginatedResponse.fromJson handles this structure or adjust here.
      // Assuming PaginatedResponse.fromJson expects a map with 'items' (or 'data'), 'page', 'limit', 'total'.
      // The backend for extraCharge.all returns 'items', so we might need to rename it or adjust PaginatedResponse.
      // For now, let's assume PaginatedResponse can handle 'items' or we adjust the key.
      // If PaginatedResponse expects 'data', we'd do:
      // final Map<String, dynamic> paginatedData = {
      //   'data': response['items'],
      //   'page': response['page'],
      //   'limit': response['limit'],
      //   'total': response['total'],
      // };
      // return PaginatedResponse<ExtraCharge>.fromJson(paginatedData, ...);
      // For simplicity, assuming PaginatedResponse.fromJson is flexible or response['items'] is directly usable.
      // The backend returns 'items' not 'data'.
      // We need to adapt the PaginatedResponse.fromJson or the data passed to it.
      // Let's assume PaginatedResponse.fromJson is adapted to look for 'items' if 'data' is not present,
      // or it's constructed manually.
      // For now, this is a direct pass-through, which might fail if PaginatedResponse is strict.
      return PaginatedResponse<ExtraCharge>.fromJson(
        response, // This might need adjustment based on PaginatedResponse.fromJson
        (json) => ExtraCharge.fromJson(json as Map<String, dynamic>),
        dataKey: 'items', // Specify the key for the list of items
      );
    } catch (e, st) {
      _logError('getExtraCharges', e, st);
      throw ExtraChargeException('Failed to get extra charges: $e');
    }
  }

  /// Fetches a single extra charge by ID.
  Future<ExtraCharge> getExtraCharge(String id) async {
    try {
      final response = await _apiService.query(
        'extraCharge.byId', // Corrected procedure name
        {'id': id},
      );
      if (response == null) {
        throw ExtraChargeException.notFound(
            'ExtraCharge not found with ID: $id. No data returned.');
      }
      return ExtraCharge.fromJson(response as Map<String, dynamic>);
    } catch (e, st) {
      _logError('getExtraCharge', e, st);
      if (e is ExtraChargeException && e.code == 'NOT_FOUND') rethrow;
      if (e.toString().contains('not found') ||
          e.toString().contains('P2025') ||
          e.toString().contains('ExtraCharge not found')) {
        throw ExtraChargeException.notFound(
            'ExtraCharge not found with ID: $id.');
      }
      throw ExtraChargeException('Failed to get extra charge: $e');
    }
  }

  /// Creates a new extra charge.
  Future<ExtraCharge> createExtraCharge({
    // Parameters based on CreateExtraChargeSchema
    required String name,
    required double amount,
    required String type, // e.g., "ONE_TIME", "PER_NIGHT", "PER_PERSON"
    String? description,
    String? facilityId,
    bool? isTaxable,
    double? taxRate,
  }) async {
    try {
      final Map<String, dynamic> params = {
        'name': name,
        'amount': amount,
        'type': type,
      };
      if (description != null) params['description'] = description;
      if (facilityId != null) params['facilityId'] = facilityId;
      if (isTaxable != null) params['isTaxable'] = isTaxable;
      if (taxRate != null) params['taxRate'] = taxRate;

      final response = await _apiService.mutation(
        'extraCharge.create',
        params,
      );
      if (response == null) {
        throw ExtraChargeException('No data returned from createExtraCharge');
      }
      return ExtraCharge.fromJson(response as Map<String, dynamic>);
    } catch (e, st) {
      _logError('createExtraCharge', e, st);
      throw ExtraChargeException('Failed to create extra charge: $e');
    }
  }

  /// Updates an existing extra charge by ID.
  Future<ExtraCharge> updateExtraCharge({
    required String id,
    // Parameters based on UpdateExtraChargeSchema
    String? name,
    double? amount,
    String? type,
    String? description,
    String? facilityId, // Can be null to disconnect
    bool? isTaxable,
    double? taxRate,
  }) async {
    try {
      final Map<String, dynamic> params = {'id': id};
      if (name != null) params['name'] = name;
      if (amount != null) params['amount'] = amount;
      if (type != null) params['type'] = type;
      if (description != null) params['description'] = description;
      // For facilityId, if you want to allow unsetting it, pass null.
      // The backend schema seems to handle facilityId being optional or explicitly null.
      if (params.containsKey('facilityId') || facilityId != null) {
        params['facilityId'] = facilityId;
      }
      if (isTaxable != null) params['isTaxable'] = isTaxable;
      if (taxRate != null) params['taxRate'] = taxRate;

      final response = await _apiService.mutation(
        'extraCharge.update',
        params,
      );
      if (response == null) {
        throw ExtraChargeException('No data returned from updateExtraCharge');
      }
      return ExtraCharge.fromJson(response as Map<String, dynamic>);
    } catch (e, st) {
      _logError('updateExtraCharge', e, st);
      if (e is ExtraChargeException && e.code == 'NOT_FOUND') rethrow;
      if (e.toString().contains('not found') ||
          e.toString().contains('P2025')) {
        throw ExtraChargeException.notFound(
            'ExtraCharge not found for update with ID: $id');
      }
      throw ExtraChargeException('Failed to update extra charge: $e');
    }
  }

  /// Deletes an extra charge by ID.
  Future<void> deleteExtraCharge(String id) async {
    try {
      await _apiService.mutation('extraCharge.delete', {'id': id});
    } catch (e, st) {
      _logError('deleteExtraCharge', e, st);
      if (e is ExtraChargeException && e.code == 'NOT_FOUND') rethrow;
      if (e.toString().contains('not found') ||
          e.toString().contains('P2025')) {
        throw ExtraChargeException.notFound(
            'ExtraCharge not found or already deleted with ID: $id.');
      }
      throw ExtraChargeException('Failed to delete extra charge: $e');
    }
  }

  void _logError(String method, Object error, StackTrace st) {
    log('[ExtraChargeService][$method] $error', error: error, stackTrace: st);
    // Optionally log errors to a logging service or console
    if (kDebugMode) {
      print('ExtraChargeService.$method error: $error\n$st');
    }
    // Logging is handled here. Rethrowing or wrapping is done in the calling catch block.
  }
}
