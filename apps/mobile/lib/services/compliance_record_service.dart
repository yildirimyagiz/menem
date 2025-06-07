import 'dart:developer';

import 'package:mobile/api/api_service.dart';
import 'package:mobile/exceptions/compliance_record_exception.dart';
import 'package:mobile/models/compliance_record.dart';
import 'package:mobile/models/paginated_response.dart';

/// Service for handling compliance record-related API operations.
class ComplianceRecordService {
  final ApiService _apiService;

  /// Creates a new [ComplianceRecordService].
  ComplianceRecordService({ApiService? apiService})
      : _apiService = apiService ?? ApiService();

  /// Fetches all compliance records with pagination and filtering support.
  Future<PaginatedResponse<ComplianceRecord>> getComplianceRecords({
    int page = 1,
    int limit = 10,
    String? entityId,
    String? entityType,
    String? type,
    String? status,
    bool? isVerified,
    String? propertyId,
    String? agentId,
    String? agencyId,
    String? reservationId,
    String? sortBy,
    String? sortOrder = 'desc',
  }) async {
    try {
      final params = <String, dynamic>{
        'page': page,
        'limit': limit,
        if (entityId != null) 'entityId': entityId,
        if (entityType != null) 'entityType': entityType,
        if (type != null) 'type': type,
        if (status != null) 'status': status,
        if (isVerified != null) 'isVerified': isVerified,
        if (propertyId != null) 'propertyId': propertyId,
        if (agentId != null) 'agentId': agentId,
        if (agencyId != null) 'agencyId': agencyId,
        if (reservationId != null) 'reservationId': reservationId,
        if (sortBy != null) 'sortBy': sortBy,
        if (sortOrder != null) 'sortOrder': sortOrder,
      };

      final response = await _apiService.query(
        'complianceRecord.all',
        params,
      );

      if (response == null) {
        throw const ComplianceRecordException(
          'No data returned from getComplianceRecords',
        );
      }

      return PaginatedResponse<ComplianceRecord>.fromJson(
        response as Map<String, dynamic>,
        (json) => ComplianceRecord.fromJson(json as Map<String, dynamic>),
      );
    } catch (e, st) {
      _logError('getComplianceRecords', e, st);
      rethrow;
    }
  }

  /// Fetches a single compliance record by ID.
  Future<ComplianceRecord> getComplianceRecord(String id) async {
    try {
      final response = await _apiService.query(
        'complianceRecord.byId',
        {'id': id},
      );

      if (response == null) {
        throw ComplianceRecordException.notFound(
          'Compliance record not found',
        );
      }

      return ComplianceRecord.fromJson(response as Map<String, dynamic>);
    } catch (e, st) {
      _logError('getComplianceRecord', e, st);
      rethrow;
    }
  }

  /// Creates a new compliance record.
  Future<ComplianceRecord> createComplianceRecord(
    Map<String, dynamic> data,
  ) async {
    try {
      final response = await _apiService.mutation(
        'complianceRecord.create',
        data,
      );

      if (response == null) {
        throw const ComplianceRecordException(
          'No data returned from createComplianceRecord',
        );
      }

      return ComplianceRecord.fromJson(response as Map<String, dynamic>);
    } catch (e, st) {
      _logError('createComplianceRecord', e, st);
      rethrow;
    }
  }

  /// Updates an existing compliance record.
  Future<ComplianceRecord> updateComplianceRecord(
    String id,
    Map<String, dynamic> data,
  ) async {
    try {
      final response = await _apiService.mutation(
        'complianceRecord.update',
        {...data, 'id': id},
      );

      if (response == null) {
        throw const ComplianceRecordException(
          'No data returned from updateComplianceRecord',
        );
      }

      return ComplianceRecord.fromJson(response as Map<String, dynamic>);
    } catch (e, st) {
      _logError('updateComplianceRecord', e, st);
      rethrow;
    }
  }

  /// Deletes a compliance record by ID.
  Future<void> deleteComplianceRecord(String id) async {
    try {
      await _apiService.mutation(
        'complianceRecord.delete',
        {'id': id},
      );
    } catch (e, st) {
      _logError('deleteComplianceRecord', e, st);
      rethrow;
    }
  }

  /// Logs errors with stack trace for debugging purposes.
  void _logError(String method, Object error, StackTrace st) {
    log(
      '[ComplianceRecordService][$method] $error',
      error: error,
      stackTrace: st,
    );

    if (error is ComplianceRecordException) {
      throw error;
    }

    throw ComplianceRecordException(error.toString());
  }
}
