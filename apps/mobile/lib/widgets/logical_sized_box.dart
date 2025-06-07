import 'package:flutter/material.dart';

class LogicalSizedBox extends StatelessWidget {
  final double? blockSize;
  final double? inlineSize;
  final Widget? child;

  const LogicalSizedBox({
    super.key,
    this.blockSize,
    this.inlineSize,
    this.child,
  });

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: blockSize,
      width: inlineSize,
      child: child,
    );
  }
}
