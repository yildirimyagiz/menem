import 'package:flutter/material.dart';

class LabeledTextField extends StatelessWidget {
  final TextEditingController controller;
  final String label;
  final String? errorText;
  final TextInputType? keyboardType;
  final bool obscureText;
  final int? maxLines;
  final void Function(String)? onChanged;

  const LabeledTextField({
    super.key,
    required this.controller,
    required this.label,
    this.errorText,
    this.keyboardType,
    this.obscureText = false,
    this.maxLines,
    this.onChanged,
  });

  @override
  Widget build(BuildContext context) {
    return TextField(
      controller: controller,
      decoration: InputDecoration(
        labelText: label,
        errorText: errorText,
      ),
      keyboardType: keyboardType,
      obscureText: obscureText,
      maxLines: maxLines,
      onChanged: onChanged,
    );
  }
}
