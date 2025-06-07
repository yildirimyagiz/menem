import 'package:flutter/material.dart';

class UserAvatar extends StatelessWidget {
  final String initials;
  final String? avatarUrl;
  const UserAvatar({super.key, required this.initials, this.avatarUrl});

  @override
  Widget build(BuildContext context) {
    if (avatarUrl != null && avatarUrl!.isNotEmpty) {
      return CircleAvatar(backgroundImage: NetworkImage(avatarUrl!));
    }
    return CircleAvatar(child: Text(initials));
  }
}
