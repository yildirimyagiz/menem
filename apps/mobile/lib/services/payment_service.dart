import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:mobile/config/env.dart';
import 'package:mobile/models/payment.dart';
import 'package:mobile/models/pagination.dart'; // For PaginatedResponse
import 'package:mobile/providers/api_provider.dart';
import 'dart:developer';
// Keep or use a more specific PaymentException
import 'package:flutter_stripe/flutter_stripe.dart';
import '../api/api_service.dart' show ApiService;

final paymentServiceProvider = Provider<PaymentService>((ref) {
  final apiService = ref.watch(apiServiceProvider);
  return PaymentService(apiService);
});

/// Custom exception for payment-related errors.
class PaymentException implements Exception {
  final String message;
  final String? code; // Optional: for specific error codes from backend

  PaymentException(this.message, {this.code});

  @override
  String toString() =>
      'PaymentException: $message${code != null ? ' (Code: $code)' : ''}';
}

class PaymentService {
  final ApiService _apiService;

  PaymentService(this._apiService) {
    Stripe.publishableKey = Env.stripePublicKey;
  }

  // Example: Creating a payment record via tRPC after Stripe interaction
  // This assumes 'payment.create' tRPC procedure exists and takes these params.
  // The actual creation of a "payment intent" on Stripe's side might be separate
  // or handled by a dedicated tRPC procedure if it involves backend logic.
  Future<Payment> createPaymentRecord({
    required String tenantId,
    required double amount,
    required String currency,
    required DateTime paymentDate,
    required DateTime dueDate,
    String? paymentMethod,
    String? reference,
    String status = 'UNPAID', // Default status
  }) async {
    try {
      final response = await _apiService.mutation('payment.create', {
        'tenantId': tenantId,
        'amount': amount,
        'currencyId': currency, // Assuming this is the ID
        'paymentDate': paymentDate.toIso8601String(),
        'dueDate': dueDate.toIso8601String(),
        'status': status,
        if (paymentMethod != null) 'paymentMethod': paymentMethod,
        if (reference != null) 'reference': reference,
      });
      return Payment.fromJson(response as Map<String, dynamic>);
    } catch (e, st) {
      _logError('createPaymentRecord', e, st);
      throw PaymentException('Failed to create payment record: $e');
    }
  }

  Future<Payment> confirmPayment({
    required String paymentIntentId,
    required String clientSecret,
    required BillingDetails billingDetails,
    // required String paymentMethodId, // paymentMethodId is part of PaymentMethodParams.card
  }) async {
    try {
      await Stripe.instance.confirmPayment(
        paymentIntentClientSecret: clientSecret,
        data: PaymentMethodParams.card(
          paymentMethodData: PaymentMethodData(
            billingDetails: billingDetails,
            // If you have a specific paymentMethodId from Stripe setup elements:
            // paymentMethod: paymentMethodId,
          ),
        ),
      );

      // After Stripe confirmation, you might update your backend payment record.
      // This assumes 'paymentIntentId' can be used as the 'id' in your system
      // or you have another way to identify the payment record.
      return markPaymentAsPaid(paymentIntentId);
    } catch (e, st) {
      _logError('confirmPayment (Stripe)', e, st);
      throw PaymentException('Failed to confirm payment with Stripe: $e');
    }
  }

  Future<Payment> getPayment(String paymentId) async {
    try {
      final response =
          await _apiService.query('payment.byId', {'id': paymentId});
      return Payment.fromJson(response as Map<String, dynamic>);
    } catch (e, st) {
      _logError('getPayment', e, st);
      throw PaymentException('Failed to get payment: $e');
    }
  }

  Future<PaginatedResponse<Payment>> getPayments({
    int page = 1,
    int limit = 10,
    String? tenantId,
    String? currencyId,
    String? status,
    String? paymentMethod,
    String? sortBy,
    String sortOrder = 'desc',
  }) async {
    try {
      final Map<String, dynamic> params = {
        'page': page,
        'limit': limit,
        'sortOrder': sortOrder,
      };
      if (tenantId != null) params['tenantId'] = tenantId;
      if (currencyId != null) params['currencyId'] = currencyId;
      if (status != null) params['status'] = status;
      if (paymentMethod != null) params['paymentMethod'] = paymentMethod;
      if (sortBy != null) params['sortBy'] = sortBy;

      final response = await _apiService.query('payment.list', params);
      return PaginatedResponse<Payment>.fromJson(
        response as Map<String, dynamic>,
        (json) => Payment.fromJson(json as Map<String, dynamic>),
        dataKey:
            'data', // Assuming tRPC returns paginated data under 'data' key
      );
    } catch (e, st) {
      _logError('getPayments', e, st);
      throw PaymentException('Failed to get payments: $e');
    }
  }

  // Example: if you need payments by reservation, and reservationId is a filter on Tenant or Payment model
  // This would require 'reservationId' to be a filterable field in 'payment.list' tRPC procedure.
  // Or, a dedicated tRPC procedure like 'payment.byReservationId'.
  // For now, assuming tenantId can be used if a reservation is linked to a tenant.
  Future<PaginatedResponse<Payment>> getPaymentsByTenant(String tenantId,
      {int page = 1, int limit = 10}) async {
    return getPayments(tenantId: tenantId, page: page, limit: limit);
  }

  Future<Payment> markPaymentAsPaid(String paymentId) async {
    try {
      final response =
          await _apiService.mutation('payment.markAsPaid', {'id': paymentId});
      return Payment.fromJson(response as Map<String, dynamic>);
    } catch (e, st) {
      _logError('markPaymentAsPaid', e, st);
      throw PaymentException('Failed to mark payment as paid: $e');
    }
  }

  Future<Payment> updatePaymentStatus(String paymentId, String status,
      {String? notes}) async {
    try {
      final Map<String, dynamic> data = {
        'id': paymentId,
        'status': status,
      };
      if (notes != null) data['notes'] = notes;

      final response = await _apiService.mutation('payment.update', data);
      return Payment.fromJson(response as Map<String, dynamic>);
    } catch (e, st) {
      _logError('updatePaymentStatus', e, st);
      throw PaymentException('Failed to update payment status: $e');
    }
  }

  // Corresponds to payment.delete tRPC
  Future<void> deletePayment(String paymentId) async {
    try {
      await _apiService.mutation('payment.delete', {'id': paymentId});
    } catch (e, st) {
      _logError('deletePayment', e, st);
      throw PaymentException('Failed to delete payment: $e');
    }
  }

  Future<void> refundPayment(String paymentId) async {
    try {} catch (e, st) {
      _logError('refundPayment', e, st);
      throw PaymentException('Failed to refund payment: $e');
    }
  }

  void _logError(String method, Object error, StackTrace st) {
    log('[PaymentService][$method] $error', error: error, stackTrace: st);
  }
}
