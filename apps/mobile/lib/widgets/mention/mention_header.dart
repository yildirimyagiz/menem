import 'package:flutter/material.dart';

class MentionHeader extends StatelessWidget {
  final int mentionCount;
  final String? title;
  const MentionHeader({super.key, required this.mentionCount, this.title});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        if (title != null)
          Text(title!, style: Theme.of(context).textTheme.headlineSmall),
        Text('$mentionCount mentions found', style: Theme.of(context).textTheme.bodyMedium),
      ],
    );
  }
}
