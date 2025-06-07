import 'dart:developer';

import '../api/api_service.dart';
import '../exceptions/api_exception.dart';
import '../models/availability.dart';
import '../models/pagination.dart';

class AvailabilityService {
  final ApiService _apiService;

  AvailabilityService(this._apiService);

  Future<PaginatedResponse<Availability>> getAvailabilities({
    int page = 1,
    int limit = 10,
    String? propertyId,
    DateTime? date,
    bool? isBlocked,
    int? minAvailableUnits,
    int? maxAvailableUnits,
    String? sortBy,
    String sortOrder = 'asc',
    DateTime? startDate,
    DateTime? endDate,
  }) async {
    try {
      final response = await _apiService.query(
        'availability.all',
        {
          'page': page,
          'limit': limit,
          if (propertyId != null) 'propertyId': propertyId,
          if (date != null) 'date': date.toIso8601String(),
          if (isBlocked != null) 'isBlocked': isBlocked,
          if (minAvailableUnits != null) 'minAvailableUnits': minAvailableUnits,
          if (maxAvailableUnits != null) 'maxAvailableUnits': maxAvailableUnits,
          if (sortBy != null) 'sortBy': sortBy,
          'sortOrder': sortOrder,
        },
      );

      if (response == null) {
        throw ApiException.server('No data returned from getAvailabilities');
      }

      return PaginatedResponse<Availability>.fromJson(
        response,
        (json) => Availability.fromJson(json as Map<String, dynamic>),
        dataKey:
            'data', // Backend 'availability.all' returns data under 'data' key
      );
    } catch (e, st) {
      _logError('getAvailabilities', e, st);
      throw ApiException.server('Failed to get availabilities: $e');
    }
  }

  Future<Availability> getAvailability(String id) async {
    try {
      final response = await _apiService.query(
        'availability.byId',
        {'id': id},
      );

      if (response == null) {
        throw ApiException.notFound('Availability not found');
      }

      return Availability.fromJson(response);
    } catch (e, st) {
      _logError('getAvailability', e, st);
      if (e.toString().contains('not found') ||
          e.toString().contains('P2025')) {
        throw ApiException.notFound('Availability not found');
      }
      throw ApiException.server('Failed to get availability: $e');
    }
  }

  Future<Availability> createAvailability(
    Availability availability, {
    required DateTime date,
    // This parameter was unused: Availability availability,
    required String propertyId,
    bool isBlocked = false,
    bool isBooked = false,
    int totalUnits = 1,
    int availableUnits = 1,
    int bookedUnits = 0,
    int blockedUnits = 0,
    double basePrice = 0,
    double currentPrice = 0,
    int maxGuests = 2,
    Map<String, dynamic>? specialPricing,
    Map<String, dynamic>? priceSettings,
    Map<String, dynamic>? discountSettings,
    double? weekendRate,
    double? weekdayRate,
    double? weekendMultiplier = 1,
    double? weekdayMultiplier = 1,
    double? seasonalMultiplier = 1,
    String? reservationId,
    String? pricingRuleId,
    required int minNights,
    required int maxNights,
  }) async {
    try {
      final response = await _apiService.mutation(
        'availability.create',
        {
          'date': date.toIso8601String(),
          'propertyId': propertyId,
          'isBlocked': isBlocked,
          'isBooked': isBooked,
          'totalUnits': totalUnits,
          'availableUnits': availableUnits,
          'bookedUnits': bookedUnits,
          'blockedUnits': blockedUnits,
          'basePrice': basePrice,
          'currentPrice': currentPrice,
          'maxGuests': maxGuests,
          'specialPricing': specialPricing,
          'priceSettings': priceSettings,
          'discountSettings': discountSettings,
          'weekendRate': weekendRate,
          'weekdayRate': weekdayRate,
          'weekendMultiplier': weekendMultiplier,
          'weekdayMultiplier': weekdayMultiplier,
          'seasonalMultiplier': seasonalMultiplier,
          'reservationId': reservationId,
          'pricingRuleId': pricingRuleId,
        },
      );

      if (response == null) {
        throw ApiException.server('No data returned from createAvailability');
      }

      return Availability.fromJson(response);
    } catch (e, st) {
      _logError('createAvailability', e, st);
      throw ApiException.server('Failed to create availability: $e');
    }
  }

