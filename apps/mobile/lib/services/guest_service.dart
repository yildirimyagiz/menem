import 'package:flutter/foundation.dart';

import '../models/guest.dart';
import 'dart:developer';
import '../api/api_service.dart';
import '../models/pagination.dart'; // For PaginatedResponse

/// Custom exception for guest-related errors.
class GuestException implements Exception {
  final String message;
  final String? code;

  GuestException(this.message, {this.code});

  /// Creates a "not found" guest exception.
  factory GuestException.notFound(String message) =>
      GuestException(message, code: 'NOT_FOUND');

  @override
  String toString() =>
      'GuestException: $message${code != null ? ' (Code: $code)' : ''}';
}

/// Service for handling guest-related API operations via TRPC.
class GuestService {
  final ApiService _apiService;

  GuestService(this._apiService);

  /// Fetches all guests (optionally filtered).
  Future<PaginatedResponse<Guest>> getGuests({
    int page = 1,
    int limit = 10,
    String? search,
    String? name,
    String? email,
    String? phone,
    String? passportNumber,
    String? nationality,
    String? gender, // Assuming Gender enum or String
    String? agencyId,
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
      if (search != null) params['search'] = search;
      if (name != null) params['name'] = name;
      if (email != null) params['email'] = email;
      if (phone != null) params['phone'] = phone;
      if (passportNumber != null) params['passportNumber'] = passportNumber;
      if (nationality != null) params['nationality'] = nationality;
      if (gender != null) params['gender'] = gender;
      if (agencyId != null) params['agencyId'] = agencyId;
      if (createdAtFrom != null) {
        params['createdAtFrom'] = createdAtFrom.toIso8601String();
      }
      if (createdAtTo != null) {
        params['createdAtTo'] = createdAtTo.toIso8601String();
      }
      if (sortBy != null) params['sortBy'] = sortBy;

      final response = await _apiService.query(
        'guest.all', // Corrected procedure name
        params,
      );
      if (response == null) {
        throw GuestException('No data returned from getGuests');
      }
      return PaginatedResponse<Guest>.fromJson(
        response,
        (json) => Guest.fromJson(json as Map<String, dynamic>),
        dataKey: '',
      );
    } catch (e, st) {
      _logError('getGuests', e, st);
      throw GuestException('Failed to get guests: $e');
    }
  }

  /// Fetches a single guest by ID.
  Future<Guest> getGuest(String id) async {
    try {
      final response = await _apiService.query(
        'guest.byId', // Corrected procedure name
        {'id': id},
      );
      if (response == null) {
        throw GuestException.notFound(
            'Guest not found with ID: $id. No data returned.');
      }
      return Guest.fromJson(response as Map<String, dynamic>);
    } catch (e, st) {
      _logError('getGuest', e, st);
      if (e is GuestException && e.code == 'NOT_FOUND') rethrow;
      if (e.toString().contains('not found') ||
          e.toString().contains('P2025')) {
        throw GuestException.notFound('Guest not found with ID: $id.');
      }
      throw GuestException('Failed to get guest: $e');
    }
  }

  /// Creates a new guest.
  Future<Guest> createGuest({
    // Parameters based on CreateGuestSchema
    required String name,
    required String email,
    String? phone,
    String? address,
    String? city,
    String? state,
    String? country,
    String? postalCode,
    DateTime? dateOfBirth,
    String? nationality,
    String? passportNumber,
    DateTime? passportExpiryDate,
    String? gender,
    String? notes,
    String? agencyId,
  }) async {
    try {
      final Map<String, dynamic> params = {
        'name': name,
        'email': email,
      };
      if (phone != null) params['phone'] = phone;
      if (address != null) params['address'] = address;
      if (city != null) params['city'] = city;
      if (state != null) params['state'] = state;
      if (country != null) params['country'] = country;
      if (postalCode != null) params['postalCode'] = postalCode;
      if (dateOfBirth != null) {
        params['dateOfBirth'] = dateOfBirth.toIso8601String();
      }
      if (nationality != null) params['nationality'] = nationality;
      if (passportNumber != null) params['passportNumber'] = passportNumber;
      if (passportExpiryDate != null) {
        params['passportExpiryDate'] = passportExpiryDate.toIso8601String();
      }
      if (gender != null) params['gender'] = gender;
      if (notes != null) params['notes'] = notes;
      if (agencyId != null) params['agencyId'] = agencyId;

      final response = await _apiService.mutation(
        'guest.create',
        params,
      );
      if (response == null) {
        throw GuestException('No data returned from createGuest');
      }
      return Guest.fromJson(response as Map<String, dynamic>);
    } catch (e, st) {
      _logError('createGuest', e, st);
      throw GuestException('Failed to create guest: $e');
    }
  }

