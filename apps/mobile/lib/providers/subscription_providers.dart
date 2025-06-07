import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';
import 'package:mobile/services/subscription_service.dart';
import 'package:mobile/models/subscription.dart';
import 'api_service_provider.dart';

part 'subscription_providers.g.dart';

@riverpod
SubscriptionService subscriptionService(Ref ref) {
  final apiService = ref.read(apiServiceProvider);
  return SubscriptionService(apiService);
}

@riverpod
class SubscriptionNotifier extends _$SubscriptionNotifier {
  @override
  FutureOr<List<Subscription>> build() async {
    final response = await ref.read(subscriptionServiceProvider).getSubscriptions();
    return response.data;
  }

  Future<void> refresh() async {
    state = const AsyncValue.loading();
    state = await AsyncValue.guard(() async {
      final response = await ref.read(subscriptionServiceProvider).getSubscriptions();
      return response.data;
    });
  }

  Future<Subscription?> getSubscription(String id) async {
    try {
      return await ref.read(subscriptionServiceProvider).getSubscriptionById(id);
    } catch (e) {
      rethrow;
    }
  }

  Future<Subscription> createSubscription({
    required SubscriptionPlan plan,
    required DateTime startDate,
    required DateTime endDate,
    required double price,
    required String currency,
    String? entityId,
    String? entityType,
    bool isAutoRenew = false,
  }) async {
    try {
      final subscription = await ref.read(subscriptionServiceProvider).createSubscription(
        plan: plan,
        status: SubscriptionStatus.active,
        startDate: startDate,
        endDate: endDate,
        price: price,
        currency: currency,
        entityId: entityId,
        entityType: entityType,
        isAutoRenew: isAutoRenew,
      );
      await refresh();
      return subscription;
    } catch (e) {
      rethrow;
    }
  }

  Future<Subscription> updateSubscription({
    required String id,
    SubscriptionPlan? tier,
    SubscriptionStatus? status,
    DateTime? startDate,
    DateTime? endDate,
    double? price,
    String? currency,
    bool? isAutoRenew,
  }) async {
    try {
      final subscription = await ref.read(subscriptionServiceProvider).updateSubscription(
        id: id,
        tier: tier,
        status: status,
        startDate: startDate,
        endDate: endDate,
        price: price,
        currency: currency,
        isAutoRenew: isAutoRenew,
      );
      await refresh();
      return subscription;
    } catch (e) {
      rethrow;
    }
  }

  Future<bool> deleteSubscription(String id) async {
    try {
      await ref.read(subscriptionServiceProvider).deleteSubscription(id);
      await refresh();
      return true;
    } catch (e) {
      rethrow;
    }
  }
}
