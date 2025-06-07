import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:mobile/screens/agent/agent_detail_screen.dart';
import '../../models/agent.dart';

class AgentListScreen extends StatefulWidget {
  final List<Agent> agents;
  const AgentListScreen({super.key, required this.agents});

  @override
  State<AgentListScreen> createState() => _AgentListScreenState();
}

class _AgentListScreenState extends State<AgentListScreen> {
  List<Agent> get _sortedAgents {
    // Sort by status, then name
    final agents = [...widget.agents];
    agents.sort((a, b) {
      final statusCompare = a.status.index.compareTo(b.status.index);
      if (statusCompare != 0) return statusCompare;
      return a.name.toLowerCase().compareTo(b.name.toLowerCase());
    });
    return agents;
  }

  void _showAgentActions(Agent agent) {
    showModalBottomSheet(
      context: context,
      builder: (context) => SafeArea(
        child: Wrap(
          children: [
            ListTile(
              leading: const Icon(Icons.visibility),
              title: const Text('View'),
              onTap: () {
                Navigator.pop(context);
                Navigator.of(context).push(
                  MaterialPageRoute(
                    builder: (context) => AgentDetailScreen(agent: agent),
                  ),
                );
              },
            ),
            ListTile(
              leading: const Icon(Icons.edit),
              title: const Text('Edit'),
              onTap: () {
                Navigator.pop(context);
                Navigator.of(context).push(
                  MaterialPageRoute(
                    builder: (context) => AgentEditScreen(agent: agent),
                  ),
                );
              },
            ),
            ListTile(
              leading: const Icon(Icons.delete),
              title: const Text('Delete'),
              onTap: () {
                showDialog(
                  context: context,
                  builder: (ctx) => AlertDialog(
                    title: const Text('Delete Agent'),
                    content: const Text(
                        'Are you sure you want to delete this agent?'),
                    actions: [
                      TextButton(
                        onPressed: () => Navigator.of(ctx).pop(),
                        child: const Text('Cancel'),
                      ),
                      TextButton(
                        onPressed: () {
                          setState(() {
                            widget.agents.remove(agent);
                          });
                          Navigator.of(ctx).pop();
                          Navigator.of(context).pop();
                        },
                        child: const Text('Delete',
                            style: TextStyle(color: Colors.red)),
                      ),
                    ],
                  ),
                );
              },
            ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Agents')),
      body: SingleChildScrollView(
        scrollDirection: Axis.horizontal,
        child: SingleChildScrollView(
          child: DataTable(
            columns: const [
              DataColumn(label: Text('Name')),
              DataColumn(label: Text('Status')),
              DataColumn(label: Text('Email')),
              DataColumn(label: Text('Phone')),
              DataColumn(label: Text('Address')),
              DataColumn(label: Text('Website')),
              DataColumn(label: Text('Logo')),
              DataColumn(label: Text('Active')),
              DataColumn(label: Text('Owner ID')),
              DataColumn(label: Text('Agency ID')),
              DataColumn(label: Text('Theme')),
              DataColumn(label: Text('External ID')),
              DataColumn(label: Text('Settings')),
              DataColumn(label: Text('Integration')),
              DataColumn(label: Text('Last Active')),
              DataColumn(label: Text('Specialities')),
              DataColumn(label: Text('Created At')),
              DataColumn(label: Text('Updated At')),
              DataColumn(label: Text('Deleted At')),
              DataColumn(label: Text('Actions')),
            ],
            rows: _sortedAgents
                .map((agent) => DataRow(
                      cells: [
                        DataCell(Row(
                          children: [
                            if (agent.logoUrl != null &&
                                agent.logoUrl!.isNotEmpty)
                              Padding(
                                padding: const EdgeInsets.only(right: 8),
                                child: CircleAvatar(
                                    backgroundImage:
                                        NetworkImage(agent.logoUrl!),
                                    radius: 16),
                              ),
                            Expanded(
                                child: Text(agent.name,
                                    overflow: TextOverflow.ellipsis)),
                          ],
                        )),
                        DataCell(Text(agent.status.name)),
                        DataCell(Text(agent.email ?? '-')),
                        DataCell(Text(agent.phoneNumber ?? '-')),
                        DataCell(Text(agent.address ?? '-',
                            maxLines: 1, overflow: TextOverflow.ellipsis)),
                        DataCell(Text(agent.website ?? '-',
                            maxLines: 1, overflow: TextOverflow.ellipsis)),
                        DataCell(
                            agent.logoUrl != null && agent.logoUrl!.isNotEmpty
                                ? Tooltip(
                                    message: agent.logoUrl!,
                                    child: const Icon(Icons.image))
                                : const Text('-')),
                        DataCell(Text(agent.isActive ? 'Yes' : 'No')),
                        DataCell(Text(agent.ownerId ?? '-')),
                        DataCell(Text(agent.agencyId ?? '-')),
                        DataCell(Text(agent.agency?.theme ?? '-')),
                        DataCell(Text(agent.externalId ?? '-')),
                        DataCell(Text(agent.settings != null
                            ? agent.settings!.length.toString()
                            : '0')),
                        DataCell(Text(agent.integration != null
                            ? agent.integration!.length.toString()
                            : '0')),
                        DataCell(Text(agent.lastActive != null
                            ? DateFormat('MMM d, y').format(agent.lastActive!)
                            : '-')),
                        DataCell(Text(agent.specialities != null &&
                                agent.specialities!.isNotEmpty
                            ? agent.specialities!.map((s) => s.name).join(', ')
                            : '-')),
                        DataCell(Text(agent.createdAt != null
                            ? DateFormat('MMM d, y').format(agent.createdAt!)
                            : '-')),
                        DataCell(Text(agent.updatedAt != null
                            ? DateFormat('MMM d, y').format(agent.updatedAt!)
                            : '-')),
                        DataCell(Text(agent.deletedAt != null
                            ? DateFormat('MMM d, y').format(agent.deletedAt!)
                            : '-')),
                        DataCell(Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            IconButton(
                              icon: const Icon(Icons.edit),
                              onPressed: () => _showAgentActions(agent),
                            ),
                            IconButton(
                              icon: const Icon(Icons.delete),
                              onPressed: () => _showAgentActions(agent),
                            ),
                          ],
                        )),
                      ],
                    ))
                .toList(),
          ),
        ),
      ),
    );
  }
}

class AgentEditScreen extends StatefulWidget {
  final Agent agent;

  const AgentEditScreen({super.key, required this.agent});

  @override
  State<AgentEditScreen> createState() => _AgentEditScreenState();
}

class _AgentEditScreenState extends State<AgentEditScreen> {
  late TextEditingController _nameController;
  late TextEditingController _emailController;
  late TextEditingController _phoneController;
  late TextEditingController _addressController;
  late TextEditingController _websiteController;
  late TextEditingController _logoUrlController;
  late TextEditingController _bioController;

  AgentStatus? _status;

  @override
  void initState() {
    super.initState();
    final agent = widget.agent;
    _nameController = TextEditingController(text: agent.name);
    _emailController = TextEditingController(text: agent.email ?? '');
    _phoneController = TextEditingController(text: agent.phoneNumber ?? '');
    _addressController = TextEditingController(text: agent.address ?? '');
    _websiteController = TextEditingController(text: agent.website ?? '');
    _logoUrlController = TextEditingController(text: agent.logoUrl ?? '');
    _bioController = TextEditingController(text: agent.bio ?? '');
    _status = agent.status;
  }

  @override
  void dispose() {
    _nameController.dispose();
    _emailController.dispose();
    _phoneController.dispose();
    _addressController.dispose();
    _websiteController.dispose();
    _logoUrlController.dispose();
    _bioController.dispose();
    super.dispose();
  }

  void _save() {
    // Here you would call your update logic/provider
    final updatedAgent = widget.agent.copyWith(
      name: _nameController.text.trim(),
      email: _emailController.text.trim(),
      phoneNumber: _phoneController.text.trim(),
      address: _addressController.text.trim(),
      website: _websiteController.text.trim(),
      logoUrl: _logoUrlController.text.trim(),
      bio: _bioController.text.trim(),
      status: _status,
    );
    Navigator.of(context).pop(updatedAgent);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Edit Agent'),
        actions: [
          IconButton(
            icon: const Icon(Icons.save),
            onPressed: _save,
            tooltip: 'Save',
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            TextField(
              controller: _nameController,
              decoration: const InputDecoration(labelText: 'Name'),
            ),
            TextField(
              controller: _emailController,
              decoration: const InputDecoration(labelText: 'Email'),
            ),
            TextField(
              controller: _phoneController,
              decoration: const InputDecoration(labelText: 'Phone Number'),
            ),
            TextField(
              controller: _addressController,
              decoration: const InputDecoration(labelText: 'Address'),
            ),
            TextField(
              controller: _websiteController,
              decoration: const InputDecoration(labelText: 'Website'),
            ),
            TextField(
              controller: _logoUrlController,
              decoration: const InputDecoration(labelText: 'Logo URL'),
            ),
            TextField(
              controller: _bioController,
              decoration: const InputDecoration(labelText: 'Bio'),
              maxLines: 2,
            ),
            const SizedBox(height: 16),
            DropdownButtonFormField<AgentStatus>(
              value: _status,
              decoration: const InputDecoration(labelText: 'Status'),
              items: AgentStatus.values
                  .map((status) => DropdownMenuItem(
                        value: status,
                        child: Text(status.name.toUpperCase()),
                      ))
                  .toList(),
              onChanged: (value) => setState(() => _status = value),
            ),
            // You can add more fields for agency, specialities, etc. as needed
          ],
        ),
      ),
    );
  }
}
