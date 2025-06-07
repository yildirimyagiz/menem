import 'package:flutter/foundation.dart';
import 'package:mobile/models/report.dart';
import 'package:mobile/providers/api_providers.dart';
import 'package:mobile/services/report_service.dart' show ReportService;
import 'package:mobile/services/report_service.dart' as service show ReportType;
import 'package:riverpod_annotation/riverpod_annotation.dart';

part 'report_providers.g.dart';

/// Provider for the ReportService
@riverpod
// ignore: deprecated_member_use_from_same_package
ReportService reportService(ReportServiceRef ref) {
  final apiService = ref.watch(apiServiceProvider);
  return ReportService(apiService);
}

/// Notifier for managing a list of reports
@riverpod
class ReportNotifier extends _$ReportNotifier {
  late final ReportService _reportService;

  @override
  Future<List<Report>> build() async {
    _reportService = ref.watch(reportServiceProvider);
    try {
      final response = await _reportService.getReports();
      return response.data;
    } catch (e, st) {
      debugPrint('Error loading reports: $e\n$st');
      rethrow;
    }
  }

  Future<void> refresh() async {
    state = const AsyncValue.loading();
    state = await AsyncValue.guard(() async {
      final response = await _reportService.getReports();
      return response.data;
    });
  }

  Future<Report?> getReportById(String id) async {
    try {
      state = const AsyncValue.loading();
      final report = await _reportService.getReportById(id);
      state = AsyncValue.data(state.value ?? []);
      return report;
    } catch (e, st) {
      state = AsyncValue.error(e, st);
      rethrow;
    }
  }

  Future<Report> createReport(Map<String, dynamic> data) async {
    try {
      state = const AsyncValue.loading();
      final report = await _reportService.createReport(data);

      // Update the state to include the new report
      if (state.hasValue) {
        final reports = List<Report>.from(state.value!);
        reports.add(report);
        state = AsyncValue.data(reports);
      }

      return report;
    } catch (e, st) {
      state = AsyncValue.error(e, st);
      rethrow;
    }
  }

  Future<Report> updateReport(Map<String, dynamic> data) async {
    try {
      state = const AsyncValue.loading();
      final updatedReport = await _reportService.updateReport(data);

      // Update the state with the updated report
      if (state.hasValue) {
        final reports = List<Report>.from(state.value!);
        final index = reports.indexWhere((r) => r.id == updatedReport.id);
        if (index != -1) {
          reports[index] = updatedReport;
          state = AsyncValue.data(reports);
        }
      }

      return updatedReport;
    } catch (e, st) {
      state = AsyncValue.error(e, st);
      rethrow;
    }
  }

  Future<void> deleteReport(String id) async {
    try {
      state = const AsyncValue.loading();
      await _reportService.deleteReport(id);

      // Update the state to remove the deleted report
      if (state.hasValue) {
        final reports = state.value!.where((r) => r.id != id).toList();
        state = AsyncValue.data(reports);
      }
    } catch (e, st) {
      state = AsyncValue.error(e, st);
      rethrow;
    }
  }

  Future<Map<String, dynamic>> generateReport({
    required service.ReportType type,
    required DateTime startDate,
    required DateTime endDate,
    String? entityId,
    String? entityType,
  }) async {
    try {
      return await _reportService.generateReport(
        type: type,
        startDate: startDate,
        endDate: endDate,
        entityId: entityId,
        entityType: entityType,
      );
    } catch (e, st) {
      state = AsyncValue.error(e, st);
      rethrow;
    }
  }

  Future<Map<String, dynamic>> getReportStatus(String reportId) async {
    try {
      return await _reportService.getReportStatus(reportId);
    } catch (e, st) {
      state = AsyncValue.error(e, st);
      rethrow;
    }
  }

  Future<Map<String, dynamic>> getReportStats({
    DateTime? startDate,
    DateTime? endDate,
    String? agencyId,
  }) async {
    try {
      return await _reportService.getReportStats(
        startDate: startDate,
        endDate: endDate,
        agencyId: agencyId,
      );
    } catch (e, st) {
      state = AsyncValue.error(e, st);
      rethrow;
    }
  }

  Future<String?> downloadReport(String reportId) async {
    try {
      return await _reportService.downloadReport(reportId);
    } catch (e, st) {
      state = AsyncValue.error(e, st);
      rethrow;
    }
  }
}
