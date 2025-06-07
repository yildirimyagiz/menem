import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';

class BottomNavbar extends StatelessWidget {
  final int currentIndex;
  final ValueChanged<int> onTap;

  const BottomNavbar({
    super.key,
    required this.currentIndex,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return BottomNavigationBar(
      currentIndex: currentIndex,
      onTap: onTap,
      type: BottomNavigationBarType.fixed, // Ensures all labels are visible
      selectedItemColor: Theme.of(context).primaryColor,
      unselectedItemColor: Colors.grey[600],
      items: const [
        BottomNavigationBarItem(
          icon: Icon(LucideIcons.home),
          label: 'Home',
        ),
        BottomNavigationBarItem(
          icon: Icon(LucideIcons.search),
          label: 'Search',
        ),
        BottomNavigationBarItem(
          icon: Icon(LucideIcons.heart),
          label: 'Favorites',
        ),
        BottomNavigationBarItem(
          icon: Icon(LucideIcons.userCircle2),
          label: 'Profile',
        ),
      ],
    );
  }
}

// Example of how you might manage the state for BottomNavbar in a parent screen (e.g., a MainScreen)
/*
class MainScreenWithBottomNav extends StatefulWidget {
  const MainScreenWithBottomNav({super.key});

  @override
  State<MainScreenWithBottomNav> createState() => _MainScreenWithBottomNavState();
}

class _MainScreenWithBottomNavState extends State<MainScreenWithBottomNav> {
  int _currentIndex = 0;
  final List<Widget> _screens = [HomeScreen(), SearchScreen(), FavoritesScreen(), ProfileScreen()]; // Define your screens

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: _screens[_currentIndex],
      bottomNavigationBar: BottomNavbar(currentIndex: _currentIndex, onTap: (index) => setState(() => _currentIndex = index)),
    );
  }
}
*/
