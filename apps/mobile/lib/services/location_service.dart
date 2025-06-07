import 'package:flutter/foundation.dart';

import '../models/location.dart';
import 'dart:developer';
import '../api/api_service.dart';
import '../models/pagination.dart'; // For PaginatedResponse

/// Custom exception for location-related errors.
class LocationException implements Exception {
  final String message;
  final String? code;

  LocationException(this.message, {this.code});

  /// Creates a "not found" location exception.
  factory LocationException.notFound(String message) =>
      LocationException(message, code: 'NOT_FOUND');

  @override
  String toString() =>
      'LocationException: $message${code != null ? ' (Code: $code)' : ''}';
}

/// Service for handling location-related API operations via TRPC.
class LocationService {
  final ApiService _apiService;

  LocationService(this._apiService);

  /// Fetches all locations (optionally filtered).
  Future<PaginatedResponse<Location>> getLocations({
    int page = 1,
    int limit = 10,
    String? country,
    String? city,
    String? district,
    String? address,
    String? postalCode,
    String? sortBy, // e.g., "createdAt"
    String sortOrder = 'desc', // "asc" or "desc"
  }) async {
    try {
      final Map<String, dynamic> params = {
        'page': page,
        'limit': limit,
        'sortOrder': sortOrder,
      };
      if (country != null) params['country'] = country;
      if (city != null) params['city'] = city;
      if (district != null) params['district'] = district;
      if (address != null) params['address'] = address;
      if (postalCode != null) params['postalCode'] = postalCode;
      if (sortBy != null) params['sortBy'] = sortBy;

      final response = await _apiService.query(
        'location.all', // Corrected procedure name
        params,
      );
      if (response == null) {
        throw LocationException('No data returned from getLocations');
      }
      // Backend returns { data: locations.map(sanitizeLocation), page, limit, total }
      return PaginatedResponse<Location>.fromJson(
        response,
        (json) => Location.fromJson(json as Map<String, dynamic>),
        dataKey: 'data', // The list of locations is under the 'data' key
      );
    } catch (e, st) {
      _logError('getLocations', e, st);
      throw LocationException('Failed to get locations: $e');
    }
  }

  /// Fetches a single location by ID.
  Future<Location> getLocation(String id) async {
    try {
      final response = await _apiService.query(
        'location.byId', // Corrected procedure name
        {'id': id},
      );
      if (response == null) {
        throw LocationException.notFound(
            'Location not found with ID: $id. No data returned.');
      }
      return Location.fromJson(response as Map<String, dynamic>);
    } catch (e, st) {
      _logError('getLocation', e, st);
      if (e is LocationException && e.code == 'NOT_FOUND') rethrow;
      if (e.toString().contains('not found') ||
          e.toString().contains('P2025')) {
        throw LocationException.notFound('Location not found with ID: $id.');
      }
      throw LocationException('Failed to get location: $e');
    }
  }

  /// Creates a new location.
  Future<Location> createLocation({
    // Parameters based on CreateLocationSchema
    required String address,
    required String city,
    required String country,
    String? district,
    String? postalCode,
    Map<String, double>? coordinates, // e.g., {'lat': 0.0, 'lng': 0.0}
  }) async {
    try {
      final Map<String, dynamic> params = {
        'address': address,
        'city': city,
        'country': country,
      };
      if (district != null) params['district'] = district;
      if (postalCode != null) params['postalCode'] = postalCode;
      if (coordinates != null) params['coordinates'] = coordinates;

      final response = await _apiService.mutation(
        'location.create',
        params,
      );
      if (response == null) {
        throw LocationException('No data returned from createLocation');
      }
      return Location.fromJson(response as Map<String, dynamic>);
    } catch (e, st) {
      _logError('createLocation', e, st);
      throw LocationException('Failed to create location: $e');
    }
  }

  /// Updates an existing location by ID.
  Future<Location> updateLocation({
    required String id,
    String? address,
    String? city,
    String? country,
    String? district,
    String? postalCode,
    Map<String, double>? coordinates,
    DateTime? deletedAt, // For soft delete, if applicable
  }) async {
    try {
      final Map<String, dynamic> params = {'id': id};
      if (address != null) params['address'] = address;
      if (city != null) params['city'] = city;
      if (country != null) params['country'] = country;
      if (district != null) params['district'] = district;
      if (postalCode != null) params['postalCode'] = postalCode;
      if (coordinates != null) params['coordinates'] = coordinates;
      if (deletedAt != null) params['deletedAt'] = deletedAt.toIso8601String();

      final response = await _apiService.mutation(
        'location.update',
        params,
      );
      if (response == null) {
        throw LocationException('No data returned from updateLocation');
      }
      return Location.fromJson(response as Map<String, dynamic>);
    } catch (e, st) {
      _logError('updateLocation', e, st);
      if (e is LocationException && e.code == 'NOT_FOUND') rethrow;
      if (e.toString().contains('not found') ||
          e.toString().contains('P2025')) {
        throw LocationException.notFound(
            'Location not found for update with ID: $id.');
      }
      throw LocationException('Failed to update location: $e');
    }
  }

  /// Deletes a location by ID.
  Future<void> deleteLocation(String id) async {
    try {
      // The backend performs a soft delete and returns { success: true }
      await _apiService.mutation('location.delete', {'id': id});
    } catch (e, st) {
      _logError('deleteLocation', e, st);
      if (e is LocationException && e.code == 'NOT_FOUND') rethrow;
      if (e.toString().contains('not found') ||
          e.toString().contains('P2025')) {
        throw LocationException.notFound(
            'Location not found or already deleted with ID: $id');
      }
      throw LocationException('Failed to delete location: $e');
    }
  }

  void _logError(String method, Object error, StackTrace st) {
    log('[LocationService][$method] $error', error: error, stackTrace: st);
    if (kDebugMode) {
      print('LocationService.$method error: $error\n$st');
    }
    // Logging is handled here. Rethrowing or wrapping is done in the calling catch block.
  }
}
