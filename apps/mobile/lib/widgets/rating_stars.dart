import 'package:flutter/material.dart';

class RatingStars extends StatelessWidget {
  final double rating;
  final int maxStars;
  final Color color;
  final double size;

  const RatingStars({
    super.key,
    required this.rating,
    this.maxStars = 5,
    this.color = Colors.amber,
    this.size = 20,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: List.generate(maxStars, (index) {
        return Icon(
          index < rating ? Icons.star : Icons.star_border,
          color: color,
          size: size,
        );
      }),
    );
  }
}
