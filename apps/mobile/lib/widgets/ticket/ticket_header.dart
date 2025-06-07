import 'package:flutter/material.dart';

class TicketHeader extends StatelessWidget {
  final int ticketCount;
  final String? title;
  const TicketHeader({super.key, required this.ticketCount, this.title});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        if (title != null)
          Text(title!, style: Theme.of(context).textTheme.headlineSmall),
        Text('$ticketCount tickets found', style: Theme.of(context).textTheme.bodyMedium),
      ],
    );
  }
}
