import 'package:flutter/material.dart';

class PostHeader extends StatelessWidget {
  final int postCount;
  final String? title;
  const PostHeader({super.key, required this.postCount, this.title});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        if (title != null)
          Text(title!, style: Theme.of(context).textTheme.headlineSmall),
        Text('$postCount posts found', style: Theme.of(context).textTheme.bodyMedium),
      ],
    );
  }
}
