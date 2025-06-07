import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';
import '../models/increase.dart';
import '../services/increase_service.dart';
import 'api_providers.dart';

part 'increase_providers.g.dart';

@riverpod
IncreaseService increaseService(Ref ref) {
  return IncreaseService(ref.watch(apiServiceProvider));
}

@riverpod
class IncreaseNotifier extends _$IncreaseNotifier {
  late final IncreaseService _increaseService;

  @override
  Future<List<Increase>> build() async {
    _increaseService = ref.watch(increaseServiceProvider);
    final response = await _increaseService.getIncreases();
    return response.data;
  }

  Future<void> refresh() async {
    state = const AsyncValue.loading();
    state = await AsyncValue.guard(() async {
      final response = await _increaseService.getIncreases();
      return response.data;
    });
  }
  // Add create, update, delete methods as needed
}
