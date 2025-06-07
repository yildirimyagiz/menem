import 'package:flutter/material.dart';
import '../../models/user.dart';

class UserFilters extends StatefulWidget {
  final void Function({String? email, Role? role, UserStatus? status, AccountType? type, String? agencyId}) onChanged;
  const UserFilters({super.key, required this.onChanged});

  @override
  State<UserFilters> createState() => _UserFiltersState();
}

class _UserFiltersState extends State<UserFilters> {
  final _emailController = TextEditingController();
  final _agencyIdController = TextEditingController();
  Role? _selectedRole;
  UserStatus? _selectedStatus;
  AccountType? _selectedType;

  @override
  void dispose() {
    _emailController.dispose();
    _agencyIdController.dispose();
    super.dispose();
  }

  void _onFilterChanged() {
    widget.onChanged(
      email: _emailController.text.isEmpty ? null : _emailController.text,
      role: _selectedRole,
      status: _selectedStatus,
      type: _selectedType,
      agencyId: _agencyIdController.text.isEmpty ? null : _agencyIdController.text,
    );
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        TextField(
          controller: _emailController,
          decoration: const InputDecoration(labelText: 'Email'),
          onChanged: (_) => _onFilterChanged(),
        ),
        DropdownButtonFormField<Role>(
          value: _selectedRole,
          decoration: const InputDecoration(labelText: 'Role'),
          items: Role.values
              .map((role) => DropdownMenuItem(
                    value: role,
                    child: Text(role.toString().split('.').last),
                  ))
              .toList(),
          onChanged: (role) {
            setState(() => _selectedRole = role);
            _onFilterChanged();
          },
        ),
        DropdownButtonFormField<UserStatus>(
          value: _selectedStatus,
          decoration: const InputDecoration(labelText: 'Status'),
          items: UserStatus.values
              .map((status) => DropdownMenuItem(
                    value: status,
                    child: Text(status.toString().split('.').last),
                  ))
              .toList(),
          onChanged: (status) {
            setState(() => _selectedStatus = status);
            _onFilterChanged();
          },
        ),
        DropdownButtonFormField<AccountType>(
          value: _selectedType,
          decoration: const InputDecoration(labelText: 'Account Type'),
          items: AccountType.values
              .map((type) => DropdownMenuItem(
                    value: type,
                    child: Text(type.toString().split('.').last),
                  ))
              .toList(),
          onChanged: (type) {
            setState(() => _selectedType = type);
            _onFilterChanged();
          },
        ),
        TextField(
          controller: _agencyIdController,
          decoration: const InputDecoration(labelText: 'Agency ID'),
          onChanged: (_) => _onFilterChanged(),
        ),
      ],
    );
  }
}
