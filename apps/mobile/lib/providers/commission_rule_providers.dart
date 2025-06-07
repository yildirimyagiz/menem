import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';
import 'package:mobile/models/commission_rule.dart';
import 'package:mobile/services/commission_rule_service.dart';
import 'package:mobile/providers/api_provider.dart';

part 'commission_rule_providers.g.dart';

// Provider for CommissionRuleService
@riverpod
CommissionRuleService commissionRuleService(Ref ref) {
  return CommissionRuleService(ref.watch(apiServiceProvider));
}

@riverpod
class CommissionRuleNotifier extends _$CommissionRuleNotifier {
  @override
  FutureOr<List<CommissionRule>> build() async {
    final paginatedResponse =
        await ref.read(commissionRuleServiceProvider).getCommissionRules();
    return paginatedResponse.data;
  }

  Future<void> refresh() async {
    state = const AsyncValue.loading();
    state = await AsyncValue.guard(() async {
      final paginatedResponse =
          await ref.read(commissionRuleServiceProvider).getCommissionRules();
      return paginatedResponse.data;
    });
  }

  Future<void> getByProvider(String providerId) async {
    state = const AsyncValue.loading();
    state = await AsyncValue.guard(() async {
      final paginatedResponse = await ref
          .read(commissionRuleServiceProvider)
          .getCommissionRules();
      // Filter the results by providerId on the client side
      return paginatedResponse.data
          .where((rule) => rule.providerId == providerId)
          .toList();
    });
  }

  // Add methods for create, update, delete if needed, similar to AccountNotifier/ChannelNotifier
  // e.g., Future<void> createCommissionRule(...) async { ... }
  // e.g., Future<void> updateCommissionRule(...) async { ... }
  // e.g., Future<void> deleteCommissionRule(String id) async { ... }
}

@riverpod
class CommissionRuleDetailNotifier extends _$CommissionRuleDetailNotifier {
  @override
  FutureOr<CommissionRule?> build(String id) async {
    // Assuming CommissionRuleService.getCommissionRule returns Future<CommissionRule>
    // Returning CommissionRule? to allow null state if deletion is implemented.
    return ref.read(commissionRuleServiceProvider).getCommissionRule(id);
  }

  Future<void> refresh() async {
    state = const AsyncValue.loading();
    // Use the 'id' from the provider's family parameter
    state = await AsyncValue.guard(
        () => ref.read(commissionRuleServiceProvider).getCommissionRule(id));
  }

  // Add methods for update, delete if needed, similar to AccountDetailNotifier/ChannelDetailNotifier
  // e.g., Future<void> updateCurrentCommissionRule(...) async { ... }
  // e.g., Future<void> deleteCurrentCommissionRule() async { ... }
}
