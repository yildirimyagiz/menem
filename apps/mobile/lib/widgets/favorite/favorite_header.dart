import 'package:flutter/material.dart';

class FavoriteHeader extends StatelessWidget {
  final int favoriteCount;
  final String? title;
  const FavoriteHeader({super.key, required this.favoriteCount, this.title});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        if (title != null)
          Text(title!, style: Theme.of(context).textTheme.headlineSmall),
        Text('$favoriteCount favorites found', style: Theme.of(context).textTheme.bodyMedium),
      ],
    );
  }
}
