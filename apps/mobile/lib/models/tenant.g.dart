// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'tenant.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

Tenant _$TenantFromJson(Map<String, dynamic> json) => Tenant(
      id: json['id'] as String,
      createdAt: json['createdAt'] == null
          ? null
          : DateTime.parse(json['createdAt'] as String),
      updatedAt: json['updatedAt'] == null
          ? null
          : DateTime.parse(json['updatedAt'] as String),
      deletedAt: json['deletedAt'] == null
          ? null
          : DateTime.parse(json['deletedAt'] as String),
      userId: json['userId'] as String,
      firstName: json['firstName'] as String,
      lastName: json['lastName'] as String,
      email: json['email'] as String,
      phoneNumber: json['phoneNumber'] as String?,
      leaseStartDate: DateTime.parse(json['leaseStartDate'] as String),
      leaseEndDate: DateTime.parse(json['leaseEndDate'] as String),
      paymentStatus: $enumDecode(_$PaymentStatusEnumMap, json['paymentStatus']),
      propertyId: json['propertyId'] as String,
      status: $enumDecodeNullable(_$TenantStatusEnumMap, json['status']) ??
          TenantStatus.active,
      documentIds: (json['documentIds'] as List<dynamic>?)
          ?.map((e) => e as String)
          .toList(),
      metadata: json['metadata'] as Map<String, dynamic>?,
      notes: json['notes'] as String?,
      emergencyContact: json['emergencyContact'] as String?,
      emergencyPhone: json['emergencyPhone'] as String?,
      securityDeposit: (json['securityDeposit'] as num?)?.toDouble(),
      currency: json['currency'] as String?,
      lastPaymentDate: json['lastPaymentDate'] == null
          ? null
          : DateTime.parse(json['lastPaymentDate'] as String),
      balance: (json['balance'] as num?)?.toDouble(),
    );

Map<String, dynamic> _$TenantToJson(Tenant instance) => <String, dynamic>{
      'id': instance.id,
      'createdAt': instance.createdAt?.toIso8601String(),
      'updatedAt': instance.updatedAt?.toIso8601String(),
      'deletedAt': instance.deletedAt?.toIso8601String(),
      'userId': instance.userId,
      'firstName': instance.firstName,
      'lastName': instance.lastName,
      'email': instance.email,
      'phoneNumber': instance.phoneNumber,
      'leaseStartDate': instance.leaseStartDate.toIso8601String(),
      'leaseEndDate': instance.leaseEndDate.toIso8601String(),
      'paymentStatus': _$PaymentStatusEnumMap[instance.paymentStatus]!,
      'propertyId': instance.propertyId,
      'status': _$TenantStatusEnumMap[instance.status]!,
      'documentIds': instance.documentIds,
      'metadata': instance.metadata,
      'notes': instance.notes,
      'emergencyContact': instance.emergencyContact,
      'emergencyPhone': instance.emergencyPhone,
      'securityDeposit': instance.securityDeposit,
      'currency': instance.currency,
      'lastPaymentDate': instance.lastPaymentDate?.toIso8601String(),
      'balance': instance.balance,
    };

const _$PaymentStatusEnumMap = {
  PaymentStatus.current: 'CURRENT',
  PaymentStatus.late: 'LATE',
  PaymentStatus.delinquent: 'DELINQUENT',
  PaymentStatus.paid: 'PAID',
  PaymentStatus.pending: 'PENDING',
};

const _$TenantStatusEnumMap = {
  TenantStatus.active: 'ACTIVE',
  TenantStatus.inactive: 'INACTIVE',
  TenantStatus.pending: 'PENDING',
  TenantStatus.suspended: 'SUSPENDED',
  TenantStatus.terminated: 'terminated',
};
