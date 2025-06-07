import 'package:mobile/api/api_service.dart';
import 'package:mobile/exceptions/compliance_record_exception.dart';
import 'package:mobile/models/compliance_record.dart';
import 'package:mobile/models/paginated_response.dart';

class ComplianceRecordService {
  final ApiService _api;

  ComplianceRecordService({ApiService? apiService})
      : _api = apiService ?? ApiService();

  Future<PaginatedResponse<ComplianceRecord>> getComplianceRecords({
    int page = 1,
    int limit = 10,
    Map<String, dynamic>? filters,
    String? sortBy,
    String sortOrder = 'desc',
  }) async {
    try {
      final response = await _api.query(
        'complianceRecord.all',
        {
          'page': page,
          'limit': limit,
          if (sortBy != null) 'sortBy': sortBy,
          'sortOrder': sortOrder,
          ...?filters,
        },
      );

      if (response == null) {
        throw const ComplianceRecordException('No data returned');
      }

      return PaginatedResponse<ComplianceRecord>.fromJson(
        response as Map<String, dynamic>,
        (json) => ComplianceRecord.fromJson(json as Map<String, dynamic>),
      );
    } catch (e) {
      _handleError(e);
    }
  }

  Future<ComplianceRecord> getComplianceRecord(String id) async {
    try {
      final response = await _api.query('complianceRecord.byId', {'id': id});

      if (response == null) {
        throw ComplianceRecordException.notFound('Compliance record not found');
      }

      return ComplianceRecord.fromJson(response as Map<String, dynamic>);
    } catch (e) {
      _handleError(e);
    }
  }

  Future<ComplianceRecord> createComplianceRecord(
    Map<String, dynamic> data,
  ) async {
    try {
      final response = await _api.mutation('complianceRecord.create', data);

      if (response == null) {
        throw const ComplianceRecordException('No data returned');
      }

      return ComplianceRecord.fromJson(response as Map<String, dynamic>);
    } catch (e) {
      _handleError(e);
    }
  }

  Future<ComplianceRecord> updateComplianceRecord(
    String id,
    Map<String, dynamic> data,
  ) async {
    try {
      final response = await _api.mutation(
        'complianceRecord.update',
        {...data, 'id': id},
      );

      if (response == null) {
        throw const ComplianceRecordException('No data returned');
      }

      return ComplianceRecord.fromJson(response as Map<String, dynamic>);
    } catch (e) {
      _handleError(e);
    }
  }

  Future<void> deleteComplianceRecord(String id) async {
    try {
      await _api.mutation('complianceRecord.delete', {'id': id});
    } catch (e) {
      _handleError(e);
    }
  }

  Never _handleError(Object error) {
    if (error is ComplianceRecordException) throw error;
    throw ComplianceRecordException(error.toString());
  }
}
