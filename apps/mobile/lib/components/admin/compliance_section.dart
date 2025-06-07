import 'package:flutter/material.dart';

class AdminComplianceSection extends StatelessWidget {
  const AdminComplianceSection({super.key});

  @override
  Widget build(BuildContext context) {
    return const Card(
      child: Padding(
        padding: EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Admin Compliance',
                style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
            SizedBox(height: 12),
            Text(
                'Compliance records and system documents will be managed here.'),
          ],
        ),
      ),
    );
  }
}
