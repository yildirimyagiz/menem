import 'package:flutter/material.dart';
import '../../models/expense.dart';

class ExpenseListScreen extends StatelessWidget {
  final List<Expense> expenses;
  const ExpenseListScreen({super.key, required this.expenses});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Expenses')),
      body: ListView.separated(
        padding: const EdgeInsets.all(16),
        itemCount: expenses.length,
        separatorBuilder: (_, __) => const Divider(),
        itemBuilder: (context, i) {
          final exp = expenses[i];
          return ListTile(
            leading: const Icon(Icons.money_off),
            title: Text(exp.title),
            subtitle: Text('Amount: ${exp.amount}\nDue: ${exp.dueDate.toLocal()}'),
            trailing: IconButton(
              icon: const Icon(Icons.more_vert),
              onPressed: () {
                showModalBottomSheet(
                  context: context,
                  builder: (context) => SafeArea(
                    child: Wrap(children: [
                      ListTile(
                        leading: const Icon(Icons.visibility),
                        title: const Text('View Details'),
                        onTap: () => Navigator.pop(context),
                      ),
                      ListTile(
                        leading: const Icon(Icons.edit),
                        title: const Text('Edit'),
                        onTap: () => Navigator.pop(context),
                      ),
                      ListTile(
                        leading: const Icon(Icons.delete),
                        title: const Text('Delete'),
                        onTap: () => Navigator.pop(context),
                      ),
                    ]),
                  ),
                );
              },
            ),
            onTap: () {},
          );
        },
      ),
    );
  }
}
