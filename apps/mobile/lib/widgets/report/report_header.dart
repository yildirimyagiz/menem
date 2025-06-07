import 'package:flutter/material.dart';

class ReportHeader extends StatelessWidget {
  final int reportCount;
  final String? title;
  const ReportHeader({super.key, required this.reportCount, this.title});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        if (title != null)
          Text(title!, style: Theme.of(context).textTheme.headlineSmall),
        Text('$reportCount reports found', style: Theme.of(context).textTheme.bodyMedium),
      ],
    );
  }
}
