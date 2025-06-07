import 'package:flutter/material.dart';

class TaxRecordHeader extends StatelessWidget {
  final int taxRecordCount;
  final String? title;
  const TaxRecordHeader({super.key, required this.taxRecordCount, this.title});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        if (title != null)
          Text(title!, style: Theme.of(context).textTheme.headlineSmall),
        Text('$taxRecordCount tax records found', style: Theme.of(context).textTheme.bodyMedium),
      ],
    );
  }
}
