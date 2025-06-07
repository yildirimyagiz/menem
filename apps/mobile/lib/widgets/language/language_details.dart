import 'package:flutter/material.dart';
import '../../models/language.dart';

class LanguageDetails extends StatelessWidget {
  final Language language;
  const LanguageDetails({super.key, required this.language});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(language.name, style: Theme.of(context).textTheme.titleLarge),
        // Add more fields as needed
      ],
    );
  }
}
