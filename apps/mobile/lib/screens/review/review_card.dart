import 'package:flutter/material.dart';
import '../../models/review.dart';

class ReviewCard extends StatelessWidget {
  final Review review;
  final VoidCallback? onTap;
  const ReviewCard({super.key, required this.review, this.onTap});

  @override
  Widget build(BuildContext context) {
    return Card(
      child: ListTile(
        onTap: onTap,
        leading: const Icon(Icons.rate_review),
        title: Text(review.title),
        subtitle: Text('Rating: ${review.rating}'),
        trailing: Text(review.status.toString().split('.').last),
      ),
    );
  }
}
