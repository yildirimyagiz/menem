import 'package:flutter/material.dart';
import '../../models/hashtag.dart';
import 'hashtag_details.dart';

class HashtagCard extends StatelessWidget {
  final Hashtag hashtag;
  final VoidCallback? onTap;

  const HashtagCard({super.key, required this.hashtag, this.onTap});

  @override
  Widget build(BuildContext context) {
    return Card(
      child: InkWell(
        onTap: onTap,
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: HashtagDetails(hashtag: hashtag),
        ),
      ),
    );
  }
}
