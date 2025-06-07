import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:mobile/components/client/dashboard/dashboard_layout.dart';
import 'package:mobile/components/client/dashboard/quick_actions_section.dart';
import 'package:mobile/components/client/dashboard/summary_statistics_section.dart';
import 'package:mobile/components/client/quick_access_section.dart';
import 'package:mobile/components/client/upcoming_events_section.dart';

// Add your other screens here (SearchScreen, FavoritesScreen, ProfileScreen)

class DashboardMainScreen extends StatefulWidget {
  const DashboardMainScreen({super.key});

  @override
  State<DashboardMainScreen> createState() => _DashboardMainScreenState();
}

class _DashboardMainScreenState extends State<DashboardMainScreen> {
  final int _currentIndex = 0;
  late final List<Widget> _screens;

  @override
  void initState() {
    super.initState();
    _screens = const [
      DashboardScreen(), // The main dashboard (see below)
      Placeholder(), // TODO: Replace with SearchScreen()
      Placeholder(), // TODO: Replace with FavoritesScreen()
      Placeholder(), // TODO: Replace with ProfileScreen()
    ];
  }

  @override
  Widget build(BuildContext context) {
    return DashboardLayout(
      body: _screens[_currentIndex],
    );
  }
}

class DashboardScreen extends ConsumerWidget {
  const DashboardScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return SingleChildScrollView(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          child: Text(
            'Dashboard',
            style: Theme.of(context)
                .textTheme
                .headlineMedium
                ?.copyWith(fontWeight: FontWeight.bold),
          ),
        ),
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16),
          child: Text(
            'Manage your properties effectively',
            style: Theme.of(context).textTheme.bodyMedium,
          ),
        ),
        const SizedBox(height: 16),
        // Quick Access Section
        const Padding(
          padding: EdgeInsets.symmetric(horizontal: 16),
          child: Text('Quick Access',
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.w600)),
        ),
        const SizedBox(height: 8),
        const QuickAccessSection(),
        const SizedBox(height: 24),
        // Summary Statistics Section
        const Padding(
          padding: EdgeInsets.symmetric(horizontal: 16),
          child: Text('Summary Statistics',
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.w600)),
        ),
        const SizedBox(height: 8),
        const SummaryStatisticsSection(),
        const SizedBox(height: 24),
        // Quick Actions Section
        const Padding(
          padding: EdgeInsets.symmetric(horizontal: 16),
          child: Text('Quick Actions',
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.w600)),
        ),
        const SizedBox(height: 8),
        const QuickActionsSection(),
        const SizedBox(height: 24),
        // Upcoming Events Section
        const Padding(
          padding: EdgeInsets.symmetric(horizontal: 16),
          child: Text('Upcoming Events',
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.w600)),
        ),
        const SizedBox(height: 8),
        const UpcomingEventsSection(),
        const SizedBox(height: 16),
      ],
    ),
  );
  }
}
