import 'package:flutter/material.dart';
import '../../models/discount.dart';

class DiscountListScreen extends StatelessWidget {
  final List<Discount> discounts;
  const DiscountListScreen({super.key, required this.discounts});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Discounts')),
      body: ListView.separated(
        padding: const EdgeInsets.all(16),
        itemCount: discounts.length,
        separatorBuilder: (_, __) => const Divider(),
        itemBuilder: (context, i) {
          final d = discounts[i];
          return ListTile(
            leading: const Icon(Icons.local_offer),
            title: Text(d.name ?? 'Unnamed'),
            subtitle: Text('Type: ${d.type}\nValue: ${d.value}'),
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
