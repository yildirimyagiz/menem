// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'payment.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

Payment _$PaymentFromJson(Map<String, dynamic> json) => Payment(
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
      propertyId: json['propertyId'] as String,
      userId: json['userId'] as String,
      type: $enumDecode(_$PaymentTypeEnumMap, json['type']),
      method: $enumDecode(_$PaymentMethodEnumMap, json['method']),
      status: $enumDecode(_$PaymentStatusEnumMap, json['status']),
      amount: (json['amount'] as num).toDouble(),
      currency: json['currency'] as String,
      paidAt: json['paidAt'] == null
          ? null
          : DateTime.parse(json['paidAt'] as String),
      transactionId: json['transactionId'] as String?,
      description: json['description'] as String?,
      metadata: json['metadata'] as Map<String, dynamic>?,
      createdBy: json['createdBy'] as String?,
      updatedBy: json['updatedBy'] as String?,
      reservationId: json['reservationId'] as String,
      paymentIntentId: json['paymentIntentId'] as String?,
      clientSecret: json['clientSecret'] as String?,
    );

Map<String, dynamic> _$PaymentToJson(Payment instance) => <String, dynamic>{
      'id': instance.id,
      'createdAt': instance.createdAt?.toIso8601String(),
      'updatedAt': instance.updatedAt?.toIso8601String(),
      'deletedAt': instance.deletedAt?.toIso8601String(),
      'propertyId': instance.propertyId,
      'userId': instance.userId,
      'type': _$PaymentTypeEnumMap[instance.type]!,
      'method': _$PaymentMethodEnumMap[instance.method]!,
      'status': _$PaymentStatusEnumMap[instance.status]!,
      'amount': instance.amount,
      'currency': instance.currency,
      'paidAt': instance.paidAt?.toIso8601String(),
      'transactionId': instance.transactionId,
      'description': instance.description,
      'metadata': instance.metadata,
      'createdBy': instance.createdBy,
      'updatedBy': instance.updatedBy,
      'reservationId': instance.reservationId,
      'paymentIntentId': instance.paymentIntentId,
      'clientSecret': instance.clientSecret,
    };

const _$PaymentTypeEnumMap = {
  PaymentType.rent: 'RENT',
  PaymentType.deposit: 'DEPOSIT',
  PaymentType.fee: 'FEE',
  PaymentType.refund: 'REFUND',
  PaymentType.other: 'OTHER',
};

const _$PaymentMethodEnumMap = {
  PaymentMethod.creditCard: 'CREDIT_CARD',
  PaymentMethod.debitCard: 'DEBIT_CARD',
  PaymentMethod.bankTransfer: 'BANK_TRANSFER',
  PaymentMethod.cash: 'CASH',
  PaymentMethod.check: 'CHECK',
  PaymentMethod.other: 'OTHER',
};

const _$PaymentStatusEnumMap = {
  PaymentStatus.pending: 'PENDING',
  PaymentStatus.completed: 'COMPLETED',
  PaymentStatus.failed: 'FAILED',
  PaymentStatus.refunded: 'REFUNDED',
  PaymentStatus.cancelled: 'CANCELLED',
};
