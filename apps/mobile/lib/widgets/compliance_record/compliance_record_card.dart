import 'package:flutter/material.dart';
import '../../models/compliance_record.dart';
import 'compliance_record_details.dart';

class ComplianceRecordCard extends StatelessWidget {
  final ComplianceRecord complianceRecord;
  final VoidCallback? onTap;

  const ComplianceRecordCard({super.key, required this.complianceRecord, this.onTap});

  @override
  Widget build(BuildContext context) {
    return Card(
      child: InkWell(
        onTap: onTap,
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: ComplianceRecordDetails(complianceRecord: complianceRecord),
        ),
      ),
    );
  }
}
