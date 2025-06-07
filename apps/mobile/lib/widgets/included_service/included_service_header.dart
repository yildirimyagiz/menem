import 'package:flutter/material.dart';

class IncludedServiceHeader extends StatelessWidget {
  final int includedServiceCount;
  final String? title;
  const IncludedServiceHeader({super.key, required this.includedServiceCount, this.title});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        if (title != null)
          Text(title!, style: Theme.of(context).textTheme.headlineSmall),
        Text('$includedServiceCount services found', style: Theme.of(context).textTheme.bodyMedium),
      ],
    );
  }
}
