import 'package:flutter/material.dart';
import '../../models/reservation.dart';

typedef OnReservationFilterChanged = void Function({
  List<ReservationType>? types,
  List<ReservationStatus>? statuses,
});

class ReservationFilters extends StatefulWidget {
  final List<ReservationType> allTypes;
  final List<ReservationStatus> allStatuses;
  final OnReservationFilterChanged onFilterChanged;

  const ReservationFilters({
    super.key,
    required this.allTypes,
    required this.allStatuses,
    required this.onFilterChanged,
  });

  @override
  State<ReservationFilters> createState() => _ReservationFiltersState();
}

class _ReservationFiltersState extends State<ReservationFilters> {
  final Set<ReservationType> _selectedTypes = {};
  final Set<ReservationStatus> _selectedStatuses = {};

  void _onTypeTap(ReservationType type) {
    setState(() {
      if (!_selectedTypes.add(type)) _selectedTypes.remove(type);
      widget.onFilterChanged(
        types: _selectedTypes.toList(),
        statuses: _selectedStatuses.toList(),
      );
    });
  }

  void _onStatusTap(ReservationStatus status) {
    setState(() {
      if (!_selectedStatuses.add(status)) _selectedStatuses.remove(status);
      widget.onFilterChanged(
        types: _selectedTypes.toList(),
        statuses: _selectedStatuses.toList(),
      );
    });
  }

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      child: Row(
        children: [
          ...widget.allTypes.map((type) => FilterChip(
                label: Text(type.name),
                selected: _selectedTypes.contains(type),
                onSelected: (_) => _onTypeTap(type),
              )),
          ...widget.allStatuses.map((status) => FilterChip(
                label: Text(status.name),
                selected: _selectedStatuses.contains(status),
                onSelected: (_) => _onStatusTap(status),
              )),
        ],
      ),
    );
  }
}
