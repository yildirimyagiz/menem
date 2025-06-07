import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../../models/discount.dart';

class DiscountDetails extends StatelessWidget {
  final Discount discount;
  const DiscountDetails({super.key, required this.discount});

  @override
  Widget build(BuildContext context) {
    final DateFormat yMMMdFormatter = DateFormat.yMMMd();
    final DateFormat yMMMdJmFormatter = DateFormat.yMMMd().add_jm();

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Discount Details',
              style: Theme.of(context).textTheme.titleLarge),
          _buildDetailItem('ID', discount.id),
          _buildDetailItem('Code', discount.code),
          _buildDetailItem('Description', discount.description),
          _buildDetailItem('Type', discount.type.name),
          _buildDetailItem('Status', discount.status.name),
          _buildDetailItem('Value', discount.value.toString()),
          _buildDetailItem('Currency', discount.currency ?? ''),
          _buildDetailItem('Is Public', discount.isPublic ? 'Yes' : 'No'),
          _buildDetailItem('Is Active',
              (discount.status == DiscountStatus.active) ? 'Yes' : 'No'),
          // ignore: unnecessary_null_comparison
          _buildDetailItem(
              'Start Date',
              // ignore: unnecessary_null_comparison
              discount.startDate != null
                  ? yMMMdFormatter.format(discount.startDate)
                  : ''),
          _buildDetailItem(
              'End Date',
              // ignore: unnecessary_null_comparison
              discount.endDate != null
                  ? yMMMdFormatter.format(discount.endDate)
                  : ''),
          _buildDetailItem(
              'Created At',
              discount.createdAt != null
                  ? yMMMdJmFormatter.format(discount.createdAt!)
                  : ''),
          _buildDetailItem(
              'Updated At',
              discount.updatedAt != null
                  ? yMMMdJmFormatter.format(discount.updatedAt!)
                  : ''),
          if (discount.deletedAt != null)
            _buildDetailItem(
                'Deleted At', yMMMdFormatter.format(discount.deletedAt!)),
          _buildDetailItem('Max Uses', discount.maxUses?.toString()),
          _buildDetailItem('Current Uses', discount.currentUses.toString()),
          _buildDetailItem('Min Amount', discount.minAmount?.toString()),
          _buildDetailItem('Max Amount', discount.maxAmount?.toString()),
          _buildDetailItem('Min Nights', discount.minNights?.toString()),
          _buildDetailItem('Max Nights', discount.maxNights?.toString()),
          _buildDetailItem(
              'First Booking Date',
              discount.firstBookingDate != null
                  ? yMMMdFormatter.format(discount.firstBookingDate!)
                  : ''),
          _buildDetailItem(
              'Last Booking Date',
              discount.lastBookingDate != null
                  ? yMMMdFormatter.format(discount.lastBookingDate!)
                  : ''),
          _buildDetailItem('Property ID', discount.propertyId),
          _buildDetailItem('Pricing Rule ID', discount.pricingRuleId),
          const SizedBox(height: 16),
          if (discount.conditions != null) ...[
            Text('Conditions:', style: Theme.of(context).textTheme.titleSmall),
            SelectableText(discount.conditions.toString()),
          ],
          if (discount.metadata != null) ...[
            const SizedBox(height: 8),
            Text('Metadata:', style: Theme.of(context).textTheme.titleSmall),
            SelectableText(discount.metadata.toString()),
          ],
          if (discount.applicablePropertyIds != null &&
              discount.applicablePropertyIds!.isNotEmpty) ...[
            const SizedBox(height: 8),
            Text('Applicable Property IDs:',
                style: Theme.of(context).textTheme.titleSmall),
            SelectableText(discount.applicablePropertyIds.toString()),
          ],
          if (discount.applicableUserIds != null &&
              discount.applicableUserIds!.isNotEmpty) ...[
            const SizedBox(height: 8),
            Text('Applicable User IDs:',
                style: Theme.of(context).textTheme.titleSmall),
            SelectableText(discount.applicableUserIds.toString()),
          ],
        ],
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
