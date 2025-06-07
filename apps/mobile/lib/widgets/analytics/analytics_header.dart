import 'package:flutter/material.dart';

class AnalyticsHeader extends StatelessWidget {
  final int analyticsCount;
  final String? title;
  const AnalyticsHeader({super.key, required this.analyticsCount, this.title});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        if (title != null)
          Text(title!, style: Theme.of(context).textTheme.headlineSmall),
        Text('$analyticsCount analytics found', style: Theme.of(context).textTheme.bodyMedium),
      ],
    );
  }
}
