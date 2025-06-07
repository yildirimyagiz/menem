import 'package:flutter/material.dart';
import '../../models/post.dart';

class PostDetails extends StatelessWidget {
  final Post post;
  const PostDetails({super.key, required this.post});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(post.title, style: Theme.of(context).textTheme.titleLarge),
        if (post.body != null)
          Text(post.body!),
        // Add more fields as needed
      ],
    );
  }
}
