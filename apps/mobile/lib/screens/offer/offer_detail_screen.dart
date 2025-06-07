import 'package:flutter/material.dart';
import 'package:mobile/components/layouts/client_layout.dart';

class OfferDetailScreen extends StatelessWidget {
  const OfferDetailScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return const ClientLayout(
      child: Center(
        child: Text(
          'Offer Details',
          style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
        ),
      ),
    );
  }
}
