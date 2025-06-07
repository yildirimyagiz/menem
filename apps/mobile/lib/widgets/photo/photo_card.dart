import 'package:flutter/material.dart';
import '../../models/photo.dart';
import 'photo_details.dart';

class PhotoCard extends StatelessWidget {
  final Photo photo;
  final VoidCallback? onTap;

  const PhotoCard({super.key, required this.photo, this.onTap});

  @override
  Widget build(BuildContext context) {
    return Card(
      child: InkWell(
        onTap: onTap,
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: PhotoDetails(photo: photo),
        ),
      ),
    );
  }
}
