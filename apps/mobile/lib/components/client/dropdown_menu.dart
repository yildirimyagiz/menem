import 'package:flutter/material.dart';

class DropdownMenu extends StatelessWidget {
  final Widget child;
  final List<PopupMenuEntry> items;
  final void Function(dynamic)? onSelected;
  const DropdownMenu({super.key, required this.child, required this.items, this.onSelected});

  @override
  Widget build(BuildContext context) {
    return PopupMenuButton(
      itemBuilder: (context) => items,
      onSelected: onSelected,
      child: child,
    );
  }
}
