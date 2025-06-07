import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../../models/channel.dart';

class ChannelDetailScreen extends StatelessWidget {
  final Channel channel;
  const ChannelDetailScreen({super.key, required this.channel});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Channel Details')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildDetailItem('Name', channel.name),
            _buildDetailItem('CUID', channel.cuid),
            _buildDetailItem('Type', channel.type.name),
            _buildDetailItem('Category', channel.category.name),
            if (channel.description != null)
              _buildDetailItem('Description', channel.description),
            _buildDetailItem('Is Active', channel.isActive ? 'Yes' : 'No'),
            _buildDetailItem('Created At',
                DateFormat.yMMMd().add_jm().format(channel.createdAt!)),
            _buildDetailItem('Updated At',
                DateFormat.yMMMd().add_jm().format(channel.updatedAt!)),
            if (channel.deletedAt != null)
              _buildDetailItem(
                  'Deleted At', DateFormat.yMMMd().format(channel.deletedAt!)),
            if (channel.communicationLogs != null) ...[
              const SizedBox(height: 8),
              Text('Communication Logs:',
                  style: Theme.of(context).textTheme.titleSmall),
              SelectableText(channel.communicationLogs.toString()),
            ],
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
              width: 120,
              child: Text(label,
                  style: const TextStyle(fontWeight: FontWeight.bold))),
          Expanded(child: Text(value)),
        ],
      ),
    );
  }
}
