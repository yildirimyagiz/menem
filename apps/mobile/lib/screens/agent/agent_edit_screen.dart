import 'package:flutter/material.dart';
import '../../models/agent.dart';

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
  late TextEditingController _agencyIdController;
  late TextEditingController _ownerIdController;
  late TextEditingController _externalIdController;
  late TextEditingController _settingsController;
  late TextEditingController _integrationController;
  AgentStatus? _status;
  DateTime? _lastActive;
  List<AgentSpecialty> _selectedSpecialities = [];

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
    _agencyIdController = TextEditingController(text: agent.agencyId ?? '');
    _ownerIdController = TextEditingController(text: agent.ownerId ?? '');
    _externalIdController = TextEditingController(text: agent.externalId ?? '');
    _settingsController = TextEditingController(
        text: agent.settings != null ? agent.settings.toString() : '');
    _integrationController = TextEditingController(
        text: agent.integration != null ? agent.integration.toString() : '');
    _status = agent.status;
    _lastActive = agent.lastActive;
    _selectedSpecialities = List<AgentSpecialty>.from(agent.specialities ?? []);
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
    _agencyIdController.dispose();
    _ownerIdController.dispose();
    _externalIdController.dispose();
    _settingsController.dispose();
    _integrationController.dispose();
    super.dispose();
  }

  void _save() {
    // For settings/integration, a real implementation would parse JSON.
    final updatedAgent = widget.agent.copyWith(
      name: _nameController.text.trim(),
      email: _emailController.text.trim().isNotEmpty
          ? _emailController.text.trim()
          : null,
      emailExplicitNull: _emailController.text.trim().isEmpty,
      phoneNumber: _phoneController.text.trim().isNotEmpty
          ? _phoneController.text.trim()
          : null,
      phoneNumberExplicitNull: _phoneController.text.trim().isEmpty,
      address: _addressController.text.trim().isNotEmpty
          ? _addressController.text.trim()
          : null,
      addressExplicitNull: _addressController.text.trim().isEmpty,
      website: _websiteController.text.trim().isNotEmpty
          ? _websiteController.text.trim()
          : null,
      websiteExplicitNull: _websiteController.text.trim().isEmpty,
      logoUrl: _logoUrlController.text.trim().isNotEmpty
          ? _logoUrlController.text.trim()
          : null,
      logoUrlExplicitNull: _logoUrlController.text.trim().isEmpty,
      bio: _bioController.text.trim().isNotEmpty
          ? _bioController.text.trim()
          : null,
      bioExplicitNull: _bioController.text.trim().isEmpty,
      status: _status,
      agencyId: _agencyIdController.text.trim().isNotEmpty
          ? _agencyIdController.text.trim()
          : null,
      agencyIdExplicitNull: _agencyIdController.text.trim().isEmpty,
      ownerId: _ownerIdController.text.trim().isNotEmpty
          ? _ownerIdController.text.trim()
          : null,
      ownerIdExplicitNull: _ownerIdController.text.trim().isEmpty,
      externalId: _externalIdController.text.trim().isNotEmpty
          ? _externalIdController.text.trim()
          : null,
      externalIdExplicitNull: _externalIdController.text.trim().isEmpty,
      settings: _settingsController.text.isNotEmpty
          ? {'data': _settingsController.text}
          : null,
      settingsExplicitNull: _settingsController.text.isEmpty,
      integration: _integrationController.text.isNotEmpty
          ? {'data': _integrationController.text}
          : null,
      integrationExplicitNull: _integrationController.text.isEmpty,
      lastActive: _lastActive,
      // If you want to allow explicit nulling of lastActive, add a UI control and set lastActiveExplicitNull accordingly
      specialities:
          _selectedSpecialities.isNotEmpty ? _selectedSpecialities : null,
      specialitiesExplicitNull: _selectedSpecialities.isEmpty,
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
            TextField(
              controller: _agencyIdController,
              decoration: const InputDecoration(labelText: 'Agency ID'),
            ),
            TextField(
              controller: _ownerIdController,
              decoration: const InputDecoration(labelText: 'Owner ID'),
            ),
            TextField(
              controller: _externalIdController,
              decoration: const InputDecoration(labelText: 'External ID'),
            ),
            TextField(
              controller: _settingsController,
              decoration:
                  const InputDecoration(labelText: 'Settings (JSON string)'),
            ),
            TextField(
              controller: _integrationController,
              decoration:
                  const InputDecoration(labelText: 'Integration (JSON string)'),
            ),
            const SizedBox(height: 16),
            // Multi-select for specialities
            Text('Specialities',
                style: Theme.of(context).textTheme.titleMedium),
            Wrap(
              spacing: 8.0,
              children: AgentSpecialty.values.map((spec) {
                final selected = _selectedSpecialities.contains(spec);
                return FilterChip(
                  label: Text(spec.name),
                  selected: selected,
                  onSelected: (val) {
                    setState(() {
                      if (val) {
                        _selectedSpecialities.add(spec);
                      } else {
                        _selectedSpecialities.remove(spec);
                      }
                    });
                  },
                );
              }).toList(),
            ),
            const SizedBox(height: 16),
            // Date picker for lastActive
            Row(
              children: [
                const Text('Last Active: '),
                Text(_lastActive != null
                    ? _lastActive!.toLocal().toString().split(' ')[0]
                    : 'Not set'),
                IconButton(
                  icon: const Icon(Icons.calendar_today),
                  onPressed: () async {
                    final picked = await showDatePicker(
                      context: context,
                      initialDate: _lastActive ?? DateTime.now(),
                      firstDate: DateTime(2000),
                      lastDate: DateTime(2100),
                    );
                    if (picked != null) {
                      setState(() => _lastActive = picked);
                    }
                  },
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
