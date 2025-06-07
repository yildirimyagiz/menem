import 'package:flutter/material.dart';
import '../../models/language.dart';
import '../../widgets/language/language_filters.dart';
import '../../widgets/language/language_header.dart';

class LanguageListScreen extends StatefulWidget {
  final List<Language> languages; // List of Language objects
  // The 'allStatuses' parameter is no longer needed as filtering is by 'isActive' boolean
  const LanguageListScreen({super.key, required this.languages});

  @override
  State<LanguageListScreen> createState() => _LanguageListScreenState();
}

class _LanguageListScreenState extends State<LanguageListScreen> {
  // State to hold the selected 'isActive' filter status (true, false, or null for all)
  bool? _selectedIsActive;
  final bool _isLoading = false;
  String? _error;

  List<Language> get _filteredLanguages {
    // If no filter is selected, return all languages
    if (_selectedIsActive == null) {
      return widget.languages;
    }
    // Filter based on the 'isActive' status
    return widget.languages
        .where((l) => l.isActive == _selectedIsActive)
        .toList();
  }

  void _showLanguageActions(Language language) {
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
      appBar: AppBar(title: const Text('Languages')),
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
                      LanguageHeader(languageCount: _filteredLanguages.length),
                      const SizedBox(height: 8),
                      LanguageFilters(
                        // LanguageFilters now expects an onFilterChanged with 'isActive'
                        onFilterChanged: ({isActive}) =>
                            setState(() => _selectedIsActive = isActive),
                      ),
                      const SizedBox(height: 12),
                      Expanded(
                        child: ListView.separated(
                          itemCount: _filteredLanguages.length,
                          separatorBuilder: (_, __) => const Divider(),
                          itemBuilder: (context, i) {
                            final language = _filteredLanguages[i];
                            return ListTile(
                              leading: Icon(Icons.language,
                                  color: Theme.of(context).colorScheme.primary),
                              title: Text(language.name),
                              trailing: IconButton(
                                icon: const Icon(Icons.more_vert),
                                onPressed: () => _showLanguageActions(language),
                              ),
                              onTap: () => _showLanguageActions(language),
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
