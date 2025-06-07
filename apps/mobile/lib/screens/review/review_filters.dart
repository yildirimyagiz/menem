import 'package:flutter/material.dart';
import '../../models/review.dart';

class ReviewFilters extends StatefulWidget {
  final void Function({String? userId, String? entityId, ReviewType? type, ReviewStatus? status, int? rating}) onChanged;
  const ReviewFilters({super.key, required this.onChanged});

  @override
  State<ReviewFilters> createState() => _ReviewFiltersState();
}

class _ReviewFiltersState extends State<ReviewFilters> {
  final _userIdController = TextEditingController();
  final _entityIdController = TextEditingController();
  ReviewType? _selectedType;
  ReviewStatus? _selectedStatus;
  int? _selectedRating;

  @override
  void dispose() {
    _userIdController.dispose();
    _entityIdController.dispose();
    super.dispose();
  }

  void _onFilterChanged() {
    widget.onChanged(
      userId: _userIdController.text.isEmpty ? null : _userIdController.text,
      entityId: _entityIdController.text.isEmpty ? null : _entityIdController.text,
      type: _selectedType,
      status: _selectedStatus,
      rating: _selectedRating,
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
        TextField(
          controller: _entityIdController,
          decoration: const InputDecoration(labelText: 'Entity ID'),
          onChanged: (_) => _onFilterChanged(),
        ),
        DropdownButtonFormField<ReviewType>(
          value: _selectedType,
          decoration: const InputDecoration(labelText: 'Type'),
          items: ReviewType.values
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
        DropdownButtonFormField<ReviewStatus>(
          value: _selectedStatus,
          decoration: const InputDecoration(labelText: 'Status'),
          items: ReviewStatus.values
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
        DropdownButtonFormField<int>(
          value: _selectedRating,
          decoration: const InputDecoration(labelText: 'Rating'),
          items: List.generate(5, (i) => i + 1)
              .map((rating) => DropdownMenuItem(
                    value: rating,
                    child: Text(rating.toString()),
                  ))
              .toList(),
          onChanged: (rating) {
            setState(() => _selectedRating = rating);
            _onFilterChanged();
          },
        ),
      ],
    );
  }
}
