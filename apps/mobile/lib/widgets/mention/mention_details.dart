import 'package:flutter/material.dart';
import '../../models/mention.dart';

class MentionDetails extends StatelessWidget {
  final Mention mention;
  const MentionDetails({super.key, required this.mention});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
            'Mentioned by: ${mention.mentionedById}', // Assuming mentionedById is non-nullable
            style: Theme.of(context).textTheme.titleLarge),
        Text(
            'Mentioned entity: ${mention.entityId}'), // Assuming a field like entityId or mentionedToId exists
        // Add more fields as needed
      ],
    );
  }
}
