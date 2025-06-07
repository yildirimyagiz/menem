import 'package:flutter/material.dart';
import '../../models/favorite.dart';

class FavoriteFilters extends StatefulWidget {
  final void Function({String? userId, FavoriteType? type}) onChanged;
  const FavoriteFilters({super.key, required this.onChanged});

  @override
  State<FavoriteFilters> createState() => _FavoriteFiltersState();
}

class _FavoriteFiltersState extends State<FavoriteFilters> {
  final _userIdController = TextEditingController();
  FavoriteType? _selectedType;

  @override
  void dispose() {
    _userIdController.dispose();
    super.dispose();
  }

  void _onFilterChanged() {
    widget.onChanged(
      userId: _userIdController.text.isEmpty ? null : _userIdController.text,
      type: _selectedType,
    );
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        TextField(
          controller: _userIdController,
          decoration: const InputDecoration(labelText: 'User ID'),
          onChanged: (_) => _onFilterChanged(),
        ),
        DropdownButtonFormField<FavoriteType>(
          value: _selectedType,
          decoration: const InputDecoration(labelText: 'Type'),
          items: FavoriteType.values
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
      ],
    );
  }
}
