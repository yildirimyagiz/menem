import 'package:flutter/material.dart';

class EnumDropdown<T> extends StatelessWidget {
  final T? value;
  final List<T> values;
  final String label;
  final void Function(T?)? onChanged;
  final String Function(T)? display;

  const EnumDropdown({
    super.key,
    required this.value,
    required this.values,
    required this.label,
    this.onChanged,
    required this.display,
  });

  @override
  Widget build(BuildContext context) {
    return DropdownButtonFormField<T>(
      value: value,
      decoration: InputDecoration(labelText: label),
      items: values
          .map((v) => DropdownMenuItem(value: v, child: Text(display!(v))))
          .toList(),
      onChanged: onChanged,
    );
  }
}
