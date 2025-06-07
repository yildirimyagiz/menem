import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import '../../models/agency.dart';
import '../../providers/agency_provider.dart'; // Keep only if used below
import '../../widgets/agency_status_chip.dart';
import 'agency_form_screen.dart';

class AgencyDetailScreen extends ConsumerWidget {
  final String agencyId;

  const AgencyDetailScreen({
    super.key,
    required this.agencyId,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final agencyAsync = ref.watch(agencyDetailProvider(agencyId));

    return Scaffold(
      appBar: AppBar(
        title: const Text('Agency Details'),
        actions: [
          IconButton(
            icon: const Icon(Icons.edit),
            onPressed: () {
              agencyAsync.whenData((agency) {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) => AgencyFormScreen(agency: agency),
                  ),
                );
              });
            },
          ),
        ],
      ),
      body: agencyAsync.when(
        data: (agency) => _buildAgencyDetails(context, agency!),
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (error, stackTrace) => Center(
          child: Text('Error: $error'),
        ),
      ),
    );
  }

  Widget _buildAgencyDetails(BuildContext context, Agency agency) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          if (agency.logoUrl != null)
            Center(
              child: CircleAvatar(
                radius: 60,
                backgroundImage: NetworkImage(agency.logoUrl!),
              ),
            ),
          const SizedBox(height: 24),
          _buildInfoSection(
            context,
            'Basic Information',
            [
              _buildInfoRow('Name', agency.name),
              _buildInfoRow('Status', AgencyStatusChip(status: agency.status)),
              if (agency.description != null)
                _buildInfoRow('Description', agency.description!),
            ],
          ),
          const SizedBox(height: 24),
          _buildInfoSection(
            context,
            'Contact Information',
            [
              if (agency.phone != null) _buildInfoRow('Phone', agency.phone!),
              if (agency.email != null) _buildInfoRow('Email', agency.email!),
              if (agency.website != null)
                _buildInfoRow('Website', agency.website!),
              if (agency.address != null)
                _buildInfoRow('Address', agency.address!),
            ],
          ),
          const SizedBox(height: 24),
          _buildInfoSection(
            context,
            'Additional Information',
            [
              if (agency.createdAt != null)
                _buildInfoRow(
                  'Created At',
                  DateFormat('MMM d, y').format(agency.createdAt!),
                ),
              if (agency.updatedAt != null)
                _buildInfoRow(
                  'Last Updated',
                  DateFormat('MMM d, y').format(agency.updatedAt!),
                ),
              if (agency.facility != null)
                _buildInfoRow('Facility', agency.facility!.name),
              if (agency.includedService != null)
                _buildInfoRow(
                  'Included Service',
                  agency.includedService!.name,
                ),
              if (agency.extraCharge != null)
                _buildInfoRow(
                  'Extra Charge',
                  agency.extraCharge!.name,
                ),
            ],
          ),
          if (agency.settings != null && agency.settings!.isNotEmpty) ...[
            const SizedBox(height: 24),
            _buildInfoSection(
              context,
              'Settings',
              agency.settings!.entries.map((entry) {
                return _buildInfoRow(
                  entry.key,
                  entry.value.toString(),
                );
              }).toList(),
            ),
          ],
          if (agency.integration != null && agency.integration!.isNotEmpty) ...[
            const SizedBox(height: 24),
            _buildInfoSection(
              context,
              'Integration',
              agency.integration!.entries.map((entry) {
                return _buildInfoRow(
                  entry.key,
                  entry.value.toString(),
                );
              }).toList(),
            ),
          ],
        ],
      ),
    );
  }

  Widget _buildInfoSection(
    BuildContext context,
    String title,
    List<Widget> children,
  ) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          title,
          style: Theme.of(context).textTheme.titleLarge,
        ),
        const SizedBox(height: 16),
        Card(
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              children: children,
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildInfoRow(String label, dynamic value) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 120,
            child: Text(
              label,
              style: const TextStyle(
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
          Expanded(
            child: value is Widget
                ? value
                : Text(
                    value.toString(),
                    style: const TextStyle(
                      color: Colors.black87,
                    ),
                  ),
          ),
        ],
      ),
    );
  }
}
