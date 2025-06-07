import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../services/property_service.dart';
import 'api_provider.dart';

final propertyRepositoryProvider = Provider<PropertyService>((ref) {
  final apiService = ref.read(apiServiceProvider);
  return PropertyService(apiService);
});

final propertyProvider =
    StateNotifierProvider<PropertyNotifier, AsyncValue<List<dynamic>>>(
        (ref) => PropertyNotifier(ref));

class PropertyNotifier extends StateNotifier<AsyncValue<List<dynamic>>> {
  final Ref ref;
  PropertyNotifier(this.ref) : super(const AsyncValue.loading()) {
    fetchAll();
  }

  Future<void> fetchAll() async {
    state = const AsyncValue.loading();
    try {
      final items = await ref.read(propertyRepositoryProvider).getProperties();
      state = AsyncValue.data(items as List);
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }
}
