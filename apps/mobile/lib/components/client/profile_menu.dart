import 'package:flutter/material.dart';

class ProfileMenu extends StatelessWidget {
  final String userName;
  final String? userEmail;
  final String? avatarUrl;
  final VoidCallback onProfile;
  final VoidCallback onSettings;
  final VoidCallback onLogout;

  const ProfileMenu({
    super.key,
    required this.userName,
    this.userEmail,
    this.avatarUrl,
    required this.onProfile,
    required this.onSettings,
    required this.onLogout,
  });

  @override
  Widget build(BuildContext context) {
    return PopupMenuButton<int>(
      icon: avatarUrl != null && avatarUrl!.isNotEmpty
          ? CircleAvatar(backgroundImage: NetworkImage(avatarUrl!))
          : CircleAvatar(child: Text(userName.isNotEmpty ? userName[0] : 'U')),
      itemBuilder: (context) => [
        PopupMenuItem(
          value: 0,
          child: ListTile(
            leading: const Icon(Icons.person),
            title: const Text('Profile'),
            subtitle: userEmail != null ? Text(userEmail!) : null,
          ),
        ),
        const PopupMenuItem(
          value: 1,
          child: ListTile(
            leading: Icon(Icons.settings),
            title: Text('Settings'),
          ),
        ),
        const PopupMenuDivider(),
        const PopupMenuItem(
          value: 2,
          child: ListTile(
            leading: Icon(Icons.logout, color: Colors.red),
            title: Text('Logout', style: TextStyle(color: Colors.red)),
          ),
        ),
      ],
      onSelected: (value) {
        if (value == 0) onProfile();
        if (value == 1) onSettings();
        if (value == 2) onLogout();
      },
    );
  }
}
