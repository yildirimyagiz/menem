import 'package:riverpod_annotation/riverpod_annotation.dart';
import 'package:mobile/models/mortgage.dart';
import 'package:mobile/services/mortgage_service.dart';
import 'api_providers.dart';

part 'mortgage_providers.g.dart';

@riverpod
class MortgageServiceProvider extends _$MortgageServiceProvider {
  @override
  MortgageService build() {
    final apiService = ref.watch(apiServiceProvider);
    return MortgageService(apiService);
  }
}

@riverpod
class MortgageListNotifier extends _$MortgageListNotifier {
  @override
  Future<List<Mortgage>> build() async {
    final service = ref.watch(mortgageServiceProviderProvider);
    final response = await service.getMortgages();
    return response.data;
  }

  Future<void> refresh() async {
    state = const AsyncValue.loading();
    state = await AsyncValue.guard(() async {
      final service = ref.read(mortgageServiceProviderProvider);
      final response = await service.getMortgages();
      return response.data;
    });
  }

  Future<void> filter({
    String? propertyId,
    String? lender,
    String? status,
    String? sortBy,
    String sortOrder = 'desc',
  }) async {
    state = const AsyncValue.loading();
    state = await AsyncValue.guard(() async {
      final service = ref.read(mortgageServiceProviderProvider);
      final response = await service.getMortgages(
        propertyId: propertyId,
        lender: lender,
        status: status,
        sortBy: sortBy,
        sortOrder: sortOrder,
      );
      return response.data;
    });
  }
}

@riverpod
class MortgageDetailNotifier extends _$MortgageDetailNotifier {
  @override
  Future<Mortgage?> build(String id) async {
    final service = ref.read(mortgageServiceProviderProvider);
    try {
      return await service.getMortgage(id);
    } catch (e) {
      // Return null if mortgage is not found
      if (e.toString().contains('not found')) {
        return null;
      }
      rethrow;
    }
  }

  Future<void> refresh() async {
    final id = state.value?.id;
    if (id == null) return;
    
    state = const AsyncValue.loading();
    state = await AsyncValue.guard(() async {
      final service = ref.read(mortgageServiceProviderProvider);
      return service.getMortgage(id);
    });
  }

  Future<void> updateMortgage({
    String? lender,
    double? principal,
    double? interestRate,
    DateTime? startDate,
    DateTime? endDate,
    String? status,
    String? notes,
  }) async {
    final mortgage = state.value;
    if (mortgage == null) return;

    state = const AsyncValue.loading();
    state = await AsyncValue.guard(() async {
      final service = ref.read(mortgageServiceProviderProvider);
      return service.updateMortgage(
        id: mortgage.id,
        lender: lender,
        principal: principal,
        interestRate: interestRate,
        startDate: startDate,
        endDate: endDate,
        status: status,
        notes: notes,
      );
    });
  }

  Future<void> deleteMortgage() async {
    final mortgage = state.value;
    if (mortgage == null) return;

    state = const AsyncValue.loading();
    await AsyncValue.guard(() async {
      final service = ref.read(mortgageServiceProviderProvider);
      await service.deleteMortgage(mortgage.id);
      return null; // Return null since delete doesn't return a mortgage
    });
  }
}
