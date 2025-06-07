import 'package:json_annotation/json_annotation.dart';
import 'base_model.dart';

part 'compliance_record.g.dart';

enum ComplianceStatus {
  @JsonValue('PENDING')
  pending,
  @JsonValue('APPROVED')
  approved,
  @JsonValue('REJECTED')
  rejected,
  @JsonValue('EXPIRED')
  expired,
}

enum ComplianceType {
  @JsonValue('LICENSE')
  license,
  @JsonValue('CERTIFICATION')
  certification,
  @JsonValue('INSURANCE')
  insurance,
  @JsonValue('PERMIT')
  permit,
  @JsonValue('OTHER')
  other,
}

@JsonSerializable()
class ComplianceRecord extends BaseModel {
  DateTime get date => issueDate;
  final String title;
  final String description;
  final ComplianceType type;
  final ComplianceStatus status;
  final String entityId;
  final String? entityType;
  final DateTime issueDate;
  final DateTime expiryDate;
  final String? issuer;
  final String? documentNumber;
  final String? documentUrl;
  final Map<String, dynamic>? metadata;
  final String? approvedBy;
  final DateTime? approvedAt;
  final String? rejectionReason;
  final DateTime? rejectedAt;
  final List<String>? tags;
  final bool isRequired;
  final int? renewalPeriod;
  final DateTime? lastRenewedAt;
  final Map<String, dynamic>? customFields;

  ComplianceRecord({
    required super.id,
    required super.createdAt,
    required super.updatedAt,
    super.deletedAt,
    required this.title,
    required this.description,
    required this.type,
    required this.status,
    required this.entityId,
    this.entityType,
    required this.issueDate,
    required this.expiryDate,
    this.issuer,
    this.documentNumber,
    this.documentUrl,
    this.metadata,
    this.approvedBy,
    this.approvedAt,
    this.rejectionReason,
    this.rejectedAt,
    this.tags,
    required this.isRequired,
    this.renewalPeriod,
    this.lastRenewedAt,
    this.customFields,
  });

  /// Returns a copy of this ComplianceRecord with the given fields replaced by new values.
  /// For nullable fields, pass `explicitNull: true` to explicitly set them to null.
  ComplianceRecord copyWith({
    String? id,
    DateTime? createdAt,
    DateTime? updatedAt,
    DateTime? deletedAt,
    String? title,
    String? description,
    ComplianceType? type,
    ComplianceStatus? status,
    String? entityId,
    String? entityType,
    bool entityTypeExplicitNull = false,
    DateTime? issueDate,
    DateTime? expiryDate,
    String? issuer,
    bool issuerExplicitNull = false,
    String? documentNumber,
    bool documentNumberExplicitNull = false,
    String? documentUrl,
    bool documentUrlExplicitNull = false,
    Map<String, dynamic>? metadata,
    bool metadataExplicitNull = false,
    String? approvedBy,
    bool approvedByExplicitNull = false,
    DateTime? approvedAt,
    bool approvedAtExplicitNull = false,
    String? rejectionReason,
    bool rejectionReasonExplicitNull = false,
    DateTime? rejectedAt,
    bool rejectedAtExplicitNull = false,
    List<String>? tags,
    bool tagsExplicitNull = false,
    bool? isRequired,
    int? renewalPeriod,
    bool renewalPeriodExplicitNull = false,
    DateTime? lastRenewedAt,
    bool lastRenewedAtExplicitNull = false,
    Map<String, dynamic>? customFields,
    bool customFieldsExplicitNull = false,
  }) {
    return ComplianceRecord(
      id: id ?? this.id,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
      deletedAt: deletedAt ?? this.deletedAt,
      title: title ?? this.title,
      description: description ?? this.description,
      type: type ?? this.type,
      status: status ?? this.status,
      entityId: entityId ?? this.entityId,
      entityType: entityTypeExplicitNull ? null : (entityType ?? this.entityType),
      issueDate: issueDate ?? this.issueDate,
      expiryDate: expiryDate ?? this.expiryDate,
      issuer: issuerExplicitNull ? null : (issuer ?? this.issuer),
      documentNumber: documentNumberExplicitNull ? null : (documentNumber ?? this.documentNumber),
      documentUrl: documentUrlExplicitNull ? null : (documentUrl ?? this.documentUrl),
      metadata: metadataExplicitNull ? null : (metadata ?? this.metadata),
      approvedBy: approvedByExplicitNull ? null : (approvedBy ?? this.approvedBy),
      approvedAt: approvedAtExplicitNull ? null : (approvedAt ?? this.approvedAt),
      rejectionReason: rejectionReasonExplicitNull ? null : (rejectionReason ?? this.rejectionReason),
      rejectedAt: rejectedAtExplicitNull ? null : (rejectedAt ?? this.rejectedAt),
      tags: tagsExplicitNull ? null : (tags ?? this.tags),
      isRequired: isRequired ?? this.isRequired,
      renewalPeriod: renewalPeriodExplicitNull ? null : (renewalPeriod ?? this.renewalPeriod),
      lastRenewedAt: lastRenewedAtExplicitNull ? null : (lastRenewedAt ?? this.lastRenewedAt),
      customFields: customFieldsExplicitNull ? null : (customFields ?? this.customFields),
    );
  }

  factory ComplianceRecord.fromJson(Map<String, dynamic> json) {
    return ComplianceRecord(
      id: json['id'],
      createdAt: DateTime.parse(json['createdAt']),
      updatedAt: DateTime.parse(json['updatedAt']),
      deletedAt:
          json['deletedAt'] != null ? DateTime.parse(json['deletedAt']) : null,
      title: json['title'],
      description: json['description'],
      type: ComplianceType.values.firstWhere(
        (e) => e.toString().split('.').last == json['type'],
      ),
      status: ComplianceStatus.values.firstWhere(
        (e) => e.toString().split('.').last == json['status'],
      ),
      entityId: json['entityId'],
      entityType: json['entityType'],
      issueDate: DateTime.parse(json['issueDate']),
      expiryDate: DateTime.parse(json['expiryDate']),
      issuer: json['issuer'],
      documentNumber: json['documentNumber'],
      documentUrl: json['documentUrl'],
      metadata: json['metadata'],
      approvedBy: json['approvedBy'],
      approvedAt: json['approvedAt'] != null
          ? DateTime.parse(json['approvedAt'])
          : null,
      rejectionReason: json['rejectionReason'],
      rejectedAt: json['rejectedAt'] != null
          ? DateTime.parse(json['rejectedAt'])
          : null,
      tags: json['tags'] != null ? List<String>.from(json['tags']) : null,
      isRequired: json['isRequired'],
      renewalPeriod: json['renewalPeriod'],
      lastRenewedAt: json['lastRenewedAt'] != null
          ? DateTime.parse(json['lastRenewedAt'])
          : null,
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
      'entityId': entityId,
      'entityType': entityType,
      'issueDate': issueDate.toIso8601String(),
      'expiryDate': expiryDate.toIso8601String(),
      'issuer': issuer,
      'documentNumber': documentNumber,
      'documentUrl': documentUrl,
      'metadata': metadata,
      'approvedBy': approvedBy,
      'approvedAt': approvedAt?.toIso8601String(),
      'rejectionReason': rejectionReason,
      'rejectedAt': rejectedAt?.toIso8601String(),
      'tags': tags,
      'isRequired': isRequired,
      'renewalPeriod': renewalPeriod,
      'lastRenewedAt': lastRenewedAt?.toIso8601String(),
      'customFields': customFields,
    };
  }
}
