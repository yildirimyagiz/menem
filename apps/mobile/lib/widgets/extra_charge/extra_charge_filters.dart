import 'package:flutter/material.dart';

class ExtraChargeFilters extends StatelessWidget {
  final ValueChanged<String?>? onNameChanged;
  const ExtraChargeFilters({super.key, this.onNameChanged});

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Expanded(
          child: TextField(
            decoration: const InputDecoration(labelText: 'Filter by name'),
            onChanged: onNameChanged,
          ),
        ),
      ],
    );
  }
}
