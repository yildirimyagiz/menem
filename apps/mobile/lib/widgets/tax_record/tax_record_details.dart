import 'package:flutter/material.dart';
import '../../models/tax_record.dart';

class TaxRecordDetails extends StatelessWidget {
  final TaxRecord taxRecord;
  const TaxRecordDetails({super.key, required this.taxRecord});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('Tax Year: ${taxRecord.year}', style: Theme.of(context).textTheme.titleLarge),
        Text('Amount: ${taxRecord.amount}'),
        // Add more fields as needed
      ],
    );
  }
}
