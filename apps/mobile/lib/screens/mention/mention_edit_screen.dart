import 'package:flutter/material.dart';
import '../../models/mention.dart';

class MentionEditScreen extends StatefulWidget {
  final Mention mention;
  const MentionEditScreen({super.key, required this.mention});

  @override
  State<MentionEditScreen> createState() => _MentionEditScreenState();
}

class _MentionEditScreenState extends State<MentionEditScreen> {
  late TextEditingController _contentController;
  late MentionType _type; // Changed from String

  @override
  void initState() {
    super.initState();
    final m = widget.mention;
    // FIXME: 'content' is not defined in the Mention model.
    // Add 'String? content' field to the Mention model.
    _contentController = TextEditingController(text: /* m.content ?? */ '');
    // Explicitly cast m.type to MentionType
    _type = m.type as MentionType;
  }

  @override
  void dispose() {
    _contentController.dispose();
    super.dispose();
  }

  void _save() {
    // FIXME: The Mention.copyWith method does not define named parameters for
    // 'content' and 'type'. These need to be added to the
    // Mention model's copyWith method signature (e.g., content: String?, type: MentionType?).
    final updated = widget.mention.copyWith(
        // content: _contentController.text.trim(),
        // type: _type,
        );
    Navigator.of(context).pop(updated);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Edit Mention'),
        actions: [IconButton(icon: const Icon(Icons.save), onPressed: _save)],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            TextField(
                controller: _contentController,
                decoration: const InputDecoration(labelText: 'Content')),
            DropdownButtonFormField<MentionType>(
              value: _type,
              decoration: const InputDecoration(labelText: 'Type'),
              items: MentionType.values
                  .map((t) => DropdownMenuItem(
                        value: t,
                        child: Text(t.toString().split('.').last),
                      ))
                  .toList(),
              onChanged: (v) => setState(() => _type = v!),
            ),
          ],
        ),
      ),
    );
  }
}

// Assume MentionType enum exists in models/mention.dart:
// enum MentionType { USER, AGENT, SYSTEM }
