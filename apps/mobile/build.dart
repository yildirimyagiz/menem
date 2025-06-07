import 'dart:io';

import 'package:flutter/foundation.dart';

void main() async {
  // Run build_runner
  final result = await Process.run('dart', [
    'run',
    '--enable-experiment=native-assets',
    'build_runner',
    'build',
    '--delete-conflicting-outputs',
  ]);

  if (kDebugMode) {
    print(result.stdout);
  }
  if (result.stderr.toString().isNotEmpty) {
    if (kDebugMode) {
      print(result.stderr);
    }
  }

  if (result.exitCode != 0) {
    if (kDebugMode) {
      print('Error: Build failed');
    }
    exit(1);
  }
}
