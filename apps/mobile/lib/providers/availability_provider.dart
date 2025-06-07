import 'package:riverpod_annotation/riverpod_annotation.dart';
import '../models/availability.dart';
import '../models/pagination.dart';
import '../services/availability_service.dart';
import 'api_provider.dart';

part 'availability_provider.g.dart';

// Provider for AvailabilityService
@riverpod
AvailabilityService availabilityService(ref) {
  return AvailabilityService(ref.watch(apiServiceProvider));
}

@riverpod
class AvailabilityNotifier extends _$AvailabilityNotifier {
  @override
  Future<List<Availability>> build() async {
    final response =
        await ref.read(availabilityServiceProvider).getAvailabilities();
    return response.data;
  }

  Future<void> refresh() async {
    state = const AsyncValue.loading();
    state = await AsyncValue.guard(() async {
      final response =
          await ref.read(availabilityServiceProvider).getAvailabilities();
      return response.data;
    });
  }

  Future<void> fetchAvailabilities({
    int page = 1,
    int limit = 10,
    String? propertyId,
    DateTime? date,
    bool? isBlocked,
    int? minAvailableUnits,
    int? maxAvailableUnits,
    String? sortBy,
    String sortOrder = 'asc',
    DateTime? startDate, // For date range queries
    DateTime? endDate, // For date range queries
  }) async {
    state = const AsyncValue.loading();
    try {
      final PaginatedResponse<Availability> paginatedResponse =
          await ref.read(availabilityServiceProvider).getAvailabilities(
                page: page,
                limit: limit,
                propertyId: propertyId,
                date: date,
                isBlocked: isBlocked,
                minAvailableUnits: minAvailableUnits,
                maxAvailableUnits: maxAvailableUnits,
                sortBy: sortBy,
                sortOrder: sortOrder,
                startDate: startDate,
                endDate: endDate,
              );
      state = AsyncValue.data(paginatedResponse.data);
    } catch (e, stackTrace) {
      // No previous state to revert to here as it's a fetch operation,
      // so just set the error.
      state = AsyncValue.error(e, stackTrace);
    }
  }

  Future<void> createAvailability({
    required DateTime date,
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
    double weekendMultiplier = 1,
    double weekdayMultiplier = 1,
    double seasonalMultiplier = 1,
    String? reservationId,
    String? pricingRuleId,
    int minNights = 1, // Default based on AccountService style
    int maxNights = 30, // Default based on AccountService style
  }) async {
    final previousAsyncState = state;
    state = const AsyncValue.loading();
    try {
      final availability = Availability(
        id: '', // Will be set by the server
        date: date,
        propertyId: propertyId,
        isBlocked: isBlocked,
        isBooked: isBooked,
        totalUnits: totalUnits,
        availableUnits: availableUnits,
        bookedUnits: bookedUnits,
        blockedUnits: blockedUnits,
        basePrice: basePrice,
        currentPrice: currentPrice,
        maxGuests: maxGuests,
        specialPricing: specialPricing,
        priceSettings: priceSettings,
        discountSettings: discountSettings,
        weekendRate: weekendRate,
        weekdayRate: weekdayRate,
        weekendMultiplier: weekendMultiplier,
        weekdayMultiplier: weekdayMultiplier,
        seasonalMultiplier: seasonalMultiplier,
        reservationId: reservationId,
        pricingRuleId: pricingRuleId,
        minNights: minNights,
        maxNights: maxNights,
        createdAt: DateTime.now(),
        updatedAt: DateTime.now(), isActive: null,
      );

      await ref.read(availabilityServiceProvider).createAvailability(
            availability,
            date: date,
            propertyId: propertyId,
            isBlocked: isBlocked,
            isBooked: isBooked,
            totalUnits: totalUnits,
            availableUnits: availableUnits,
            bookedUnits: bookedUnits,
            blockedUnits: blockedUnits,
            basePrice: basePrice,
            currentPrice: currentPrice,
            maxGuests: maxGuests,
            specialPricing: specialPricing,
            priceSettings: priceSettings,
            discountSettings: discountSettings,
            weekendRate: weekendRate,
            weekdayRate: weekdayRate,
            weekendMultiplier: weekendMultiplier,
            weekdayMultiplier: weekdayMultiplier,
            seasonalMultiplier: seasonalMultiplier,
            reservationId: reservationId,
            pricingRuleId: pricingRuleId,
            minNights: minNights,
            maxNights: maxNights,
          );

      await refresh();
    } catch (e, st) {
      if (previousAsyncState is AsyncData) {
        state = AsyncError(e, st).copyWithPrevious(previousAsyncState)
            as AsyncValue<List<Availability>>;
      } else {
        state = AsyncValue.error(e, st);
      }
      rethrow;
    }
  }

