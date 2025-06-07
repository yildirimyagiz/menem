import 'package:flutter/foundation.dart';
import '../models/mortgage.dart';
import 'dart:developer';
import 'package:mobile/api/api_service.dart'; // Import ApiService
import 'package:mobile/models/pagination.dart'; // For PaginatedResponse

/// Custom exception for mortgage-related errors.
class MortgageException implements Exception {
  final String message;
  final String? code;

  MortgageException(this.message, {this.code});

  /// Creates a "not found" mortgage exception.
  factory MortgageException.notFound(String message) =>
      MortgageException(message, code: 'NOT_FOUND');

  @override
  String toString() =>
      'MortgageException: $message${code != null ? ' (Code: $code)' : ''}';
}

/// Service for handling mortgage-related API operations via TRPC.
class MortgageService {
  final ApiService _apiService;

  MortgageService(this._apiService);

  /// Fetches all mortgages (optionally filtered).
  Future<PaginatedResponse<Mortgage>> getMortgages({
    int page = 1,
    int limit = 10,
    String? propertyId,
    String? lender,
    String? status, // Assuming MortgageStatus enum or String
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
      if (lender != null) params['lender'] = lender;
      if (status != null) params['status'] = status;
      if (sortBy != null) params['sortBy'] = sortBy;

      final response = await _apiService.query(
        'mortgage.all', // Corrected procedure name
        params,
      );
      if (response == null) {
        throw MortgageException('No data returned from getMortgages');
      }
      return PaginatedResponse<Mortgage>.fromJson(
        response,
        (json) => Mortgage.fromJson(json as Map<String, dynamic>),
        dataKey: '', // Assuming backend returns data at root or 'data' key
      );
    } catch (e, st) {
      _logError('getMortgages', e, st);
      throw MortgageException('Failed to get mortgages: $e');
    }
  }

  /// Fetches a single mortgage by ID.
  Future<Mortgage> getMortgage(String id) async {
    try {
      final response = await _apiService.query(
        'mortgage.byId', // Corrected procedure name
        {'id': id},
      );
      if (response == null) {
        throw MortgageException.notFound(
            'Mortgage not found with ID: $id. No data returned.');
      }
      return Mortgage.fromJson(response);
    } catch (e, st) {
      _logError('getMortgage', e, st);
      if (e is MortgageException && e.code == 'NOT_FOUND') rethrow;
      if (e.toString().contains('not found') ||
          e.toString().contains('P2025')) {
        throw MortgageException.notFound('Mortgage not found with ID: $id.');
      }
      throw MortgageException('Failed to get mortgage: $e');
    }
  }

  /// Creates a new mortgage.
  Future<Mortgage> createMortgage({
    // Parameters based on CreateMortgageSchema
    required String propertyId,
    required String lender,
    required double principal,
    required double interestRate,
    required DateTime startDate,
    required DateTime endDate,
    String? status, // e.g., "ACTIVE", "PAID_OFF"
    String? notes,
  }) async {
    try {
      final Map<String, dynamic> params = {
        'propertyId': propertyId,
        'lender': lender,
        'principal': principal,
        'interestRate': interestRate,
        'startDate': startDate.toIso8601String(),
        'endDate': endDate.toIso8601String(),
      };
      if (status != null) params['status'] = status;
      if (notes != null) params['notes'] = notes;

      final response = await _apiService.mutation(
        'mortgage.create',
        params,
      );
      if (response == null) {
        throw MortgageException('No data returned from createMortgage');
      }
      return Mortgage.fromJson(response);
    } catch (e, st) {
      _logError('createMortgage', e, st);
      throw MortgageException('Failed to create mortgage: $e');
    }
  }

  /// Updates an existing mortgage by ID.
  Future<Mortgage> updateMortgage({
    // Parameters based on UpdateMortgageSchema
    required String id,
    String? lender,
    double? principal,
    double? interestRate,
    DateTime? startDate,
    DateTime? endDate,
    String? status,
    String? notes,
  }) async {
    try {
      final Map<String, dynamic> params = {'id': id};
      if (lender != null) params['lender'] = lender;
      if (principal != null) params['principal'] = principal;
      if (interestRate != null) params['interestRate'] = interestRate;
      if (startDate != null) params['startDate'] = startDate.toIso8601String();
      if (endDate != null) params['endDate'] = endDate.toIso8601String();
      if (status != null) params['status'] = status;
      if (notes != null) params['notes'] = notes;

      final response = await _apiService.mutation(
        'mortgage.update',
        params,
      );
      if (response == null) {
        throw MortgageException('No data returned from updateMortgage');
      }
      return Mortgage.fromJson(response);
    } catch (e, st) {
      _logError('updateMortgage', e, st);
      if (e is MortgageException && e.code == 'NOT_FOUND') rethrow;
      if (e.toString().contains('not found') ||
          e.toString().contains('P2025')) {
        throw MortgageException.notFound(
            'Mortgage not found for update with ID: $id.');
      }
      throw MortgageException('Failed to update mortgage: $e');
    }
  }

  /// Deletes a mortgage by ID.
  Future<void> deleteMortgage(String id) async {
    try {
      await _apiService.mutation('mortgage.delete', {'id': id});
    } catch (e, st) {
      _logError('deleteMortgage', e, st);
      if (e is MortgageException && e.code == 'NOT_FOUND') rethrow;
      if (e.toString().contains('not found') ||
          e.toString().contains('P2025')) {
        throw MortgageException.notFound(
            'Mortgage not found or already deleted with ID: $id.');
      }
      throw MortgageException('Failed to delete mortgage: $e');
    }
  }

  void _logError(String method, Object error, StackTrace st) {
    log('[MortgageService][$method] $error', error: error, stackTrace: st);
    if (kDebugMode) {
      print('MortgageService.$method error: $error\n$st');
    }
    // Logging is handled here. Rethrowing or wrapping is done in the calling catch block.
  }
}
