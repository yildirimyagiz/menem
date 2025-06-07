import 'package:flutter/material.dart';
import '../../models/included_service.dart';
import '../../widgets/included_service/included_service_filters.dart';
import '../../widgets/included_service/included_service_header.dart';

class IncludedServiceListScreen extends StatefulWidget {
  final List<IncludedService> includedServices;
  final List<String> allNames;
  const IncludedServiceListScreen(
      {super.key, required this.includedServices, required this.allNames});

  @override
  State<IncludedServiceListScreen> createState() =>
      _IncludedServiceListScreenState();
}

class _IncludedServiceListScreenState extends State<IncludedServiceListScreen> {
  List<String>? _selectedNames;
  final bool _isLoading = false;
  String? _error;

  List<IncludedService> get _filteredIncludedServices {
    if (_selectedNames == null || _selectedNames!.isEmpty) {
      return widget.includedServices;
    }
    return widget.includedServices
        .where((s) => _selectedNames!.contains(s.name))
        .toList();
  }

  void _showServiceActions(IncludedService service) {
    showModalBottomSheet(
      context: context,
      builder: (context) => SafeArea(
        child: Wrap(
          children: [
            ListTile(
              leading: const Icon(Icons.visibility),
              title: const Text('View'),
              onTap: () {
                // TODO: Implement view
                Navigator.pop(context);
              },
            ),
            ListTile(
              leading: const Icon(Icons.edit),
              title: const Text('Edit'),
              onTap: () {
                // TODO: Implement edit
                Navigator.pop(context);
              },
            ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Included Services')),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : _error != null
              ? Center(
                  child: Text(_error!,
                      style: TextStyle(
                          color: Theme.of(context).colorScheme.error)))
              : Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      IncludedServiceHeader(
                          includedServiceCount:
                              _filteredIncludedServices.length),
                      const SizedBox(height: 8),
                      IncludedServiceFilters(
                        allNames: widget.allNames,
                        onFilterChanged: ({names}) =>
                            setState(() => _selectedNames = names),
                      ),
                      const SizedBox(height: 12),
                      Expanded(
                        child: ListView.separated(
                          itemCount: _filteredIncludedServices.length,
                          separatorBuilder: (_, __) => const Divider(),
                          itemBuilder: (context, i) {
                            final service = _filteredIncludedServices[i];
                            return ListTile(
                              leading: Icon(Icons.check_circle,
                                  color: Theme.of(context).colorScheme.primary),
                              title: Text(service.name),
                              trailing: IconButton(
                                icon: const Icon(Icons.more_vert),
                                onPressed: () => _showServiceActions(service),
                              ),
                              onTap: () => _showServiceActions(service),
                            );
                          },
                        ),
                      ),
                    ],
                  ),
                ),
    );
  }
}
