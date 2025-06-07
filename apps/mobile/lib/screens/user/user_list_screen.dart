import 'package:flutter/material.dart';
import 'package:mobile/models/user.dart';
import '../../widgets/user/user_filters.dart';
import '../../widgets/user/user_header.dart';
import '../../widgets/user/user_card.dart';

class UserListScreen extends StatefulWidget {
  final List<User> users;
  const UserListScreen({super.key, required this.users});

  @override
  State<UserListScreen> createState() => _UserListScreenState();
}

class _UserListScreenState extends State<UserListScreen> {
  // Filters
  String? _email;
  Role? _role;
  UserStatus? _status;
  AccountType? _type;
  String? _agencyId;

  String? _error;

  List<User> get _filteredUsers {
    return widget.users.where((u) {
      if (_email != null && _email!.isNotEmpty && !u.email.contains(_email!)) {
        return false;
      }
      if (_role != null && u.role != _role) return false;
      if (_status != null && u.status != _status) return false;
      if (_type != null && u.type != _type) return false;
      if (_agencyId != null &&
          _agencyId!.isNotEmpty &&
          u.agencyId != _agencyId) {
        return false;
      }
      return true;
    }).toList();
  }

  void _showUserActions(User user) {
    showModalBottomSheet(
      context: context,
      builder: (context) => SafeArea(
        child: Wrap(
          children: [
            ListTile(
              leading: const Icon(Icons.person),
              title: const Text('View'),
              onTap: () {
                // TODO: Implement view
                Navigator.pop(context);
              },
            ),
            ListTile(
              leading: const Icon(Icons.edit),
              title: const Text('Edit'),
              onTap: () {
                // TODO: Implement edit
                Navigator.pop(context);
              },
            ),
            ListTile(
              leading: const Icon(Icons.block),
              title: const Text('Deactivate'),
              onTap: () {
                // TODO: Implement deactivate
                Navigator.pop(context);
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
      appBar: AppBar(
        title: const Text('Users'),
      ),
      body: _error != null
          ? Center(
              child: Text(_error!,
                  style: TextStyle(color: Theme.of(context).colorScheme.error)))
          : Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  UserHeader(userCount: _filteredUsers.length),
                  const SizedBox(height: 8),
                  UserFilters(
                    onChanged: ({email, role, status, type, agencyId}) {
                      setState(() {
                        _email = email;
                        _role = role;
                        _status = status;
                        _type = type;
                        _agencyId = agencyId;
                      });
                    },
                  ),
                  const SizedBox(height: 12),
                  Expanded(
                    child: ListView.separated(
                      itemCount: _filteredUsers.length,
                      separatorBuilder: (_, __) => const Divider(),
                      itemBuilder: (context, i) {
                        final user = _filteredUsers[i];
                        return UserCard(
                          user: user,
                          onTap: () => _showUserActions(user),
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
