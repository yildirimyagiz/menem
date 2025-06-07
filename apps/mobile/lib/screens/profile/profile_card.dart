import 'package:flutter/material.dart';
import '../../models/user.dart';

class ProfileCard extends StatelessWidget {
  final User user;
  final VoidCallback? onTap;
  const ProfileCard({super.key, required this.user, this.onTap});

  @override
  Widget build(BuildContext context) {
    return Card(
      child: ListTile(
        onTap: onTap,
        leading: user.avatarUrl != null ? CircleAvatar(backgroundImage: NetworkImage(user.avatarUrl!)) : const Icon(Icons.person),
        title: Text(user.displayName ?? user.email),
        subtitle: Text(user.role.toString().split('.').last),
        trailing: user.isActive ? const Icon(Icons.check_circle, color: Colors.green) : const Icon(Icons.cancel, color: Colors.red),
      ),
    );
  }
}
