import 'package:flutter/material.dart';
import '../../models/compliance_record.dart';

class ComplianceRecordListScreen extends StatelessWidget {
  final List<ComplianceRecord> complianceRecords;
  const ComplianceRecordListScreen(
      {super.key, required this.complianceRecords});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Compliance Records')),
      body: ListView.separated(
        padding: const EdgeInsets.all(16),
        itemCount: complianceRecords.length,
        separatorBuilder: (_, __) => const Divider(),
        itemBuilder: (context, i) {
          final cr = complianceRecords[i];
          return ListTile(
            leading: const Icon(Icons.verified_user),
            title: Text(cr.title),
            subtitle: Text('Status: ${cr.status}\nDate: ${cr.date.toLocal()}'),
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
