import 'package:flutter/material.dart';
import '../../models/hashtag.dart';

class HashtagEditScreen extends StatefulWidget {
  final Hashtag hashtag;
  const HashtagEditScreen({super.key, required this.hashtag});

  @override
  State<HashtagEditScreen> createState() => _HashtagEditScreenState();
}

class _HashtagEditScreenState extends State<HashtagEditScreen> {
  late TextEditingController _nameController;
  late TextEditingController _countController;

  @override
  void initState() {
    super.initState();
    final h = widget.hashtag;
    _nameController = TextEditingController(text: h.name);
    _countController = TextEditingController(text: h.count?.toString() ?? '');
  }

  @override
  void dispose() {
    _nameController.dispose();
    _countController.dispose();
    super.dispose();
  }

  void _save() {
    final updated = widget.hashtag.copyWith(
      name: _nameController.text.trim(),
      count: int.tryParse(_countController.text.trim()),
    );
    Navigator.of(context).pop(updated);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Edit Hashtag'),
        actions: [IconButton(icon: const Icon(Icons.save), onPressed: _save)],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            TextField(controller: _nameController, decoration: const InputDecoration(labelText: 'Name')),
            TextField(controller: _countController, decoration: const InputDecoration(labelText: 'Count'), keyboardType: TextInputType.number),
          ],
        ),
      ),
    );
  }
}
