import 'package:flutter/material.dart';
import 'package:mobile/components/layouts/client_layout.dart';

class PropertyOwnershipScreen extends StatelessWidget {
  const PropertyOwnershipScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return const ClientLayout(
      child: Center(
        child: Text(
          'Property Ownership & Legal',
          style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
        ),
      ),
    );
  }
}
