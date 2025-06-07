// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'report_providers.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

String _$reportServiceHash() => r'c6d8000594c0a818aecf8296c2e9268f648f63cb';

/// Provider for the ReportService
///
/// Copied from [reportService].
@ProviderFor(reportService)
final reportServiceProvider = AutoDisposeProvider<ReportService>.internal(
  reportService,
  name: r'reportServiceProvider',
  debugGetCreateSourceHash: const bool.fromEnvironment('dart.vm.product')
      ? null
      : _$reportServiceHash,
  dependencies: null,
  allTransitiveDependencies: null,
);

@Deprecated('Will be removed in 3.0. Use Ref instead')
// ignore: unused_element
typedef ReportServiceRef = AutoDisposeProviderRef<ReportService>;
String _$reportNotifierHash() => r'feed4fc7c4be3d7d4cb6bb14d24c8dc3a192c176';

/// Notifier for managing a list of reports
///
/// Copied from [ReportNotifier].
@ProviderFor(ReportNotifier)
final reportNotifierProvider =
    AutoDisposeAsyncNotifierProvider<ReportNotifier, List<Report>>.internal(
  ReportNotifier.new,
  name: r'reportNotifierProvider',
  debugGetCreateSourceHash: const bool.fromEnvironment('dart.vm.product')
      ? null
      : _$reportNotifierHash,
  dependencies: null,
  allTransitiveDependencies: null,
);

typedef _$ReportNotifier = AutoDisposeAsyncNotifier<List<Report>>;
// ignore_for_file: type=lint
// ignore_for_file: subtype_of_sealed_class, invalid_use_of_internal_member, invalid_use_of_visible_for_testing_member, deprecated_member_use_from_same_package
