import 'package:flutter/material.dart';
import '../../models/user.dart';

class UserCard extends StatelessWidget {
  final User user;
  final VoidCallback? onTap;
  const UserCard({super.key, required this.user, this.onTap});

  @override
  Widget build(BuildContext context) {
    return Card(
      child: ListTile(
        onTap: onTap,
        leading: user.avatarUrl != null
            ? CircleAvatar(backgroundImage: NetworkImage(user.avatarUrl!))
            : const CircleAvatar(child: Icon(Icons.person)),
        title: Text(user.displayName ?? user.email),
        subtitle: Text(user.role.toString().split('.').last),
        trailing: Icon(
          user.isActive ? Icons.check_circle : Icons.remove_circle,
          color: user.isActive ? Colors.green : Colors.red,
        ),
      ),
    );
  }
}
