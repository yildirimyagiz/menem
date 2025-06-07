import 'package:flutter/material.dart';
import '../../models/review.dart';
import '../../widgets/review/review_card.dart';
import '../../widgets/review/review_filters.dart';
import '../../widgets/review/review_header.dart';

class ReviewListScreen extends StatefulWidget {
  final List<Review> reviews;
  final List<String> allTypes;
  const ReviewListScreen(
      {super.key, required this.reviews, required this.allTypes});

  @override
  State<ReviewListScreen> createState() => _ReviewListScreenState();
}

class _ReviewListScreenState extends State<ReviewListScreen> {
  List<String>? _selectedTypes;

  List<Review> get _filteredReviews {
    if (_selectedTypes == null || _selectedTypes!.isEmpty) {
      return widget.reviews;
    }
    return widget.reviews
        .where((r) => _selectedTypes!.contains(r.type))
        .toList();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Reviews')),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            ReviewHeader(reviewCount: _filteredReviews.length),
            const SizedBox(height: 8),
            ReviewFilters(
              allTypes: widget.allTypes,
              onFilterChanged: ({types}) =>
                  setState(() => _selectedTypes = types),
            ),
            const SizedBox(height: 12),
            Expanded(
              child: ListView.builder(
                itemCount: _filteredReviews.length,
                itemBuilder: (context, i) => ReviewCard(
                  review: _filteredReviews[i],
                  onTap: () {
                    // Navigate to detail if needed
                  },
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
