import 'package:flutter/material.dart';

class PropertyFilterDialog extends StatelessWidget {
  const PropertyFilterDialog({super.key});

  @override
  Widget build(BuildContext context) {
    // Replace with your actual filter UI
    return AlertDialog(
      title: const Text('Filter Properties'),
      content: const Text('Filter options go here.'),
      actions: [
        TextButton(onPressed: () => Navigator.pop(context), child: const Text('Cancel')),
        ElevatedButton(onPressed: () {/* Apply filter */}, child: const Text('Apply')),
      ],
    );
  }
}
