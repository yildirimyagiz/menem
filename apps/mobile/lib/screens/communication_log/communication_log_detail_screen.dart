import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../../models/communication_log.dart';

class CommunicationLogDetailScreen extends StatelessWidget {
  final CommunicationLog communicationLog;
  const CommunicationLogDetailScreen(
      {super.key, required this.communicationLog});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Communication Log Details')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildDetailItem('Sender ID', communicationLog.senderId),
            _buildDetailItem('Receiver ID', communicationLog.receiverId),
            _buildDetailItem('Type', communicationLog.type.name),
            _buildDetailItem(
                'Status', communicationLog.isRead ? 'Read' : 'Unread'),
            _buildDetailItem('Content', communicationLog.content),
            if (communicationLog.entityId != null)
              _buildDetailItem('Entity ID', communicationLog.entityId),
            if (communicationLog.entityType != null)
              _buildDetailItem('Entity Type', communicationLog.entityType),
            if (communicationLog.metadata != null) ...[
              const SizedBox(height: 8),
              Text('Metadata:', style: Theme.of(context).textTheme.titleSmall),
              SelectableText(communicationLog.metadata.toString()),
            ],
            if (communicationLog.readAt != null)
              _buildDetailItem('Read At',
                  DateFormat.yMMMd().add_jm().format(communicationLog.readAt!)),
            if (communicationLog.deliveredAt != null)
              _buildDetailItem(
                  'Delivered At',
                  DateFormat.yMMMd()
                      .add_jm()
                      .format(communicationLog.deliveredAt!)),
            if (communicationLog.userId != null)
              _buildDetailItem('User ID', communicationLog.userId),
            if (communicationLog.agencyId != null)
              _buildDetailItem('Agency ID', communicationLog.agencyId),
            if (communicationLog.threadId != null)
              _buildDetailItem('Thread ID', communicationLog.threadId),
            if (communicationLog.replyToId != null)
              _buildDetailItem('Reply To ID', communicationLog.replyToId),
            if (communicationLog.channelId != null)
              _buildDetailItem('Channel ID', communicationLog.channelId),
            if (communicationLog.ticketId != null)
              _buildDetailItem('Ticket ID', communicationLog.ticketId),
            if (communicationLog.agency != null) ...[
              const SizedBox(height: 8),
              Text('Agency:', style: Theme.of(context).textTheme.titleSmall),
              SelectableText(communicationLog.agency.toString()),
            ],
            if (communicationLog.user != null) ...[
              const SizedBox(height: 8),
              Text('User:', style: Theme.of(context).textTheme.titleSmall),
              SelectableText(communicationLog.user.toString()),
            ],
            if (communicationLog.replyTo != null) ...[
              const SizedBox(height: 8),
              Text('Reply To:', style: Theme.of(context).textTheme.titleSmall),
              SelectableText(communicationLog.replyTo.toString()),
            ],
            if (communicationLog.replies != null) ...[
              const SizedBox(height: 8),
              Text('Replies:', style: Theme.of(context).textTheme.titleSmall),
              SelectableText(communicationLog.replies.toString()),
            ],
            if (communicationLog.channel != null) ...[
              const SizedBox(height: 8),
              Text('Channel:', style: Theme.of(context).textTheme.titleSmall),
              SelectableText(communicationLog.channel.toString()),
            ],
            if (communicationLog.ticket != null) ...[
              const SizedBox(height: 8),
              Text('Ticket:', style: Theme.of(context).textTheme.titleSmall),
              SelectableText(communicationLog.ticket.toString()),
            ],
            _buildDetailItem(
                'Created At',
                DateFormat.yMMMd()
                    .add_jm()
                    .format(communicationLog.createdAt!)),
            _buildDetailItem(
                'Updated At',
                DateFormat.yMMMd()
                    .add_jm()
                    .format(communicationLog.updatedAt!)),
            if (communicationLog.deletedAt != null)
              _buildDetailItem('Deleted At',
                  DateFormat.yMMMd().format(communicationLog.deletedAt!)),
          ],
        ),
      ),
    );
  }

  Widget _buildDetailItem(String label, String? value) {
    if (value == null || value.isEmpty) return const SizedBox.shrink();
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6.0),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
              width: 140,
              child: Text(label,
                  style: const TextStyle(fontWeight: FontWeight.bold))),
          Expanded(child: Text(value)),
        ],
      ),
    );
  }
}
