import 'package:flutter/material.dart';

class PhotoHeader extends StatelessWidget {
  final int photoCount;
  final String? title;
  const PhotoHeader({super.key, required this.photoCount, this.title});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        if (title != null)
          Text(title!, style: Theme.of(context).textTheme.headlineSmall),
        Text('$photoCount photos found', style: Theme.of(context).textTheme.bodyMedium),
      ],
    );
  }
}
