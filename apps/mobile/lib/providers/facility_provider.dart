import 'package:riverpod_annotation/riverpod_annotation.dart';
import '../models/facility.dart';
import '../services/facility_service.dart'; // Import FacilityService
import 'api_provider.dart'; // To provide ApiService for FacilityService

part 'facility_provider.g.dart';

// Provider for FacilityService
@riverpod
// ignore: deprecated_member_use_from_same_package
FacilityService facilityService(FacilityServiceRef ref) {
  return FacilityService(ref.watch(apiServiceProvider));
}

@riverpod
class FacilityNotifier extends _$FacilityNotifier {
  @override
  FutureOr<List<Facility>> build() async {
    // FacilityService.getFacilities returns PaginatedResponse<Facility>.
    // We'll fetch the first page here. UI might need pagination controls.
    final paginatedResponse =
        await ref.read(facilityServiceProvider).getFacilities();
    return paginatedResponse.data;
  }

  /// Refresh the list of all facilities
  Future<void> refresh() async {
    state = const AsyncValue.loading();
    state = await AsyncValue.guard(() async {
      final paginatedResponse =
          await ref.read(facilityServiceProvider).getFacilities();
      return paginatedResponse.data;
    });
  }

  /// Fetch facilities with optional filters
  Future<void> fetchFacilities({
    int page = 1,
    int limit = 10,
    String? name,
    DateTime? createdAtFrom,
    DateTime? createdAtTo,
    DateTime? updatedAtFrom,
    DateTime? updatedAtTo,
    DateTime? deletedAt,
    String? sortBy,
    String sortOrder = 'asc',
  }) async {
    state = const AsyncValue.loading();
    state = await AsyncValue.guard(() async {
      final paginatedResponse =
          await ref.read(facilityServiceProvider).getFacilities(
                page: page,
                limit: limit,
                name: name,
                createdAtFrom: createdAtFrom,
                createdAtTo: createdAtTo,
                updatedAtFrom: updatedAtFrom,
                updatedAtTo: updatedAtTo,
                deletedAt: deletedAt,
                sortBy: sortBy,
                sortOrder: sortOrder,
              );
      return paginatedResponse.data;
    });
  }

  /// Create a new facility
  Future<void> createFacility({
    required String name,
    String? description,
    String? icon,
    String? logo,
    String? locationId,
    String? type,
    String? status,
  }) async {
    final previousAsyncState = state;
    state = const AsyncValue.loading();
    try {
      await ref.read(facilityServiceProvider).createFacility(
            name: name,
            description: description,
            icon: icon,
            logo: logo,
            locationId: locationId,
            type: type,
            status: status,
          );
      await refresh();
    } catch (e, st) {
      if (previousAsyncState is AsyncData<List<Facility>>) {
        state = AsyncError<List<Facility>>(e, st)
            .copyWithPrevious(previousAsyncState);
      } else {
        state = AsyncValue.error(e, st);
      }
    }
  }

  /// Update an existing facility
  Future<void> updateFacility({
    required String id,
    String? name,
    String? description,
    String? icon,
    String? logo,
    String? locationId,
    String? type,
    String? status,
    DateTime? deletedAt,
  }) async {
    final previousAsyncState = state;
    state = const AsyncValue.loading();
    try {
      final updatedFacility =
          await ref.read(facilityServiceProvider).updateFacility(
                id: id,
                name: name,
                description: description,
                icon: icon,
                logo: logo,
                locationId: locationId,
                type: type,
                status: status,
                deletedAt: deletedAt,
              );
      final currentData = previousAsyncState.valueOrNull;
      if (currentData != null) {
        state = AsyncValue.data(
          currentData
              .map(
                  (fac) => fac.id == updatedFacility.id ? updatedFacility : fac)
              .toList(),
        );
      } else {
        await refresh();
      }
    } catch (e, st) {
      if (previousAsyncState is AsyncData<List<Facility>>) {
        state = AsyncError<List<Facility>>(e, st)
            .copyWithPrevious(previousAsyncState);
      } else {
        state = AsyncValue.error(e, st);
      }
    }
  }

