import 'package:flutter/material.dart';
import '../../models/favorite.dart';
import 'favorite_details.dart';

class FavoriteCard extends StatelessWidget {
  final Favorite favorite;
  final VoidCallback? onTap;

  const FavoriteCard({super.key, required this.favorite, this.onTap});

  @override
  Widget build(BuildContext context) {
    return Card(
      child: InkWell(
        onTap: onTap,
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: FavoriteDetails(favorite: favorite),
        ),
      ),
    );
  }
}
