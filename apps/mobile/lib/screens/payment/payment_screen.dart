import 'package:flutter/material.dart' hide Card;
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_stripe/flutter_stripe.dart';
import '../../providers/payment_provider.dart';

class PaymentScreen extends ConsumerStatefulWidget {
  final String tenantId;
  final double amount;
  final String currency;
  final DateTime paymentDate;
  final DateTime dueDate;

  PaymentScreen({
    super.key,
    required this.tenantId,
    required this.amount,
    required this.currency,
    required DateTime? paymentDate,
    required DateTime? dueDate,
  })  : paymentDate = paymentDate ?? DateTime.now(),
        dueDate = dueDate ?? DateTime.now().add(const Duration(days: 30));

  @override
  ConsumerState<PaymentScreen> createState() => _PaymentScreenState();
}

class _PaymentScreenState extends ConsumerState<PaymentScreen> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _emailController = TextEditingController();
  final _cardFormController = CardFormEditController();
  bool _isProcessing = false;

  @override
  void dispose() {
    _nameController.dispose();
    _emailController.dispose();
    _cardFormController.dispose();
    super.dispose();
  }

  Future<void> _processPayment() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() {
      _isProcessing = true;
    });

    try {
      // Create payment record
      final payment = await ref.read(paymentsProvider.notifier).createPayment(
            tenantId: widget.tenantId,
            amount: widget.amount,
            currency: widget.currency,
            paymentDate: widget.paymentDate,
            dueDate: widget.dueDate,
            paymentMethod: 'card',
            reference: 'RES-${DateTime.now().millisecondsSinceEpoch}',
          );

      // Create billing details
      final billingDetails = BillingDetails(
        name: _nameController.text,
        email: _emailController.text,
      );

      // Confirm payment with Stripe
      if (payment.paymentIntentId != null && payment.clientSecret != null) {
        await ref.read(paymentsProvider.notifier).confirmPayment(
              paymentIntentId: payment.paymentIntentId!,
              clientSecret: payment.clientSecret!,
              billingDetails: billingDetails,
            );
      } else {
        throw Exception('Payment intent ID or client secret is missing');
      }

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Payment successful!'),
            backgroundColor: Colors.green,
          ),
        );
        Navigator.of(context).pop(true);
      }
    } on StripeException catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Payment failed: ${e.error.localizedMessage}'),
            backgroundColor: Colors.red,
          ),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Payment failed: ${e.toString()}'),
            backgroundColor: Colors.red,
          ),
        );
      }
    } finally {
      if (mounted) {
        setState(() {
          _isProcessing = false;
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Payment'),
      ),
      body: _isProcessing
          ? const Center(child: CircularProgressIndicator())
          : SingleChildScrollView(
              padding: const EdgeInsets.all(16),
              child: Form(
                key: _formKey,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    Material(
                      elevation: 2,
                      borderRadius: BorderRadius.circular(8),
                      child: Padding(
                        padding: const EdgeInsets.all(16),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Payment Details',
                              style: Theme.of(context).textTheme.titleLarge,
                            ),
                            const SizedBox(height: 16),
                            Text(
                              'Amount: ${widget.currency}${widget.amount.toStringAsFixed(2)}',
                              style: Theme.of(context).textTheme.titleMedium,
                            ),
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(height: 24),
                    TextFormField(
                      controller: _nameController,
                      decoration: const InputDecoration(
                        labelText: 'Name on Card',
                        border: OutlineInputBorder(),
                      ),
                      validator: (value) {
                        if (value == null || value.isEmpty) {
                          return 'Please enter the name on card';
                        }
                        return null;
                      },
                    ),
                    const SizedBox(height: 16),
                    TextFormField(
                      controller: _emailController,
                      decoration: const InputDecoration(
                        labelText: 'Email',
                        border: OutlineInputBorder(),
                      ),
                      keyboardType: TextInputType.emailAddress,
                      validator: (value) {
                        if (value == null || value.isEmpty) {
                          return 'Please enter your email';
                        }
                        if (!value.contains('@')) {
                          return 'Please enter a valid email';
                        }
                        return null;
                      },
                    ),
                    const SizedBox(height: 16),
                    CardFormField(
                      controller: _cardFormController,
                      style: CardFormStyle(
                        backgroundColor: Colors.white,
                        textColor: Colors.black,
                        borderColor: Colors.grey,
                        borderRadius: 8,
                        textErrorColor: Colors.red,
                      ),
                    ),
                    const SizedBox(height: 24),
                    ElevatedButton(
                      onPressed: _isProcessing ? null : _processPayment,
                      style: ElevatedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(vertical: 16),
                      ),
                      child: const Text('Pay Now'),
                    ),
                  ],
                ),
              ),
            ),
    );
  }
}
