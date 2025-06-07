import 'package:flutter/material.dart';
import '../../models/user.dart';

class UserDetails extends StatelessWidget {
  final User user;
  const UserDetails({super.key, required this.user});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          user.displayName?.isNotEmpty == true
              ? user.displayName!
              : (user.name?.isNotEmpty == true ? user.name! : 'No Name'),
          style: Theme.of(context).textTheme.titleLarge,
        ),
        Text('Email: ${user.email}'),
        Text('Role: ${user.role.name.toUpperCase()}'),
        // Add more fields as needed, e.g. phone, status, etc.
      ],
    );
  }
}
