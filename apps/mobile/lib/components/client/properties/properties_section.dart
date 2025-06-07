import 'package:flutter/material.dart';

class PropertiesSection extends StatelessWidget {
  const PropertiesSection({super.key});

  @override
  Widget build(BuildContext context) {
    return const Card(
      child: Padding(
        padding: EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Properties',
                style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
            SizedBox(height: 12),
            Text('Your properties will be shown here.'),
          ],
        ),
      ),
    );
  }
}
