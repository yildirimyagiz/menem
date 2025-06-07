import 'package:flutter/material.dart';
import '../../models/tax_record.dart';
import 'tax_record_details.dart';

class TaxRecordCard extends StatelessWidget {
  final TaxRecord taxRecord;
  final VoidCallback? onTap;

  const TaxRecordCard({super.key, required this.taxRecord, this.onTap});

  @override
  Widget build(BuildContext context) {
    return Card(
      child: InkWell(
        onTap: onTap,
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: TaxRecordDetails(taxRecord: taxRecord),
        ),
      ),
    );
  }
}
