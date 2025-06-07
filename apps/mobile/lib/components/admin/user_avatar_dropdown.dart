import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../client/user_avatar.dart';
import '../../providers/auth_provider.dart';

class UserAvatarDropdown extends ConsumerStatefulWidget {
  const UserAvatarDropdown({super.key});

  @override
  ConsumerState<UserAvatarDropdown> createState() => _UserAvatarDropdownState();
}

class _UserAvatarDropdownState extends ConsumerState<UserAvatarDropdown> {
  bool isMenuOpen = false;
  bool isLoggingOut = false;

  void _handleLogout() async {
    setState(() => isLoggingOut = true);
    try {
      final authNotifier = ref.read(authNotifierProvider.notifier);
      await authNotifier.logout();
      if (!mounted) return;
      Navigator.of(context).pushNamedAndRemoveUntil('/login', (route) => false);
    } catch (e) {
      // Handle error
    } finally {
      setState(() => isLoggingOut = false);
      setState(() => isMenuOpen = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final authState = ref.watch(authNotifierProvider);
    final user = authState.asData?.value;
    if (user == null) return const SizedBox.shrink();
    final initials = (user['displayName'] ?? user['name'] ?? user['email'] ?? 'U').toString().substring(0, 1).toUpperCase();
    final avatarUrl = user['avatarUrl'] as String?;
    return GestureDetector(
      onTap: () => setState(() => isMenuOpen = !isMenuOpen),
      child: Stack(
        children: [
          Row(
            children: [
              UserAvatar(initials: initials, avatarUrl: avatarUrl),
              const SizedBox(width: 8),
              Text(user['displayName'] ?? user['name'] ?? user['email'] ?? '',
                  style: Theme.of(context).textTheme.bodyMedium),
              const Icon(Icons.keyboard_arrow_down),
            ],
          ),
          if (isMenuOpen)
            Positioned(
              right: 0,
              top: 48,
              child: Material(
                elevation: 8,
                borderRadius: BorderRadius.circular(8),
                child: Container(
                  width: 200,
                  padding: const EdgeInsets.symmetric(vertical: 8),
                  decoration: BoxDecoration(
                    color: Theme.of(context).colorScheme.surface,
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      _DropdownItem(
                        icon: LucideIcons.user,
                        label: 'Profile',
                        onTap: () {
                          setState(() => isMenuOpen = false);
                          Navigator.of(context).pushNamed('/profile');
                        },
                      ),
                      _DropdownItem(
                        icon: LucideIcons.settings,
                        label: 'Settings',
                        onTap: () {
                          setState(() => isMenuOpen = false);
                          Navigator.of(context).pushNamed('/settings');
                        },
                      ),
                      const Divider(),
                      _DropdownItem(
                        icon: LucideIcons.logOut,
                        label: 'Logout',
                        isDanger: true,
                        trailing: isLoggingOut
                            ? const SizedBox(
                                width: 16,
                                height: 16,
                                child:
                                    CircularProgressIndicator(strokeWidth: 2))
                            : null,
                        onTap: _handleLogout,
                      ),
                    ],
                  ),
                ),
              ),
            ),
          if (isMenuOpen)
            Positioned.fill(
              child: GestureDetector(
                onTap: () => setState(() => isMenuOpen = false),
                behavior: HitTestBehavior.translucent,
                child: const SizedBox.expand(),
              ),
            ),
        ],
      ),
    );
  }
}

class _DropdownItem extends StatelessWidget {
  final IconData icon;
  final String label;
  final VoidCallback onTap;
  final bool isDanger;
  final Widget? trailing;

  const _DropdownItem({
    required this.icon,
    required this.label,
    required this.onTap,
    this.isDanger = false,
    this.trailing,
  });

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
        child: Row(
          children: [
            Icon(icon,
                size: 20,
                color: isDanger ? Theme.of(context).colorScheme.error : null),
            const SizedBox(width: 12),
            Expanded(
              child: Text(
                label,
                style: TextStyle(
                  color: isDanger ? Theme.of(context).colorScheme.error : null,
                  fontWeight: isDanger ? FontWeight.bold : FontWeight.normal,
                ),
              ),
            ),
            if (trailing != null) trailing!,
          ],
        ),
      ),
    );
  }
}
