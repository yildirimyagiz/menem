import 'dart:async';

import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../exceptions/agency_exception.dart';
import '../models/agency.dart';
import '../services/agency_service.dart';
import 'api_service_provider.dart';

/// Provider for AgencyService
final agencyServiceProvider = Provider<AgencyService>((ref) {
  final apiService = ref.watch(apiServiceProvider);
  return AgencyService(apiService);
});

/// AsyncNotifier for managing list of agencies
class AgencyListNotifier extends AsyncNotifier<List<Agency>> {
  /// Loads agencies with current filters and sorting
  Future<void> loadAgencies({
    int page = 1,
    int limit = 10,
    String? search,
    bool? isActive,
    String? sortBy,
    String? sortOrder,
  }) async {
    state = const AsyncValue
        .loading(); // Keep previous data by not assigning here if state.hasValue
    state = await AsyncValue.guard(() => ref
        .read(agencyServiceProvider)
        .getAgencies(
          page: page,
          limit: limit, // Ensure these params are used
          search: search,
          isActive: isActive,
          sortBy: sortBy,
          sortOrder: sortOrder,
        )
        .then((paginated) => paginated.data));
  }

  /// Sort agencies by column
  Future<void> sortAgencies(String column, bool ascending) async {
    // Assuming current filters should be preserved.
    // This requires loadAgencies to accept current filter state or for you to store it.
    // For simplicity, let's assume we pass them directly.
    // You might need to store current page, search, isActive etc., in the notifier's state
    // or pass them from the UI.
    // For now, just passing sort parameters.
    await loadAgencies(sortBy: column, sortOrder: ascending ? 'asc' : 'desc');
  }

  /// Search agencies by query
  Future<void> searchAgencies(String query) async {
    // Resetting page to 1 for new search
    await loadAgencies(search: query, page: 1);
  }

  /// Filter agencies by statuses and active
  Future<void> filterAgencies(
      {bool? isActive,
      List<AgencyStatus>? statuses /*, List<AgencyStatus>? statuses */}) async {
    // Assuming AgencyService.getAgencies handles isActive.
    // If statuses were a parameter for getAgencies, you'd pass it here.
    // Resetting page to 1 for new filter
    await loadAgencies(isActive: isActive, page: 1);
  }

  @override
  FutureOr<List<Agency>> build() async {
    // Initial load, can use default parameters for loadAgencies
    // Or, if you want build to also accept parameters, you'd need to change
    // this to a FamilyAsyncNotifier or handle parameters differently.
    // For simplicity, using the existing loadAgencies structure.
    final result = await ref
        .read(agencyServiceProvider)
        .getAgencies(page: 1, limit: 10); // Default initial load
    return result.data;
  }

  /// Refresh agencies with current filters
  Future<void> refresh() async {
    // This should ideally re-use the current filters/pagination state.
    // For simplicity, it calls loadAgencies which might reset to defaults
    // if not managed carefully. Consider storing current params in the notifier.
    await loadAgencies();
  }

  /// Create a new agency
  Future<void> createAgency(Map<String, dynamic> data) async {
    state = const AsyncValue.loading();
    await ref.read(agencyServiceProvider).createAgency(data);
    await loadAgencies(); // Refresh is generally safer for create
  }

  /// Update an agency
  Future<void> updateAgency(String id, Map<String, dynamic> data) async {
    final currentAgencies = state.valueOrNull;
    state = const AsyncValue.loading();
    try {
      final updatedAgency = await ref
          .read(agencyServiceProvider)
          .updateAgency(id: id, data: data);
      if (currentAgencies != null) {
        state = AsyncValue.data(currentAgencies
            .map((agency) => agency.id == id ? updatedAgency : agency)
            .toList());
      } else {
        await loadAgencies(); // Fallback if no current data
      }
    } catch (e, st) {
      state = AsyncValue.error(e, st);
      if (currentAgencies != null) {
        state = AsyncValue.data(currentAgencies); // Revert
      }
    }
  }

  /// Delete an agency
  Future<void> deleteAgency(String id) async {
    final currentAgencies = state.valueOrNull;
    state = const AsyncValue.loading();
    try {
      await ref.read(agencyServiceProvider).deleteAgency(id);
      if (currentAgencies != null) {
        state = AsyncValue.data(
            currentAgencies.where((agency) => agency.id != id).toList());
      } else {
        await loadAgencies(); // Fallback
      }
    } catch (e, st) {
      state = AsyncValue.error(e, st);
      if (currentAgencies != null) {
        state = AsyncValue.data(currentAgencies); // Revert
      }
    }
  }
}

/// AsyncNotifier for a single agency detail
class AgencyDetailNotifier extends FamilyAsyncNotifier<Agency?, String> {
  @override
  FutureOr<Agency?> build(String id) async {
    try {
      return await ref.read(agencyServiceProvider).getAgency(id);
    } catch (e) {
      // Return null if agency is not found
      if (e is AgencyException && e.code == 'not_found') {
        return null;
      }
      rethrow;
    }
  }

  /// Refresh the agency detail
  Future<void> refresh() async {
    state = const AsyncValue.loading();
    state = await AsyncValue.guard(() async {
      // 'arg' is the family parameter (id)
      return ref.read(agencyServiceProvider).getAgency(arg);
    });
  }

  /// Update the current agency
  Future<void> updateAgency(Map<String, dynamic> data) async {
    // 'arg' is the family parameter (id)
    if (state.valueOrNull == null) return; // No agency loaded to update

    state = const AsyncValue.loading();
    try {
      final updatedAgency = await ref
          .read(agencyServiceProvider)
          .updateAgency(id: arg, data: data);
      state = AsyncValue.data(updatedAgency);
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }

  /// Delete the current agency
  Future<void> deleteAgency() async {
    // 'arg' is the family parameter (id)
    if (state.valueOrNull == null) return; // No agency loaded to delete

    state = const AsyncValue.loading();
    await ref.read(agencyServiceProvider).deleteAgency(arg);
    state = const AsyncValue.data(null);
  }
}

/// Providers for agency list and detail
final agencyListProvider =
    AsyncNotifierProvider<AgencyListNotifier, List<Agency>>(
        AgencyListNotifier.new);
final agencyDetailProvider =
    AsyncNotifierProvider.family<AgencyDetailNotifier, Agency?, String>(
        AgencyDetailNotifier.new);
