import 'package:flutter/material.dart';

class AdminAnalyticsSection extends StatelessWidget {
  const AdminAnalyticsSection({super.key});

  @override
  Widget build(BuildContext context) {
    return const Card(
      child: Padding(
        padding: EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Admin Analytics',
                style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
            SizedBox(height: 12),
            Text('System analytics and statistics will be shown here.'),
          ],
        ),
      ),
    );
  }
}
