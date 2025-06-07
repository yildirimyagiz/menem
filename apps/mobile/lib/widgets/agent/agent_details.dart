import 'package:flutter/material.dart';
import '../../models/agent.dart';

class AgentDetails extends StatelessWidget {
  final Agent agent;
  const AgentDetails({super.key, required this.agent});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(agent.name,
            style: Theme.of(context)
                .textTheme
                .titleLarge), // Assuming agent.name is non-nullable
        if (agent.bio != null && agent.bio!.isNotEmpty)
          Padding(
            padding: const EdgeInsets.only(top: 4.0),
            child: Text(agent.bio!),
          ),
        // Add more fields as needed
      ],
    );
  }
}
