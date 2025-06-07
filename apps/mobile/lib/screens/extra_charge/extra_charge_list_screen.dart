import 'package:flutter/material.dart';
import '../../models/extra_charge.dart';

class ExtraChargeListScreen extends StatelessWidget {
  final List<ExtraCharge> extraCharges;
  const ExtraChargeListScreen({super.key, required this.extraCharges});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Extra Charges')),
      body: ListView.separated(
        padding: const EdgeInsets.all(16),
        itemCount: extraCharges.length,
        separatorBuilder: (_, __) => const Divider(),
        itemBuilder: (context, i) {
          final ec = extraCharges[i];
          return ListTile(
            leading: const Icon(Icons.add_circle_outline),
            title: Text(ec.name),
            subtitle: Text(ec.description ?? ''),
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
