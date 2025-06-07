import 'package:flutter/material.dart';
import '../../models/ticket.dart';
import 'ticket_details.dart';

class TicketCard extends StatelessWidget {
  final Ticket ticket;
  final VoidCallback? onTap;

  const TicketCard({super.key, required this.ticket, this.onTap});

  @override
  Widget build(BuildContext context) {
    return Card(
      child: InkWell(
        onTap: onTap,
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: TicketDetails(ticket: ticket),
        ),
      ),
    );
  }
}
