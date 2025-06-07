import 'dart:developer';

import '../api/api_service.dart';
import '../exceptions/agency_exception.dart';
import '../models/agency.dart';
import '../models/pagination.dart';

/// Provides agency-related API operations with type safety and error context.
class AgencyService {
  final ApiService _apiService;

  AgencyService(this._apiService);

  /// Fetches paginated list of agencies with filtering and sorting options.
  Future<PaginatedResponse<Agency>> getAgencies({
    int page = 1,
    int limit = 10,
    String? search,
    String? email,
    bool? isActive,
    String? ownerId,
    bool? hasDeleted,
    DateTime? createdFrom,
    DateTime? createdTo,
    String? sortBy,
    String? sortOrder = 'desc',
  }) async {
    try {
      final response = await _apiService.query(
        'agency.all',
        {
          'page': page,
          'limit': limit,
          if (search != null) 'search': search,
          if (email != null) 'email': email,
          if (isActive != null) 'isActive': isActive,
          if (ownerId != null) 'ownerId': ownerId,
          if (hasDeleted != null) 'hasDeleted': hasDeleted,
          if (createdFrom != null) 'createdFrom': createdTo?.toIso8601String(),
          if (createdTo != null) 'createdTo': createdTo.toIso8601String(),
          if (sortBy != null) 'sortBy': sortBy,
          if (sortOrder != null) 'sortOrder': sortOrder,
        },
      );

      final data = response.data as Map<String, dynamic>;
      return PaginatedResponse<Agency>.fromJson(
        data,
        (json) => Agency.fromJson(json as Map<String, dynamic>),
        dataKey: '',
      );
    } catch (e, st) {
      _logError('getAgencies', e, st);
      throw AgencyException(
        'Failed to fetch agencies: ${e.toString()}',
      );
    }
  }

  /// Fetches a single agency by ID.
  Future<Agency> getAgency(String id) async {
    try {
      final response = await _apiService.query(
        'agency.byId',
        {'id': id},
      );

      if (response.data == null) {
        throw AgencyException('Agency not found', code: 'not_found');
      }

      return Agency.fromJson(response.data as Map<String, dynamic>);
    } catch (e, st) {
      _logError('getAgency', e, st);
      throw AgencyException(
        'Failed to fetch agency: ${e.toString()}',
        code: e is AgencyException ? e.code : null,
      );
    }
  }

  /// Creates a new agency.
  Future<Agency> createAgency(Map<String, dynamic> data) async {
    try {
      final response = await _apiService.mutation(
        'agency.create',
        data,
      );

      return Agency.fromJson(response.data as Map<String, dynamic>);
    } catch (e, st) {
      _logError('createAgency', e, st);
      throw AgencyException(
        'Failed to create agency: ${e.toString()}',
      );
    }
  }

  /// Updates an existing agency.
  Future<Agency> updateAgency({
    required String id,
    required Map<String, dynamic> data,
  }) async {
    try {
      final response = await _apiService.mutation(
        'agency.update',
        {'id': id, ...data},
      );

      return Agency.fromJson(response.data as Map<String, dynamic>);
    } catch (e, st) {
      _logError('updateAgency', e, st);
      throw AgencyException(
        'Failed to update agency: ${e.toString()}',
      );
    }
  }

  /// Deletes an agency by ID (soft delete).
  Future<void> deleteAgency(String id) async {
    try {
      await _apiService.mutation('agency.delete', {'id': id});
    } catch (e, st) {
      _logError('deleteAgency', e, st);

      if (e.toString().contains('not found') ||
          e.toString().contains('already deleted')) {
        throw AgencyException(
          'Agency not found or already deleted',
          code: 'not_found',
        );
      }

      throw AgencyException(
        'Failed to delete agency: ${e.toString()}',
      );
    }
  }

  void _logError(String method, Object error, StackTrace st) {
    log(
      '[AgencyService][$method] $error',
      error: error,
      stackTrace: st,
    );
  }
}
