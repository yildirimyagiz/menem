import 'dart:developer';
import 'package:mobile/api/api_service.dart';
import 'package:mobile/models/provider.dart'; // Assuming you have a Provider model
import 'package:mobile/models/pagination.dart'; // For PaginatedResponse

/// Custom exception for provider-related errors.
class ProviderException implements Exception {
  final String message;
  final String? code;

  ProviderException(this.message, {this.code});

  @override
  String toString() =>
      'ProviderException: $message${code != null ? ' (Code: $code)' : ''}';
}

/// Service for handling provider-related API operations via TRPC.
class ProviderService {
  final ApiService _apiService;

  ProviderService(this._apiService);

  /// Fetches providers with pagination and filtering.
  Future<PaginatedResponse<Provider>> getProviders({
    int page = 1,
    int limit = 10,
    String? name,
    bool? isActive,
    String? source,
    double? commissionMin,
    double? commissionMax,
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
      if (isActive != null) params['isActive'] = isActive;
      if (source != null) params['source'] = source;
      if (commissionMin != null) params['commissionMin'] = commissionMin;
      if (commissionMax != null) params['commissionMax'] = commissionMax;
      if (sortBy != null) params['sortBy'] = sortBy;

      final response = await _apiService.query('provider.all', params);
      if (response == null) {
        throw ProviderException('No data returned from getProviders');
      }
      return PaginatedResponse<Provider>.fromJson(
        response as Map<String, dynamic>,
        (json) => Provider.fromJson(json as Map<String, dynamic>),
        dataKey: 'data',
      );
    } catch (e, st) {
      _logError('getProviders', e, st);
      throw ProviderException('Failed to get providers: $e');
    }
  }

  /// Fetches a single provider by ID.
  Future<Provider?> getProviderById(String id) async {
    try {
      final response = await _apiService.query('provider.byId', {'id': id});
      if (response == null) {
        return null;
      }
      return Provider.fromJson(response as Map<String, dynamic>);
    } catch (e, st) {
      _logError('getProviderById', e, st);
      if (e.toString().contains('NOT_FOUND')) return null;
      throw ProviderException('Failed to get provider by ID $id: $e');
    }
  }

  /// Creates a new provider.
  /// `data` should match the `CreateProviderSchema`.
  Future<Provider> createProvider(Map<String, dynamic> data) async {
    try {
      final response = await _apiService.mutation('provider.create', data);
      if (response == null) {
        throw ProviderException('No data returned from createProvider');
      }
      return Provider.fromJson(response as Map<String, dynamic>);
    } catch (e, st) {
      _logError('createProvider', e, st);
      throw ProviderException('Failed to create provider: $e');
    }
  }

  // Add updateProvider and deleteProvider (soft delete) methods similarly,
  // matching UpdateProviderSchema and the delete procedure in provider.ts.

  // Example for soft delete:
  // Future<void> deleteProvider(String id) async {
  //   try {
  //     await _apiService.mutation('provider.delete', {'id': id});
  //   } catch (e, st) {
  //     _logError('deleteProvider', e, st);
  //     throw ProviderException('Failed to delete provider $id: $e');
  //   }
  // }

  void _logError(String method, Object error, StackTrace st) {
    log('[ProviderService][$method] $error', error: error, stackTrace: st);
  }
}
