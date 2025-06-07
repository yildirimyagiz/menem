import 'package:flutter/material.dart';
import '../../models/report.dart';

class ReportDetails extends StatelessWidget {
  final Report report;
  const ReportDetails({super.key, required this.report});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(report.title, style: Theme.of(context).textTheme.titleLarge),
        Text(report.description),
        // Add more fields as needed
      ],
    );
  }
}
