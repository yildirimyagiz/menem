import 'package:flutter/material.dart';

class PaymentsSection extends StatelessWidget {
  const PaymentsSection({super.key});

  @override
  Widget build(BuildContext context) {
    return const Card(
      child: Padding(
        padding: EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Payments',
                style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
            SizedBox(height: 12),
            Text('Your recent payments and payment actions will appear here.'),
          ],
        ),
      ),
    );
  }
}
