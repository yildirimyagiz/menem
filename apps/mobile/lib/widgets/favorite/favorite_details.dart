import 'package:flutter/material.dart';
import '../../models/favorite.dart';

class FavoriteDetails extends StatelessWidget {
  final Favorite favorite;
  const FavoriteDetails({super.key, required this.favorite});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('Favorite: ${favorite.id}', style: Theme.of(context).textTheme.titleLarge),
        Text('User: ${favorite.userId}'),
        Text('Property: ${favorite.propertyId}'),
        // Add more fields as needed
      ],
    );
  }
}
