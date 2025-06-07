import 'package:flutter/material.dart';
import '../../models/hashtag.dart';

class HashtagFilters extends StatefulWidget {
  final void Function({String? name, HashtagType? type, bool? isTrending}) onChanged;
  const HashtagFilters({super.key, required this.onChanged});

  @override
  State<HashtagFilters> createState() => _HashtagFiltersState();
}

class _HashtagFiltersState extends State<HashtagFilters> {
  final _nameController = TextEditingController();
  HashtagType? _selectedType;
  bool? _isTrending;

  @override
  void dispose() {
    _nameController.dispose();
    super.dispose();
  }

  void _onFilterChanged() {
    widget.onChanged(
      name: _nameController.text.isEmpty ? null : _nameController.text,
      type: _selectedType,
      isTrending: _isTrending,
    );
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        TextField(
          controller: _nameController,
          decoration: const InputDecoration(labelText: 'Name'),
          onChanged: (_) => _onFilterChanged(),
        ),
        DropdownButtonFormField<HashtagType>(
          value: _selectedType,
          decoration: const InputDecoration(labelText: 'Type'),
          items: HashtagType.values
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
        DropdownButtonFormField<bool>(
          value: _isTrending,
          decoration: const InputDecoration(labelText: 'Trending'),
          items: const [
            DropdownMenuItem(value: null, child: Text('Any')),
            DropdownMenuItem(value: true, child: Text('Trending')),
            DropdownMenuItem(value: false, child: Text('Not Trending')),
          ],
          onChanged: (val) {
            setState(() => _isTrending = val);
            _onFilterChanged();
          },
        ),
      ],
    );
  }
}
