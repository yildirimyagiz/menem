// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'offer.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

Offer _$OfferFromJson(Map<String, dynamic> json) => Offer(
      id: json['id'] as String,
      propertyId: json['propertyId'] as String,
      userId: json['userId'] as String,
      type: $enumDecode(_$OfferTypeEnumMap, json['type']),
      status: $enumDecodeNullable(_$OfferStatusEnumMap, json['status']) ??
          OfferStatus.pending,
      amount: (json['amount'] as num).toDouble(),
      currency: json['currency'] as String,
      validUntil: json['validUntil'] == null
          ? null
          : DateTime.parse(json['validUntil'] as String),
      message: json['message'] as String?,
      terms: json['terms'] as Map<String, dynamic>?,
      acceptedBy: json['acceptedBy'] as String?,
      acceptedAt: json['acceptedAt'] == null
          ? null
          : DateTime.parse(json['acceptedAt'] as String),
      rejectedBy: json['rejectedBy'] as String?,
      rejectedAt: json['rejectedAt'] == null
          ? null
          : DateTime.parse(json['rejectedAt'] as String),
      cancelledBy: json['cancelledBy'] as String?,
      cancelledAt: json['cancelledAt'] == null
          ? null
          : DateTime.parse(json['cancelledAt'] as String),
      metadata: json['metadata'] as Map<String, dynamic>?,
      createdAt: json['createdAt'] == null
          ? null
          : DateTime.parse(json['createdAt'] as String),
      updatedAt: json['updatedAt'] == null
          ? null
          : DateTime.parse(json['updatedAt'] as String),
      deletedAt: json['deletedAt'] == null
          ? null
          : DateTime.parse(json['deletedAt'] as String),
    );

Map<String, dynamic> _$OfferToJson(Offer instance) => <String, dynamic>{
      'id': instance.id,
      'createdAt': instance.createdAt?.toIso8601String(),
      'updatedAt': instance.updatedAt?.toIso8601String(),
      'deletedAt': instance.deletedAt?.toIso8601String(),
      'propertyId': instance.propertyId,
      'userId': instance.userId,
      'type': _$OfferTypeEnumMap[instance.type]!,
      'status': _$OfferStatusEnumMap[instance.status]!,
      'amount': instance.amount,
      'currency': instance.currency,
      'validUntil': instance.validUntil?.toIso8601String(),
      'message': instance.message,
      'terms': instance.terms,
      'acceptedBy': instance.acceptedBy,
      'acceptedAt': instance.acceptedAt?.toIso8601String(),
      'rejectedBy': instance.rejectedBy,
      'rejectedAt': instance.rejectedAt?.toIso8601String(),
      'cancelledBy': instance.cancelledBy,
      'cancelledAt': instance.cancelledAt?.toIso8601String(),
      'metadata': instance.metadata,
    };

const _$OfferTypeEnumMap = {
  OfferType.purchase: 'PURCHASE',
  OfferType.rental: 'RENTAL',
  OfferType.maintenance: 'MAINTENANCE',
  OfferType.service: 'SERVICE',
};

const _$OfferStatusEnumMap = {
  OfferStatus.pending: 'PENDING',
  OfferStatus.accepted: 'ACCEPTED',
  OfferStatus.rejected: 'REJECTED',
  OfferStatus.cancelled: 'CANCELLED',
  OfferStatus.expired: 'EXPIRED',
};
