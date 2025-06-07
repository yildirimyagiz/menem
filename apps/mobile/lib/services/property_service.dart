import '../models/property.dart';
import 'dart:developer';
import '../exceptions/api_exception.dart';
import 'package:mobile/models/pagination.dart'; // For PaginatedResponse
import 'package:mobile/api/api_service.dart';

/// Service for handling property-related API operations via TRPC.
class PropertyService {
  final ApiService _apiService;

  PropertyService(this._apiService);

  /// Fetches all properties.
  Future<PaginatedResponse<Property>> getProperties({
    int? page,
    int? limit,
    String? searchTerm,
    PropertyStatus? status,
    PropertyCategory? category,
    PropertyType? type,
    // Add other filter parameters as needed by your backend
  }) async {
    try {
      // Use instance method of ApiService
      final response = await _apiService.query('property.all', {
        // Ensure your tRPC router for property uses 'property.all'
        if (page != null) 'page': page,
        if (limit != null) 'limit': limit,
        if (searchTerm != null && searchTerm.isNotEmpty)
          'title': searchTerm, // Assuming backend filters by 'title' for search
        if (status != null)
          'status': status.name, // Send enum name, ensure backend expects this
        if (category != null) 'category': category.name,
        if (type != null) 'type': type.name,
      });
      if (response == null) {
        throw ApiException('No data returned from getProperties');
      }
      // Backend 'property.all' returns a paginated structure
      if (response is Map<String, dynamic> &&
          response.containsKey('data') &&
          response['data'] is List) {
        return PaginatedResponse<Property>.fromJson(
            response, (json) => Property.fromJson(json as Map<String, dynamic>),
            dataKey: '');
      }
      throw ApiException('Unexpected response format from getProperties');
    } catch (e, st) {
      _logError('getProperties', e, st);
      throw ApiException('Failed to get properties: $e');
    }
  }

  /// Fetches a single property by its ID.
  Future<Property?> getPropertyById(String id) async {
    try {
      final response = await _apiService.query('property.byId',
          {'id': id}); // Ensure tRPC router has 'property.byId'
      if (response == null) {
        // Consider throwing a specific "NotFound" exception or returning null
        // depending on how you want to handle it in the UI.
        return null;
      }
      return Property.fromJson(response as Map<String, dynamic>);
    } catch (e, st) {
      _logError('getPropertyById', e, st);
      // Check if the error indicates "not found" and handle accordingly
      if (e.toString().toLowerCase().contains('not found')) {
        return null;
      }
      throw ApiException('Failed to get property by ID $id: $e');
    }
  }

  /// Creates a new property.
  /// `data` should match the `CreatePropertySchema` on your backend.
  Future<Property> createProperty(Map<String, dynamic> data) async {
    try {
      final response = await _apiService.mutation(
          'property.create', data); // Ensure tRPC router has 'property.create'
      if (response == null) {
        throw ApiException('No data returned from createProperty');
      }
      return Property.fromJson(response as Map<String, dynamic>);
    } catch (e, st) {
      _logError('createProperty', e, st);
      throw ApiException('Failed to create property: $e');
    }
  }

  /// Updates an existing property.
  /// `data` should match the `UpdatePropertySchema` on your backend and include the `id`.
  Future<Property> updateProperty(String id, Map<String, dynamic> data) async {
    try {
      final response = await _apiService.mutation('property.update',
          {'id': id, ...data}); // Ensure tRPC router has 'property.update'
      if (response == null) {
        throw ApiException('No data returned from updateProperty');
      }
      return Property.fromJson(response as Map<String, dynamic>);
    } catch (e, st) {
      _logError('updateProperty', e, st);
      throw ApiException('Failed to update property $id: $e');
    }
  }

  /// Deletes a property by its ID.
  Future<void> deleteProperty(String id) async {
    try {
      await _apiService.mutation('property.delete',
          {'id': id}); // Ensure tRPC router has 'property.delete'
    } catch (e, st) {
      _logError('deleteProperty', e, st);
      throw ApiException('Failed to delete property $id: $e');
    }
  }

  /// Client-side search (consider moving to backend for performance).
  Future<List<Property>> searchPropertiesClientSide(String query) async {
    try {
      final paginatedResponse = await getProperties(
          limit: 1000); // Fetch a large number for client-side filtering
      final all = paginatedResponse.data;
      final q = query.toLowerCase();
      return all
          .where((p) =>
              p.title.toLowerCase().contains(q) ||
              (p.address?.toLowerCase().contains(q) ?? false) ||
              (p.description?.toLowerCase().contains(q) ?? false))
          .toList();
    } catch (e, st) {
      _logError('searchPropertiesClientSide', e, st);
      throw ApiException('Failed to search properties (client-side): $e');
    }
  }

  /// Client-side filter (consider moving to backend for performance).
  Future<List<Property>> filterPropertiesClientSide({
    List<PropertyType>? types,
    List<PropertyStatus>? statuses,
    List<PropertyCategory>? categories,
  }) async {
    try {
      final paginatedResponse =
          await getProperties(limit: 1000); // Fetch a large number
      final all = paginatedResponse.data;
      var filtered = all;
      if (types != null && types.isNotEmpty) {
        filtered =
            filtered.where((p) => types.contains(p.propertyType)).toList();
      }
      if (statuses != null && statuses.isNotEmpty) {
        filtered =
            filtered.where((p) => statuses.contains(p.propertyStatus)).toList();
      }
      if (categories != null && categories.isNotEmpty) {
        filtered =
            filtered.where((p) => categories.contains(p.category)).toList();
      }
      return filtered;
    } catch (e, st) {
      _logError('filterPropertiesClientSide', e, st);
      throw ApiException('Failed to filter properties (client-side): $e');
    }
  }

  void _logError(String method, Object error, StackTrace st) {
    log('[PropertyService][$method] $error', error: error, stackTrace: st);
    // Optionally log errors to a logging service or console
    // print('PropertyService.$method error: $error\n$st');
  }
}
