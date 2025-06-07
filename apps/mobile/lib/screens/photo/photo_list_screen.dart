import 'package:flutter/material.dart';
import '../../models/photo.dart';
import '../../widgets/photo/photo_filters.dart';
import '../../widgets/photo/photo_header.dart';

class PhotoListScreen extends StatefulWidget {
  final List<Photo> photos;
  final List<String> allTypes;
  const PhotoListScreen(
      {super.key, required this.photos, required this.allTypes});

  @override
  State<PhotoListScreen> createState() => _PhotoListScreenState();
}

class _PhotoListScreenState extends State<PhotoListScreen> {
  List<String>? _selectedTypes;
  final bool _isLoading = false;
  String? _error;

  List<Photo> get _filteredPhotos {
    if (_selectedTypes == null || _selectedTypes!.isEmpty) return widget.photos;
    return widget.photos
        .where((p) => _selectedTypes!.contains(p.type))
        .toList();
  }

  void _showPhotoActions(Photo photo) {
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
              leading: const Icon(Icons.download),
              title: const Text('Download'),
              onTap: () {
                // TODO: Implement download
                Navigator.pop(context);
              },
            ),
            ListTile(
              leading: const Icon(Icons.delete),
              title: const Text('Delete'),
              onTap: () {
                // TODO: Implement delete
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
      appBar: AppBar(title: const Text('Photos')),
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
                      PhotoHeader(photoCount: _filteredPhotos.length),
                      const SizedBox(height: 8),
                      PhotoFilters(
                        allTypes: widget.allTypes,
                        onFilterChanged: ({types}) =>
                            setState(() => _selectedTypes = types),
                      ),
                      const SizedBox(height: 12),
                      Expanded(
                        child: ListView.separated(
                          itemCount: _filteredPhotos.length,
                          separatorBuilder: (_, __) => const Divider(),
                          itemBuilder: (context, i) {
                            final photo = _filteredPhotos[i];
                            return ListTile(
                              leading: photo.url.isNotEmpty
                                  ? Image.network(photo.url,
                                      width: 48, height: 48, fit: BoxFit.cover)
                                  : const Icon(Icons.photo),
                              title: Text(photo.caption ?? 'Untitled'),
                              subtitle: Text(photo.type),
                              trailing: IconButton(
                                icon: const Icon(Icons.more_vert),
                                onPressed: () => _showPhotoActions(photo),
                              ),
                              onTap: () => _showPhotoActions(photo),
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
