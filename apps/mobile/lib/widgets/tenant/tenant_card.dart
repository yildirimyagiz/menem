import 'package:flutter/material.dart';
import '../../models/tenant.dart';
import 'tenant_details.dart';

class TenantCard extends StatelessWidget {
  final Tenant tenant;
  final VoidCallback? onTap;

  const TenantCard({super.key, required this.tenant, this.onTap});

  @override
  Widget build(BuildContext context) {
    return Card(
      child: InkWell(
        onTap: onTap,
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: TenantDetails(tenant: tenant),
        ),
      ),
    );
  }
}
