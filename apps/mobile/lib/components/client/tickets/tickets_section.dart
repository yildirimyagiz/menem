import 'package:flutter/material.dart';

class TicketsSection extends StatelessWidget {
  const TicketsSection({super.key});

  @override
  Widget build(BuildContext context) {
    return const Card(
      child: Padding(
        padding: EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Tickets',
                style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
            SizedBox(height: 12),
            Text('Your maintenance and support tickets will be shown here.'),
          ],
        ),
      ),
    );
  }
}
