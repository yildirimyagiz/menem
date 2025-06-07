import 'package:flutter/material.dart';
import '../../models/tenant.dart';

class TenantDetails extends StatelessWidget {
  final Tenant tenant;
  const TenantDetails({super.key, required this.tenant});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(tenant.fullName, style: Theme.of(context).textTheme.titleLarge),
        Text('Email: ${tenant.email}'),
        if (tenant.phoneNumber != null) Text('Phone: ${tenant.phoneNumber!}'),
        // Add more fields as needed
      ],
    );
  }
}
