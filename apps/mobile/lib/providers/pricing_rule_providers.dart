import 'package:mobile/providers/api_service_provider.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/pricing_rule.dart';
import '../services/pricing_rule_service.dart';

part 'pricing_rule_providers.g.dart';

@riverpod
PricingRuleService pricingRuleService(Ref ref) {
  return PricingRuleService(ref.read(apiServiceProvider));
}

@riverpod
class PricingRuleNotifier extends _$PricingRuleNotifier {
  @override
  FutureOr<List<PricingRule>> build() async {
    final response = await ref.read(pricingRuleServiceProvider).getPricingRules();
    return response.data;
  }

  Future<void> refresh() async {
    state = const AsyncValue.loading();
    state = await AsyncValue.guard(() async {
      final response = await ref.read(pricingRuleServiceProvider).getPricingRules();
      return response.data;
    });
  }

  Future<void> createPricingRule(PricingRule rule) async {
    state = const AsyncValue.loading();
    await ref.read(pricingRuleServiceProvider).createPricingRule(rule);
    state = await AsyncValue.guard(() async {
      final response = await ref.read(pricingRuleServiceProvider).getPricingRules();
      return response.data;
    });
  }

  Future<void> updatePricingRule(PricingRule rule) async {
    state = const AsyncValue.loading();
    await ref.read(pricingRuleServiceProvider).updatePricingRule(rule);
    state = await AsyncValue.guard(() async {
      final response = await ref.read(pricingRuleServiceProvider).getPricingRules();
      return response.data;
    });
  }

  Future<void> deletePricingRule(String id) async {
    state = const AsyncValue.loading();
    await ref.read(pricingRuleServiceProvider).deletePricingRule(id);
    state = await AsyncValue.guard(() async {
      final response = await ref.read(pricingRuleServiceProvider).getPricingRules();
      return response.data;
    });
  }
}
