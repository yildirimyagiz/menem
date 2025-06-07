import 'package:flutter/material.dart';
import 'package:mobile/components/layouts/client_layout.dart';

class ReportListScreen extends StatelessWidget {
  const ReportListScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return const ClientLayout(
      child: Center(
        child: Text(
          'Reports List',
          style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
        ),
      ),
    );
  }
}
