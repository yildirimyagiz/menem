import 'package:flutter/material.dart';

class ComplianceSection extends StatelessWidget {
  const ComplianceSection({super.key});

  @override
  Widget build(BuildContext context) {
    return const Card(
      child: Padding(
        padding: EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Compliance',
                style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
            SizedBox(height: 12),
            Text('Your compliance records and documents will be shown here.'),
          ],
        ),
      ),
    );
  }
}
