import 'package:flutter/material.dart';
import '../../models/analytics.dart';

class AnalyticsListScreen extends StatelessWidget {
  final List<Analytics> analytics;
  const AnalyticsListScreen({super.key, required this.analytics});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Analytics')),
      body: ListView.separated(
        padding: const EdgeInsets.all(16),
        itemCount: analytics.length,
        separatorBuilder: (_, __) => const Divider(),
        itemBuilder: (context, i) {
          final a = analytics[i];
          return ListTile(
            leading: const Icon(Icons.analytics),
            title: Text(a.type.name),
            subtitle: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Entity: ${a.entityType}'),
                Text('Entity ID: ${a.entityId}'),
                Text('Timestamp: ${a.timestamp.toLocal()}'),
                if (a.propertyId != null) Text('Property ID: ${a.propertyId}'),
                if (a.userId != null) Text('User ID: ${a.userId}'),
                if (a.agentId != null) Text('Agent ID: ${a.agentId}'),
                if (a.agencyId != null) Text('Agency ID: ${a.agencyId}'),
                if (a.reservationId != null)
                  Text('Reservation ID: ${a.reservationId}'),
                if (a.taskId != null) Text('Task ID: ${a.taskId}'),
              ],
            ),
            trailing: IconButton(
              icon: const Icon(Icons.more_vert),
              onPressed: () {
                showModalBottomSheet(
                  context: context,
                  builder: (context) => SafeArea(
                    child: Wrap(children: [
                      ListTile(
                        leading: const Icon(Icons.visibility),
                        title: const Text('View Details'),
                        onTap: () {
                          Navigator.pop(context);
                          showDialog(
                            context: context,
                            builder: (ctx) => AlertDialog(
                              title: const Text('Analytics Details'),
                              content: SingleChildScrollView(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text('ID: ${a.id}'),
                                    Text('Type: ${a.type.name}'),
                                    Text('Entity Type: ${a.entityType}'),
                                    Text('Entity ID: ${a.entityId}'),
                                    Text('Timestamp: ${a.timestamp.toLocal()}'),
                                    if (a.propertyId != null)
                                      Text('Property ID: ${a.propertyId}'),
                                    if (a.userId != null)
                                      Text('User ID: ${a.userId}'),
                                    if (a.agentId != null)
                                      Text('Agent ID: ${a.agentId}'),
                                    if (a.agencyId != null)
                                      Text('Agency ID: ${a.agencyId}'),
                                    if (a.reservationId != null)
                                      Text(
                                          'Reservation ID: ${a.reservationId}'),
                                    if (a.taskId != null)
                                      Text('Task ID: ${a.taskId}'),
                                    if (a.deletedAt != null)
                                      Text('Deleted At: ${a.deletedAt}'),
                                    Text('Created At: ${a.createdAt}'),
                                    Text('Updated At: ${a.updatedAt}'),
                                    const SizedBox(height: 8),
                                    const Text('Data:',
                                        style: TextStyle(
                                            fontWeight: FontWeight.bold)),
                                    Text(a.data.toString()),
                                    if (a.agency != null) ...[
                                      const SizedBox(height: 8),
                                      const Text('Agency:',
                                          style: TextStyle(
                                              fontWeight: FontWeight.bold)),
                                      Text(a.agency.toString()),
                                    ],
                                    if (a.agent != null) ...[
                                      const SizedBox(height: 8),
                                      const Text('Agent:',
                                          style: TextStyle(
                                              fontWeight: FontWeight.bold)),
                                      Text(a.agent.toString()),
                                    ],
                                    if (a.property != null) ...[
                                      const SizedBox(height: 8),
                                      const Text('Property:',
                                          style: TextStyle(
                                              fontWeight: FontWeight.bold)),
                                      Text(a.property.toString()),
                                    ],
                                    if (a.reservation != null) ...[
                                      const SizedBox(height: 8),
                                      const Text('Reservation:',
                                          style: TextStyle(
                                              fontWeight: FontWeight.bold)),
                                      Text(a.reservation.toString()),
                                    ],
                                    if (a.task != null) ...[
                                      const SizedBox(height: 8),
                                      const Text('Task:',
                                          style: TextStyle(
                                              fontWeight: FontWeight.bold)),
                                      Text(a.task.toString()),
                                    ],
                                    if (a.user != null) ...[
                                      const SizedBox(height: 8),
                                      const Text('User:',
                                          style: TextStyle(
                                              fontWeight: FontWeight.bold)),
                                      Text(a.user.toString()),
                                    ],
                                  ],
                                ),
                              ),
                              actions: [
                                TextButton(
                                  onPressed: () => Navigator.of(ctx).pop(),
                                  child: const Text('Close'),
                                ),
                              ],
                            ),
                          );
                        },
                      ),
                    ]),
                  ),
                );
              },
            ),
            onTap: () {},
          );
        },
      ),
    );
  }
}
