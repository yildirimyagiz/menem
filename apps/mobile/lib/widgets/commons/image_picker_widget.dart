import 'package:flutter/material.dart';

class ImagePickerWidget extends StatelessWidget {
  final String? imageUrl;
  final VoidCallback onPickImage;
  final bool isLoading;

  const ImagePickerWidget({
    super.key,
    this.imageUrl,
    required this.onPickImage,
    this.isLoading = false,
  });

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        Container(
          width: 150,
          height: 150,
          decoration: BoxDecoration(
            color: Colors.grey[200],
            borderRadius: BorderRadius.circular(8),
          ),
          child: imageUrl != null
              ? ClipRRect(
                  borderRadius: BorderRadius.circular(8),
                  child: Image.network(
                    imageUrl!,
                    fit: BoxFit.cover,
                    errorBuilder: (context, error, stackTrace) {
                      return const Center(
                        child: Icon(
                          Icons.error_outline,
                          color: Colors.red,
                          size: 32,
                        ),
                      );
                    },
                  ),
                )
              : const Center(
                  child: Icon(
                    Icons.add_photo_alternate,
                    size: 48,
                    color: Colors.grey,
                  ),
                ),
        ),
        if (isLoading)
          Container(
            width: 150,
            height: 150,
            decoration: BoxDecoration(
              color: Colors.black.withAlpha((0.5 * 255).toInt()),
              borderRadius: BorderRadius.circular(8),
            ),
            child: const Center(
              child: CircularProgressIndicator(
                valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
              ),
            ),
          ),
        Positioned(
          right: 0,
          bottom: 0,
          child: Container(
            decoration: BoxDecoration(
              color: Theme.of(context).primaryColor,
              shape: BoxShape.circle,
            ),
            child: IconButton(
              icon: const Icon(
                Icons.camera_alt,
                color: Colors.white,
              ),
              onPressed: isLoading ? null : onPickImage,
            ),
          ),
        ),
      ],
    );
  }
}
