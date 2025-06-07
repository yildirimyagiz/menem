import 'package:flutter/material.dart';

class LogoutButton extends StatelessWidget {
  final VoidCallback onLogout;
  const LogoutButton({super.key, required this.onLogout});
  @override
  Widget build(BuildContext context) {
    return IconButton(
      icon: const Icon(Icons.logout, color: Colors.red),
      tooltip: 'Logout',
      onPressed: onLogout,
    );
  }
}
