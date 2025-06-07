import 'package:flutter/foundation.dart';
import 'dart:developer';

import 'package:mobile/api/api_service.dart'; // Changed from TrpcClient
import 'package:mobile/models/contract.dart';
import 'package:mobile/models/paginated_response.dart'; // Added for pagination

/// Custom exception for contract-related errors.
class ContractException implements Exception {
  final String message;
  final String? code;

  ContractException(this.message, {this.code});

  /// Creates a "not found" contract exception.
  factory ContractException.notFound(String message) =>
      ContractException(message, code: 'NOT_FOUND');

  @override
  String toString() =>
      'ContractException: $message${code != null ? ' (Code: $code)' : ''}';
}

/// Service for handling contract-related API operations via TRPC.
class ContractService {
  final ApiService _apiService; // Changed from TrpcClient

  ContractService({ApiService? apiService})
      : _apiService = apiService ?? ApiService();

  /// Fetches all contracts with pagination and filtering.
  Future<PaginatedResponse<Contract>> getContracts({
    int page = 1,
    int pageSize = 20, // Matches backend 'pageSize'
    ContractStatus? status,
    String? tenantId,
    String? propertyId,
    String? agencyId,
    DateTime? startDateFrom,
    DateTime? startDateTo,
    DateTime? endDateFrom,
    DateTime? endDateTo,
    String? sortBy, // e.g., "startDate", "endDate", "status", "name"
    String? sortOrder = 'desc', // "asc" or "desc"
  }) async {
    try {
      final params = <String, dynamic>{
        'page': page,
        'pageSize': pageSize,
        if (status != null)
          'status':
              status.name, // Assumes enum .name gives "ACTIVE", "DRAFT" etc.
        if (tenantId != null) 'tenantId': tenantId,
        if (propertyId != null) 'propertyId': propertyId,
        if (agencyId != null) 'agencyId': agencyId,
        if (startDateFrom != null)
          'startDateFrom': startDateFrom.toIso8601String(),
        if (startDateTo != null) 'startDateTo': startDateTo.toIso8601String(),
        if (endDateFrom != null) 'endDateFrom': endDateFrom.toIso8601String(),
        if (endDateTo != null) 'endDateTo': endDateTo.toIso8601String(),
        if (sortBy != null) 'sortBy': sortBy,
        if (sortOrder != null) 'sortOrder': sortOrder,
      };

      final response = await _apiService.query(
        'contract.getAll',
        params,
      );

      if (response == null) {
        throw ContractException('No data returned from getContracts.');
      }

      return PaginatedResponse<Contract>.fromJson(
        response as Map<String, dynamic>,
        (json) => Contract.fromJson(json as Map<String, dynamic>),
        // Assuming backend returns { data: [...], total: ... }
        // If data is directly at root and total is part of it, adjust dataKey
      );
    } catch (e, st) {
      _logError('getContracts', e, st);
      // Aligning with AccountService: explicitly throw a wrapped exception.
      throw ContractException('Failed to get contracts: $e');
    }
  }

  /// Fetches a single contract by ID.
  Future<Contract> getContract(String id) async {
    try {
      final response = await _apiService.query(
        'contract.getById', // Corrected endpoint
        {'id': id},
      );
      if (response == null) {
        throw ContractException.notFound(
            'Contract not found with ID: $id. No data returned.');
      }
      return Contract.fromJson(response);
    } catch (e, st) {
      _logError('getContract', e, st);
      if (e is ContractException && e.code == 'NOT_FOUND') {
        rethrow;
      }
      if (e.toString().contains('not found') ||
          e.toString().contains('P2025')) {
        throw ContractException.notFound('Contract not found with ID: $id.');
      }
      throw ContractException('Failed to get contract by ID: $e');
    }
  }

  /// Creates a new contract.
  Future<Contract> createContract({
    required String name,
    required String description,
    required ContractStatus status,
    required DateTime startDate,
    required DateTime endDate,
    required String propertyId,
    required String tenantId,
    required String agencyId,
    Map<String, dynamic>? terms,
    Map<String, dynamic>? metadata,
  }) async {
    try {
      final Map<String, dynamic> payload = {
        'name': name,
        'description': description,
        'status':
            status.name, // Assumes enum .name gives "ACTIVE", "DRAFT" etc.
        'startDate': startDate.toIso8601String(),
        'endDate': endDate.toIso8601String(),
        'propertyId': propertyId,
        'tenantId': tenantId,
        'agencyId': agencyId,
        if (terms != null) 'terms': terms,
        if (metadata != null) 'metadata': metadata,
      };

      final response = await _apiService.mutation(
        'contract.create',
        payload,
      );
      if (response == null) {
        throw ContractException('No data returned from createContract.');
      }
      return Contract.fromJson(response);
    } catch (e, st) {
      _logError('createContract', e, st);
      throw ContractException('Failed to create contract: $e');
    }
  }

  /// Updates an existing contract by ID.
  Future<Contract> updateContract({
    required String id,
    String? name,
    String? description,
    ContractStatus? status,
    DateTime? startDate,
    DateTime? endDate,
    Map<String, dynamic>? terms,
    Map<String, dynamic>? metadata,
  }) async {
    try {
      final Map<String, dynamic> payload = {
        'id': id,
        if (name != null) 'name': name,
        if (description != null) 'description': description,
        if (status != null) 'status': status.name,
        if (startDate != null) 'startDate': startDate.toIso8601String(),
        if (endDate != null) 'endDate': endDate.toIso8601String(),
        if (terms != null) 'terms': terms,
        if (metadata != null) 'metadata': metadata,
      };

      final response = await _apiService.mutation(
        'contract.update',
        payload,
      );
      if (response == null) {
        throw ContractException.notFound(
            'Contract not found for update with ID: $id. No data returned.');
      }
      return Contract.fromJson(response);
    } catch (e, st) {
      _logError('updateContract', e, st);
      if (e is ContractException && e.code == 'NOT_FOUND') {
        rethrow;
      }
      if (e.toString().contains('not found') ||
          e.toString().contains('P2025')) {
        throw ContractException.notFound(
            'Contract not found for update with ID: $id.');
      }
      throw ContractException('Failed to update contract: $e');
    }
  }

  /// Deletes a contract by ID.
  Future<void> deleteContract(String id) async {
    try {
      await _apiService.mutation('contract.delete', {'id': id});
    } catch (e, st) {
      _logError('deleteContract', e, st);
      if (e is ContractException && e.code == 'NOT_FOUND') {
        rethrow;
      }
      if (e.toString().contains('not found') ||
          e.toString().contains('P2025')) {
        throw ContractException.notFound(
            'Contract not found or already deleted with ID: $id.');
      }
      throw ContractException('Failed to delete contract: $e');
    }
  }

  void _logError(String method, Object error, StackTrace st) {
    log('[ContractService][$method] $error', error: error, stackTrace: st);

    if (kDebugMode) {
      print('ContractService.$method error: $error\n$st');
    }
    // Logging is handled here. Rethrowing or wrapping is done in the calling catch block.
  }

  Future getAll() async {}

  Future<void> create(Map<String, dynamic> json) async {}

  Future getContractsByUser(String userId) async {}

  Future<void> update(String id, Map<String, dynamic> data) async {}

  Future<void> delete(String id) async {}

  Future get(String id) async {}
}
