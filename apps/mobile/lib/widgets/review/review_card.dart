import 'package:flutter/material.dart';
import '../../models/review.dart';
import 'review_details.dart';

class ReviewCard extends StatelessWidget {
  final Review review;
  final VoidCallback? onTap;

  const ReviewCard({super.key, required this.review, this.onTap});

  @override
  Widget build(BuildContext context) {
    return Card(
      child: InkWell(
        onTap: onTap,
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: ReviewDetails(review: review),
        ),
      ),
    );
  }
}
