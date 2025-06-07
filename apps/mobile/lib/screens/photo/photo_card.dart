import 'package:flutter/material.dart';
import '../../models/photo.dart';

class PhotoCard extends StatelessWidget {
  final Photo photo;
  final VoidCallback? onTap;
  const PhotoCard({super.key, required this.photo, this.onTap});

  @override
  Widget build(BuildContext context) {
    return Card(
      child: ListTile(
        onTap: onTap,
        leading: photo.url.isNotEmpty ? Image.network(photo.url, width: 48, height: 48, fit: BoxFit.cover) : const Icon(Icons.image),
        title: Text(photo.type),
        subtitle: photo.caption != null ? Text(photo.caption!) : null,
        trailing: photo.featured ? const Icon(Icons.star, color: Colors.amber) : null,
      ),
    );
  }
}
