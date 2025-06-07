import 'package:flutter/material.dart';

class ListingHeader extends StatelessWidget {
  final int propertyCount;
  final String? title;
  const ListingHeader({super.key, required this.propertyCount, this.title});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        if (title != null)
          Text(
            title!,
            style: Theme.of(context).textTheme.headlineSmall,
          ),
        Text(
          '$propertyCount properties found',
          style: Theme.of(context).textTheme.bodyMedium,
        ),
      ],
    );
  }
}
