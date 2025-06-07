import 'package:flutter/material.dart';
import 'package:mobile/components/layouts/client_layout.dart';

class OfferListScreen extends StatelessWidget {
  const OfferListScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return const ClientLayout(
      child: Center(
        child: Text(
          'Offers List',
          style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
        ),
      ),
    );
  }
}
