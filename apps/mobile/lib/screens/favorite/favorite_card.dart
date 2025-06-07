import 'package:flutter/material.dart';
import '../../models/favorite.dart';

class FavoriteCard extends StatelessWidget {
  final Favorite favorite;
  final VoidCallback? onTap;
  const FavoriteCard({super.key, required this.favorite, this.onTap});

  @override
  Widget build(BuildContext context) {
    return Card(
      child: ListTile(
        onTap: onTap,
        leading: const Icon(Icons.star),
        title: Text(favorite.type.toString().split('.').last),
        subtitle: Text(favorite.entityId),
        trailing:
            favorite.notes != null ? const Chip(label: Text('Notes')) : null,
      ),
    );
  }
}
