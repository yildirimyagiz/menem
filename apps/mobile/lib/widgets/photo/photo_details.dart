import 'package:flutter/material.dart';
import '../../models/photo.dart';

class PhotoDetails extends StatelessWidget {
  final Photo photo;
  const PhotoDetails({super.key, required this.photo});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Image.network(photo.url, height: 120, fit: BoxFit.cover),
        if (photo.caption != null)
          Text(photo.caption!),
        // Add more fields as needed
      ],
    );
  }
}