  Future<void> updateAvailability({
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
    int? minNights,
    int? maxNights,
  }) async {
    final previousAsyncState = state;
    state = const AsyncValue.loading();
    try {
      final currentState = await future;
      if (currentState.isEmpty) throw StateError('No availabilities available');
      final currentAvailability = currentState.firstWhere(
        (a) => a.id == id,
        orElse: () => throw StateError('Availability with id $id not found'),
      );

      final updatedAvailability = currentAvailability.copyWith(
        date: date,
        isBlocked: isBlocked,
        isBooked: isBooked,
        propertyId: propertyId,
        reservationId: reservationId,
        pricingRuleId: pricingRuleId,
        totalUnits: totalUnits,
        availableUnits: availableUnits,
        bookedUnits: bookedUnits,
        blockedUnits: blockedUnits,
        basePrice: basePrice,
        currentPrice: currentPrice,
        maxGuests: maxGuests,
        specialPricing: specialPricing,
        priceSettings: priceSettings,
        discountSettings: discountSettings,
        weekendRate: weekendRate,
        weekdayRate: weekdayRate,
        weekendMultiplier: weekendMultiplier,
        weekdayMultiplier: weekdayMultiplier,
        seasonalMultiplier: seasonalMultiplier,
        minNights: minNights,
        maxNights: maxNights,
        updatedAt: DateTime.now(),
      );

      await ref.read(availabilityServiceProvider).updateAvailability(
            updatedAvailability,
            id: id,
            date: date,
            isBlocked: isBlocked,
            isBooked: isBooked,
            propertyId: propertyId,
            reservationId: reservationId,
            pricingRuleId: pricingRuleId,
            totalUnits: totalUnits,
            availableUnits: availableUnits,
            bookedUnits: bookedUnits,
            blockedUnits: blockedUnits,
            basePrice: basePrice,
            currentPrice: currentPrice,
            maxGuests: maxGuests,
            specialPricing: specialPricing,
            priceSettings: priceSettings,
            discountSettings: discountSettings,
            weekendRate: weekendRate,
            weekdayRate: weekdayRate,
            weekendMultiplier: weekendMultiplier,
            weekdayMultiplier: weekdayMultiplier,
            seasonalMultiplier: seasonalMultiplier,
          );

      await refresh();
    } catch (e, st) {
      if (previousAsyncState is AsyncData) {
        state = AsyncError(e, st).copyWithPrevious(previousAsyncState)
            as AsyncValue<List<Availability>>;
      } else {
        state = AsyncValue.error(e, st);
      }
    }
  }

  Future<void> deleteAvailabilityFromList(String id) async {
    final previousAsyncState = state;
    state = const AsyncValue.loading();
    try {
      final currentData = previousAsyncState.valueOrNull;
      await ref.read(availabilityServiceProvider).deleteAvailability(id);
      if (currentData != null) {
        state = AsyncValue.data(currentData.where((a) => a.id != id).toList());
      } else {
        await refresh();
      }
    } catch (e, st) {
      if (previousAsyncState is AsyncData) {
        state = AsyncError(e, st).copyWithPrevious(previousAsyncState)
            as AsyncValue<List<Availability>>;
      } else {
        state = AsyncValue.error(e, st);
      }
    }
  }

