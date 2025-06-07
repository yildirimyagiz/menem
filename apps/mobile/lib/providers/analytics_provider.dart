import 'package:riverpod_annotation/riverpod_annotation.dart';
import 'package:mobile/models/analytics.dart';
import 'package:mobile/services/analytics_service.dart';
import 'package:mobile/providers/api_provider.dart'; // Assuming apiServiceProvider is here

part 'analytics_provider.g.dart';

// Provider for AnalyticsService
@riverpod
// ignore: deprecated_member_use_from_same_package
AnalyticsService analyticsService(AnalyticsServiceRef ref) {
  return AnalyticsService(ref.watch(apiServiceProvider));
}

@riverpod
class AnalyticsNotifier extends _$AnalyticsNotifier {
  // Ensure this matches a non-family AsyncNotifier for List<Analytics>
  @override
  FutureOr<List<Analytics>> build(String id) async {
    final paginatedResponse =
        await ref.read(analyticsServiceProvider).getAnalytics();
    return paginatedResponse.data;
  }

  Future<void> fetchAnalytics({
    int page = 1,
    int limit = 10,
    String? entityId,
    String? entityType,
    AnalyticsType? type,
    String? propertyId,
    String? userId,
    String? agentId,
    String? agencyId,
    String? taskId,
    String? reservationId,
    DateTime? timestampFrom,
    DateTime? timestampTo,
    String? sortBy,
    String sortOrder = 'asc',
  }) async {
    state = const AsyncValue.loading();
    state = await AsyncValue.guard(() async {
      final response = await ref.read(analyticsServiceProvider).getAnalytics(
            page: page,
            limit: limit,
            entityId: entityId,
            entityType: entityType,
            type: type,
            propertyId: propertyId,
            userId: userId,
            agentId: agentId,
            agencyId: agencyId,
            taskId: taskId,
            reservationId: reservationId,
            timestampFrom: timestampFrom,
            timestampTo: timestampTo,
            sortBy: sortBy,
            sortOrder: sortOrder,
          );
      return response.data;
    });
  }

  Future<void> refresh() async {
    // Consider re-fetching with current filters if they are stored in the notifier
    state = const AsyncValue.loading();
    state = await AsyncValue.guard(() async {
      final paginatedResponse =
          await ref.read(analyticsServiceProvider).getAnalytics();
      return paginatedResponse.data;
    });
  }

  Future<void> createAnalyticsEntry({
    required String entityId,
    required String entityType,
    required AnalyticsType type,
    required Map<String, dynamic> data,
    DateTime? timestamp,
    String? propertyId,
    String? userId,
    String? agentId,
    String? agencyId,
    String? taskId,
    String? reservationId,
  }) async {
    final previousState = state;
    state = const AsyncValue.loading();
    try {
      await ref.read(analyticsServiceProvider).createAnalytics(
            entityId: entityId,
            entityType: entityType,
            type: type,
            data: data,
            timestamp: timestamp,
            propertyId: propertyId,
            userId: userId,
            agentId: agentId,
            agencyId: agencyId,
            taskId: taskId,
            reservationId: reservationId,
          );
      await refresh(); // Refresh list after creation
    } catch (e, st) {
      state = AsyncValue.error(e, st);
      if (previousState.hasValue) state = previousState;
    }
  }

  // Add updateAnalyticsEntry and deleteAnalyticsEntry if needed,
  // following similar patterns with optimistic updates.
}

@riverpod
class AnalyticsDetailNotifier extends _$AnalyticsDetailNotifier {
  // Family AsyncNotifier for individual Analytics
  @override
  FutureOr<Analytics?> build(String id) async {
    try {
      return await ref.read(analyticsServiceProvider).getAnalyticsById(id);
    } catch (e, st) {
      state = AsyncValue.error(e, st);
      rethrow;
    }
  }

  Future<void> refresh() async {
    final id = (ref as dynamic).id; // Get the family parameter
    state = const AsyncValue.loading();
    state = await AsyncValue.guard(
      () => ref.read(analyticsServiceProvider).getAnalyticsById(id),
    );
  }

  Future<void> updateCurrentAnalytics({
    String? entityId,
    String? entityType,
    AnalyticsType? type,
    Map<String, dynamic>? data,
    DateTime? timestamp,
    String? propertyId,
    String? userId,
    String? agentId,
    String? agencyId,
    String? taskId,
    String? reservationId,
  }) async {
    final currentState = state.valueOrNull;
    if (currentState == null) return;

    final id = (ref as dynamic).id; // Get the family parameter
    state = const AsyncValue.loading();

    try {
      final updatedAnalytics =
          await ref.read(analyticsServiceProvider).updateAnalytics(
                id: id,
                entityId: entityId,
                entityType: entityType,
                type: type,
                data: data,
                timestamp: timestamp,
                propertyId: propertyId,
                userId: userId,
                agentId: agentId,
                agencyId: agencyId,
                taskId: taskId,
                reservationId: reservationId,
              );
      state = AsyncValue.data(updatedAnalytics);
    } catch (e, st) {
      state = AsyncValue.error(e, st);
      rethrow;
    }
  }

  Future<void> deleteCurrentAnalytics() async {
    final id = (ref as dynamic).id; // Get the family parameter
    state = const AsyncValue.loading();

    try {
      await ref.read(analyticsServiceProvider).deleteAnalytics(id);
      state = const AsyncValue.data(null);
    } catch (e, st) {
      state = AsyncValue.error(e, st);
      rethrow;
    }
  }
}
