import 'package:flutter/material.dart';

class UserHeader extends StatelessWidget {
  final int userCount;
  final String? title;
  const UserHeader({super.key, required this.userCount, this.title});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        if (title != null)
          Text(title!, style: Theme.of(context).textTheme.headlineSmall),
        Text('$userCount users found', style: Theme.of(context).textTheme.bodyMedium),
      ],
    );
  }
}
