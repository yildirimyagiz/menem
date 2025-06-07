import 'package:flutter/material.dart';
import 'package:mobile/generated/l10n.dart';
import '../../models/account.dart';
// Import S class

typedef OnAccountFilterChanged = void Function(
    {List<AccountType>? types}); // Use AccountType enum

class AccountFilters extends StatefulWidget {
  final List<AccountType> allTypes; // Use AccountType enum
  final OnAccountFilterChanged onFilterChanged;

  const AccountFilters({
    super.key,
    required this.allTypes,
    required this.onFilterChanged,
  });

  @override
  State<AccountFilters> createState() => _AccountFiltersState();
}

class _AccountFiltersState extends State<AccountFilters> {
  final Set<AccountType> _selectedTypes = {}; // Use AccountType enum

  void _onTypeTap(AccountType type) {
    // Use AccountType enum
    setState(() {
      if (!_selectedTypes.add(type)) _selectedTypes.remove(type);
      // Pass null if no types are selected, otherwise pass the list
      widget.onFilterChanged(
          types: _selectedTypes.isEmpty ? null : _selectedTypes.toList());
    });
  }

  String _getLocalizedAccountType(BuildContext context, AccountType type) {
    final s = AppLocalizations.of(context)!;
    // Assuming AccountType enum values match these cases.
    // Add more cases as per your AccountType enum.
    switch (type) {
      case AccountType.oauth:
        return s.accountFilter_type_oauth;
      case AccountType.email:
        return s.accountFilter_type_email;
      case AccountType.oidc:
        return s.accountFilter_type_oidc;
      case AccountType.credentials:
        return s.accountFilter_type_credentials;
      case AccountType.google:
        return s.accountFilter_type_google;
      case AccountType.facebook:
        return s.accountFilter_type_facebook;
      // Or type.name as a fallback
    }
  }

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      child: Row(
        children: widget.allTypes.map((type) {
          return FilterChip(
            label: Text(_getLocalizedAccountType(context, type)),
            selected: _selectedTypes.contains(type),
            onSelected: (_) => _onTypeTap(type),
          );
        }).toList(),
      ),
    );
  }
}
