import 'package:riverpod_annotation/riverpod_annotation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/currency.dart';
import '../services/currency_service.dart';
import 'api_provider.dart' as api_provider;

part 'currency_providers.g.dart';

@riverpod
CurrencyService currencyService(Ref ref) {
  return CurrencyService(ref.read(api_provider.apiServiceProvider));
}

@riverpod
class CurrencyNotifier extends _$CurrencyNotifier {
  @override
  FutureOr<List<Currency>> build() async {
    final response = await ref.read(currencyServiceProvider).getCurrencies();
    return response.data;
  }

  Future<void> refresh() async {
    state = const AsyncValue.loading();
    state = await AsyncValue.guard(() async {
      final response = await ref.read(currencyServiceProvider).getCurrencies();
      return response.data;
    });
  }

  Future<void> search(String query) async {
    state = const AsyncValue.loading();
    state = await AsyncValue.guard(() async {
      // Note: The search method isn't directly available in CurrencyService
      // We'll filter the results client-side for now
      final response = await ref.read(currencyServiceProvider).getCurrencies();
      return response.data
          .where((currency) =>
              currency.code.toLowerCase().contains(query.toLowerCase()) ||
              currency.name.toLowerCase().contains(query.toLowerCase()))
          .toList();
    });
  }

  Future<Currency> getByCode(String code) async {
    try {
      final response = await ref.read(currencyServiceProvider).getCurrencies();
      final currency = response.data.firstWhere(
        (c) => c.code == code.toUpperCase(),
        orElse: () => throw Exception('Currency not found'),
      );
      return currency;
    } catch (e) {
      rethrow;
    }
  }

  Future<List<Currency>> getByCountry(String country) async {
    // Note: The Currency model doesn't have a country field
    // This method is kept for backward compatibility but will return all currencies
    final response = await ref.read(currencyServiceProvider).getCurrencies();
    return response.data;
  }

  Future<void> updateStatus(String id, bool isActive) async {
    // Note: The Currency model doesn't have an isActive field
    // This method is kept for backward compatibility but won't do anything
    await Future.delayed(Duration.zero);
    await refresh();
  }
}

@riverpod
class CurrencyDetailNotifier extends _$CurrencyDetailNotifier {
  @override
  FutureOr<Currency?> build(String id) async {
    try {
      return await ref.read(currencyServiceProvider).getCurrency(id);
    } catch (e) {
      return null;
    }
  }

  Future<void> refresh() async {
    final id = state.value?.id;
    if (id != null) {
      state = await AsyncValue.guard(
          () => ref.read(currencyServiceProvider).getCurrency(id));
    }
  }

  Future<void> updateStatus(bool isActive) async {
    // Note: The Currency model doesn't have an isActive field
    // This method is kept for backward compatibility but won't do anything
    await refresh();
  }
}
