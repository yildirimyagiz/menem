import 'package:riverpod_annotation/riverpod_annotation.dart';
import 'package:mobile/services/facility_service.dart';
import 'package:mobile/providers/api_provider.dart';
import '../models/facility.dart';

part 'facility_providers.g.dart';

@riverpod
// ignore: deprecated_member_use_from_same_package
FacilityService facilityService(FacilityServiceRef ref) {
  final apiService = ref.watch(apiServiceProvider);
  return FacilityService(apiService);
}

@riverpod
class FacilityNotifier extends _$FacilityNotifier {
  @override
  FutureOr<List<Facility>> build() async {
    final response = await ref.read(facilityServiceProvider).getAll();
    return response;
  }

  Future<void> refresh() async {
    state = const AsyncValue.loading();
    state = await AsyncValue.guard(() async {
      final response = await ref.read(facilityServiceProvider).getAll();
      return response;
    });
  }

  Future<void> search(String query) async {
    state = const AsyncValue.loading();
    state = await AsyncValue.guard(() async {
      final response = await ref.read(facilityServiceProvider).getFacilities(
            name: query,
          );
      return response.data;
    });
  }

  Future<void> getByType(String type) async {
    state = const AsyncValue.loading();
    state = await AsyncValue.guard(() async {
      final response = await ref.read(facilityServiceProvider).getFacilities();
      return response.data
          .where((f) => f.type.name.toLowerCase() == type.toLowerCase())
          .toList();
    });
  }

  Future<void> getByStatus(String status) async {
    state = const AsyncValue.loading();
    state = await AsyncValue.guard(() async {
      final response = await ref.read(facilityServiceProvider).getFacilities();
      return response.data
          .where((f) => f.status.name.toLowerCase() == status.toLowerCase())
          .toList();
    });
  }

  Future<void> updateFacilityStatus(String id, String status) async {
    state = const AsyncValue.loading();
    try {
      await ref.read(facilityServiceProvider).updateFacilityStatus(
            id: id,
            status: status,
          );
      state = await AsyncValue.guard(() async {
        final response = await ref.read(facilityServiceProvider).getAll();
        return response;
      });
    } catch (e) {
      state = AsyncValue.error(e, StackTrace.current);
      rethrow;
    }
  }
}

@riverpod
class FacilityDetailNotifier extends _$FacilityDetailNotifier {
  @override
  FutureOr<Facility?> build(String id) async {
    try {
      return await ref.read(facilityServiceProvider).getFacility(id);
    } catch (e) {
      throw FacilityException('Failed to load facility: $e');
    }
  }

  Future<void> refresh() async {
    final id = state.value?.id;
    if (id == null) return;

    state = const AsyncValue.loading();
    state = await AsyncValue.guard(
      () => ref.read(facilityServiceProvider).getFacility(id),
    );
  }

  Future<void> updateStatus(String status) async {
    final id = state.value?.id;
    if (id == null) return;

    state = const AsyncValue.loading();
    try {
      await ref.read(facilityServiceProvider).updateFacilityStatus(
            id: id,
            status: status,
          );
      state = await AsyncValue.guard(
        () => ref.read(facilityServiceProvider).getFacility(id),
      );
    } catch (e) {
      state = AsyncValue.error(e, StackTrace.current);
      rethrow;
    }
  }
}
