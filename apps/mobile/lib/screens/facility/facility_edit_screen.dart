import 'package:flutter/material.dart';
import '../../models/facility.dart';

class FacilityEditScreen extends StatefulWidget {
  final Facility facility;
  const FacilityEditScreen({super.key, required this.facility});

  @override
  State<FacilityEditScreen> createState() => _FacilityEditScreenState();
}

class _FacilityEditScreenState extends State<FacilityEditScreen> {
  late TextEditingController _nameController;
  late TextEditingController _descriptionController;
  late TextEditingController _iconController;
  late TextEditingController _logoController;
  late TextEditingController _locationIdController;
  FacilityType? _type;
  FacilityStatus? _status;

  @override
  void initState() {
    super.initState();
    final f = widget.facility;
    // Assuming f.name is non-nullable based on dead_null_aware_expression
    _nameController = TextEditingController(text: f.name);
    _descriptionController = TextEditingController(text: f.description);
    _iconController = TextEditingController(text: f.icon ?? '');
    _logoController = TextEditingController(text: f.logo ?? '');
    _locationIdController = TextEditingController(text: f.locationId ?? '');
    _type = f.type; // Assuming f.type is FacilityType and non-nullable
    _status = f.status; // Assuming f.status is FacilityStatus and non-nullable
  }

  @override
  void dispose() {
    _nameController.dispose();
    _descriptionController.dispose();
    _iconController.dispose();
    _logoController.dispose();
    _locationIdController.dispose();
    super.dispose();
  }

  void _save() {
    final updated = widget.facility.copyWith(
      name: _nameController.text.trim(),
      description: _descriptionController.text.trim().isNotEmpty
          ? _descriptionController.text.trim()
          : null,
      icon: _iconController.text.trim().isNotEmpty
          ? _iconController.text.trim()
          : null,
      logo: _logoController.text.trim().isNotEmpty
          ? _logoController.text.trim()
          : null,
      locationId: _locationIdController.text.trim().isNotEmpty
          ? _locationIdController.text.trim()
          : null,
      type: _type, // Will pass FacilityType?
      status: _status, // Will pass FacilityStatus?
    );
    Navigator.of(context).pop(updated);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Edit Facility'),
        actions: [IconButton(icon: const Icon(Icons.save), onPressed: _save)],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            TextField(
                controller: _nameController,
                decoration: const InputDecoration(labelText: 'Name')),
            TextField(
                controller: _descriptionController,
                decoration: const InputDecoration(labelText: 'Description')),
            TextField(
                controller: _iconController,
                decoration: const InputDecoration(labelText: 'Icon')),
            TextField(
                controller: _logoController,
                decoration: const InputDecoration(labelText: 'Logo')),
            TextField(
                controller: _locationIdController,
                decoration: const InputDecoration(labelText: 'Location ID')),
            DropdownButtonFormField<FacilityType>(
              value: _type,
              decoration: const InputDecoration(labelText: 'Type'),
              items: FacilityType.values // Assuming FacilityType is an enum
                  .map((t) => DropdownMenuItem(
                        value: t,
                        child: Text(
                            t.toString().split('.').last), // Display enum name
                      ))
                  .toList(),
              onChanged: (v) => setState(() => _type = v),
            ),
            DropdownButtonFormField<FacilityStatus>(
              // Corrected for _status as well
              value: _status,
              decoration: const InputDecoration(labelText: 'Status'),
              items: FacilityStatus.values // Assuming FacilityStatus is an enum
                  .map((s) => DropdownMenuItem(
                        value: s,
                        child: Text(
                            s.toString().split('.').last), // Display enum name
                      ))
                  .toList(),
              onChanged: (v) => setState(() => _status = v),
            ),
          ],
        ),
      ),
    );
  }
}
