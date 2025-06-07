import 'package:flutter/material.dart';
import '../../models/tax_record.dart';
import '../../widgets/tax_record/tax_record_filters.dart';
import '../../widgets/tax_record/tax_record_header.dart';

class TaxRecordListScreen extends StatefulWidget {
  final List<TaxRecord> taxRecords;
  final List<String> allYears;
  const TaxRecordListScreen(
      {super.key, required this.taxRecords, required this.allYears});

  @override
  State<TaxRecordListScreen> createState() => _TaxRecordListScreenState();
}

class _TaxRecordListScreenState extends State<TaxRecordListScreen> {
  List<String>? _selectedYears;

  List<TaxRecord> get _filteredTaxRecords {
    if (_selectedYears == null || _selectedYears!.isEmpty) {
      return widget.taxRecords;
    }
    return widget.taxRecords
        .where((r) => _selectedYears!.contains(r.year))
        .toList();
  }

  bool _isLoading = false;
  String? _error;

  Future<void> _downloadDocument(TaxRecord record) async {
    setState(() {
      _isLoading = true;
      _error = null;
    });
    try {
      await Future.delayed(const Duration(seconds: 1));
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Downloaded tax document.')),
      );
    } catch (e) {
      setState(() {
        _error = 'Failed to download: $e';
      });
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Tax Records')),
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
                      TaxRecordHeader(
                          taxRecordCount: _filteredTaxRecords.length),
                      const SizedBox(height: 8),
                      TaxRecordFilters(
                        allYears: widget.allYears,
                        onFilterChanged: ({years}) =>
                            setState(() => _selectedYears = years),
                      ),
                      const SizedBox(height: 12),
                      Expanded(
                        child: ListView.separated(
                          itemCount: _filteredTaxRecords.length,
                          separatorBuilder: (_, __) => const Divider(),
                          itemBuilder: (context, i) {
                            final record = _filteredTaxRecords[i];
                            return ListTile(
                              leading: Icon(Icons.receipt_long,
                                  color: Theme.of(context).colorScheme.primary),
                              title: Text('Year: ${record.year}'),
                              subtitle: Text('Amount: ${record.amount}'),
                              trailing: record.documentUrl != null
                                  ? IconButton(
                                      icon: const Icon(Icons.download),
                                      onPressed: () =>
                                          _downloadDocument(record),
                                    )
                                  : null,
                              onTap: () {
                                // Optionally show details
                              },
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
