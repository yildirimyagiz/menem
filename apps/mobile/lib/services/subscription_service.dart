import '../models/subscription.dart';
import 'dart:developer';
import 'package:mobile/api/api_service.dart';
import 'package:mobile/models/pagination.dart'; // For PaginatedResponse

/// Custom exception for subscription-related errors.
class SubscriptionException implements Exception {
  final String message;
  SubscriptionException(this.message);
  @override
  String toString() => 'SubscriptionException: $message';
}

/// Service for handling subscription-related API operations via TRPC.
class SubscriptionService {
  final ApiService _apiService;

  SubscriptionService(this._apiService);

  /// Fetches a list of available subscription packages/plans.
  /// Corresponds to `subscription.listPackages` tRPC procedure.
  Future<List<dynamic>> listSubscriptionPackages() async {
    try {
      // Assuming listPackages returns a list of package objects
      final response = await _apiService.query('subscription.listPackages', {});
      return response
          as List<dynamic>; // Adjust type as per actual package structure
    } catch (e, st) {
      _logError('listSubscriptionPackages', e, st);
      throw SubscriptionException('Failed to list subscription packages: $e');
    }
  }

  /// Fetches all subscriptions.
  /// Corresponds to `subscription.all` tRPC procedure.
  Future<PaginatedResponse<Subscription>> getSubscriptions({
    int page = 1,
    int pageSize = 10,
    Map<String, dynamic>? filters, // To match SubscriptionFilterInputSchema
  }) async {
    try {
      final params = {'page': page, 'pageSize': pageSize, ...(filters ?? {})};
      final response = await _apiService.query('subscription.all', params);

      return PaginatedResponse<Subscription>.fromJson(
        response as Map<String, dynamic>,
        (json) => Subscription.fromJson(json as Map<String, dynamic>),
        dataKey: 'data',
      );
    } catch (e, st) {
      _logError('getSubscriptions', e, st);
      throw SubscriptionException('Failed to get subscriptions: $e');
    }
  }

  /// Fetches a single subscription by ID.
  /// Corresponds to `subscription.byId` tRPC procedure.
  Future<Subscription?> getSubscriptionById(String id) async {
    try {
      final response = await _apiService.query('subscription.byId', {'id': id});
      if (response == null) {
        return null; // Or throw specific "Not Found" SubscriptionException
      }
      return Subscription.fromJson(response as Map<String, dynamic>);
    } catch (e, st) {
      _logError('getSubscriptionById', e, st);
      if (e.toString().contains('NOT_FOUND')) return null;
      throw SubscriptionException('Failed to get subscription: $e');
    }
  }

  /// Creates a new subscription. All fields from the Subscription model (except id, createdAt, updatedAt, deletedAt) should be provided.
  Future<Subscription> createSubscription({
    required SubscriptionPlan plan,
    SubscriptionStatus status = SubscriptionStatus.pending, // Default status
    required DateTime startDate,
    required DateTime endDate,
    required double price,
    required String currency,
    // Add other fields from CreateSubscriptionSchema as needed
    String? entityId,
    String? entityType,
    bool isAutoRenew = false,
  }) async {
    try {
      final Map<String, dynamic> data = {
        'tier': plan
            .name, // Assuming SubscriptionPlan enum name matches backend Tier
        'status': status
            .name, // Assuming SubscriptionStatus enum name matches backend Status
        'startDate': startDate.toIso8601String(),
        'endDate': endDate.toIso8601String(),
        'price': price, // Send as number
        'currency':
            currency, // Ensure this is the currency code/ID expected by backend
        'isAutoRenew': isAutoRenew,
        if (entityId != null) 'entityId': entityId,
        if (entityType != null) 'entityType': entityType,
      };
      final response = await _apiService.mutation('subscription.create', data);
      if (response == null) {
        throw SubscriptionException('No data returned from createSubscription');
      }
      return Subscription.fromJson(response as Map<String, dynamic>);
    } catch (e, st) {
      _logError('createSubscription', e, st);
      throw SubscriptionException('Failed to create subscription: $e');
    }
  }

  /// Updates an existing subscription by ID. All updatable fields from the Subscription model can be provided.
  /// `data` should match `UpdateSubscriptionSchema` and include 'id'.
  Future<Subscription> updateSubscription({
    required String id,
    SubscriptionPlan? tier,
    SubscriptionStatus? status,
    DateTime? startDate,
    DateTime? endDate,
    double? price,
    String? currency,
    bool? isAutoRenew,
    // Add other updatable fields
  }) async {
    try {
      final Map<String, dynamic> data = {'id': id};
      if (tier != null) data['tier'] = tier.name;
      if (status != null) data['status'] = status.name;
      if (startDate != null) data['startDate'] = startDate.toIso8601String();
      if (endDate != null) data['endDate'] = endDate.toIso8601String();
      if (price != null) data['price'] = price; // Send as number
      if (currency != null) data['currency'] = currency;
      if (isAutoRenew != null) data['isAutoRenew'] = isAutoRenew;

      final response = await _apiService.mutation('subscription.update', data);
      if (response == null) {
        throw SubscriptionException('No data returned from updateSubscription');
      }
      return Subscription.fromJson(response as Map<String, dynamic>);
    } catch (e, st) {
      _logError('updateSubscription', e, st);
      throw SubscriptionException('Failed to update subscription: $e');
    }
  }

  /// Deletes a subscription by ID.
  /// Corresponds to `subscription.delete` tRPC procedure.
  Future<void> deleteSubscription(String id) async {
    try {
      await _apiService.mutation('subscription.delete', {'id': id});
    } catch (e, st) {
      _logError('deleteSubscription', e, st);
      throw SubscriptionException('Failed to delete subscription: $e');
    }
  }

  /// Creates a Stripe Payment Intent for a subscription.
  /// Corresponds to `subscription.createStripeIntent` tRPC procedure.
  Future<String?> createStripePaymentIntent({
    required String planName,
    required double price,
    String currency = 'usd',
  }) async {
    try {
      final response =
          await _apiService.mutation('subscription.createStripeIntent', {
        'planName': planName,
        'price': price, // Send as number
        'currency': currency,
      });
      return (response as Map<String, dynamic>)['clientSecret'] as String?;
    } catch (e, st) {
      _logError('createStripePaymentIntent', e, st);
      throw SubscriptionException('Failed to create Stripe payment intent: $e');
    }
  }

  void _logError(String method, Object error, StackTrace st) {
    log('[SubscriptionService][$method] $error', error: error, stackTrace: st);
  }
}
