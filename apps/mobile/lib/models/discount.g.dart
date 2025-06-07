// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'discount.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

Discount _$DiscountFromJson(Map<String, dynamic> json) => Discount(
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
      code: json['code'] as String,
      description: json['description'] as String,
      type: $enumDecode(_$DiscountTypeEnumMap, json['type']),
      status: $enumDecode(_$DiscountStatusEnumMap, json['status']),
      value: (json['value'] as num).toDouble(),
      currency: json['currency'] as String?,
      startDate: DateTime.parse(json['startDate'] as String),
      endDate: DateTime.parse(json['endDate'] as String),
      maxUses: (json['maxUses'] as num?)?.toInt(),
      currentUses: (json['currentUses'] as num).toInt(),
      minAmount: (json['minAmount'] as num?)?.toDouble(),
      maxAmount: (json['maxAmount'] as num?)?.toDouble(),
      isPublic: json['isPublic'] as bool,
      applicablePropertyIds: (json['applicablePropertyIds'] as List<dynamic>?)
          ?.map((e) => e as String)
          .toList(),
      applicableUserIds: (json['applicableUserIds'] as List<dynamic>?)
          ?.map((e) => e as String)
          .toList(),
      conditions: json['conditions'] as Map<String, dynamic>?,
      minNights: (json['minNights'] as num?)?.toInt(),
      maxNights: (json['maxNights'] as num?)?.toInt(),
      firstBookingDate: json['firstBookingDate'] == null
          ? null
          : DateTime.parse(json['firstBookingDate'] as String),
      lastBookingDate: json['lastBookingDate'] == null
          ? null
          : DateTime.parse(json['lastBookingDate'] as String),
      metadata: json['metadata'] as Map<String, dynamic>?,
      createdBy: json['createdBy'] as String?,
      updatedBy: json['updatedBy'] as String?,
      customFields: json['customFields'] as Map<String, dynamic>?,
    );

Map<String, dynamic> _$DiscountToJson(Discount instance) => <String, dynamic>{
      'id': instance.id,
      'createdAt': instance.createdAt?.toIso8601String(),
      'updatedAt': instance.updatedAt?.toIso8601String(),
      'deletedAt': instance.deletedAt?.toIso8601String(),
      'code': instance.code,
      'description': instance.description,
      'type': _$DiscountTypeEnumMap[instance.type]!,
      'status': _$DiscountStatusEnumMap[instance.status]!,
      'value': instance.value,
      'currency': instance.currency,
      'startDate': instance.startDate.toIso8601String(),
      'endDate': instance.endDate.toIso8601String(),
      'maxUses': instance.maxUses,
      'currentUses': instance.currentUses,
      'minAmount': instance.minAmount,
      'maxAmount': instance.maxAmount,
      'isPublic': instance.isPublic,
      'applicablePropertyIds': instance.applicablePropertyIds,
      'applicableUserIds': instance.applicableUserIds,
      'conditions': instance.conditions,
      'minNights': instance.minNights,
      'maxNights': instance.maxNights,
      'firstBookingDate': instance.firstBookingDate?.toIso8601String(),
      'lastBookingDate': instance.lastBookingDate?.toIso8601String(),
      'metadata': instance.metadata,
      'createdBy': instance.createdBy,
      'updatedBy': instance.updatedBy,
      'customFields': instance.customFields,
    };

const _$DiscountTypeEnumMap = {
  DiscountType.percentage: 'PERCENTAGE',
  DiscountType.fixed: 'FIXED',
  DiscountType.seasonal: 'SEASONAL',
  DiscountType.loyalty: 'LOYALTY',
  DiscountType.promotion: 'PROMOTION',
  DiscountType.coupon: 'COUPON',
};

const _$DiscountStatusEnumMap = {
  DiscountStatus.active: 'ACTIVE',
  DiscountStatus.inactive: 'INACTIVE',
  DiscountStatus.expired: 'EXPIRED',
};
