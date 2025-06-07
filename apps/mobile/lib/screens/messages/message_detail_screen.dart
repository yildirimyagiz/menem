import 'package:flutter/material.dart';
import '../../models/message.dart';
import 'package:intl/intl.dart';

class MessageDetailScreen extends StatelessWidget {
  final Message message;
  const MessageDetailScreen({super.key, required this.message});

  String? _formatDate(DateTime? date) =>
      date != null ? DateFormat.yMMMd().add_jm().format(date) : null;

  Widget _buildDetailItem(String label, String? value, {bool selectable = false}) {
    if (value == null || value.isEmpty) return const SizedBox.shrink();
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6.0),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
              width: 140,
              child: Text(label, style: const TextStyle(fontWeight: FontWeight.bold))),
          Expanded(
            child: selectable
                ? SelectableText(value)
                : Text(value),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Message Details')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Card(
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                _buildDetailItem('ID', message.id),
                _buildDetailItem('Type', message.type.toString().split('.').last),
                _buildDetailItem('Status', message.status.toString().split('.').last),
                _buildDetailItem('Sender ID', message.senderId),
                _buildDetailItem('Receiver ID', message.receiverId),
                _buildDetailItem('Content', message.content),
                _buildDetailItem('Is Read', message.isRead ? 'Yes' : 'No'),
                _buildDetailItem('Created At', _formatDate(message.createdAt)),
                _buildDetailItem('Updated At', _formatDate(message.updatedAt)),
                _buildDetailItem('Deleted At', _formatDate(message.deletedAt)),
                if (message.metadata != null && message.metadata!.isNotEmpty)
                  _buildDetailItem('Metadata', message.metadata.toString(), selectable: true),
                // Add sender/receiver details if needed:
                // _buildDetailItem('Sender Name', message.sender?.name),
                // _buildDetailItem('Receiver Name', message.receiver?.name),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
