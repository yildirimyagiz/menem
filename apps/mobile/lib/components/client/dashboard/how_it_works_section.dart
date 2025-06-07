import 'package:flutter/material.dart';

class HowItWorksSection extends StatelessWidget {
  const HowItWorksSection({super.key});

  @override
  Widget build(BuildContext context) {
    // Replace with your actual How It Works UI
    return const Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          "How It Works", // i18n: Replace with context.l10n.howItWorks or similar
          style: TextStyle(fontSize: 20, fontWeight: FontWeight.w600),
        ),
        SizedBox(height: 12),
        Card(child: ListTile(title: Text("Step 1: ..."))),
        Card(child: ListTile(title: Text("Step 2: ..."))),
        Card(child: ListTile(title: Text("Step 3: ..."))),
      ],
    );
  }
}
