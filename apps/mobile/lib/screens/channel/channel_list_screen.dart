import 'package:flutter/material.dart';
import '../../models/channel.dart';

class ChannelListScreen extends StatelessWidget {
  final List<Channel> channels;
  const ChannelListScreen({super.key, required this.channels});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Channels')),
      body: ListView.separated(
        padding: const EdgeInsets.all(16),
        itemCount: channels.length,
        separatorBuilder: (_, __) => const Divider(),
        itemBuilder: (context, i) {
          final c = channels[i];
          return ListTile(
            leading: const Icon(Icons.forum),
            title: Text(c.name),
            subtitle: Text('Type: ${c.type.name}\nCategory: ${c.category.name}'),
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
