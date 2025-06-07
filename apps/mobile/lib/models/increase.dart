import 'package:json_annotation/json_annotation.dart';
import 'base_model.dart';

part 'increase.g.dart';

enum IncreaseType {
  @JsonValue('PERCENTAGE')
  percentage,
  @JsonValue('FIXED')
  fixed,
}

enum IncreaseStatus {
  @JsonValue('PENDING')
  pending,
  @JsonValue('APPROVED')
  approved,
  @JsonValue('REJECTED')
  rejected,
  @JsonValue('CANCELLED')
  cancelled,
}

@JsonSerializable()
class Increase extends BaseModel {
  final String propertyId;
  final String tenantId;
  final IncreaseType type;
  final double amount;
  final DateTime effectiveDate;
  final String? reason;
  final IncreaseStatus status;
  final String? approvedBy;
  final DateTime? approvedAt;
  final String? rejectedBy;
  final DateTime? rejectedAt;
  final String? cancelledBy;
  final DateTime? cancelledAt;
  final Map<String, dynamic>? metadata;

  Increase({
    required super.id,
    required this.propertyId,
    required this.tenantId,
    required this.type,
    required this.amount,
    required this.effectiveDate,
    this.reason,
    this.status = IncreaseStatus.pending,
    this.approvedBy,
    this.approvedAt,
    this.rejectedBy,
    this.rejectedAt,
    this.cancelledBy,
    this.cancelledAt,
    this.metadata,
    required super.createdAt,
    required super.updatedAt,
    super.deletedAt,
  });

  factory Increase.fromJson(Map<String, dynamic> json) =>
      _$IncreaseFromJson(json);
  @override
  Map<String, dynamic> toJson() => _$IncreaseToJson(this);

  bool get isPending => status == IncreaseStatus.pending;
  bool get isApproved => status == IncreaseStatus.approved;
  bool get isRejected => status == IncreaseStatus.rejected;
  bool get isCancelled => status == IncreaseStatus.cancelled;
  bool get canBeApproved => isPending;
  bool get canBeRejected => isPending;
  bool get canBeCancelled => isPending || isApproved;

  Increase copyWith({
    String? id,
    String? propertyId,
    String? tenantId,
    IncreaseType? type,
    double? amount,
    DateTime? effectiveDate,
    String? reason,
    IncreaseStatus? status,
    String? approvedBy,
    DateTime? approvedAt,
    String? rejectedBy,
    DateTime? rejectedAt,
    String? cancelledBy,
    DateTime? cancelledAt,
    Map<String, dynamic>? metadata,
    DateTime? createdAt,
    DateTime? updatedAt,
    DateTime? deletedAt,
  }) {
    return Increase(
      id: id ?? this.id,
      propertyId: propertyId ?? this.propertyId,
      tenantId: tenantId ?? this.tenantId,
      type: type ?? this.type,
      amount: amount ?? this.amount,
      effectiveDate: effectiveDate ?? this.effectiveDate,
      reason: reason ?? this.reason,
      status: status ?? this.status,
      approvedBy: approvedBy ?? this.approvedBy,
      approvedAt: approvedAt ?? this.approvedAt,
      rejectedBy: rejectedBy ?? this.rejectedBy,
      rejectedAt: rejectedAt ?? this.rejectedAt,
      cancelledBy: cancelledBy ?? this.cancelledBy,
      cancelledAt: cancelledAt ?? this.cancelledAt,
      metadata: metadata ?? this.metadata,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
      deletedAt: deletedAt ?? this.deletedAt,
    );
  }
}

@JsonSerializable()
class IncreaseModel extends BaseModel {
  final String title;
  final String description;
  final IncreaseType type;
  final IncreaseStatus status;
  final double value;
  final String currency;
  final DateTime effectiveDate;
  final String propertyId;
  final String? approvedBy;
  final DateTime? approvedAt;
  final String? rejectionReason;
  final DateTime? rejectedAt;
  final Map<String, dynamic>? metadata;
  final String? createdBy;
  final String? updatedBy;
  final Map<String, dynamic>? customFields;

  IncreaseModel({
    required super.id,
    required super.createdAt,
    required super.updatedAt,
    super.deletedAt,
    required this.title,
    required this.description,
    required this.type,
    required this.status,
    required this.value,
    required this.currency,
    required this.effectiveDate,
    required this.propertyId,
    this.approvedBy,
    this.approvedAt,
    this.rejectionReason,
    this.rejectedAt,
    this.metadata,
    this.createdBy,
    this.updatedBy,
    this.customFields,
  });

  factory IncreaseModel.fromJson(Map<String, dynamic> json) {
    return IncreaseModel(
      id: json['id'],
      createdAt: DateTime.parse(json['createdAt']),
      updatedAt: DateTime.parse(json['updatedAt']),
      deletedAt:
          json['deletedAt'] != null ? DateTime.parse(json['deletedAt']) : null,
      title: json['title'],
      description: json['description'],
      type: IncreaseType.values.firstWhere(
        (e) => e.toString().split('.').last == json['type'],
      ),
      status: IncreaseStatus.values.firstWhere(
        (e) => e.toString().split('.').last == json['status'],
      ),
      value: json['value'].toDouble(),
      currency: json['currency'],
      effectiveDate: DateTime.parse(json['effectiveDate']),
      propertyId: json['propertyId'],
      approvedBy: json['approvedBy'],
      approvedAt: json['approvedAt'] != null
          ? DateTime.parse(json['approvedAt'])
          : null,
      rejectionReason: json['rejectionReason'],
      rejectedAt: json['rejectedAt'] != null
          ? DateTime.parse(json['rejectedAt'])
          : null,
      metadata: json['metadata'],
      createdBy: json['createdBy'],
      updatedBy: json['updatedBy'],
      customFields: json['customFields'],
    );
  }

  @override
  Map<String, dynamic> toJson() {
    return {
      ...super.toJson(),
      'title': title,
      'description': description,
      'type': type.toString().split('.').last,
      'status': status.toString().split('.').last,
      'value': value,
      'currency': currency,
      'effectiveDate': effectiveDate.toIso8601String(),
      'propertyId': propertyId,
      'approvedBy': approvedBy,
      'approvedAt': approvedAt?.toIso8601String(),
      'rejectionReason': rejectionReason,
      'rejectedAt': rejectedAt?.toIso8601String(),
      'metadata': metadata,
      'createdBy': createdBy,
      'updatedBy': updatedBy,
      'customFields': customFields,
    };
  }
}
