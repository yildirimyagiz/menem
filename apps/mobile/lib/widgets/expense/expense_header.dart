import 'package:flutter/material.dart';

class ExpenseHeader extends StatelessWidget {
  final int expenseCount;
  final String? title;
  const ExpenseHeader({super.key, required this.expenseCount, this.title});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        if (title != null)
          Text(title!, style: Theme.of(context).textTheme.headlineSmall),
        Text('$expenseCount expenses found', style: Theme.of(context).textTheme.bodyMedium),
      ],
    );
  }
}