  Future<Availability> updateAvailability(
    Availability availability, {
    required String id,
    DateTime? date,
    bool? isBlocked,
    bool? isBooked,
    String? propertyId,
    String? reservationId,
    String? pricingRuleId,
    int? totalUnits,
    int? availableUnits,
    int? bookedUnits,
    int? blockedUnits,
    double? basePrice,
    double? currentPrice,
    int? maxGuests,
    Map<String, dynamic>? specialPricing,
    Map<String, dynamic>? priceSettings,
    Map<String, dynamic>? discountSettings,
    double? weekendRate,
    double? weekdayRate,
    double? weekendMultiplier,
    double? weekdayMultiplier,
    double? seasonalMultiplier,
  }) async {
    try {
      final response = await _apiService.mutation(
        'availability.update',
        {
          'id': id,
          if (date != null) 'date': date.toIso8601String(),
          if (isBlocked != null) 'isBlocked': isBlocked,
          if (isBooked != null) 'isBooked': isBooked,
          if (propertyId != null) 'propertyId': propertyId,
          if (reservationId != null) 'reservationId': reservationId,
          if (pricingRuleId != null) 'pricingRuleId': pricingRuleId,
          if (totalUnits != null) 'totalUnits': totalUnits,
          if (availableUnits != null) 'availableUnits': availableUnits,
          if (bookedUnits != null) 'bookedUnits': bookedUnits,
          if (blockedUnits != null) 'blockedUnits': blockedUnits,
          if (basePrice != null) 'basePrice': basePrice,
          if (currentPrice != null) 'currentPrice': currentPrice,
          if (maxGuests != null) 'maxGuests': maxGuests,
          if (specialPricing != null) 'specialPricing': specialPricing,
          if (priceSettings != null) 'priceSettings': priceSettings,
          if (discountSettings != null) 'discountSettings': discountSettings,
          if (weekendRate != null) 'weekendRate': weekendRate,
          if (weekdayRate != null) 'weekdayRate': weekdayRate,
          if (weekendMultiplier != null) 'weekendMultiplier': weekendMultiplier,
          if (weekdayMultiplier != null) 'weekdayMultiplier': weekdayMultiplier,
          if (seasonalMultiplier != null)
            'seasonalMultiplier': seasonalMultiplier,
        },
      );

      if (response == null) {
        throw ApiException.server('No data returned from updateAvailability');
      }

      return Availability.fromJson(response);
    } catch (e, st) {
      _logError('updateAvailability', e, st);
      if (e.toString().contains('not found') ||
          e.toString().contains('P2025')) {
        throw ApiException.notFound('Availability not found');
      }
      throw ApiException.server('Failed to update availability: $e');
    }
  }

  Future<void> deleteAvailability(String id) async {
    try {
      await _apiService.mutation(
        'availability.delete',
        {'id': id},
      );
    } catch (e, st) {
      _logError('deleteAvailability', e, st);
      if (e.toString().contains('not found') ||
          e.toString().contains('P2025')) {
        throw ApiException.notFound('Availability not found');
      }
      throw ApiException.server('Failed to delete availability: $e');
    }
  }

  Future<List<Availability>> blockDates({
    required String propertyId,
    required DateTime startDate,
    required DateTime endDate,
    int units = 0,
    // Add 'reason' if your backend 'availability.blockDates' procedure expects it
    String? reason,
  }) async {
    try {
      final response = await _apiService.mutation(
        'availability.blockDates',
        {
          'propertyId': propertyId,
          'startDate': startDate.toIso8601String(),
          'endDate': endDate.toIso8601String(),
          'units': units,
          if (reason != null) 'reason': reason,
        },
      );

      if (response == null) {
        throw ApiException.server('No data returned from blockDates');
      }

      return (response as List)
          .map((e) => Availability.fromJson(e as Map<String, dynamic>))
          .toList();
    } catch (e, st) {
      _logError('blockDates', e, st);
      throw ApiException.server('Failed to block dates: $e');
      // Note: 'availability.blockDates' procedure is not defined in the provided backend router.
    }
  }

  Future<List<Availability>> unblockDates({
    required String propertyId,
    required DateTime startDate,
    required DateTime endDate,
  }) async {
    try {
      final response = await _apiService.mutation(
        'availability.unblockDates',
        {
          'propertyId': propertyId,
          'startDate': startDate.toIso8601String(),
          'endDate': endDate.toIso8601String(),
        },
      );

      if (response == null) {
        throw ApiException.server('No data returned from unblockDates');
      }

      return (response as List)
          .map((e) => Availability.fromJson(e as Map<String, dynamic>))
          .toList();
    } catch (e, st) {
      _logError('unblockDates', e, st);
      throw ApiException.server('Failed to unblock dates: $e');
      // Note: 'availability.unblockDates' procedure is not defined in the provided backend router.
    }
  }

  Future<List<Availability>> updatePricing({
    required String propertyId,
    required DateTime startDate,
    required DateTime endDate,
    required double price,
    Map<String, dynamic>? settings,
  }) async {
    try {
      final response = await _apiService.mutation(
        'availability.updatePricing',
        {
          'propertyId': propertyId,
          'startDate': startDate.toIso8601String(),
          'endDate': endDate.toIso8601String(),
          'price': price,
          'settings': settings,
        },
      );

      if (response == null) {
        throw ApiException.server('No data returned from updatePricing');
      }

      return (response as List)
          .map((e) => Availability.fromJson(e as Map<String, dynamic>))
          .toList();
    } catch (e, st) {
      _logError('updatePricing', e, st);
      throw ApiException.server('Failed to update pricing: $e');
      // Note: 'availability.updatePricing' procedure is not defined in the provided backend router.
    }
  }

  void _logError(String method, Object error, StackTrace st) {
    log('[AvailabilityService][$method] $error', error: error, stackTrace: st);
  }
}
