import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';
import '../models/extra_charge.dart';
import '../services/extra_charge_service.dart';
import 'api_service_provider.dart';

part 'extra_charge_providers.g.dart';

@riverpod
ExtraChargeService extraChargeService(Ref ref) {
  final apiService = ref.read(apiServiceProvider);
  return ExtraChargeService(apiService);
}

@riverpod
class ExtraChargeNotifier extends _$ExtraChargeNotifier {
  @override
  FutureOr<List<ExtraCharge>> build() async {
    final service = ref.read(extraChargeServiceProvider);
    final response = await service.getExtraCharges();
    return response.data;
  }

  Future<void> refresh() async {
    state = const AsyncValue.loading();
    final service = ref.read(extraChargeServiceProvider);
    state = await AsyncValue.guard(() async {
      final response = await service.getExtraCharges();
      return response.data;
    });
  }

  Future<ExtraCharge?> fetchById(String id) async {
    final apiService = ref.read(apiServiceProvider);
    final service = ExtraChargeService(apiService);
    try {
      return await service.getExtraCharge(id);
    } catch (e, st) {
      state = AsyncValue.error(e, st);
      return null;
    }
  }

  Future<ExtraCharge?> createExtraCharge({
    required String name,
    required double amount,
    // Add other required fields here
  }) async {
    final apiService = ref.read(apiServiceProvider);
    final service = ExtraChargeService(apiService);
    try {
      final created =
          await service.createExtraCharge(name: name, amount: amount, type: '');
      await refresh();
      return created;
    } catch (e, st) {
      state = AsyncValue.error(e, st);
      return null;
    }
  }

  Future<ExtraCharge?> updateExtraCharge({
    required String id,
    String? name,
    double? amount,
    // Add other updatable fields here
  }) async {
    final apiService = ref.read(apiServiceProvider);
    final service = ExtraChargeService(apiService);
    try {
      final updated =
          await service.updateExtraCharge(id: id, name: name, amount: amount);
      await refresh();
      return updated;
    } catch (e, st) {
      state = AsyncValue.error(e, st);
      return null;
    }
  }

  Future<bool> deleteExtraCharge(String id) async {
    final apiService = ref.read(apiServiceProvider);
    final service = ExtraChargeService(apiService);
    try {
      await service.deleteExtraCharge(id);
      await refresh();
      return true;
    } catch (e, st) {
      state = AsyncValue.error(e, st);
      return false;
    }
  }
}