  Future<void> blockDates({
    required String propertyId,
    required DateTime startDate,
    required DateTime endDate,
    int units = 0,
    String? reason,
  }) async {
    final previousAsyncState = state;
    state = const AsyncValue.loading(); // Set loading state
    try {
      // Refresh the list after blocking dates
      await ref.read(availabilityServiceProvider).blockDates(
            propertyId: propertyId,
            startDate: startDate,
            endDate: endDate,
            units: units,
            reason: reason,
          );
      // Refresh the availability list to reflect the changes
      await refresh();
    } catch (e, stackTrace) {
      if (previousAsyncState is AsyncData) {
        state = AsyncError(e, stackTrace).copyWithPrevious(previousAsyncState)
            as AsyncValue<List<Availability>>;
      } else {
        state = AsyncValue.error(e, stackTrace);
      }
    }
  }

  Future<void> unblockDates({
    required String propertyId,
    required DateTime startDate,
    required DateTime endDate,
  }) async {
    final previousAsyncState = state;
    state = const AsyncValue.loading(); // Set loading state
    try {
      await ref.read(availabilityServiceProvider).unblockDates(
            propertyId: propertyId,
            startDate: startDate,
            endDate: endDate,
          );
      await refresh(); // Preferring refresh
    } catch (e, stackTrace) {
      if (previousAsyncState is AsyncData) {
        state = AsyncError(e, stackTrace).copyWithPrevious(previousAsyncState)
            as AsyncValue<List<Availability>>;
      } else {
        state = AsyncValue.error(e, stackTrace);
      }
    }
  }

  Future<void> updateAvailabilities({
    required List<Availability> updates,
  }) async {
    final previousAsyncState = state;
    state = const AsyncValue.loading();
    try {
      // Update each availability one by one since we don't have a batch update endpoint
      final service = ref.read(availabilityServiceProvider);
      for (final update in updates) {
        await service.updateAvailability(
          update,
          id: update.id,
          date: update.date,
          isBlocked: update.isBlocked,
          isBooked: update.isBooked,
          propertyId: update.propertyId,
          reservationId: update.reservationId,
          pricingRuleId: update.pricingRuleId,
          totalUnits: update.totalUnits,
          availableUnits: update.availableUnits,
          bookedUnits: update.bookedUnits,
          blockedUnits: update.blockedUnits,
          basePrice: update.basePrice,
          currentPrice: update.currentPrice,
          maxGuests: update.maxGuests,
          specialPricing: update.specialPricing,
          priceSettings: update.priceSettings,
          discountSettings: update.discountSettings,
          weekendRate: update.weekendRate,
          weekdayRate: update.weekdayRate,
          weekendMultiplier: update.weekendMultiplier,
          weekdayMultiplier: update.weekdayMultiplier,
          seasonalMultiplier: update.seasonalMultiplier,
        );
      }
      await refresh();
    } catch (e, stackTrace) {
      if (previousAsyncState is AsyncData) {
        state = AsyncError(e, stackTrace).copyWithPrevious(previousAsyncState)
            as AsyncValue<List<Availability>>;
      } else {
        state = AsyncValue.error(e, stackTrace);
      }
      rethrow;
    }
  }

  Future<void> updatePricing({
    required String propertyId,
    required DateTime startDate,
    required DateTime endDate,
    required double price,
    Map<String, dynamic>? settings,
  }) async {
    final previousAsyncState = state;
    state = const AsyncValue.loading(); // Set loading state
    try {
      await ref.read(availabilityServiceProvider).updatePricing(
            propertyId: propertyId,
            startDate: startDate,
            endDate: endDate,
            price: price,
            settings: settings,
          );
      await refresh(); // Preferring refresh
    } catch (e, stackTrace) {
      if (previousAsyncState is AsyncData) {
        state = AsyncError(e, stackTrace).copyWithPrevious(previousAsyncState)
            as AsyncValue<List<Availability>>;
      } else {
        state = AsyncValue.error(e, stackTrace);
      }
    }
  }
}

@riverpod
class AvailabilityDetailNotifier extends _$AvailabilityDetailNotifier {
  @override
  FutureOr<Availability?> build(String id) async {
    return ref.read(availabilityServiceProvider).getAvailability(id);
  }

