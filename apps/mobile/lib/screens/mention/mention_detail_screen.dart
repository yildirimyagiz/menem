import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../../models/mention.dart';

class MentionDetailScreen extends StatelessWidget {
  final Mention mention;
  const MentionDetailScreen({super.key, required this.mention});

  @override
  Widget build(BuildContext context) {
    final DateFormat yMMMdFormatter = DateFormat.yMMMd();
    final DateFormat yMMMdJmFormatter = DateFormat.yMMMd().add_jm();
    return Scaffold(
      appBar: AppBar(title: const Text('Mention Details')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Mention Details', style: Theme.of(context).textTheme.titleLarge),
            _buildDetailItem('ID', mention.id),
            _buildDetailItem('User ID', mention.userId),
            _buildDetailItem('Post ID', mention.postId),
            _buildDetailItem('Comment ID', mention.commentId),
            _buildDetailItem('Is Read', mention.isRead ? 'Yes' : 'No'),
            _buildDetailItem('Read At', mention.readAt != null ? yMMMdJmFormatter.format(mention.readAt!) : null),
            _buildDetailItem('Created At', mention.createdAt != null ? yMMMdJmFormatter.format(mention.createdAt!) : null),
            _buildDetailItem('Updated At', mention.updatedAt != null ? yMMMdJmFormatter.format(mention.updatedAt!) : null),
            if (mention.deletedAt != null)
              _buildDetailItem('Deleted At', yMMMdFormatter.format(mention.deletedAt!)),
          ],
        ),
      ),
    );
  }

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
}
