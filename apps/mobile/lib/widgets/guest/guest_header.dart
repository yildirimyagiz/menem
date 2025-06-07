import 'package:flutter/material.dart';

class GuestHeader extends StatelessWidget {
  final int guestCount;
  final String? title;
  const GuestHeader({super.key, required this.guestCount, this.title});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        if (title != null)
          Text(title!, style: Theme.of(context).textTheme.headlineSmall),
        Text('$guestCount guests found', style: Theme.of(context).textTheme.bodyMedium),
      ],
    );
  }
}
