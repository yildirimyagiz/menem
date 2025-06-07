import 'package:flutter/material.dart';
import '../../models/hashtag.dart';

class HashtagCard extends StatelessWidget {
  final Hashtag hashtag;
  final VoidCallback? onTap;
  const HashtagCard({super.key, required this.hashtag, this.onTap});

  @override
  Widget build(BuildContext context) {
    return Card(
      child: ListTile(
        onTap: onTap,
        leading: const Icon(Icons.tag),
        title: Text(hashtag.name),
        subtitle: Text(hashtag.type.toString().split('.').last),
        trailing: hashtag.isTrending
            ? Chip(
                label: const Text('Trending'),
                backgroundColor: Colors.orange.shade100)
            : null,
      ),
    );
  }
}
