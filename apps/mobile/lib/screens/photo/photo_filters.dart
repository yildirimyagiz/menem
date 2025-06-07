import 'package:flutter/material.dart';

class PhotoFilters extends StatefulWidget {
  final void Function({String? type, bool? featured, String? userId, String? agencyId, String? propertyId, String? agentId, String? postId}) onChanged;
  const PhotoFilters({super.key, required this.onChanged});

  @override
  State<PhotoFilters> createState() => _PhotoFiltersState();
}

class _PhotoFiltersState extends State<PhotoFilters> {
  final _typeController = TextEditingController();
  final _userIdController = TextEditingController();
  final _agencyIdController = TextEditingController();
  final _propertyIdController = TextEditingController();
  final _agentIdController = TextEditingController();
  final _postIdController = TextEditingController();
  bool? _featured;

  @override
  void dispose() {
    _typeController.dispose();
    _userIdController.dispose();
    _agencyIdController.dispose();
    _propertyIdController.dispose();
    _agentIdController.dispose();
    _postIdController.dispose();
    super.dispose();
  }

  void _onFilterChanged() {
    widget.onChanged(
      type: _typeController.text.isEmpty ? null : _typeController.text,
      featured: _featured,
      userId: _userIdController.text.isEmpty ? null : _userIdController.text,
      agencyId: _agencyIdController.text.isEmpty ? null : _agencyIdController.text,
      propertyId: _propertyIdController.text.isEmpty ? null : _propertyIdController.text,
      agentId: _agentIdController.text.isEmpty ? null : _agentIdController.text,
      postId: _postIdController.text.isEmpty ? null : _postIdController.text,
    );
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        TextField(
          controller: _typeController,
          decoration: const InputDecoration(labelText: 'Type'),
          onChanged: (_) => _onFilterChanged(),
        ),
        Row(
          children: [
            const Text('Featured'),
            Checkbox(
              value: _featured ?? false,
              tristate: true,
              onChanged: (value) {
                setState(() => _featured = value);
                _onFilterChanged();
              },
            ),
          ],
        ),
        TextField(
          controller: _userIdController,
          decoration: const InputDecoration(labelText: 'User ID'),
          onChanged: (_) => _onFilterChanged(),
        ),
        TextField(
          controller: _agencyIdController,
          decoration: const InputDecoration(labelText: 'Agency ID'),
          onChanged: (_) => _onFilterChanged(),
        ),
        TextField(
          controller: _propertyIdController,
          decoration: const InputDecoration(labelText: 'Property ID'),
          onChanged: (_) => _onFilterChanged(),
        ),
        TextField(
          controller: _agentIdController,
          decoration: const InputDecoration(labelText: 'Agent ID'),
          onChanged: (_) => _onFilterChanged(),
        ),
        TextField(
          controller: _postIdController,
          decoration: const InputDecoration(labelText: 'Post ID'),
          onChanged: (_) => _onFilterChanged(),
        ),
      ],
    );
  }
}
