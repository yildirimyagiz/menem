import 'package:flutter/material.dart';

class LanguageSelector extends StatelessWidget {
  final Locale selectedLocale;
  final List<Locale> supportedLocales;
  final ValueChanged<Locale> onChanged;
  const LanguageSelector({super.key, required this.selectedLocale, required this.supportedLocales, required this.onChanged});

  @override
  Widget build(BuildContext context) {
    return DropdownButtonHideUnderline(
      child: DropdownButton<Locale>(
        value: selectedLocale,
        icon: const Icon(Icons.language),
        items: supportedLocales.map((locale) {
          return DropdownMenuItem(
            value: locale,
            child: Text(locale.languageCode.toUpperCase()),
          );
        }).toList(),
        onChanged: (Locale? newLocale) {
          if (newLocale != null) onChanged(newLocale);
        },
        style: TextStyle(
          color: Theme.of(context).primaryColor,
          fontWeight: FontWeight.bold,
        ),
      ),
    );
  }
}
