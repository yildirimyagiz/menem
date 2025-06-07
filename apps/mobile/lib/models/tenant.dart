import 'package:json_annotation/json_annotation.dart';
import 'base_model.dart';

part 'tenant.g.dart';

enum TenantStatus {
  @JsonValue('ACTIVE')
  active,
  @JsonValue('INACTIVE')
  inactive,
  @JsonValue('PENDING')
  pending,
  @JsonValue('SUSPENDED')
  suspended,
  terminated,
}

enum PaymentStatus {
  @JsonValue('CURRENT')
  current,
  @JsonValue('LATE')
  late,
  @JsonValue('DELINQUENT')
  delinquent,
  @JsonValue('PAID')
  paid,
  @JsonValue('PENDING')
  pending,
}

@JsonSerializable()
class Tenant extends BaseModel {
  final String userId;
  final String firstName;
  final String lastName;
  final String email;
  final String? phoneNumber;
  final DateTime leaseStartDate;
  final DateTime leaseEndDate;
  @JsonKey(name: 'paymentStatus')
  final PaymentStatus paymentStatus;
  final String propertyId;
  final TenantStatus status;
  final List<String>? documentIds;
  final Map<String, dynamic>? metadata;
  final String? notes;
  final String? emergencyContact;
  final String? emergencyPhone;
  final double? securityDeposit;
  final String? currency;
  final DateTime? lastPaymentDate;
  final double? balance;

  Tenant({
    required super.id,
    required super.createdAt,
    required super.updatedAt,
    super.deletedAt,
    required this.userId,
    required this.firstName,
    required this.lastName,
    required this.email,
    this.phoneNumber,
    required this.leaseStartDate,
    required this.leaseEndDate,
    required this.paymentStatus,
    required this.propertyId,
    this.status = TenantStatus.active,
    this.documentIds,
    this.metadata,
    this.notes,
    this.emergencyContact,
    this.emergencyPhone,
    this.securityDeposit,
    this.currency,
    this.lastPaymentDate,
    this.balance,
  }) {
    if (firstName.isEmpty) {
      throw ArgumentError('First name cannot be empty');
    }
    if (lastName.isEmpty) {
      throw ArgumentError('Last name cannot be empty');
    }
    if (email.isEmpty) {
      throw ArgumentError('Email cannot be empty');
    }
    if (leaseStartDate.isAfter(leaseEndDate)) {
      throw ArgumentError('Lease start date cannot be after end date');
    }
  }

  String get fullName => '$firstName $lastName';
  @override
  bool get isActive => status == TenantStatus.active;
  bool get isPending => status == TenantStatus.pending;
  bool get isSuspended => status == TenantStatus.suspended;
  bool get isTerminated => status == TenantStatus.terminated;
  bool get hasExpired => DateTime.now().isAfter(leaseEndDate);
  bool get isPaymentCurrent => paymentStatus == PaymentStatus.current;
  bool get isPaymentLate => paymentStatus == PaymentStatus.late;
  bool get isPaymentDelinquent => paymentStatus == PaymentStatus.delinquent;
  bool get hasDocuments => documentIds != null && documentIds!.isNotEmpty;
  bool get hasEmergencyContact =>
      emergencyContact != null && emergencyPhone != null;
  bool get hasSecurityDeposit =>
      securityDeposit != null && securityDeposit! > 0;

  factory Tenant.fromJson(Map<String, dynamic> json) => _$TenantFromJson(json);

  @override
  Map<String, dynamic> toJson() => _$TenantToJson(this);

  Tenant copyWith({
    String? id,
    DateTime? createdAt,
    DateTime? updatedAt,
    DateTime? deletedAt,
    String? userId,
    String? firstName,
    String? lastName,
    String? email,
    String? phoneNumber,
    DateTime? leaseStartDate,
    DateTime? leaseEndDate,
    PaymentStatus? paymentStatus,
    String? propertyId,
    TenantStatus? status,
    List<String>? documentIds,
    Map<String, dynamic>? metadata,
    String? notes,
    String? emergencyContact,
    String? emergencyPhone,
    double? securityDeposit,
    String? currency,
    DateTime? lastPaymentDate,
    double? balance,
  }) {
    return Tenant(
      id: id ?? this.id,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
      deletedAt: deletedAt ?? this.deletedAt,
      userId: userId ?? this.userId,
      firstName: firstName ?? this.firstName,
      lastName: lastName ?? this.lastName,
      email: email ?? this.email,
      phoneNumber: phoneNumber ?? this.phoneNumber,
      leaseStartDate: leaseStartDate ?? this.leaseStartDate,
      leaseEndDate: leaseEndDate ?? this.leaseEndDate,
      paymentStatus: paymentStatus ?? this.paymentStatus,
      propertyId: propertyId ?? this.propertyId,
      status: status ?? this.status,
      documentIds: documentIds ?? this.documentIds,
      metadata: metadata ?? this.metadata,
      notes: notes ?? this.notes,
      emergencyContact: emergencyContact ?? this.emergencyContact,
      emergencyPhone: emergencyPhone ?? this.emergencyPhone,
      securityDeposit: securityDeposit ?? this.securityDeposit,
      currency: currency ?? this.currency,
      lastPaymentDate: lastPaymentDate ?? this.lastPaymentDate,
      balance: balance ?? this.balance,
    );
  }
}