  /// Updates an existing guest by ID.
  Future<Guest> updateGuest({
    // Parameters based on UpdateGuestSchema
    required String id,
    String? name,
    String? email,
    String? phone,
    String? address,
    String? city,
    String? state,
    String? country,
    String? postalCode,
    DateTime? dateOfBirth,
    String? nationality,
    String? passportNumber,
    DateTime? passportExpiryDate,
    String? gender,
    String? notes,
    String? agencyId, // Can be null to disconnect
  }) async {
    try {
      final Map<String, dynamic> params = {'id': id};
      if (name != null) params['name'] = name;
      if (email != null) params['email'] = email;
      if (phone != null) params['phone'] = phone;
      if (address != null) params['address'] = address;
      if (city != null) params['city'] = city;
      if (state != null) params['state'] = state;
      if (country != null) params['country'] = country;
      if (postalCode != null) params['postalCode'] = postalCode;
      if (dateOfBirth != null) {
        params['dateOfBirth'] = dateOfBirth.toIso8601String();
      }
      if (nationality != null) params['nationality'] = nationality;
      if (passportNumber != null) params['passportNumber'] = passportNumber;
      if (passportExpiryDate != null) {
        params['passportExpiryDate'] = passportExpiryDate.toIso8601String();
      }
      if (gender != null) params['gender'] = gender;
      if (notes != null) params['notes'] = notes;
      // For agencyId, if you want to allow unsetting it, pass null.
      // The backend schema handles agencyId being optional or explicitly null for disconnection.
      if (params.containsKey('agencyId') || agencyId != null) {
        params['agencyId'] = agencyId;
      }

      final response = await _apiService.mutation(
        'guest.update',
        params,
      );
      if (response == null) {
        throw GuestException('No data returned from updateGuest');
      }
      return Guest.fromJson(response as Map<String, dynamic>);
    } catch (e, st) {
      _logError('updateGuest', e, st);
      if (e is GuestException && e.code == 'NOT_FOUND') rethrow;
      if (e.toString().contains('not found') ||
          e.toString().contains('P2025')) {
        throw GuestException.notFound(
            'Guest not found for update with ID: $id.');
      }
      throw GuestException('Failed to update guest: $e');
    }
  }

  /// Deletes a guest by ID.
  Future<void> deleteGuest(String id) async {
    try {
      await _apiService.mutation('guest.delete', {'id': id});
    } catch (e, st) {
      _logError('deleteGuest', e, st);
      if (e is GuestException && e.code == 'NOT_FOUND') rethrow;
      if (e.toString().contains('not found') ||
          e.toString().contains('P2025')) {
        throw GuestException.notFound(
            'Guest not found or already deleted with ID: $id.');
      }
      throw GuestException('Failed to delete guest: $e');
    }
  }

  /// Searches for guests based on a query string.
  Future<List<Guest>> searchGuests(String query, {int limit = 10}) async {
    try {
      final response = await _apiService.query(
        'guest.search',
        {'query': query, 'limit': limit},
      );
      if (response == null || response is! List) {
        throw GuestException(
            'No data or invalid format returned from searchGuests');
      }
      return (response)
          .map((json) => Guest.fromJson(json as Map<String, dynamic>))
          .toList();
    } catch (e, st) {
      _logError('searchGuests', e, st);
      throw GuestException('Failed to search guests: $e');
    }
  }

  void _logError(String method, Object error, StackTrace st) {
    log('[GuestService][$method] $error', error: error, stackTrace: st);
    if (kDebugMode) {
      // The null character `\0` in the original print might be a typo.
      print('GuestService.$method error: $error\n$st'); // Corrected: removed \0
    }
    // Logging is handled here. Rethrowing or wrapping is done in the calling catch block.
  }
}
