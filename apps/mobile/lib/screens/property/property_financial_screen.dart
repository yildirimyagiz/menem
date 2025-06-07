import 'package:flutter/material.dart';
import 'package:mobile/components/layouts/client_layout.dart';

class PropertyFinancialScreen extends StatelessWidget {
  const PropertyFinancialScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return const ClientLayout(
      child: Center(
        child: Text(
          'Property Financials',
          style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
        ),
      ),
    );
  }
}
