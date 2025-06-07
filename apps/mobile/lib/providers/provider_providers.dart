import 'package:riverpod_annotation/riverpod_annotation.dart';
import '../models/provider.dart' as provider_model;
import '../services/provider_service.dart';
import 'api_providers.dart';
part 'provider_providers.g.dart';

typedef Provider = provider_model.Provider;

@riverpod
// ignore: deprecated_member_use_from_same_package
ProviderService providerService(ProviderServiceRef ref) {
  final apiService = ref.watch(apiServiceProvider);
  return ProviderService(apiService);
}

@riverpod
class ProviderNotifier extends _$ProviderNotifier {
  @override
  Future<List<Provider>> build() async {
    final service = ref.watch(providerServiceProvider);
    final response = await service.getProviders();
    return response.data;
  }

  Future<void> refresh() async {
    state = const AsyncValue.loading();
    state = await AsyncValue.guard(() async {
      final service = ref.read(providerServiceProvider);
      final response = await service.getProviders();
      return response.data;
    });
  }

  Future<void> filter({
    String? name,
    bool? isActive,
    String? source,
    double? commissionMin,
    double? commissionMax,
    String? sortBy,
    String sortOrder = 'desc',
  }) async {
    state = const AsyncValue.loading();
    state = await AsyncValue.guard(() async {
      final service = ref.read(providerServiceProvider);
      final response = await service.getProviders(
        name: name,
        isActive: isActive,
        source: source,
        commissionMin: commissionMin,
        commissionMax: commissionMax,
        sortBy: sortBy,
        sortOrder: sortOrder,
      );
      return response.data;
    });
  }
}

@riverpod
class ProviderDetailNotifier extends _$ProviderDetailNotifier {
  @override
  Future<Provider?> build(String id) async {
    if (id.isEmpty) return null;
    final service = ref.read(providerServiceProvider);
    return service.getProviderById(id);
  }

  Future<void> refresh() async {
    final id = state.value?.id;
    if (id == null) return;

    state = const AsyncValue.loading();
    state = await AsyncValue.guard(() async {
      final service = ref.read(providerServiceProvider);
      return service.getProviderById(id);
    });
  }

  Future<Provider> createProvider(Map<String, dynamic> data) async {
    state = const AsyncValue.loading();
    try {
      final service = ref.read(providerServiceProvider);
      final provider = await service.createProvider(data);
      state = AsyncValue.data(provider);
      return provider;
    } catch (e, st) {
      state = AsyncValue.error(e, st);
      rethrow;
    }
  }
}
