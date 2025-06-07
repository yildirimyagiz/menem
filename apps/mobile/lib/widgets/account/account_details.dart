import 'package:flutter/material.dart';
import 'package:mobile/generated/l10n.dart';
import '../../models/account.dart';
// Import S class

class AccountDetails extends StatelessWidget {
  final Account account;
  const AccountDetails({super.key, required this.account});

  @override
  Widget build(BuildContext context) {
    final s = AppLocalizations.of(context)!;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('${s.account_id}: ${account.id}',
            style: Theme.of(context)
                .textTheme
                .titleLarge), // Assuming account.id is never null
        // Display the enum name if type is not null
        Text('${s.account_type}: ${account.type.name}'),
        Text('${s.account_provider}: ${account.provider}'),
        // Add more fields as needed
      ],
    );
  }
}
