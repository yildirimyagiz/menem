import 'package:flutter/material.dart';

class FeatureHighlightsSection extends StatelessWidget {
  const FeatureHighlightsSection({super.key});

  @override
  Widget build(BuildContext context) {
    // Replace with your actual Feature Highlights UI
    return const Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          "Feature Highlights", // i18n: Replace with context.l10n.featureHighlights or similar
          style: TextStyle(fontSize: 20, fontWeight: FontWeight.w600),
        ),
        SizedBox(height: 12),
        Card(child: ListTile(title: Text("Highlight 1"))),
        Card(child: ListTile(title: Text("Highlight 2"))),
      ],
    );
  }
}
