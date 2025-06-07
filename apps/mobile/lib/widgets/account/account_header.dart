import 'package:flutter/material.dart';
import 'package:mobile/generated/l10n.dart';
// Import S class

class AccountHeader extends StatelessWidget {
  final int accountCount;
  final String? title;
  const AccountHeader({super.key, required this.accountCount, this.title});

  @override
  Widget build(BuildContext context) {
    final s = AppLocalizations.of(context)!;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        if (title != null)
          Text(title!, style: Theme.of(context).textTheme.headlineSmall),
        Text(s.accountsFound(accountCount),
            style: Theme.of(context).textTheme.bodyMedium),
      ],
    );
  }
}