  /// Update the status of a facility
  Future<void> updateFacilityStatus(String id, String facilityStatus) async {
    final previousAsyncState = state;
    state = const AsyncValue.loading();
    try {
      final updatedFacility = await ref
          .read(facilityServiceProvider)
          .updateFacilityStatus(id: id, status: facilityStatus);
      final currentData = previousAsyncState.valueOrNull;
      if (currentData != null) {
        state = AsyncValue.data(
          currentData
              .map(
                  (fac) => fac.id == updatedFacility.id ? updatedFacility : fac)
              .toList(),
        );
      } else {
        await refresh();
      }
    } catch (e, st) {
      if (previousAsyncState is AsyncData<List<Facility>>) {
        state = AsyncError<List<Facility>>(e, st)
            .copyWithPrevious(previousAsyncState);
      } else {
        state = AsyncValue.error(e, st);
      }
    }
  }

  /// Delete a facility
  Future<void> deleteFacility(String id) async {
    final previousAsyncState = state;
    state = const AsyncValue.loading();
    try {
      await ref.read(facilityServiceProvider).deleteFacility(id);
      final currentData = previousAsyncState.valueOrNull;
      if (currentData != null) {
        state =
            AsyncValue.data(currentData.where((fac) => fac.id != id).toList());
      } else {
        await refresh();
      }
    } catch (e, st) {
      if (previousAsyncState is AsyncData<List<Facility>>) {
        state = AsyncError<List<Facility>>(e, st)
            .copyWithPrevious(previousAsyncState);
      } else {
        state = AsyncValue.error(e, st);
      }
    }
  }
}

@riverpod
class FacilityDetailNotifier extends _$FacilityDetailNotifier {
  @override
  FutureOr<Facility?> build(String id) async {
    // FacilityService.getFacility returns Future<Facility>
    // Riverpod will handle the Future and place it in AsyncData or AsyncError.
    // The `Facility?` return type here is mainly to support the `AsyncValue.data(null)` after deletion.
    return ref.read(facilityServiceProvider).getFacility(id);
  }

  /// Refresh the detail for the current facility
  Future<void> refresh() async {
    state = const AsyncValue.loading();
    state = await AsyncValue.guard(
        () => ref.read(facilityServiceProvider).getFacility(id));
  }

  /// Update the current facility
  Future<void> updateCurrentFacility({
    String? name,
    String? description,
    String? icon,
    String? logo,
    String? locationId,
    String? type,
    String? status,
    DateTime? deletedAt,
  }) async {
    final previousAsyncState = state;
    state = const AsyncValue.loading();
    try {
      final updatedFacility =
          await ref.read(facilityServiceProvider).updateFacility(
                id: id, // Use the 'id' from the provider's family parameter
                name: name,
                description: description,
                icon: icon,
                logo: logo,
                locationId: locationId,
                type: type,
                status: status,
                deletedAt: deletedAt,
              );
      state = AsyncValue.data(updatedFacility);
    } catch (e, st) {
      if (previousAsyncState is AsyncData<Facility?>) {
        state =
            AsyncError<Facility?>(e, st).copyWithPrevious(previousAsyncState);
      } else {
        state = AsyncValue.error(e, st);
      }
    }
  }

  /// Update the status of the current facility
  Future<void> updateCurrentFacilityStatus(String facilityStatus) async {
    final previousAsyncState = state;
    state = const AsyncValue.loading();
    try {
      final updatedFacility = await ref
          .read(facilityServiceProvider)
          .updateFacilityStatus(id: id, status: facilityStatus);
      state = AsyncValue.data(updatedFacility);
    } catch (e, st) {
      if (previousAsyncState is AsyncData<Facility?>) {
        state =
            AsyncError<Facility?>(e, st).copyWithPrevious(previousAsyncState);
      } else {
        state = AsyncValue.error(e, st);
      }
    }
  }

  /// Delete the current facility
  Future<void> deleteCurrentFacility() async {
    final previousAsyncState = state;
    state = const AsyncValue.loading();
    try {
      await ref.read(facilityServiceProvider).deleteFacility(id);
      state = const AsyncValue.data(null); // Set state to null after deletion
    } catch (e, st) {
      if (previousAsyncState is AsyncData<Facility?>) {
        state =
            AsyncError<Facility?>(e, st).copyWithPrevious(previousAsyncState);
      } else {
        state = AsyncValue.error(e, st);
      }
    }
  }
}
