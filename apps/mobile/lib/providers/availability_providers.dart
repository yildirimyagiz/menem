import 'package:riverpod_annotation/riverpod_annotation.dart';

import '../models/availability.dart';
import '../services/availability_service.dart';
import '../api/api_service.dart';

part 'availability_providers.g.dart';

// API Service Provider - This should be provided at the root of your app
final apiServiceProvider = Provider<ApiService>((ref) {
  throw UnimplementedError('ApiService must be overridden');
});

// Availability Service Provider
@riverpod
// ignore: deprecated_member_use_from_same_package
AvailabilityService availabilityService(AvailabilityServiceRef ref) {
  return AvailabilityService(ref.watch(apiServiceProvider));
}

@riverpod
class AvailabilityNotifier extends _$AvailabilityNotifier {
  @override
  Future<Availability?> build(String? id) async {
    if (id == null) return null;

    try {
      final service = ref.read(availabilityServiceProvider);
      final availability = await service.getAvailability(id);
      return availability;
    } catch (e, stack) {
      state = AsyncValue.error(e, stack);
      rethrow;
    }
  }

  Future<void> refresh() async {
    final id = state.valueOrNull?.id;
    if (id == null) return;

    state = const AsyncValue.loading();
    try {
      final service = ref.read(availabilityServiceProvider);
      final availability = await service.getAvailability(id);
      state = AsyncValue.data(availability);
    } catch (e, stack) {
      state = AsyncValue.error(e, stack);
      rethrow;
    }
  }
}

@Riverpod(keepAlive: true)
class AvailabilityListNotifier extends _$AvailabilityListNotifier {
  @override
  FutureOr<List<Availability>> build() async {
    final service = ref.read(availabilityServiceProvider);
    final response = await service.getAvailabilities();
    return response.data;
  }

  Future<void> refresh() async {
    state = const AsyncValue.loading();
    state = await AsyncValue.guard(() async {
      final service = ref.read(availabilityServiceProvider);
      final response = await service.getAvailabilities();
      return response.data;
    });
  }

  Future<void> loadAvailabilities({
    String? propertyId,
    DateTime? startDate,
    DateTime? endDate,
  }) async {
    state = const AsyncValue.loading();
    state = await AsyncValue.guard(() async {
      final service = ref.read(availabilityServiceProvider);
      final response = await service.getAvailabilities(
        propertyId: propertyId,
        startDate: startDate,
        endDate: endDate,
      );
      return response.data;
    });
  }

  Future<void> blockDates({
    required String propertyId,
    required DateTime startDate,
    required DateTime endDate,
    required int units,
    String? reason,
  }) async {
    final previousState = state;
    state = const AsyncValue.loading();

    try {
      final service = ref.read(availabilityServiceProvider);
      await service.blockDates(
        propertyId: propertyId,
        startDate: startDate,
        endDate: endDate,
        reason: reason,
        units: units,
      );
      await refresh();
    } catch (e, st) {
      state = AsyncValue.error(e, st);
      if (previousState.hasValue) state = previousState;
      rethrow;
    }
  }

  Future<void> unblockDates({
    required String propertyId,
    required DateTime startDate,
    required DateTime endDate,
  }) async {
    final previousState = state;
    state = const AsyncValue.loading();

    try {
      final service = ref.read(availabilityServiceProvider);
      await service.unblockDates(
        propertyId: propertyId,
        startDate: startDate,
        endDate: endDate,
      );
      await refresh();
    } catch (e, st) {
      state = AsyncValue.error(e, st);
      if (previousState.hasValue) state = previousState;
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
    final previousState = state;
    state = const AsyncValue.loading();

    try {
      final service = ref.read(availabilityServiceProvider);
      await service.updatePricing(
        propertyId: propertyId,
        startDate: startDate,
        endDate: endDate,
        price: price,
        settings: settings,
      );
      await refresh();
    } catch (e, st) {
      state = AsyncValue.error(e, st);
      if (previousState.hasValue) state = previousState;
      rethrow;
    }
  }

  void deleteAvailability(String id) {}
}
