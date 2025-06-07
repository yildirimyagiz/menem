import 'package:flutter/material.dart';
import '../../models/review.dart';

// import 'package:intl/intl.dart'; // Needed for number formatting if used

class ReviewDetails extends StatelessWidget {
  final Review review;
  const ReviewDetails({super.key, required this.review});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      mainAxisSize: MainAxisSize.min, // Use min size for column in a card
      children: [
        // Assuming reviewerId is a String, handle potential null
        Text('Reviewer: ${review.reviewerId ?? 'Unknown Reviewer'}',
            style: Theme.of(context).textTheme.titleLarge),
        // Format rating, e.g., to 1 decimal place if it's a double
        // Text('Rating: ${review.rating?.toStringAsFixed(1) ?? 'N/A'}'),
        Text('Rating: ${review.rating}'),
        Text(review.content),
        // Add more fields as needed
      ],
    );
  }
}
