import 'package:flutter/material.dart';
import '../../models/communication_log.dart';

class CommunicationLogDetails extends StatelessWidget {
  final CommunicationLog communicationLog;
  const CommunicationLogDetails({super.key, required this.communicationLog});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('Type: ${communicationLog.type.name}',
            style: Theme.of(context)
                .textTheme
                .titleLarge), // Assuming type is an enum
        Text('Sender: ${communicationLog.senderId}'),
        Text('Receiver: ${communicationLog.receiverId}'),
        // Add more fields as needed
      ],
    );
  }
}
