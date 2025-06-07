import 'package:flutter/material.dart';
import 'package:mobile/components/layouts/client_layout.dart';

class OfferFormScreen extends StatelessWidget {
  const OfferFormScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return const ClientLayout(
      child: Center(
        child: Text(
          'Create/Edit Offer',
          style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
        ),
      ),
    );
  }
}
