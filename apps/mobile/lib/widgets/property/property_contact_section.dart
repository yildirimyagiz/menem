import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../models/property.dart';
import '../logical_sized_box.dart';

class PropertyContactSection extends StatelessWidget {
  final Property property;

  const PropertyContactSection({
    super.key,
    required this.property,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Contact',
          style: Theme.of(context).textTheme.titleLarge,
        ),
        const LogicalSizedBox(blockSize: 16),
        if (property.owner?.name != null)
          _buildContactInfo(
              context, Icons.person, 'Owner', property.owner!.name),
        if (property.owner?.phone != null) ...[
          const LogicalSizedBox(blockSize: 8),
          _buildContactInfo(
            context,
            Icons.phone,
            'Phone',
            property.owner!.phone!,
            onTap: () => _makePhoneCall(property.owner!.phone!),
          ),
        ],
        if (property.owner?.email != null) ...[
          const LogicalSizedBox(blockSize: 8),
          _buildContactInfo(
            context,
            Icons.email,
            'Email',
            property.owner!.email!,
            onTap: () => _sendEmail(property.owner!.email!),
          ),
        ],
        const LogicalSizedBox(blockSize: 16),
      ],
    );
  }

  Widget _buildContactInfo(
    BuildContext context,
    IconData icon,
    String label,
    String value, {
    VoidCallback? onTap,
  }) {
    return InkWell(
      onTap: onTap,
      child: Row(
        children: [
          Icon(
            icon,
            size: 20,
            color: Theme.of(context).colorScheme.primary,
          ),
          const LogicalSizedBox(inlineSize: 8),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  label,
                  style: Theme.of(context).textTheme.bodySmall?.copyWith(
                        color: Theme.of(context).colorScheme.primary,
                      ),
                ),
                const LogicalSizedBox(blockSize: 2),
                Text(
                  value,
                  style: Theme.of(context).textTheme.bodyLarge,
                ),
              ],
            ),
          ),
          if (onTap != null)
            Icon(
              Icons.arrow_forward_ios,
              size: 16,
              color: Theme.of(context).colorScheme.primary,
            ),
        ],
      ),
    );
  }

  Future<void> _makePhoneCall(String phoneNumber) async {
    final url = Uri.parse('tel:$phoneNumber');
    if (await canLaunchUrl(url)) {
      await launchUrl(url);
    }
  }

  Future<void> _sendEmail(String email) async {
    final url = Uri.parse('mailto:$email');
    if (await canLaunchUrl(url)) {
      await launchUrl(url);
    }
  }
}
