import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../../models/guest.dart';

class GuestDetailScreen extends StatelessWidget {
  final Guest guest;
  const GuestDetailScreen({super.key, required this.guest});

  @override
  Widget build(BuildContext context) {
    final DateFormat yMMMdFormatter = DateFormat.yMMMd();
    final DateFormat yMMMdJmFormatter = DateFormat.yMMMd().add_jm();
    return Scaffold(
      appBar: AppBar(title: Text('${guest.firstName} ${guest.lastName}')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Guest Details', style: Theme.of(context).textTheme.titleLarge),
            _buildDetailItem('ID', guest.id),
            _buildDetailItem('User ID', guest.userId),
            _buildDetailItem('First Name', guest.firstName),
            _buildDetailItem('Last Name', guest.lastName),
            _buildDetailItem('Email', guest.email),
            _buildDetailItem('Phone Number', guest.phoneNumber),
            _buildDetailItem('Status', guest.status.toString().split('.').last),
            if (guest.metadata != null)
              _buildDetailItem('Metadata', guest.metadata.toString(), selectable: true),
            _buildDetailItem('Created By', guest.createdBy),
            _buildDetailItem('Updated By', guest.updatedBy),
            _buildDetailItem('Created At', guest.createdAt != null ? yMMMdJmFormatter.format(guest.createdAt!) : null),
            _buildDetailItem('Updated At', guest.updatedAt != null ? yMMMdJmFormatter.format(guest.updatedAt!) : null),
            if (guest.deletedAt != null)
              _buildDetailItem('Deleted At', yMMMdFormatter.format(guest.deletedAt!)),
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
