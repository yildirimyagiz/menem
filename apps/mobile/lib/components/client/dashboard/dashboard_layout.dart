import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:mobile/components/client/app_drawer.dart';
import 'package:mobile/components/client/header.dart';

class DashboardLayout extends ConsumerStatefulWidget {
  final Widget body;
  final String? title; // Optional title for the header if needed

  const DashboardLayout({
    super.key,
    required this.body,
    this.title,
  });

  @override
  ConsumerState<DashboardLayout> createState() => _DashboardLayoutState();
}

class _DashboardLayoutState extends ConsumerState<DashboardLayout> {
  final GlobalKey<ScaffoldState> _scaffoldKey = GlobalKey<ScaffoldState>();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      key: _scaffoldKey,
      appBar: Header(
        toggleMobileMenu: () {
          _scaffoldKey.currentState?.openDrawer();
        },
      ),
      drawer: const AppDrawer(),
      body: widget.body,
    );
  }
}
