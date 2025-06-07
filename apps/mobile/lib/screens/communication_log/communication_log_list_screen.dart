import 'package:flutter/material.dart';
import '../../models/communication_log.dart';

class CommunicationLogListScreen extends StatelessWidget {
  final List<CommunicationLog> communicationLogs;
  const CommunicationLogListScreen(
      {super.key, required this.communicationLogs});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Communication Logs')),
      body: ListView.separated(
        padding: const EdgeInsets.all(16),
        itemCount: communicationLogs.length,
        separatorBuilder: (_, __) => const Divider(),
        itemBuilder: (context, i) {
          final log = communicationLogs[i];
          return ListTile(
            leading: const Icon(Icons.message),
            title: Text(log.subject ?? 'No Subject'),
            subtitle:
                Text('Type: ${log.type}\nDate: ${log.date?.toLocal() ?? ''}'),
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
