import 'package:flutter/material.dart';
import '../../models/coordinates.dart';

class CoordinatesListScreen extends StatelessWidget {
  final List<Coordinates> coordinates;
  const CoordinatesListScreen({super.key, required this.coordinates});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Coordinates')),
      body: ListView.separated(
        padding: const EdgeInsets.all(16),
        itemCount: coordinates.length,
        separatorBuilder: (_, __) => const Divider(),
        itemBuilder: (context, i) {
          final coord = coordinates[i];
          return ListTile(
            leading: const Icon(Icons.location_on),
            title: Text('Lat: ${coord.latitude}, Lng: ${coord.longitude}'),
            subtitle: const Text('Coordinates point'),
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
