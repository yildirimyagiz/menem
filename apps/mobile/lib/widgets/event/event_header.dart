import 'package:flutter/material.dart';

class EventHeader extends StatelessWidget {
  final int eventCount;
  final String? title;
  const EventHeader({super.key, required this.eventCount, this.title});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        if (title != null)
          Text(title!, style: Theme.of(context).textTheme.headlineSmall),
        Text('$eventCount events found', style: Theme.of(context).textTheme.bodyMedium),
      ],
    );
  }
}
