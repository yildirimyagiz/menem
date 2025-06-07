import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:mobile/services/tenant_service.dart';
import 'api_service_provider.dart';

final tenantServiceProvider = Provider<TenantService>((ref) {
  final apiService = ref.read(apiServiceProvider);
  return TenantService(apiService);
});

final tenantProvider = StateNotifierProvider<TenantNotifier, AsyncValue<List<dynamic>>>(
  (ref) => TenantNotifier(ref),
);

class TenantNotifier extends StateNotifier<AsyncValue<List<dynamic>>> {
  final Ref ref;
  TenantNotifier(this.ref) : super(const AsyncValue.loading()) {
    fetchAll();
  }

  Future<void> fetchAll() async {
    state = const AsyncValue.loading();
    try {
      final response = await ref.read(tenantServiceProvider).getTenants();
      state = AsyncValue.data(response.data);
    } catch (e, stackTrace) {
      state = AsyncValue.error(e, stackTrace);
    }
  }
}
