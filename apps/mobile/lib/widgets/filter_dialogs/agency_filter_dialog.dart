import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../models/agency.dart';
import '../../providers/agency_provider.dart';

class AgencyFilterDialog extends ConsumerStatefulWidget {
  const AgencyFilterDialog({super.key});

  @override
  ConsumerState<AgencyFilterDialog> createState() => _AgencyFilterDialogState();
}

class _AgencyFilterDialogState extends ConsumerState<AgencyFilterDialog> {
  final Set<AgencyStatus> _selectedStatuses = {};
  bool? _isActive;

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: const Text('Filter Agencies'),
      content: SingleChildScrollView(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildFilterSection(
              'Status',
              AgencyStatus.values,
              _selectedStatuses,
              (status) {
                setState(() {
                  if (_selectedStatuses.contains(status)) {
                    _selectedStatuses.remove(status);
                  } else {
                    _selectedStatuses.add(status);
                  }
                });
              },
            ),
            const SizedBox(height: 16),
            _buildActiveFilter(),
          ],
        ),
      ),
      actions: [
        TextButton(
          onPressed: () {
            Navigator.pop(context);
          },
          child: const Text('Cancel'),
        ),
        TextButton(
          onPressed: () {
            setState(() {
              _selectedStatuses.clear();
              _isActive = null;
            });
          },
          child: const Text('Reset'),
        ),
        ElevatedButton(
          onPressed: () {
            ref.read(agencyListProvider.notifier).filterAgencies(
                  statuses: _selectedStatuses.isEmpty
                      ? null
                      : _selectedStatuses.toList(),
                  isActive: _isActive,
                );
            Navigator.pop(context);
          },
          child: const Text('Apply'),
        ),
      ],
    );
  }

  Widget _buildFilterSection<T>(
    String title,
    List<T> options,
    Set<T> selectedOptions,
    Function(T) onChanged,
  ) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          title,
          style: Theme.of(context).textTheme.titleMedium,
        ),
        const SizedBox(height: 8),
        Wrap(
          spacing: 8,
          runSpacing: 8,
          children: options.map((option) {
            return FilterChip(
              label: Text((option as Enum).name), // Use .name for enums
              selected: selectedOptions.contains(option),
              onSelected: (selected) {
                onChanged(option);
              },
            );
          }).toList(),
        ),
      ],
    );
  }

  Widget _buildActiveFilter() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Active Status',
          style: Theme.of(context).textTheme.titleMedium,
        ),
        const SizedBox(height: 8),
        Wrap(
          spacing: 8,
          runSpacing: 8,
          children: [
            FilterChip(
              label: const Text('Active'),
              selected: _isActive == true,
              onSelected: (selected) {
                setState(() {
                  _isActive = selected ? true : null;
                });
              },
            ),
            FilterChip(
              label: const Text('Inactive'),
              selected: _isActive == false,
              onSelected: (selected) {
                setState(() {
                  _isActive = selected ? false : null;
                });
              },
            ),
          ],
        ),
      ],
    );
  }
}
