import 'package:flutter/material.dart';
import '../../models/favorite.dart';

class FavoriteEditScreen extends StatefulWidget {
  final Favorite favorite;
  const FavoriteEditScreen({super.key, required this.favorite});

  @override
  State<FavoriteEditScreen> createState() => _FavoriteEditScreenState();
}

class _FavoriteEditScreenState extends State<FavoriteEditScreen> {
  late TextEditingController _nameController;
  late TextEditingController _descriptionController;

  @override
  void initState() {
    super.initState();
    _nameController = TextEditingController(text: widget.favorite.name ?? '');
    _descriptionController =
        TextEditingController(text: widget.favorite.description ?? '');
  }

  @override
  void dispose() {
    _nameController.dispose();
    _descriptionController.dispose();
    super.dispose();
  }

  void _save() {
    final updated = widget.favorite.copyWith(
      name: _nameController.text.trim(),
      description: _descriptionController.text.trim().isNotEmpty
          ? _descriptionController.text.trim()
          : null,
    );
    Navigator.of(context).pop(updated);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Edit Favorite'),
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
          ],
        ),
      ),
    );
  }
}
