import 'package:flutter/material.dart';
import '../../models/expense.dart';
import 'expense_details.dart';

class ExpenseCard extends StatelessWidget {
  final Expense expense;
  final VoidCallback? onTap;

  const ExpenseCard({super.key, required this.expense, this.onTap});

  @override
  Widget build(BuildContext context) {
    return Card(
      child: InkWell(
        onTap: onTap,
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: ExpenseDetails(expense: expense),
        ),
      ),
    );
  }
}
