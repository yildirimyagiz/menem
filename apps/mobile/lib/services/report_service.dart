import 'package:mobile/api/api_service.dart';
import '../models/report.dart';
import 'dart:developer';
import '../exceptions/api_exception.dart';
import 'package:mobile/models/pagination.dart'; // For PaginatedResponse

/// Enum for Report Types, mirroring backend.
/// Ensure this matches `PrismaClientReportType`
enum ReportType {
  financial,
  occupancy,
  bookingTrends,
  // Add other types as defined in your Prisma schema
}

/// Enum for Report Status, mirroring backend.
/// Ensure this matches `PrismaClientReportStatus`
enum ReportStatus {
  inProcess,
  completed,
  failed,
  // Add other statuses as defined in your Prisma schema
}

/// Service for handling report-related API operations via TRPC.
class ReportService {
  final ApiService _apiService;

  ReportService(this._apiService);

  /// Fetches all reports (optionally filtered).
  Future<PaginatedResponse<Report>> getReports({
    int page = 1,
    int limit = 10,
    Map<String, dynamic>? filters, // Allow flexible filtering
  }) async {
    try {
      final params = {'page': page, 'pageSize': limit, ...(filters ?? {})};
      final response = await _apiService.query('report.all', params);

      return PaginatedResponse<Report>.fromJson(
        response as Map<String, dynamic>,
        (json) => Report.fromJson(json as Map<String, dynamic>),
        dataKey: 'data', // Matches backend response
      );
    } catch (e, st) {
      _logError('getReports', e, st);
      throw ApiException('Failed to get reports: $e');
    }
  }

  /// Fetches a single report by ID.
  Future<Report?> getReportById(String id) async {
    try {
      final response = await _apiService.query(
        'report.byId',
        {'id': id},
      );
      if (response == null) {
        return null; // Or throw specific "Not Found" ApiException
      }
      return Report.fromJson(response);
    } catch (e, st) {
      _logError('getReport', e, st);
      throw ApiException('Failed to get report: $e');
    }
  }

  /// Creates a new report record (metadata).
  /// Actual report generation might be triggered by `generateReport`.
  Future<Report> createReport(Map<String, dynamic> data) async {
    try {
      final response = await _apiService.mutation(
        'report.create',
        data, // Data should match CreateReportSchema
      );
      if (response == null) {
        throw ApiException('No data returned from createReport');
      }
      return Report.fromJson(response);
    } catch (e, st) {
      _logError('createReport', e, st);
      throw ApiException('Failed to create report: $e');
    }
  }

  /// Updates an existing report.
  Future<Report> updateReport(Map<String, dynamic> data) async {
    try {
      final response = await _apiService.mutation(
        'report.update',
        data, // Data should match UpdateReportSchema (including 'id')
      );
      if (response == null) {
        throw ApiException('No data returned from updateReport');
      }
      return Report.fromJson(response);
    } catch (e, st) {
      _logError('updateReport', e, st);
      throw ApiException('Failed to update report: $e');
    }
  }

  /// Deletes a report by ID.
  Future<void> deleteReport(String id) async {
    // Assuming the backend procedure is named 'report.deleteReport'
    try {
      await _apiService.mutation('report.deleteReport', {'id': id});
    } catch (e, st) {
      _logError('deleteReport', e, st);
      throw ApiException('Failed to delete report: $e');
    }
  }

  /// Triggers the generation of a report on the backend.
  Future<Map<String, dynamic>> generateReport({
    required ReportType type,
    required DateTime startDate,
    required DateTime endDate,
    String? entityId,
    String? entityType,
  }) async {
    try {
      final params = {
        'type': type.name, // Send enum name
        'startDate': startDate.toIso8601String(),
        'endDate': endDate.toIso8601String(),
        if (entityId != null) 'entityId': entityId,
        if (entityType != null) 'entityType': entityType,
      };
      final response = await _apiService.mutation('report.generate', params);
      return response
          as Map<String, dynamic>; // e.g., { id: "...", status: "IN_PROGRESS" }
    } catch (e, st) {
      _logError('generateReport', e, st);
      throw ApiException('Failed to trigger report generation: $e');
    }
  }

  /// Fetches the status of a report generation process.
  Future<Map<String, dynamic>> getReportStatus(String reportId) async {
    try {
      final response =
          await _apiService.query('report.getStatus', {'id': reportId});
      return response as Map<String,
          dynamic>; // e.g., { id: "...", status: "COMPLETED", fileUrl: "..." }
    } catch (e, st) {
      _logError('getReportStatus', e, st);
      throw ApiException('Failed to get report status: $e');
    }
  }

  /// Fetches report statistics.
  Future<Map<String, dynamic>> getReportStats({
    DateTime? startDate,
    DateTime? endDate,
    String? agencyId,
  }) async {
    try {
      final params = {
        if (startDate != null) 'startDate': startDate.toIso8601String(),
        if (endDate != null) 'endDate': endDate.toIso8601String(),
        if (agencyId != null) 'agencyId': agencyId,
      };
      final response = await _apiService.query('report.getStats', params);
      return response
          as Map<String, dynamic>; // e.g., { "COMPLETED": 10, "FAILED": 1 }
    } catch (e, st) {
      _logError('getReportStats', e, st);
      throw ApiException('Failed to get report stats: $e');
    }
  }

  /// Gets the download URL for a completed report.
  Future<String?> downloadReport(String reportId) async {
    try {
      final response =
          await _apiService.query('report.download', {'id': reportId});
      return (response as Map<String, dynamic>)['fileUrl'] as String?;
    } catch (e, st) {
      _logError('downloadReport', e, st);
      throw ApiException('Failed to get report download link: $e');
    }
  }

  void _logError(String method, Object error, StackTrace st) {
    log('[ReportService][$method] $error', error: error, stackTrace: st);
  }
}
