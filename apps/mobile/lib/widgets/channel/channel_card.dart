import 'package:flutter/material.dart';
import '../../models/channel.dart';
import 'channel_details.dart';

class ChannelCard extends StatelessWidget {
  final Channel channel;
  final VoidCallback? onTap;

  const ChannelCard({super.key, required this.channel, this.onTap});

  @override
  Widget build(BuildContext context) {
    return Card(
      child: InkWell(
        onTap: onTap,
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: ChannelDetails(channel: channel),
        ),
      ),
    );
  }
}
