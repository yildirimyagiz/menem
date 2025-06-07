import 'package:flutter/material.dart';
import '../../models/guest.dart';

class GuestEditScreen extends StatefulWidget {
  final Guest guest;
  const GuestEditScreen({super.key, required this.guest});

  @override
  State<GuestEditScreen> createState() => _GuestEditScreenState();
}

class _GuestEditScreenState extends State<GuestEditScreen> {
  late TextEditingController _nameController;
  late TextEditingController _emailController;
  late TextEditingController _phoneController;

  @override
  void initState() {
    super.initState();
    final g = widget.guest;
    _nameController = TextEditingController(text: g.name ?? '');
    _emailController = TextEditingController(text: g.email ?? '');
    _phoneController = TextEditingController(text: g.phone ?? '');
  }

  @override
  void dispose() {
    _nameController.dispose();
    _emailController.dispose();
    _phoneController.dispose();
    super.dispose();
  }

  void _save() {
    final updated = widget.guest.copyWith(
      // FIXME: The following parameters (name, phone)
      // are reported as undefined in the Guest.copyWith() method.
      // They need to be added to the Guest model's copyWith method
      // signature to allow updating these fields.
      // name: _nameController.text.trim(),
      email: _emailController.text.trim(),
      // phone: _phoneController.text.trim(),
    );
    Navigator.of(context).pop(updated);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Edit Guest'),
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
                controller: _emailController,
                decoration: const InputDecoration(labelText: 'Email')),
            TextField(
                controller: _phoneController,
                decoration: const InputDecoration(labelText: 'Phone')),
          ],
        ),
      ),
    );
  }
}
