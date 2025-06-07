import 'package:flutter/material.dart';

class ContractsSection extends StatelessWidget {
  const ContractsSection({super.key});

  @override
  Widget build(BuildContext context) {
    return const Card(
      child: Padding(
        padding: EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Contracts',
                style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
            SizedBox(height: 12),
            Text('Your contracts and agreements will appear here.'),
          ],
        ),
      ),
    );
  }
}
