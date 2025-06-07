import 'package:json_annotation/json_annotation.dart';
import 'base_model.dart';

part 'report.g.dart';

enum ReportType {
  @JsonValue('FINANCIAL')
  financial,
  @JsonValue('OCCUPANCY')
  occupancy,
  @JsonValue('MAINTENANCE')
  maintenance,
  @JsonValue('PERFORMANCE')
  performance,
  @JsonValue('OTHER')
  other,
}

enum ReportStatus {
  @JsonValue('DRAFT')
  draft,
  @JsonValue('PUBLISHED')
  published,
  @JsonValue('ARCHIVED')
  archived,
}

@JsonSerializable()
class Report extends BaseModel {
  final String title;
  final String description;
  final ReportType type;
  final ReportStatus status;
  final DateTime startDate;
  final DateTime endDate;
  final String? propertyId;
  final String? userId;
  final String? agencyId;
  final Map<String, dynamic>? data;
  final Map<String, dynamic>? metadata;
  final String? createdBy;
  final String? updatedBy;

  Report({
    required super.id,
    required super.createdAt,
    required super.updatedAt,
    super.deletedAt,
    required this.title,
    required this.description,
    required this.type,
    required this.status,
    required this.startDate,
    required this.endDate,
    this.propertyId,
    this.userId,
    this.agencyId,
    this.data,
    this.metadata,
    this.createdBy,
    this.updatedBy,
  }) {
    if (title.isEmpty) {
      throw ArgumentError('Report title cannot be empty');
    }
    if (description.isEmpty) {
      throw ArgumentError('Report description cannot be empty');
    }
    if (startDate.isAfter(endDate)) {
      throw ArgumentError('Start date cannot be after end date');
    }
  }

  bool get isFinancial => type == ReportType.financial;
  bool get isOccupancy => type == ReportType.occupancy;
  bool get isMaintenance => type == ReportType.maintenance;
  bool get isPerformance => type == ReportType.performance;
  bool get isOther => type == ReportType.other;
  bool get isDraft => status == ReportStatus.draft;
  bool get isPublished => status == ReportStatus.published;
  bool get isArchived => status == ReportStatus.archived;

  factory Report.fromJson(Map<String, dynamic> json) => _$ReportFromJson(json);

  @override
  Map<String, dynamic> toJson() => _$ReportToJson(this);

  Report copyWith({
    String? id,
    DateTime? createdAt,
    DateTime? updatedAt,
    DateTime? deletedAt,
    String? title,
    String? description,
    ReportType? type,
    ReportStatus? status,
    DateTime? startDate,
    DateTime? endDate,
    String? propertyId,
    String? userId,
    String? agencyId,
    Map<String, dynamic>? data,
    Map<String, dynamic>? metadata,
    String? createdBy,
    String? updatedBy,
  }) {
    return Report(
      id: id ?? this.id,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
      deletedAt: deletedAt ?? this.deletedAt,
      title: title ?? this.title,
      description: description ?? this.description,
      type: type ?? this.type,
      status: status ?? this.status,
      startDate: startDate ?? this.startDate,
      endDate: endDate ?? this.endDate,
      propertyId: propertyId ?? this.propertyId,
      userId: userId ?? this.userId,
      agencyId: agencyId ?? this.agencyId,
      data: data ?? this.data,
      metadata: metadata ?? this.metadata,
      createdBy: createdBy ?? this.createdBy,
      updatedBy: updatedBy ?? this.updatedBy,
    );
  }
}
