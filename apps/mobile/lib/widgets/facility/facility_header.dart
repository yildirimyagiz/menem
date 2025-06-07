import 'package:flutter/material.dart';

class FacilityHeader extends StatelessWidget {
  final int facilityCount;
  final String? title;
  const FacilityHeader({super.key, required this.facilityCount, this.title});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        if (title != null)
          Text(title!, style: Theme.of(context).textTheme.headlineSmall),
        Text('$facilityCount facilities found', style: Theme.of(context).textTheme.bodyMedium),
      ],
    );
  }
}
