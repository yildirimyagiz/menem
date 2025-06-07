import 'package:flutter/material.dart';

class ReviewHeader extends StatelessWidget {
  final int reviewCount;
  final String? title;
  const ReviewHeader({super.key, required this.reviewCount, this.title});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        if (title != null)
          Text(title!, style: Theme.of(context).textTheme.headlineSmall),
        Text('$reviewCount reviews found', style: Theme.of(context).textTheme.bodyMedium),
      ],
    );
  }
}
