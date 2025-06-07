import 'package:flutter/material.dart';

class AvailabilityHeader extends StatelessWidget {
  final int availabilityCount;
  final String? title;
  const AvailabilityHeader({super.key, required this.availabilityCount, this.title});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        if (title != null)
          Text(title!, style: Theme.of(context).textTheme.headlineSmall),
        Text('$availabilityCount availabilities found', style: Theme.of(context).textTheme.bodyMedium),
      ],
    );
  }
}
