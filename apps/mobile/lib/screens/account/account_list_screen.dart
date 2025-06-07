import 'package:flutter/material.dart';
import 'package:mobile/widgets/account/account_details.dart';
import '../../models/account.dart';

import '../../widgets/account/account_filters.dart';
import '../../widgets/account/account_header.dart';

class AccountListScreen extends StatefulWidget {
  final List<Account> accounts;
  final List<AccountType> allTypes;
  const AccountListScreen(
      {super.key, required this.accounts, required this.allTypes});

  @override
  State<AccountListScreen> createState() => _AccountListScreenState();
}

class _AccountListScreenState extends State<AccountListScreen> {
  List<AccountType>? _selectedTypes;
  final bool _isLoading = false;
  String? _error;

  List<Account> get _filteredAccounts {
    if (_selectedTypes == null || _selectedTypes!.isEmpty) {
      return widget.accounts;
    }
    return widget.accounts
        .where((a) => _selectedTypes!.contains(a.type))
        .toList();
  }

  void _showAccountActions(Account account) {
    showModalBottomSheet(
      context: context,
      builder: (context) => SafeArea(
        child: Wrap(
          children: [
            ListTile(
              leading: const Icon(Icons.visibility),
              title: const Text('View'),
              onTap: () {
                Navigator.pop(context);
                showDialog(
                  context: context,
                  builder: (context) => AlertDialog(
                    title: const Text('Account Details'),
                    content: AccountDetails(account: account),
                    actions: [
                      TextButton(
                        onPressed: () => Navigator.pop(context),
                        child: const Text('Close'),
                      ),
                    ],
                  ),
                );
              },
            ),
            ListTile(
              leading: const Icon(Icons.edit),
              title: const Text('Edit'),
              onTap: () {
                Navigator.pop(context);
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Edit not implemented yet')),
                );
              },
            ),
            ListTile(
              leading: const Icon(Icons.delete),
              title: const Text('Delete'),
              onTap: () async {
                Navigator.pop(context);
                final confirm = await showDialog<bool>(
                  context: context,
                  builder: (context) => AlertDialog(
                    title: const Text('Delete Account'),
                    content: const Text(
                        'Are you sure you want to delete this account?'),
                    actions: [
                      TextButton(
                        onPressed: () => Navigator.pop(context, false),
                        child: const Text('Cancel'),
                      ),
                      TextButton(
                        onPressed: () => Navigator.pop(context, true),
                        child: const Text('Delete',
                            style: TextStyle(color: Colors.red)),
                      ),
                    ],
                  ),
                );
                if (!mounted) return;
                if (confirm == true) {
                  setState(() {
                    widget.accounts.remove(account);
                  });
                  ScaffoldMessenger.of(context).showSnackBar(
                    // ignore: use_build_context_synchronously
                    const SnackBar(content: Text('Account deleted')),
                  );
                }
              },
            ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Accounts')),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : _error != null
              ? Center(
                  child: Text(_error!,
                      style: TextStyle(
                          color: Theme.of(context).colorScheme.error)))
              : Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      AccountHeader(accountCount: _filteredAccounts.length),
                      const SizedBox(height: 8),
                      AccountFilters(
                        allTypes: widget.allTypes,
                        onFilterChanged: ({types}) =>
                            setState(() => _selectedTypes = types),
                      ),
                      const SizedBox(height: 12),
                      Expanded(
                        child: ListView.separated(
                          itemCount: _filteredAccounts.length,
                          separatorBuilder: (_, __) => const Divider(),
                          itemBuilder: (context, i) {
                            final account = _filteredAccounts[i];
                            return ListTile(
                              leading: Icon(Icons.account_circle,
                                  color: Theme.of(context).colorScheme.primary),
                              title: Text(account.provider),
                              subtitle: Text('Type: ${account.type.name}\n'
                                  'User ID: ${account.userId}\n'
                                  'Provider Account ID: ${account.providerAccountId}\n'
                                  'Active: ${account.isActive}\n'
                                  'Expires At: ${account.expiresAt ?? "-"}\n'
                                  'Token Type: ${account.tokenType ?? "-"}\n'
                                  'Scope: ${account.scope ?? "-"}\n'
                                  'ID Token: ${account.idToken ?? "-"}\n'
                                  'Session State: ${account.sessionState ?? "-"}'),
                              trailing: IconButton(
                                icon: const Icon(Icons.more_vert),
                                onPressed: () => _showAccountActions(account),
                              ),
                              onTap: () => _showAccountActions(account),
                            );
                          },
                        ),
                      ),
                    ],
                  ),
                ),
    );
  }
}
