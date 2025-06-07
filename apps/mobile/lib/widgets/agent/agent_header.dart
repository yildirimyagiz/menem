import 'package:flutter/material.dart';

class AgentHeader extends StatelessWidget {
  final int agentCount;
  final String? title;
  const AgentHeader({super.key, required this.agentCount, this.title});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        if (title != null)
          Text(title!, style: Theme.of(context).textTheme.headlineSmall),
        Text('$agentCount agents found', style: Theme.of(context).textTheme.bodyMedium),
      ],
    );
  }
}
