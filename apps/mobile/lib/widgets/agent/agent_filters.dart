import 'package:flutter/material.dart';
import '../../models/agent.dart'; // Assuming AgentSpecialty enum is here or exported. Replace with actual path if different.

typedef OnAgentFilterChanged = void Function(
    {List<AgentSpecialty>? specialties}); // Use enum type

class AgentFilters extends StatefulWidget {
  // Consider making this generic if you have many enum-based filters
  final List<AgentSpecialty> allSpecialties; // Use enum type
  final OnAgentFilterChanged onFilterChanged;

  const AgentFilters({
    super.key,
    required this.allSpecialties,
    required this.onFilterChanged,
  });

  @override
  State<AgentFilters> createState() => _AgentFiltersState();
}

class _AgentFiltersState extends State<AgentFilters> {
  final Set<AgentSpecialty> _selectedSpecialties = {}; // Use enum type

  void _onSpecialtyTap(AgentSpecialty specialty) {
    // Use enum type
    setState(() {
      if (!_selectedSpecialties.add(specialty)) {
        _selectedSpecialties.remove(specialty);
      }
      widget.onFilterChanged(specialties: _selectedSpecialties.toList());
    });
  }

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      child: Row(
        children: widget.allSpecialties
            .map((spec) => FilterChip(
                  // spec is AgentSpecialty
                  label:
                      Text(spec.name), // Use enum.name for display (Dart 2.15+)
                  selected: _selectedSpecialties.contains(spec),
                  onSelected: (_) => _onSpecialtyTap(spec),
                ))
            .toList(),
      ),
    );
  }
}
