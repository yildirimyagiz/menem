import 'package:flutter/material.dart';
import 'package:mobile/components/layouts/client_layout.dart';

class PropertyOfferScreen extends StatelessWidget {
  const PropertyOfferScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return const ClientLayout(
      child: Center(
        child: Text(
          'Property Offers',
          style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
        ),
      ),
    );
  }
}
