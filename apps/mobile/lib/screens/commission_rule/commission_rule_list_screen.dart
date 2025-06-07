import 'package:flutter/material.dart';
import '../../models/commission_rule.dart';

class CommissionRuleListScreen extends StatelessWidget {
  final List<CommissionRule> commissionRules;
  const CommissionRuleListScreen({super.key, required this.commissionRules});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Commission Rules')),
      body: ListView.separated(
        padding: const EdgeInsets.all(16),
        itemCount: commissionRules.length,
        separatorBuilder: (_, __) => const Divider(),
        itemBuilder: (context, i) {
          final cr = commissionRules[i];
          return ListTile(
            leading: const Icon(Icons.percent),
            title: Text(cr.name),
            subtitle: Text('Type: ${cr.type}\nRate: ${cr.rate}'),
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
