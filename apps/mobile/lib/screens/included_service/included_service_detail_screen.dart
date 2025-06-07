import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../../models/included_service.dart';

class IncludedServiceDetailScreen extends StatelessWidget {
  final IncludedService includedService;
  const IncludedServiceDetailScreen({super.key, required this.includedService});

  @override
  Widget build(BuildContext context) {
    final DateFormat yMMMdFormatter = DateFormat.yMMMd();
    final DateFormat yMMMdJmFormatter = DateFormat.yMMMd().add_jm();
    return Scaffold(
      appBar: AppBar(title: const Text('Included Service Details')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Included Service Details', style: Theme.of(context).textTheme.titleLarge),
            _buildDetailItem('ID', includedService.id),
            _buildDetailItem('Name', includedService.name),
            _buildDetailItem('Description', includedService.description),
            _buildDetailItem('Icon', includedService.icon),
            _buildDetailItem('Logo', includedService.logo),
            _buildDetailItem('Facility ID', includedService.facilityId),
            _buildDetailItem('Property IDs', includedService.propertyIds.join(', ')),
            _buildDetailItem('Agency IDs', includedService.agencyIds.join(', ')),
            _buildDetailItem('User IDs', includedService.userIds.join(', ')),
            _buildDetailItem('Task IDs', includedService.taskIds.join(', ')),
            _buildDetailItem('Report IDs', includedService.reportIds.join(', ')),
            _buildDetailItem('Facility Amenity IDs', includedService.facilityAmenityIds.join(', ')),
            _buildDetailItem('Location Amenity IDs', includedService.locationAmenityIds.join(', ')),
            _buildDetailItem('Expense IDs', includedService.expenseIds.join(', ')),
            _buildDetailItem('Extra Charge IDs', includedService.extraChargeIds.join(', ')),
            _buildDetailItem('Created At', includedService.createdAt != null ? yMMMdJmFormatter.format(includedService.createdAt!) : null),
            _buildDetailItem('Updated At', includedService.updatedAt != null ? yMMMdJmFormatter.format(includedService.updatedAt!) : null),
            if (includedService.deletedAt != null)
              _buildDetailItem('Deleted At', yMMMdFormatter.format(includedService.deletedAt!)),
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
              width: 170,
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
