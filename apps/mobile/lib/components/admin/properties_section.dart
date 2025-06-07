import 'package:flutter/material.dart';

class AdminPropertiesSection extends StatelessWidget {
  const AdminPropertiesSection({super.key});

  @override
  Widget build(BuildContext context) {
    return const Card(
      child: Padding(
        padding: EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Admin Properties',
                style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
            SizedBox(height: 12),
            Text('All properties in the system will be managed here.'),
          ],
        ),
      ),
    );
  }
}
