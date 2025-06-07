import 'package:flutter/material.dart';

class ComplianceRecordHeader extends StatelessWidget {
  final int complianceRecordCount;
  final String? title;
  const ComplianceRecordHeader({super.key, required this.complianceRecordCount, this.title});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        if (title != null)
          Text(title!, style: Theme.of(context).textTheme.headlineSmall),
        Text('$complianceRecordCount records found', style: Theme.of(context).textTheme.bodyMedium),
      ],
    );
  }
}
