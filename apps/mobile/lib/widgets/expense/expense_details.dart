import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../../models/expense.dart';

class ExpenseDetails extends StatelessWidget {
  final Expense expense;
  const ExpenseDetails({super.key, required this.expense});

  @override
  Widget build(BuildContext context) {
    final DateFormat yMMMdFormatter = DateFormat.yMMMd();
    final DateFormat yMMMdJmFormatter = DateFormat.yMMMd().add_jm();
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Expense Details', style: Theme.of(context).textTheme.titleLarge),
          _buildDetailItem('ID', expense.id),
          _buildDetailItem('Title', expense.title),
          _buildDetailItem('Description', expense.description),
          _buildDetailItem('Type', expense.type.name),
          _buildDetailItem('Status', expense.status.name),
          _buildDetailItem('Amount', expense.amount.toString()),
          _buildDetailItem('Currency', expense.currency),
          _buildDetailItem('Due Date', yMMMdFormatter.format(expense.dueDate)),
          _buildDetailItem('Paid Date', expense.paidDate != null ? yMMMdFormatter.format(expense.paidDate!) : ''),
          _buildDetailItem('Property ID', expense.propertyId),
          _buildDetailItem('Vendor ID', expense.vendorId),
          _buildDetailItem('Invoice Number', expense.invoiceNumber),
          _buildDetailItem('Invoice URL', expense.invoiceUrl),
          _buildDetailItem('Payment Method', expense.paymentMethod),
          _buildDetailItem('Payment Reference', expense.paymentReference),
          _buildDetailItem('Is Recurring', expense.isRecurring ? 'Yes' : 'No'),
          _buildDetailItem('Recurring Frequency', expense.recurringFrequency),
          _buildDetailItem('Next Due Date', expense.nextDueDate != null ? yMMMdFormatter.format(expense.nextDueDate!) : ''),
          _buildDetailItem('Created By', expense.createdBy),
          _buildDetailItem('Updated By', expense.updatedBy),
          _buildDetailItem('Created At', expense.createdAt != null ? yMMMdJmFormatter.format(expense.createdAt!) : ''),
          _buildDetailItem('Updated At', expense.updatedAt != null ? yMMMdJmFormatter.format(expense.updatedAt!) : ''),
          if (expense.deletedAt != null)
            _buildDetailItem('Deleted At', yMMMdFormatter.format(expense.deletedAt!)),
          if (expense.metadata != null) ...[
            const SizedBox(height: 8),
            Text('Metadata:', style: Theme.of(context).textTheme.titleSmall),
            SelectableText(expense.metadata.toString()),
          ],
          if (expense.customFields != null) ...[
            const SizedBox(height: 8),
            Text('Custom Fields:', style: Theme.of(context).textTheme.titleSmall),
            SelectableText(expense.customFields.toString()),
          ],
        ],
      ),
    );
  }

  Widget _buildDetailItem(String label, String? value) {
    if (value == null || value.isEmpty) return const SizedBox.shrink();
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6.0),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
              width: 140,
              child: Text(label, style: const TextStyle(fontWeight: FontWeight.bold))),
          Expanded(child: Text(value)),
        ],
      ),
    );
  }
}
