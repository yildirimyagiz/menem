import 'package:flutter/material.dart';
import '../../models/facility.dart';

class FacilityListScreen extends StatelessWidget {
  final List<Facility> facilities;
  const FacilityListScreen({super.key, required this.facilities});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Facilities')),
      body: ListView.separated(
        padding: const EdgeInsets.all(16),
        itemCount: facilities.length,
        separatorBuilder: (_, __) => const Divider(),
        itemBuilder: (context, i) {
          final f = facilities[i];
          return ListTile(
            leading: const Icon(Icons.home_work),
            title: Text(f.name),
            subtitle: Text('Type: ${f.type}\nLocation: ${f.location ?? ''}'),
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
