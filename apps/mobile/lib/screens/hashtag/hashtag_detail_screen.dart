import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../../models/hashtag.dart';

class HashtagDetailScreen extends StatelessWidget {
  final Hashtag hashtag;
  const HashtagDetailScreen({super.key, required this.hashtag});

  @override
  Widget build(BuildContext context) {
    final DateFormat yMMMdFormatter = DateFormat.yMMMd();
    final DateFormat yMMMdJmFormatter = DateFormat.yMMMd().add_jm();
    return Scaffold(
      appBar: AppBar(title: const Text('Hashtag Details')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Hashtag Details', style: Theme.of(context).textTheme.titleLarge),
            _buildDetailItem('ID', hashtag.id),
            _buildDetailItem('Name', hashtag.name),
            _buildDetailItem('Type', hashtag.type.toString().split('.').last),
            _buildDetailItem('Description', hashtag.description),
            _buildDetailItem('Usage Count', hashtag.usageCount.toString()),
            _buildDetailItem('Related Tags', hashtag.relatedTags?.join(', ')),
            _buildDetailItem('Post IDs', hashtag.postIds?.join(', ')),
            _buildDetailItem('Property IDs', hashtag.propertyIds?.join(', ')),
            _buildDetailItem('Is Trending', hashtag.isTrending ? 'Yes' : 'No'),
            _buildDetailItem('Last Used At', hashtag.lastUsedAt != null ? yMMMdJmFormatter.format(hashtag.lastUsedAt!) : null),
            if (hashtag.metadata != null)
              _buildDetailItem('Metadata', hashtag.metadata.toString(), selectable: true),
            _buildDetailItem('Created By', hashtag.createdBy),
            _buildDetailItem('Updated By', hashtag.updatedBy),
            if (hashtag.customFields != null)
              _buildDetailItem('Custom Fields', hashtag.customFields.toString(), selectable: true),
            _buildDetailItem('Created By ID', hashtag.createdById),
            _buildDetailItem('Agency ID', hashtag.agencyId),
            _buildDetailItem('Created At', hashtag.createdAt != null ? yMMMdJmFormatter.format(hashtag.createdAt!) : null),
            _buildDetailItem('Updated At', hashtag.updatedAt != null ? yMMMdJmFormatter.format(hashtag.updatedAt!) : null),
            if (hashtag.deletedAt != null)
              _buildDetailItem('Deleted At', yMMMdFormatter.format(hashtag.deletedAt!)),
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
