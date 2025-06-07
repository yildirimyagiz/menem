import 'package:flutter/material.dart';
import 'package:mobile/components/layouts/client_layout.dart';

class PropertyRelationshipsScreen extends StatelessWidget {
  const PropertyRelationshipsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return const ClientLayout(
      child: Center(
        child: Text(
          'Property Relationships',
          style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
        ),
      ),
    );
  }
}
