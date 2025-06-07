import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_stripe/flutter_stripe.dart' as stripe;
import 'package:mobile/models/payment.dart';
import 'package:mobile/services/payment_service.dart';

final paymentsProvider = AsyncNotifierProvider<PaymentsNotifier, List<Payment>>(
  PaymentsNotifier.new,
);

class PaymentsNotifier extends AsyncNotifier<List<Payment>> {
  late final PaymentService _paymentService;

  @override
  Future<List<Payment>> build() async {
    _paymentService = ref.read(paymentServiceProvider);
    return [];
  }

  Future<void> loadPaymentsByTenant(String tenantId) async {
    state = const AsyncValue.loading();
    try {
      final response = await _paymentService.getPaymentsByTenant(tenantId);
      state = AsyncValue.data(response.data);
    } catch (e, stackTrace) {
      state = AsyncValue.error(e, stackTrace);
    }
  }

  Future<Payment> createPayment({
    required String tenantId,
    required double amount,
    required String currency,
    required DateTime paymentDate,
    required DateTime dueDate,
    String? paymentMethod,
    String? reference,
    String status = 'UNPAID',
  }) async {
    try {
      final payment = await _paymentService.createPaymentRecord(
        tenantId: tenantId,
        amount: amount,
        currency: currency,
        paymentDate: paymentDate,
        dueDate: dueDate,
        paymentMethod: paymentMethod,
        reference: reference,
        status: status,
      );
      state.whenData((payments) {
        state = AsyncValue.data([...payments, payment]);
      });
      return payment;
    } catch (e, stackTrace) {
      state = AsyncValue.error(e, stackTrace);
      rethrow;
    }
  }

  Future<Payment> markPaymentAsPaid(String paymentId) async {
    try {
      final payment = await _paymentService.markPaymentAsPaid(paymentId);
      await _updatePaymentInState(payment);
      return payment;
    } catch (e, stackTrace) {
      state = AsyncValue.error(e, stackTrace);
      rethrow;
    }
  }

  Future<Payment> updatePaymentStatus(
    String paymentId,
    String status, {
    String? notes,
  }) async {
    try {
      final payment = await _paymentService.updatePaymentStatus(
        paymentId,
        status,
        notes: notes,
      );
      await _updatePaymentInState(payment);
      return payment;
    } catch (e, stackTrace) {
      state = AsyncValue.error(e, stackTrace);
      rethrow;
    }
  }

  Future<void> deletePayment(String paymentId) async {
    try {
      await _paymentService.deletePayment(paymentId);
      state.whenData((payments) {
        state = AsyncValue.data(
          payments.where((p) => p.id != paymentId).toList(),
        );
      });
    } catch (e, stackTrace) {
      state = AsyncValue.error(e, stackTrace);
      rethrow;
    }
  }

  Future<void> refundPayment(String paymentId) async {
    try {
      await _paymentService.refundPayment(paymentId);
      await updatePaymentStatus(paymentId, 'REFUNDED');
    } catch (e, stackTrace) {
      state = AsyncValue.error(e, stackTrace);
      rethrow;
    }
  }

  Future<void> confirmPayment({
    required String paymentIntentId,
    required String clientSecret,
    required stripe.BillingDetails billingDetails,
  }) async {
    try {
      await _paymentService.confirmPayment(
        paymentIntentId: paymentIntentId,
        clientSecret: clientSecret,
        billingDetails: billingDetails,
      );
    } catch (e, stackTrace) {
      state = AsyncValue.error(e, stackTrace);
      rethrow;
    }
  }

  Future<void> _updatePaymentInState(Payment updatedPayment) async {
    state.whenData((payments) {
      final updatedPayments = payments.map((payment) {
        return payment.id == updatedPayment.id ? updatedPayment : payment;
      }).toList();
      state = AsyncValue.data(updatedPayments);
    });
  }
}
