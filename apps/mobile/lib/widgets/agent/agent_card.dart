import 'package:flutter/material.dart';
import '../../models/agent.dart';
import 'agent_details.dart';

class AgentCard extends StatelessWidget {
  final Agent agent;
  final VoidCallback? onTap;

  const AgentCard({super.key, required this.agent, this.onTap});

  @override
  Widget build(BuildContext context) {
    return Card(
      child: InkWell(
        onTap: onTap,
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: AgentDetails(agent: agent),
        ),
      ),
    );
  }
}
