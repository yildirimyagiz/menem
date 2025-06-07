import 'package:flutter/material.dart';
import '../../models/expense.dart';
import 'package:intl/intl.dart';

class ExpenseCard extends StatelessWidget {
  final Expense expense;
  final VoidCallback? onTap;
  const ExpenseCard({super.key, required this.expense, this.onTap});

  @override
  Widget build(BuildContext context) {
    return Card(
      child: ListTile(
        onTap: onTap,
        leading: const Icon(Icons.receipt_long),
        title: Text(expense.title),
        subtitle: Text(
            '${expense.type.toString().split('.').last} • ${expense.amount} ${expense.currency}'),
        trailing: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Chip(
              label: Text(expense.status.toString().split('.').last),
              backgroundColor: _statusColor(expense.status),
            ),
            Text(DateFormat.yMMMd().format(expense.dueDate)),
          ],
        ),
      ),
    );
  }

  Color _statusColor(ExpenseStatus status) {
    switch (status) {
      case ExpenseStatus.pending:
        return Colors.orange.shade100;
      case ExpenseStatus.paid:
        return Colors.green.shade100;
      case ExpenseStatus.overdue:
        return Colors.red.shade100;
      case ExpenseStatus.cancelled:
        return Colors.grey.shade300;
    }
  }
}
