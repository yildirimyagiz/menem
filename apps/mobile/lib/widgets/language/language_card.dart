import 'package:flutter/material.dart';
import '../../models/language.dart';
import 'language_details.dart';

class LanguageCard extends StatelessWidget {
  final Language language;
  final VoidCallback? onTap;

  const LanguageCard({super.key, required this.language, this.onTap});

  @override
  Widget build(BuildContext context) {
    return Card(
      child: InkWell(
        onTap: onTap,
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: LanguageDetails(language: language),
        ),
      ),
    );
  }
}
