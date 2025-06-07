import 'package:flutter/material.dart';
import '../../models/communication_log.dart';
import 'communication_log_details.dart';

class CommunicationLogCard extends StatelessWidget {
  final CommunicationLog communicationLog;
  final VoidCallback? onTap;

  const CommunicationLogCard({super.key, required this.communicationLog, this.onTap});

  @override
  Widget build(BuildContext context) {
    return Card(
      child: InkWell(
        onTap: onTap,
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: CommunicationLogDetails(communicationLog: communicationLog),
        ),
      ),
    );
  }
}
