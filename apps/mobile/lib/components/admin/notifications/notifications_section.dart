import 'package:flutter/material.dart';

class AdminNotificationsSection extends StatelessWidget {
  const AdminNotificationsSection({super.key});

  @override
  Widget build(BuildContext context) {
    return const Card(
      child: Padding(
        padding: EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Admin Notifications',
                style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
            SizedBox(height: 12),
            Text('System notifications and templates will be managed here.'),
          ],
        ),
      ),
    );
  }
}
