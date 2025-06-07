import 'package:flutter/material.dart';
import '../../models/ticket.dart';

class TicketDetails extends StatelessWidget {
  final Ticket ticket;
  const TicketDetails({super.key, required this.ticket});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(ticket.title, style: Theme.of(context).textTheme.titleLarge),
        Text('Status: ${ticket.status.name}'),
        Text(ticket.description),
        // Add more fields as needed
      ],
    );
  }
}
