import 'package:flutter/material.dart';
import '../../models/user.dart';

class UserCard extends StatelessWidget {
  final User user;
  final VoidCallback? onTap;
  const UserCard({super.key, required this.user, this.onTap});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final statusColor = user.isActive
        ? Colors.green
        : (user.status == UserStatus.suspended ? Colors.orange : Colors.red);
    return Card(
      elevation: 2,
      margin: const EdgeInsets.symmetric(vertical: 6, horizontal: 4),
      child: ListTile(
        onTap: onTap,
        leading: user.avatarUrl != null && user.avatarUrl!.isNotEmpty
            ? CircleAvatar(backgroundImage: NetworkImage(user.avatarUrl!))
            : CircleAvatar(
                backgroundColor: theme.colorScheme.secondary.withAlpha((0.2 * 255).toInt()),
                child: Icon(Icons.person, color: theme.colorScheme.secondary),
              ),
        title: Text(user.displayLabel, style: theme.textTheme.titleMedium),
        subtitle: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Role: ${user.roleLabel}', style: theme.textTheme.bodySmall),
            if (user.email.isNotEmpty)
              Text(user.email, style: theme.textTheme.bodySmall),
          ],
        ),
        trailing: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              user.isActive ? Icons.check_circle : Icons.remove_circle,
              color: statusColor,
              size: 20,
            ),
            Text(
              user.statusLabel,
              style: theme.textTheme.labelSmall?.copyWith(color: statusColor),
            ),
          ],
        ),
        isThreeLine: true,
      ),
    );
  }
}
