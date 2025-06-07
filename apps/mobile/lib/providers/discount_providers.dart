import 'package:riverpod_annotation/riverpod_annotation.dart';
import '../models/discount.dart';
import '../services/discount_service.dart'; // Import DiscountService
import 'api_provider.dart'; // To provide ApiService for DiscountService

part 'discount_providers.g.dart';

// Provider for DiscountService
@riverpod
// ignore: deprecated_member_use_from_same_package
DiscountService discountService(DiscountServiceRef ref) {
  return DiscountService(ref.watch(apiServiceProvider));
}

@riverpod
class DiscountNotifier extends _$DiscountNotifier {
  @override
  FutureOr<List<Discount>> build() async {
    // Fetch the first page of discounts by default.
    final paginatedResponse =
        await ref.read(discountServiceProvider).getDiscounts();
    return paginatedResponse.data;
  }

  Future<void> refresh() async {
    state = const AsyncValue.loading();
    state = await AsyncValue.guard(() async {
      final paginatedResponse =
          await ref.read(discountServiceProvider).getDiscounts();
      return paginatedResponse.data;
    });
  }

  Future<void> search(String query) async {
    state = const AsyncValue.loading();
    state = await AsyncValue.guard(() async {
      final paginatedResponse =
          await ref.read(discountServiceProvider).getDiscounts(query: query);
      return paginatedResponse.data;
    });
  }

  Future<void> getByType(String type) async {
    state = const AsyncValue.loading();
    state = await AsyncValue.guard(() async {
      final paginatedResponse =
          await ref.read(discountServiceProvider).getDiscounts(type: type);
      return paginatedResponse.data;
    });
  }

  Future<void> getByCode(String code) async {
    state = const AsyncValue.loading();
    state = await AsyncValue.guard(() async {
      final discount =
          await ref.read(discountServiceProvider).getDiscountByCode(code);
      return discount != null ? [discount] : [];
    });
  }

  Future<void> getActive() async {
    state = const AsyncValue.loading();
    state = await AsyncValue.guard(() async {
      final paginatedResponse =
          await ref.read(discountServiceProvider).getDiscounts(isActive: true);
      return paginatedResponse.data;
    });
  }

  Future<void> createDiscount({
    required String code,
    required String type,
    required double value,
    String? description,
    DateTime? startDate,
    DateTime? endDate,
    int? usageLimit,
    bool isActive = true,
  }) async {
    final previousAsyncState = state;
    state = const AsyncValue.loading();
    try {
      await ref.read(discountServiceProvider).createDiscount(
            code: code,
            type: type,
            value: value,
            description: description,
            startDate: startDate,
            endDate: endDate,
            usageLimit: usageLimit,
            isActive: isActive,
          );
      await refresh();
    } catch (e, st) {
      if (previousAsyncState is AsyncData<List<Discount>>) {
        state = AsyncError<List<Discount>>(e, st)
            .copyWithPrevious(previousAsyncState);
      } else {
        state = AsyncValue.error(e, st);
      }
    }
  }

  Future<void> updateDiscount({
    required String id,
    String? code,
    String? type,
    double? value,
    String? description,
    DateTime? startDate,
    DateTime? endDate,
    int? usageLimit,
    bool? isActive,
  }) async {
    final previousAsyncState = state;
    state = const AsyncValue.loading();
    try {
      final updatedDiscount =
          await ref.read(discountServiceProvider).updateDiscount(
                id: id,
                code: code,
                type: type,
                value: value,
                description: description,
                startDate: startDate,
                endDate: endDate,
                usageLimit: usageLimit,
                isActive: isActive,
              );
      final currentData = previousAsyncState.valueOrNull;
      if (currentData != null) {
        state = AsyncValue.data(
          currentData
              .map((d) => d.id == updatedDiscount.id ? updatedDiscount : d)
              .toList(),
        );
      } else {
        await refresh();
      }
    } catch (e, st) {
      if (previousAsyncState is AsyncData<List<Discount>>) {
        state = AsyncError<List<Discount>>(e, st)
            .copyWithPrevious(previousAsyncState);
      } else {
        state = AsyncValue.error(e, st);
      }
    }
  }

  Future<void> updateDiscountStatus(String id, bool isActive) async {
    // This method now calls updateDiscount which handles state more robustly
    await updateDiscount(id: id, isActive: isActive);
  }

  Future<void> deleteDiscount(String id) async {
    final previousAsyncState = state;
    state = const AsyncValue.loading();
    try {
      await ref.read(discountServiceProvider).deleteDiscount(id);
      final currentData = previousAsyncState.valueOrNull;
      if (currentData != null) {
        state = AsyncValue.data(currentData.where((d) => d.id != id).toList());
      } else {
        await refresh();
      }
    } catch (e, st) {
      if (previousAsyncState is AsyncData<List<Discount>>) {
        state = AsyncError<List<Discount>>(e, st)
            .copyWithPrevious(previousAsyncState);
      } else {
        state = AsyncValue.error(e, st);
      }
    }
  }
}

@riverpod
class DiscountDetailNotifier extends _$DiscountDetailNotifier {
  @override
  FutureOr<Discount?> build(String id) async {
    return ref.read(discountServiceProvider).getDiscount(id);
  }

  Future<void> refresh() async {
    state = const AsyncValue.loading();
    state = await AsyncValue.guard(
        () => ref.read(discountServiceProvider).getDiscount(id));
  }

  Future<void> updateCurrentDiscount({
    String? code,
    String? type,
    double? value,
    String? description,
    DateTime? startDate,
    DateTime? endDate,
    int? usageLimit,
    bool? isActive,
  }) async {
    final previousAsyncState = state;
    state = const AsyncValue.loading();
    try {
      final updatedDiscount =
          await ref.read(discountServiceProvider).updateDiscount(
                id: id, // Use the 'id' from the provider's family parameter
                code: code,
                type: type,
                value: value,
                description: description,
                startDate: startDate,
                endDate: endDate,
                usageLimit: usageLimit,
                isActive: isActive,
              );
      state = AsyncValue.data(updatedDiscount);
    } catch (e, st) {
      if (previousAsyncState is AsyncData<Discount?>) {
        state =
            AsyncError<Discount?>(e, st).copyWithPrevious(previousAsyncState);
      } else {
        state = AsyncValue.error(e, st);
      }
    }
  }

  Future<void> updateCurrentDiscountStatus(bool isActive) async {
    // This method now calls updateCurrentDiscount
    await updateCurrentDiscount(isActive: isActive);
  }

  Future<void> deleteCurrentDiscount() async {
    final previousAsyncState = state;
    state = const AsyncValue.loading();
    try {
      await ref.read(discountServiceProvider).deleteDiscount(id);
      state = const AsyncValue.data(null); // Set state to null after deletion
    } catch (e, st) {
      if (previousAsyncState is AsyncData<Discount?>) {
        state =
            AsyncError<Discount?>(e, st).copyWithPrevious(previousAsyncState);
      } else {
        state = AsyncValue.error(e, st);
      }
    }
  }
}
