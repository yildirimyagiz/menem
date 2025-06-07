import 'package:flutter/material.dart';

class LanguageHeader extends StatelessWidget {
  final int languageCount;
  final String? title;
  const LanguageHeader({super.key, required this.languageCount, this.title});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        if (title != null)
          Text(title!, style: Theme.of(context).textTheme.headlineSmall),
        Text('$languageCount languages found', style: Theme.of(context).textTheme.bodyMedium),
      ],
    );
  }
}
