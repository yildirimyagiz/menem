import 'package:flutter/material.dart';

class QuickActionsSection extends StatelessWidget {
  const QuickActionsSection({super.key});

  @override
  Widget build(BuildContext context) {
    // Replace with your actual Quick Actions UI
    // Example: A Row or Wrap of ElevatedButton
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          "Quick Actions", // i18n: Replace with context.l10n.quickActions or similar
          style: TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.w600), // Changed to w600 for semi-bold
        ),
        const SizedBox(height: 12),
        Wrap(spacing: 8.0, runSpacing: 8.0, children: [
          ElevatedButton(onPressed: () {}, child: const Text("Add New Listing"))
        ]),
      ],
    );
  }
}
