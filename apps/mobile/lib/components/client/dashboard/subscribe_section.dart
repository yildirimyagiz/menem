import 'package:flutter/material.dart';

class SubscribeSection extends StatelessWidget {
  const SubscribeSection({super.key});

  @override
  Widget build(BuildContext context) {
    // Replace with your actual Subscribe UI
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            const Text(
              "Subscribe for Updates", // i18n: Replace with context.l10n.subscribeForUpdates or similar
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),
            ElevatedButton(
              onPressed: () {},
              child: const Text("Subscribe"),
            ),
          ],
        ),
      ),
    );
  }
}
