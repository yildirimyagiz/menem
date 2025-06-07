import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:mobile/providers/api_provider.dart';
import '../models/reservation.dart';
import '../models/pagination.dart'; // For PaginatedResponse
import 'dart:developer';
import 'package:mobile/api/api_service.dart';
// For enum

/// Custom exception for reservation-related errors.
class ReservationException implements Exception {
  final String message;
  ReservationException(this.message);
  @override
  String toString() => 'ReservationException: $message';
}

final reservationServiceProvider = Provider<ReservationService>((ref) {
  final apiService = ref.watch(apiServiceProvider);
  return ReservationService(apiService);
});

class ReservationService {
  final ApiService _apiService;

  ReservationService(this._apiService);

  /// Fetches reservations with pagination and filtering.
  /// Corresponds to `reservation.all` tRPC procedure.
  Future<PaginatedResponse<Reservation>> getReservations({
    int page = 1,
    int pageSize = 10,
    String? sortBy,
    String sortOrder = 'desc',
    String? userId,
    String? agentId,
    String? propertyId,
    ReservationStatus? status,
    DateTime? startDateFrom,
    DateTime? startDateTo,
    DateTime? endDateFrom,
    DateTime? endDateTo,
    // Add other filters as per ReservationFilterSchema
  }) async {
    try {
      final Map<String, dynamic> params = {
        'page': page,
        'pageSize': pageSize,
        'sortOrder': sortOrder,
        if (sortBy != null) 'sortBy': sortBy,
        if (userId != null) 'userId': userId,
        if (agentId != null) 'agentId': agentId,
        if (propertyId != null) 'propertyId': propertyId,
        if (status != null)
          'status': status.name, // Assuming status.name matches backend enum
        if (startDateFrom != null)
          'startDateFrom': startDateFrom.toIso8601String(),
        if (startDateTo != null) 'startDateTo': startDateTo.toIso8601String(),
        if (endDateFrom != null) 'endDateFrom': endDateFrom.toIso8601String(),
        if (endDateTo != null) 'endDateTo': endDateTo.toIso8601String(),
      };

      final response = await _apiService.query('reservation.all', params);
      return PaginatedResponse<Reservation>.fromJson(
        response as Map<String, dynamic>,
        (json) => Reservation.fromJson(json as Map<String, dynamic>),
        dataKey: 'data', // Backend returns { data: [...], pagination: {...} }
      );
    } catch (e, st) {
      _logError('getReservations', e, st);
      throw ReservationException('Failed to fetch reservations: $e');
    }
  }

  /// Fetches a single reservation by its ID.
  /// Corresponds to `reservation.byId` tRPC procedure.
  Future<Reservation?> getReservationById(String id) async {
    try {
      final response = await _apiService.query('reservation.byId', {'id': id});
      if (response == null) return null;
      return Reservation.fromJson(response as Map<String, dynamic>);
    } catch (e, st) {
      _logError('getReservationById', e, st);
      if (e.toString().contains('NOT_FOUND')) return null;
      throw ReservationException('Failed to fetch reservation $id: $e');
    }
  }

  /// Creates a new reservation.
  /// `data` should match `CreateReservationSchema`.
  Future<Reservation> createReservation(Map<String, dynamic> data) async {
    try {
      final response = await _apiService.mutation('reservation.create', data);
      if (response == null) {
        throw ReservationException('No data returned from createReservation');
      }
      return Reservation.fromJson(response as Map<String, dynamic>);
    } catch (e, st) {
      _logError('createReservation', e, st);
      throw ReservationException('Failed to create reservation: $e');
    }
  }

  /// Updates an existing reservation.
  /// `data` should match `UpdateReservationSchema` and include 'id'.
  Future<Reservation> updateReservation(Map<String, dynamic> data) async {
    try {
      final response = await _apiService.mutation('reservation.update', data);
      if (response == null) {
        throw ReservationException('No data returned from updateReservation');
      }
      return Reservation.fromJson(response as Map<String, dynamic>);
    } catch (e, st) {
      _logError('updateReservation', e, st);
      throw ReservationException('Failed to update reservation: $e');
    }
  }

  /// Cancels a reservation. This typically involves updating its status.
  Future<void> cancelReservation(String reservationId) async {
    try {
      // Assumes ReservationStatus.CANCELLED is the correct enum value string
      await updateReservation({
        'id': reservationId,
        'status': ReservationStatus.CANCELLED.name,
      });
    } catch (e, st) {
      _logError('cancelReservation', e, st);
      throw ReservationException('Failed to cancel reservation: $e');
    }
  }

  /// Soft deletes a reservation by its ID.
  /// Corresponds to `reservation.delete` tRPC procedure.
  Future<void> deleteReservation(String id) async {
    try {
      await _apiService.mutation('reservation.delete', {'id': id});
    } catch (e, st) {
      _logError('deleteReservation', e, st);
      throw ReservationException('Failed to delete reservation: $e');
    }
  }

  void _logError(String method, Object error, StackTrace st) {
    log('[ReservationService][[1m$method[0m] $error',
        error: error, stackTrace: st);
  }
}
