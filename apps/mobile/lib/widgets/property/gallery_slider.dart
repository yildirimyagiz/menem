import 'package:flutter/material.dart';

class GallerySlider extends StatelessWidget {
  final List<String> imageUrls;
  final double aspectRatio;
  final double height;

  const GallerySlider({
    super.key,
    required this.imageUrls,
    this.aspectRatio = 16 / 9,
    this.height = 200,
  });

  @override
  Widget build(BuildContext context) {
    if (imageUrls.isEmpty) {
      return Container(
        height: height,
        color: Colors.grey[300],
        child: const Icon(Icons.image, size: 48, color: Colors.grey),
      );
    }
    return SizedBox(
      height: height,
      child: PageView.builder(
        itemCount: imageUrls.length,
        itemBuilder: (context, index) {
          return AspectRatio(
            aspectRatio: aspectRatio,
            child: Image.network(
              imageUrls[index],
              fit: BoxFit.cover,
              errorBuilder: (context, error, stackTrace) => Container(
                color: Colors.grey[300],
                child: const Icon(Icons.broken_image, size: 48, color: Colors.grey),
              ),
            ),
          );
        },
      ),
    );
  }
}
