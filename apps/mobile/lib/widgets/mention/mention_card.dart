import 'package:flutter/material.dart';
import '../../models/mention.dart';
import 'mention_details.dart';

class MentionCard extends StatelessWidget {
  final Mention mention;
  final VoidCallback? onTap;

  const MentionCard({super.key, required this.mention, this.onTap});

  @override
  Widget build(BuildContext context) {
    return Card(
      child: InkWell(
        onTap: onTap,
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: MentionDetails(mention: mention),
        ),
      ),
    );
  }
}
