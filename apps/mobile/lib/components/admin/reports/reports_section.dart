import 'package:flutter/material.dart';

class AdminReportsSection extends StatelessWidget {
  const AdminReportsSection({super.key});

  @override
  Widget build(BuildContext context) {
    return const Card(
      child: Padding(
        padding: EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Admin Reports',
                style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
            SizedBox(height: 12),
            Text('System-wide reports and analytics will be shown here.'),
          ],
        ),
      ),
    );
  }
}
