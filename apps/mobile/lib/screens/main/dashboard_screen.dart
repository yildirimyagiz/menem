import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:mobile/components/client/dashboard/quick_actions_section.dart';
import 'package:mobile/components/client/dashboard/summary_statistics_section.dart';
import 'package:mobile/components/client/quick_access_section.dart';
import 'package:mobile/components/client/upcoming_events_section.dart';

// import '../../providers/auth_provider.dart'; // To get user details if needed

class DashboardScreen extends ConsumerWidget {
  const DashboardScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // final authState = ref.watch(authProvider);
    // final user = authState.asData?.value;
    // final userName = user?['name'] ?? 'User';

    return SingleChildScrollView(
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: <Widget>[
            Text(
              "Dashboard", // TODO: Internationalize
              style: Theme.of(context)
                  .textTheme
                  .headlineMedium
                  ?.copyWith(fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),
            Text(
              "Welcome to your property management dashboard", // TODO: Internationalize
              style: Theme.of(context)
                  .textTheme
                  .titleMedium
                  ?.copyWith(color: Colors.grey[600]),
            ),
            const SizedBox(height: 24),

            // Quick Access Section
            const Text(
              "Quick Access", // TODO: Internationalize
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.w600),
            ),
            const SizedBox(height: 12),
            const QuickAccessSection(),
            const SizedBox(height: 24),

            // Summary Statistics Section
            const Text(
              "Summary Statistics", // TODO: Internationalize
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.w600),
            ),
            const SizedBox(height: 12),
            const SummaryStatisticsSection(), // Use Suspense equivalent (FutureBuilder/StreamBuilder) inside if data is async
            const SizedBox(height: 24),

            // Quick Actions Section
            const QuickActionsSection(), // This component will contain its own title
            const SizedBox(height: 24),

            // Upcoming Events Section
            const UpcomingEventsSection(), // This component will contain its own title and handle loading
          ],
        ),
      ),
    );
  }
}
