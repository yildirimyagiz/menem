import 'package:flutter/material.dart';

class CommunicationLogHeader extends StatelessWidget {
  final int communicationLogCount;
  final String? title;
  const CommunicationLogHeader({super.key, required this.communicationLogCount, this.title});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        if (title != null)
          Text(title!, style: Theme.of(context).textTheme.headlineSmall),
        Text('$communicationLogCount logs found', style: Theme.of(context).textTheme.bodyMedium),
      ],
    );
  }
}
