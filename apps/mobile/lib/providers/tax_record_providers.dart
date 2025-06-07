import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../services/tax_record_service.dart';
import 'api_service_provider.dart';

final taxRecordServiceProvider = Provider<TaxRecordService>((ref) {
  final apiService = ref.watch(apiServiceProvider);
  return TaxRecordService(apiService);
});

final taxRecordProvider =
    StateNotifierProvider<TaxRecordNotifier, AsyncValue<List<dynamic>>>(
        (ref) => TaxRecordNotifier(ref));

class TaxRecordNotifier extends StateNotifier<AsyncValue<List<dynamic>>> {
  final Ref ref;
  TaxRecordNotifier(this.ref) : super(const AsyncValue.loading()) {
    fetchAll();
  }

  Future<void> fetchAll() async {
    state = const AsyncValue.loading();
    try {
      final result = await ref.read(taxRecordServiceProvider).getAllTaxRecords();
      state = AsyncValue.data(result);
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }
}
