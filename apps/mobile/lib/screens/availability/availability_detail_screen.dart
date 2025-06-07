import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../../models/availability.dart';

class AvailabilityDetailScreen extends StatelessWidget {
  final Availability availability;
  const AvailabilityDetailScreen({super.key, required this.availability});

  @override
  Widget build(BuildContext context) {
    final DateFormat yMMMdFormatter = DateFormat.yMMMd();
    final DateFormat yMMMdJmFormatter = DateFormat.yMMMd().add_jm();

    return Scaffold(
      appBar: AppBar(title: const Text('Availability Details')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Assuming availability.date is non-nullable as no error was reported for it.
            _buildDetailItem('Date', yMMMdFormatter.format(availability.date)),
            _buildDetailItem('Blocked', availability.isBlocked ? 'Yes' : 'No'),
            _buildDetailItem('Booked', availability.isBooked ? 'Yes' : 'No'),
            _buildDetailItem('Property ID', availability.propertyId),
            if (availability.reservationId != null)
              _buildDetailItem('Reservation ID', availability.reservationId),
            if (availability.pricingRuleId != null)
              _buildDetailItem('Pricing Rule ID', availability.pricingRuleId),
            _buildDetailItem('Total Units', availability.totalUnits.toString()),
            _buildDetailItem(
                'Available Units', availability.availableUnits.toString()),
            _buildDetailItem(
                'Booked Units', availability.bookedUnits.toString()),
            _buildDetailItem(
                'Blocked Units', availability.blockedUnits.toString()),
            _buildDetailItem('Base Price', availability.basePrice.toString()),
            _buildDetailItem(
                'Current Price', availability.currentPrice.toString()),
            if (availability.specialPricing != null) ...[
              const SizedBox(height: 8),
              Text('Special Pricing:',
                  style: Theme.of(context).textTheme.titleSmall),
              SelectableText(availability.specialPricing.toString()),
            ],
            if (availability.priceSettings != null) ...[
              const SizedBox(height: 8),
              Text('Price Settings:',
                  style: Theme.of(context).textTheme.titleSmall),
              SelectableText(availability.priceSettings.toString()),
            ],
            if (availability.discountSettings != null) ...[
              const SizedBox(height: 8),
              Text('Discount Settings:',
                  style: Theme.of(context).textTheme.titleSmall),
              SelectableText(availability.discountSettings.toString()),
            ],
            if (availability.weekendRate != null)
              _buildDetailItem(
                  'Weekend Rate', availability.weekendRate.toString()),
            if (availability.weekdayRate != null)
              _buildDetailItem(
                  'Weekday Rate', availability.weekdayRate.toString()),
            if (availability.weekendMultiplier != null)
              _buildDetailItem('Weekend Multiplier',
                  availability.weekendMultiplier.toString()),
            if (availability.weekdayMultiplier != null)
              _buildDetailItem('Weekday Multiplier',
                  availability.weekdayMultiplier.toString()),
            if (availability.seasonalMultiplier != null)
              _buildDetailItem('Seasonal Multiplier',
                  availability.seasonalMultiplier.toString()),
            if (availability.minNights != null)
              _buildDetailItem('Min Nights', availability.minNights.toString()),
            if (availability.maxNights != null)
              _buildDetailItem('Max Nights', availability.maxNights.toString()),
            _buildDetailItem('Max Guests', availability.maxGuests.toString()),
            _buildDetailItem(
                'Created At',
                availability.createdAt == null
                    ? null
                    : yMMMdJmFormatter.format(availability.createdAt!)),
            _buildDetailItem(
                'Updated At',
                availability.updatedAt == null
                    ? null
                    : yMMMdJmFormatter.format(availability.updatedAt!)),
            if (availability.deletedAt != null)
              _buildDetailItem(
                  'Deleted At',
                  yMMMdFormatter.format(availability
                      .deletedAt!)), // Ensure deletedAt is handled if it can be null before format
            const SizedBox(height: 16),
            if (availability.property != null) ...[
              Text('Property:', style: Theme.of(context).textTheme.titleSmall),
              SelectableText(availability.property.toString()),
            ],
            if (availability.reservation != null) ...[
              Text('Reservation:',
                  style: Theme.of(context).textTheme.titleSmall),
              SelectableText(availability.reservation.toString()),
            ],
            if (availability.pricingRule != null) ...[
              Text('Pricing Rule:',
                  style: Theme.of(context).textTheme.titleSmall),
              SelectableText(availability.pricingRule.toString()),
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
              width: 140,
              child: Text(label,
                  style: const TextStyle(fontWeight: FontWeight.bold))),
          Expanded(child: Text(value)),
        ],
      ),
    );
  }
}
