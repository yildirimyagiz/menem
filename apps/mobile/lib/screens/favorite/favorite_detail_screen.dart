import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../../models/favorite.dart';

class FavoriteDetailScreen extends StatelessWidget {
  final Favorite favorite;
  const FavoriteDetailScreen({super.key, required this.favorite});

  @override
  Widget build(BuildContext context) {
    final DateFormat yMMMdFormatter = DateFormat.yMMMd();
    final DateFormat yMMMdJmFormatter = DateFormat.yMMMd().add_jm();
    return Scaffold(
      appBar: AppBar(title: const Text('Favorite Details')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Favorite Details',
                style: Theme.of(context).textTheme.titleLarge),
            _buildDetailItem('ID', favorite.id),
            _buildDetailItem('User ID', favorite.userId),
            _buildDetailItem('Entity ID', favorite.entityId),
            _buildDetailItem('Type', favorite.type.toString().split('.').last),
            _buildDetailItem('Notes', favorite.notes),
            if (favorite.metadata != null)
              _buildDetailItem('Metadata', favorite.metadata.toString(),
                  selectable: true),
            _buildDetailItem('Created By', favorite.createdBy),
            _buildDetailItem('Updated By', favorite.updatedBy),
            _buildDetailItem(
                'Created At',
                favorite.createdAt != null
                    ? yMMMdJmFormatter.format(favorite.createdAt!)
                    : null),
            _buildDetailItem(
                'Updated At',
                favorite.updatedAt != null
                    ? yMMMdJmFormatter.format(favorite.updatedAt!)
                    : null),
            if (favorite.deletedAt != null)
              _buildDetailItem(
                  'Deleted At', yMMMdFormatter.format(favorite.deletedAt!)),
          ],
        ),
      ),
    );
  }

  Widget _buildDetailItem(String label, String? value,
      {bool selectable = false}) {
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
          Expanded(
            child: selectable ? SelectableText(value) : Text(value),
          ),
        ],
      ),
    );
  }
}
