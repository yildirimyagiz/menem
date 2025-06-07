import 'package:flutter/material.dart';

class ContractHeader extends StatelessWidget {
  final int contractCount;
  final String? title;
  const ContractHeader({super.key, required this.contractCount, this.title});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        if (title != null)
          Text(title!, style: Theme.of(context).textTheme.headlineSmall),
        Text('$contractCount contracts found', style: Theme.of(context).textTheme.bodyMedium),
      ],
    );
  }
}
