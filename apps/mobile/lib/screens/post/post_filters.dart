import 'package:flutter/material.dart';
import '../../models/post.dart';

class PostFilters extends StatefulWidget {
  final void Function({String? title, PostType? type, PostStatus? status, String? authorId, String? categoryId}) onChanged;
  const PostFilters({super.key, required this.onChanged});

  @override
  State<PostFilters> createState() => _PostFiltersState();
}

class _PostFiltersState extends State<PostFilters> {
  final _titleController = TextEditingController();
  final _authorIdController = TextEditingController();
  final _categoryIdController = TextEditingController();
  PostType? _selectedType;
  PostStatus? _selectedStatus;

  @override
  void dispose() {
    _titleController.dispose();
    _authorIdController.dispose();
    _categoryIdController.dispose();
    super.dispose();
  }

  void _onFilterChanged() {
    widget.onChanged(
      title: _titleController.text.isEmpty ? null : _titleController.text,
      type: _selectedType,
      status: _selectedStatus,
      authorId: _authorIdController.text.isEmpty ? null : _authorIdController.text,
      categoryId: _categoryIdController.text.isEmpty ? null : _categoryIdController.text,
    );
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        TextField(
          controller: _titleController,
          decoration: const InputDecoration(labelText: 'Title'),
          onChanged: (_) => _onFilterChanged(),
        ),
        DropdownButtonFormField<PostType>(
          value: _selectedType,
          decoration: const InputDecoration(labelText: 'Type'),
          items: PostType.values
              .map((type) => DropdownMenuItem(
                    value: type,
                    child: Text(type.toString().split('.').last),
                  ))
              .toList(),
          onChanged: (type) {
            setState(() => _selectedType = type);
            _onFilterChanged();
          },
        ),
        DropdownButtonFormField<PostStatus>(
          value: _selectedStatus,
          decoration: const InputDecoration(labelText: 'Status'),
          items: PostStatus.values
              .map((status) => DropdownMenuItem(
                    value: status,
                    child: Text(status.toString().split('.').last),
                  ))
              .toList(),
          onChanged: (status) {
            setState(() => _selectedStatus = status);
            _onFilterChanged();
          },
        ),
        TextField(
          controller: _authorIdController,
          decoration: const InputDecoration(labelText: 'Author ID'),
          onChanged: (_) => _onFilterChanged(),
        ),
        TextField(
          controller: _categoryIdController,
          decoration: const InputDecoration(labelText: 'Category ID'),
          onChanged: (_) => _onFilterChanged(),
        ),
      ],
    );
  }
}
