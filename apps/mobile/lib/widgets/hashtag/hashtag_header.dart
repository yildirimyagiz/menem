import 'package:flutter/material.dart';

class HashtagHeader extends StatelessWidget {
  final int hashtagCount;
  final String? title;
  const HashtagHeader({super.key, required this.hashtagCount, this.title});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        if (title != null)
          Text(title!, style: Theme.of(context).textTheme.headlineSmall),
        Text('$hashtagCount hashtags found', style: Theme.of(context).textTheme.bodyMedium),
      ],
    );
  }
}
