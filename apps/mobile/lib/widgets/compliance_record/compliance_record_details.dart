import 'package:flutter/material.dart';
import '../../models/compliance_record.dart';

class ComplianceRecordDetails extends StatelessWidget {
  final ComplianceRecord complianceRecord;
  const ComplianceRecordDetails({super.key, required this.complianceRecord});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('Record: ${complianceRecord.id}', style: Theme.of(context).textTheme.titleLarge),
        // Add more fields as needed
      ],
    );
  }
}
