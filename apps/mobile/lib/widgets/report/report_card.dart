import 'package:flutter/material.dart';
import '../../models/report.dart';
import 'report_details.dart';

class ReportCard extends StatelessWidget {
  final Report report;
  final VoidCallback? onTap;

  const ReportCard({super.key, required this.report, this.onTap});

  @override
  Widget build(BuildContext context) {
    return Card(
      child: InkWell(
        onTap: onTap,
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: ReportDetails(report: report),
        ),
      ),
    );
  }
}
