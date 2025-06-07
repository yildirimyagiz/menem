import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../../models/expense.dart';

class ExpenseDetailScreen extends StatelessWidget {
  final Expense expense;
  const ExpenseDetailScreen({super.key, required this.expense});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(expense.title),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildInfoCard(context, expense),
            const SizedBox(height: 16),
            _buildMetadataCard(context, expense),
          ],
        ),
      ),
    );
  }

  Widget _buildInfoCard(BuildContext context, Expense expense) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Expense Information', style: Theme.of(context).textTheme.titleLarge),
            const SizedBox(height: 16),
            _buildInfoRow('Type', expense.type.toString().split('.').last),
            _buildInfoRow('Status', expense.status.toString().split('.').last),
            _buildInfoRow('Amount', expense.amount.toString()),
            _buildInfoRow('Currency', expense.currency),
            _buildInfoRow('Due Date', DateFormat.yMMMd().format(expense.dueDate)),
            _buildInfoRow('Paid Date', expense.paidDate != null ? DateFormat.yMMMd().format(expense.paidDate!) : '-'),
            _buildInfoRow('Property', expense.propertyId),
            _buildInfoRow('Vendor', expense.vendorId ?? '-'),
            _buildInfoRow('Invoice Number', expense.invoiceNumber ?? '-'),
            _buildInfoRow('Payment Method', expense.paymentMethod ?? '-'),
            _buildInfoRow('Is Recurring', expense.isRecurring ? 'Yes' : 'No'),
            if (expense.recurringFrequency != null) _buildInfoRow('Frequency', expense.recurringFrequency!),
            if (expense.nextDueDate != null) _buildInfoRow('Next Due', DateFormat.yMMMd().format(expense.nextDueDate!)),
          ],
        ),
      ),
    );
  }

  Widget _buildMetadataCard(BuildContext context, Expense expense) {
    if (expense.metadata == null) return const SizedBox.shrink();
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Metadata', style: Theme.of(context).textTheme.titleLarge),
            const SizedBox(height: 16),
            SelectableText(expense.metadata.toString()),
          ],
        ),
      ),
    );
  }

  Widget _buildInfoRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: const TextStyle(fontWeight: FontWeight.bold)),
          Flexible(child: Text(value, overflow: TextOverflow.ellipsis)),
        ],
      ),
    );
  }
}
