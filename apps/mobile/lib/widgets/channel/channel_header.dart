import 'package:flutter/material.dart';

class ChannelHeader extends StatelessWidget {
  final int channelCount;
  final String? title;
  const ChannelHeader({super.key, required this.channelCount, this.title});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        if (title != null)
          Text(title!, style: Theme.of(context).textTheme.headlineSmall),
        Text('$channelCount channels found', style: Theme.of(context).textTheme.bodyMedium),
      ],
    );
  }
}
