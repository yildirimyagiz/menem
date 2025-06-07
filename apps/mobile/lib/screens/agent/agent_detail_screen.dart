import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:mobile/generated/l10n.dart';
import 'package:mobile/models/agent.dart';
import 'package:mobile/widgets/agent/agent_details.dart'; // The core details widget
import 'package:mobile/screens/agent/agent_edit_screen.dart';

// import 'package:mobile/screens/agent/agent_edit_screen.dart'; // Placeholder for edit screen

class AgentDetailScreen extends StatelessWidget {
  final Agent agent;

  const AgentDetailScreen({super.key, required this.agent});

  @override
  Widget build(BuildContext context) {
    final s = AppLocalizations.of(context);

    return Scaffold(
      appBar: AppBar(
        title: Text(agent.name),
        actions: [
          IconButton(
            icon: const Icon(Icons.edit), // Corrected key
            tooltip: s?.edit_agent_tooltip ?? 'Edit Agent',
            onPressed: () {
              Navigator.of(context).push(
                MaterialPageRoute(
                  builder: (context) => AgentEditScreen(agent: agent),
                ),
              );
            },
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: <Widget>[
            if (agent.logoUrl?.isNotEmpty == true)
              Center(
                child: CircleAvatar(
                  backgroundImage: NetworkImage(agent.logoUrl!),
                  radius: 50,
                  backgroundColor: Colors.grey[200],
                  child: agent.logoUrl!.isEmpty
                      ? const Icon(Icons.person, size: 50)
                      : null,
                ),
              ),
            if (agent.logoUrl?.isNotEmpty == true) const SizedBox(height: 16),
            AgentDetails(
                agent: agent), // Re-uses the existing basic details widget
            const SizedBox(height: 24),
            _buildSectionTitle(context,
                s?.agent_contact_information_title ?? 'Contact Information'),
            _buildDetailItem(
                context,
                Icons.email,
                s?.agent_email_label ?? 'Email', // Corrected key
                agent.email),
            _buildDetailItem(
                context,
                Icons.phone,
                s?.agent_phone_label ?? 'Phone',
                agent.phoneNumber), // Corrected key
            _buildDetailItem(
                context,
                Icons.location_on,
                s?.agent_address_label ?? 'Address', // Corrected key
                agent.address), // Corrected key
            _buildDetailItem(context, Icons.public,
                s?.agent_website_label ?? 'Website', agent.website),
            const SizedBox(height: 24),
            _buildSectionTitle(
                context,
                s?.agent_professional_information_title ??
                    'Professional Information'),
            _buildDetailItem(
              context,
              Icons.business_center,
              s?.agent_status_label ?? 'Status',
              agent.status.name, // Display enum name
            ),
            if (agent.agency?.name != null)
              _buildDetailItem(
                context,
                Icons.business,
                s?.agent_agency_label ?? 'Agency', // Corrected key
                agent.agency!
                    .name, // Assuming agency is non-null if name is not null
              ),
            if (agent.specialities != null &&
                agent.specialities!.isNotEmpty) ...[
              const SizedBox(height: 8),
              Text(s?.agent_specialities_label ?? 'Specialities',
                  style:
                      Theme.of(context).textTheme.titleSmall), // Corrected key
              Wrap(
                spacing: 8.0,
                children: agent.specialities!
                    .map((spec) => Chip(label: Text(spec.name)))
                    .toList(),
              ),
            ],
            const SizedBox(height: 24),
            _buildSectionTitle(context, 'Additional Information'),
            _buildDetailItem(context, Icons.info, 'Bio', agent.bio),
            _buildDetailItem(
                context, Icons.code, 'External ID', agent.externalId),
            _buildDetailItem(context, Icons.settings, 'Settings',
                agent.settings?.toString()),
            _buildDetailItem(context, Icons.link, 'Integration',
                agent.integration?.toString()),
            _buildDetailItem(context, Icons.person, 'Owner ID', agent.ownerId),
            _buildDetailItem(
                context, Icons.business, 'Agency ID', agent.agencyId),
            _buildDetailItem(
                context,
                Icons.delete,
                'Deleted At',
                agent.deletedAt != null
                    ? DateFormat.yMMMd(s?.localeName ??
                            Localizations.localeOf(context).toString())
                        .format(agent.deletedAt!)
                    : null),
            const SizedBox(height: 24),
            _buildSectionTitle(context, s?.agent_activity_title ?? 'Activity'),
            _buildDetailItem(
              context,
              Icons.history_toggle_off,
              s?.agent_last_active_label ?? 'Last Active',
              agent.lastActive != null
                  ? DateFormat.yMMMd(s?.localeName ??
                          Localizations.localeOf(context).toString())
                      .add_jm()
                      .format(agent.lastActive!)
                  : s?.common_not_available ?? 'Not available', // Corrected key
            ),
            _buildDetailItem(
              context,
              Icons.info_outline,
              s?.agent_is_active_label ?? 'Is Active',
              agent.isActive
                  ? (s?.common_yes ?? 'Yes')
                  : (s?.common_no ?? 'No'), // Corrected keys
            ),
            _buildDetailItem(
              context,
              Icons.date_range,
              s?.agent_created_at_label ?? 'Created At',
              DateFormat.yMMMd(s?.localeName ??
                      Localizations.localeOf(context).toString())
                  .format(agent.createdAt!),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSectionTitle(BuildContext context, String title) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8.0),
      child: Text(
        title,
        style: Theme.of(context).textTheme.titleMedium?.copyWith(
              color: Theme.of(context).colorScheme.primary,
              fontWeight: FontWeight.bold,
            ),
      ),
    );
  }

  Widget _buildDetailItem(
      BuildContext context, IconData icon, String label, String? value) {
    if (value == null || value.isEmpty) {
      return const SizedBox.shrink();
    }
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8.0),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, size: 20, color: Theme.of(context).colorScheme.secondary),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(label,
                    style: Theme.of(context)
                        .textTheme
                        .bodySmall
                        ?.copyWith(color: Colors.grey[600])),
                Text(value, style: Theme.of(context).textTheme.bodyLarge),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
