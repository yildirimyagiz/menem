import 'package:flutter/material.dart';
import 'package:mobile/components/layouts/client_layout.dart';

class PropertyReportScreen extends StatelessWidget {
  const PropertyReportScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return const ClientLayout(
      child: Center(
        child: Text(
          'Property Reports',
          style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
        ),
      ),
    );
  }
}
