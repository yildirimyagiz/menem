import 'package:flutter/material.dart';
import '../../models/payment.dart';
import 'package:intl/intl.dart';

class PaymentDetailScreen extends StatelessWidget {
  final Payment payment;
  const PaymentDetailScreen({super.key, required this.payment});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Payment')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('Amount',
                        style: Theme.of(context).textTheme.titleLarge),
                    Text('${payment.amount} ${payment.currency}'),
                    const SizedBox(height: 8),
                    Text('Type',
                        style: Theme.of(context).textTheme.titleMedium),
                    Text(payment.type.toString().split('.').last),
                    const SizedBox(height: 8),
                    Text('Method',
                        style: Theme.of(context).textTheme.titleMedium),
                    Text(payment.method.toString().split('.').last),
                    const SizedBox(height: 8),
                    Text('Status',
                        style: Theme.of(context).textTheme.titleMedium),
                    Text(payment.status.toString().split('.').last),
                    const SizedBox(height: 8),
                    if (payment.paidAt != null)
                      Text(
                          'Paid At: ${DateFormat.yMMMd().add_jm().format(payment.paidAt!)}'),
                    if (payment.transactionId != null)
                      Text('Transaction ID: ${payment.transactionId!}'),
                    if (payment.description != null)
                      Text('Description: ${payment.description!}'),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 16),
            if (payment.metadata != null)
              Card(
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('Metadata',
                          style: Theme.of(context).textTheme.titleLarge),
                      const SizedBox(height: 8),
                      SelectableText(payment.metadata.toString()),
                    ],
                  ),
                ),
              ),
            const SizedBox(height: 16),
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('Audit',
                        style: Theme.of(context).textTheme.titleLarge),
                    const SizedBox(height: 8),
                    Text(
                        'Created: ${DateFormat.yMMMd().add_jm().format(payment.createdAt!)}'),
                    Text(
                        'Updated: ${DateFormat.yMMMd().add_jm().format(payment.updatedAt!)}'),
                    if (payment.deletedAt != null)
                      Text(
                          'Deleted: ${DateFormat.yMMMd().add_jm().format(payment.deletedAt!)}'),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
