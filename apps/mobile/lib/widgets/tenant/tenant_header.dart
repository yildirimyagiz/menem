import 'package:flutter/material.dart';

class TenantHeader extends StatelessWidget {
  final int tenantCount;
  final String? title;
  const TenantHeader({super.key, required this.tenantCount, this.title});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        if (title != null)
          Text(title!, style: Theme.of(context).textTheme.headlineSmall),
        Text('$tenantCount tenants found', style: Theme.of(context).textTheme.bodyMedium),
      ],
    );
  }
}
