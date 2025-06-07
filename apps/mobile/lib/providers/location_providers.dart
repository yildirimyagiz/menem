import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';
import '../models/location.dart';
import '../services/location_service.dart';
import 'api_providers.dart';

part 'location_providers.g.dart';

@riverpod
LocationService locationService(Ref ref) {
  return LocationService(ref.watch(apiServiceProvider));
}

@riverpod
class LocationNotifier extends _$LocationNotifier {
  late final LocationService _locationService;

  @override
  Future<List<Location>> build() async {
    _locationService = ref.watch(locationServiceProvider);
    final response = await _locationService.getLocations();
    return response.data;
  }

  Future<void> refresh() async {
    state = const AsyncValue.loading();
    state = await AsyncValue.guard(() async {
      final response = await _locationService.getLocations();
      return response.data;
    });
  }

  Future<Location> getLocation(String id) async {
    try {
      state = const AsyncValue.loading();
      final location = await _locationService.getLocation(id);
      state = AsyncValue.data([location]);
      return location;
    } catch (e, st) {
      state = AsyncValue.error(e, st);
      rethrow;
    }
  }
}