  Future<void> refreshDetail() async {
    state = const AsyncValue.loading();
    state = await AsyncValue.guard(
        () => ref.read(availabilityServiceProvider).getAvailability(id));
  }

  Future<void> updateCurrentAvailability({
    // All fields from AvailabilityService.updateAvailability, except 'id'
    DateTime? date,
    bool? isBlocked,
    bool? isBooked,
    String?
        propertyId, // Should not typically change for an existing availability
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
    final previousAsyncState = state;
    state = const AsyncValue.loading();
    try {
      final currentAvailability = previousAsyncState.valueOrNull;

      // To satisfy the service expecting a positional Availability object,
      // we must construct one. This mirrors the pattern in
      // AvailabilityNotifier.updateAvailability.
      // Ideally, the service API would be refactored to only accept named
      // parameters (id and fields to change) like AccountService.
      if (currentAvailability == null) {
        // An update operation typically implies the item exists.
        // If currentAvailability is null, we cannot reliably form the
        // positional object with all potentially required existing data.
        throw StateError(
            'Cannot update: current availability data for id "$id" is null. Unable to construct object for update.');
      }

      final Availability availabilityDataToPass = currentAvailability.copyWith(
        date: date,
        isBlocked: isBlocked,
        isBooked: isBooked,
        propertyId:
            propertyId, // Note: propertyId might not be typically updatable here
        reservationId: reservationId,
        pricingRuleId: pricingRuleId,
        totalUnits: totalUnits,
        availableUnits: availableUnits,
        bookedUnits: bookedUnits,
        blockedUnits: blockedUnits,
        basePrice: basePrice,
        currentPrice: currentPrice,
        maxGuests: maxGuests,
        specialPricing: specialPricing,
        priceSettings: priceSettings,
        discountSettings: discountSettings,
        weekendRate: weekendRate,
        weekdayRate: weekdayRate,
        weekendMultiplier: weekendMultiplier,
        weekdayMultiplier: weekdayMultiplier,
        seasonalMultiplier: seasonalMultiplier,
        updatedAt: DateTime.now(), // Standard practice to update timestamp
      );

      // Aligning with AccountService: call service with id and named parameters.
      // Assumes AvailabilityService.updateAvailability expects 'id' and other fields.
      // The 'id' for this notifier is available via `this.id` (or just `id`).
      final updatedAvailability =
          await ref.read(availabilityServiceProvider).updateAvailability(
                availabilityDataToPass, // Positional argument
                id: id, // Named argument 'id' (family parameter)
                date: date,
                isBlocked: isBlocked,
                isBooked: isBooked,
                propertyId: propertyId,
                reservationId: reservationId,
                pricingRuleId: pricingRuleId,
                totalUnits: totalUnits,
                availableUnits: availableUnits,
                bookedUnits: bookedUnits,
                blockedUnits: blockedUnits,
                basePrice: basePrice,
                currentPrice: currentPrice,
                maxGuests: maxGuests,
                specialPricing: specialPricing,
                priceSettings: priceSettings,
                discountSettings: discountSettings,
                weekendRate: weekendRate,
                weekdayRate: weekdayRate,
                weekendMultiplier: weekendMultiplier,
                weekdayMultiplier: weekdayMultiplier,
                seasonalMultiplier: seasonalMultiplier,
                // Service should handle 'updatedAt'
              );

      state = AsyncValue.data(updatedAvailability);
    } catch (e, st) {
      if (previousAsyncState is AsyncData<Availability?>) {
        state = AsyncError<Availability?>(e, st)
            .copyWithPrevious(previousAsyncState);
      } else {
        state = AsyncValue.error(e, st);
      }
    }
  }

  Future<void> deleteCurrentAvailability() async {
    final previousAsyncState = state;
    state = const AsyncValue.loading(); // Set loading state
    try {
      await ref.read(availabilityServiceProvider).deleteAvailability(id);
      state = const AsyncValue.data(null);
    } catch (e, st) {
      if (previousAsyncState is AsyncData<Availability?>) {
        state = AsyncError<Availability?>(e, st)
            .copyWithPrevious(previousAsyncState);
      } else {
        state = AsyncValue.error(e, st);
      }
    }
  }
}
