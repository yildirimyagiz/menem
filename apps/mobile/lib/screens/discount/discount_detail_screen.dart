import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../../models/discount.dart';

class DiscountDetailScreen extends StatelessWidget {
  final Discount discount;
  const DiscountDetailScreen({super.key, required this.discount});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(discount.code),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildInfoCard(context, discount),
            const SizedBox(height: 16),
            _buildConditionsCard(context, discount),
            const SizedBox(height: 16),
            _buildMetadataCard(context, discount),
          ],
        ),
      ),
    );
  }

  Widget _buildInfoCard(BuildContext context, Discount discount) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Discount Information', style: Theme.of(context).textTheme.titleLarge),
            const SizedBox(height: 16),
            _buildInfoRow('Type', discount.type.toString().split('.').last),
            _buildInfoRow('Status', discount.status.toString().split('.').last),
            _buildInfoRow('Value', discount.value.toString()),
            _buildInfoRow('Start Date', DateFormat.yMMMd().format(discount.startDate)),
            _buildInfoRow('End Date', DateFormat.yMMMd().format(discount.endDate)),
            _buildInfoRow('Max Uses', discount.maxUses?.toString() ?? '-'),
            _buildInfoRow('Current Uses', discount.currentUses.toString()),
            _buildInfoRow('Is Public', discount.isPublic ? 'Yes' : 'No'),
            if (discount.currency != null) _buildInfoRow('Currency', discount.currency!),
            if (discount.minAmount != null) _buildInfoRow('Min Amount', discount.minAmount.toString()),
            if (discount.maxAmount != null) _buildInfoRow('Max Amount', discount.maxAmount.toString()),
            if (discount.minNights != null) _buildInfoRow('Min Nights', discount.minNights.toString()),
            if (discount.maxNights != null) _buildInfoRow('Max Nights', discount.maxNights.toString()),
            if (discount.firstBookingDate != null) _buildInfoRow('First Booking', DateFormat.yMMMd().format(discount.firstBookingDate!)),
            if (discount.lastBookingDate != null) _buildInfoRow('Last Booking', DateFormat.yMMMd().format(discount.lastBookingDate!)),
          ],
        ),
      ),
    );
  }

  Widget _buildConditionsCard(BuildContext context, Discount discount) {
    if (discount.conditions == null) return const SizedBox.shrink();
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Conditions', style: Theme.of(context).textTheme.titleLarge),
            const SizedBox(height: 16),
            SelectableText(discount.conditions.toString()),
          ],
        ),
      ),
    );
  }

  Widget _buildMetadataCard(BuildContext context, Discount discount) {
    if (discount.metadata == null) return const SizedBox.shrink();
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Metadata', style: Theme.of(context).textTheme.titleLarge),
            const SizedBox(height: 16),
            SelectableText(discount.metadata.toString()),
          ],
        ),
      ),
    );
  }

  Widget _buildInfoRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: const TextStyle(fontWeight: FontWeight.bold)),
          Text(value),
        ],
      ),
    );
  }
}
