import 'package:flutter/material.dart';
import '../../models/hashtag.dart';

class HashtagDetails extends StatelessWidget {
  final Hashtag hashtag;
  const HashtagDetails({super.key, required this.hashtag});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('#${hashtag.name}', style: Theme.of(context).textTheme.titleLarge),
        // Add more fields as needed
      ],
    );
  }
}
