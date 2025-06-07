import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../services/included_service_service.dart';
import 'api_providers.dart';

final includedServiceRepositoryProvider = Provider<IncludedServiceService>(
  (ref) => IncludedServiceService(ref.watch(apiServiceProvider)),
);

final includedServiceProvider =
    StateNotifierProvider<IncludedServiceNotifier, AsyncValue<List<dynamic>>>(
        (ref) => IncludedServiceNotifier(ref));

class IncludedServiceNotifier extends StateNotifier<AsyncValue<List<dynamic>>> {
  final Ref ref;
  IncludedServiceNotifier(this.ref) : super(const AsyncValue.loading()) {
    fetchAll();
  }

  Future<void> fetchAll() async {
    state = const AsyncValue.loading();
    try {
      final items = await ref
          .read(includedServiceRepositoryProvider)
          .getIncludedServices();
      state = AsyncValue.data(items as List);
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }
}
