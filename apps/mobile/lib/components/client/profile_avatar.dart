import 'package:flutter/material.dart';

class ProfileAvatar extends StatelessWidget {
  final String? userName;
  final String? avatarUrl;

  const ProfileAvatar({super.key, this.userName, this.avatarUrl});

  @override
  Widget build(BuildContext context) {
    if (avatarUrl != null && avatarUrl!.isNotEmpty) {
      return CircleAvatar(backgroundImage: NetworkImage(avatarUrl!));
    }
    final initials = (userName != null && userName!.isNotEmpty)
        ? userName!.substring(0, 2).toUpperCase()
        : 'U';
    return CircleAvatar(child: Text(initials));
  }
}
