import 'package:flutter/material.dart';

class AgencyHeader extends StatelessWidget {
  final int agencyCount;
  final String? title;
  const AgencyHeader({super.key, required this.agencyCount, this.title});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        if (title != null)
          Text(title!, style: Theme.of(context).textTheme.headlineSmall),
        Text('$agencyCount agencies found', style: Theme.of(context).textTheme.bodyMedium),
      ],
    );
  }
}
