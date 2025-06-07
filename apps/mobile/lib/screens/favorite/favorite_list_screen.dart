import 'package:flutter/material.dart';
import '../../models/favorite.dart';

class FavoriteListScreen extends StatelessWidget {
  final List<Favorite> favorites;
  const FavoriteListScreen({super.key, required this.favorites});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Favorites')),
      body: ListView.separated(
        padding: const EdgeInsets.all(16),
        itemCount: favorites.length,
        separatorBuilder: (_, __) => const Divider(),
        itemBuilder: (context, i) {
          final fav = favorites[i];
          return ListTile(
            leading: const Icon(Icons.favorite),
            title: Text(fav.title ?? 'Untitled'),
            subtitle: Text(
                'Type: ${fav.type}\nCreated: ${fav.createdAt?.toLocal() ?? ''}'),
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
                        leading: const Icon(Icons.delete),
                        title: const Text('Remove'),
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
