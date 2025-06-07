import 'package:flutter/material.dart';
import '../../models/post.dart';
import 'package:intl/intl.dart';

class PostCard extends StatelessWidget {
  final Post post;
  final VoidCallback? onTap;
  const PostCard({super.key, required this.post, this.onTap});

  @override
  Widget build(BuildContext context) {
    return Card(
      child: ListTile(
        onTap: onTap,
        leading: const Icon(Icons.article),
        title: Text(post.title),
        subtitle: Text(post.type.toString().split('.').last),
        trailing: post.publishedAt != null ? Text(DateFormat.yMMMd().format(post.publishedAt!)) : null,
      ),
    );
  }
}
