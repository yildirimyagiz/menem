import 'package:flutter/material.dart';
import '../../models/channel.dart';

class ChannelDetails extends StatelessWidget {
  final Channel channel;
  const ChannelDetails({super.key, required this.channel});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(channel.name, style: Theme.of(context).textTheme.titleLarge),
        if (channel.description != null)
          Text(channel.description!),
        // Add more fields as needed
      ],
    );
  }
}
