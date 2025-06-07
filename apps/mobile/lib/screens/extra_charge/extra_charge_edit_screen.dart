import 'package:flutter/material.dart';
import '../../models/extra_charge.dart';

class ExtraChargeEditScreen extends StatefulWidget {
  final ExtraCharge extraCharge;
  const ExtraChargeEditScreen({super.key, required this.extraCharge});

  @override
  State<ExtraChargeEditScreen> createState() => _ExtraChargeEditScreenState();
}

class _ExtraChargeEditScreenState extends State<ExtraChargeEditScreen> {
  late TextEditingController _nameController;
  late TextEditingController _descriptionController;
  late TextEditingController _iconController;
  late TextEditingController _logoController;
  String? _facilityId;

  @override
  void initState() {
    super.initState();
    final e = widget.extraCharge;
    _nameController = TextEditingController(text: e.name);
    _descriptionController = TextEditingController(text: e.description ?? '');
    _iconController = TextEditingController(text: e.icon ?? '');
    _logoController = TextEditingController(text: e.logo ?? '');
    _facilityId = e.facilityId;
  }

  @override
  void dispose() {
    _nameController.dispose();
    _descriptionController.dispose();
    _iconController.dispose();
    _logoController.dispose();
    super.dispose();
  }

  void _save() {
    final updated = widget.extraCharge.copyWith(
      name: _nameController.text.trim(),
      description: _descriptionController.text.trim().isNotEmpty ? _descriptionController.text.trim() : null,
      icon: _iconController.text.trim().isNotEmpty ? _iconController.text.trim() : null,
      logo: _logoController.text.trim().isNotEmpty ? _logoController.text.trim() : null,
      facilityId: _facilityId,
    );
    Navigator.of(context).pop(updated);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Edit Extra Charge'),
        actions: [IconButton(icon: const Icon(Icons.save), onPressed: _save)],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            TextField(controller: _nameController, decoration: const InputDecoration(labelText: 'Name')),
            TextField(controller: _descriptionController, decoration: const InputDecoration(labelText: 'Description')),
            TextField(controller: _iconController, decoration: const InputDecoration(labelText: 'Icon')),
            TextField(controller: _logoController, decoration: const InputDecoration(labelText: 'Logo')),
            TextField(
              decoration: const InputDecoration(labelText: 'Facility ID'),
              controller: TextEditingController(text: _facilityId ?? ''),
              onChanged: (v) => setState(() => _facilityId = v.trim().isNotEmpty ? v.trim() : null),
            ),
          ],
        ),
      ),
    );
  }
}
