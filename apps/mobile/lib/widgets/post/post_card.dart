import 'package:flutter/material.dart';
import '../../models/post.dart';
import 'post_details.dart';

class PostCard extends StatelessWidget {
  final Post post;
  final VoidCallback? onTap;

  const PostCard({super.key, required this.post, this.onTap});

  @override
  Widget build(BuildContext context) {
    return Card(
      child: InkWell(
        onTap: onTap,
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: PostDetails(post: post),
        ),
      ),
    );
  }
}
