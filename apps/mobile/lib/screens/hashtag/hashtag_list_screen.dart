import 'package:flutter/material.dart';
import '../../models/hashtag.dart';

class HashtagListScreen extends StatelessWidget {
  final List<Hashtag> hashtags;
  const HashtagListScreen({super.key, required this.hashtags});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Hashtags')),
      body: ListView.separated(
        padding: const EdgeInsets.all(16),
        itemCount: hashtags.length,
        separatorBuilder: (_, __) => const Divider(),
        itemBuilder: (context, i) {
          final h = hashtags[i];
          return ListTile(
            leading: const Icon(Icons.tag),
            title: Text(h.name),
            subtitle: Text('Count: ${h.count ?? ''}'),
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
