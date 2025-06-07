import 'package:flutter/material.dart';
import '../../models/guest.dart';

class GuestListScreen extends StatelessWidget {
  final List<Guest> guests;
  const GuestListScreen({super.key, required this.guests});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Guests')),
      body: ListView.separated(
        padding: const EdgeInsets.all(16),
        itemCount: guests.length,
        separatorBuilder: (_, __) => const Divider(),
        itemBuilder: (context, i) {
          final g = guests[i];
          return ListTile(
            leading: const Icon(Icons.person_outline),
            title: Text(g.name ?? 'Unknown'),
            subtitle: Text('Email: ${g.email ?? ''}\nPhone: ${g.phone ?? ''}'),
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
