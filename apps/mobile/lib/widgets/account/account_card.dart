import 'package:flutter/material.dart';
import '../../models/account.dart';
import 'account_details.dart';

class AccountCard extends StatelessWidget {
  final Account account;
  final VoidCallback? onTap;

  const AccountCard({super.key, required this.account, this.onTap});

  @override
  Widget build(BuildContext context) {
    return Card(
      child: InkWell(
        onTap: onTap,
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: AccountDetails(account: account),
        ),
      ),
    );
  }
}
