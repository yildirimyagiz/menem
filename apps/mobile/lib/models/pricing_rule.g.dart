// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'pricing_rule.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

PricingRule _$PricingRuleFromJson(Map<String, dynamic> json) => PricingRule(
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
      name: json['name'] as String,
      description: json['description'] as String?,
      type: $enumDecode(_$PricingRuleTypeEnumMap, json['type']),
      status: $enumDecode(_$PricingRuleStatusEnumMap, json['status']),
      multiplier: (json['multiplier'] as num).toDouble(),
      fixedPrice: (json['fixedPrice'] as num?)?.toDouble(),
      conditions: json['conditions'] as Map<String, dynamic>?,
      isActive: json['isActive'] as bool? ?? true,
      propertyId: json['propertyId'] as String,
      property: json['property'] == null
          ? null
          : Property.fromJson(json['property'] as Map<String, dynamic>),
    );

Map<String, dynamic> _$PricingRuleToJson(PricingRule instance) =>
    <String, dynamic>{
      'id': instance.id,
      'createdAt': instance.createdAt?.toIso8601String(),
      'updatedAt': instance.updatedAt?.toIso8601String(),
      'deletedAt': instance.deletedAt?.toIso8601String(),
      'name': instance.name,
      'description': instance.description,
      'type': _$PricingRuleTypeEnumMap[instance.type]!,
      'status': _$PricingRuleStatusEnumMap[instance.status]!,
      'multiplier': instance.multiplier,
      'fixedPrice': instance.fixedPrice,
      'conditions': instance.conditions,
      'isActive': instance.isActive,
      'propertyId': instance.propertyId,
      'property': instance.property,
    };

const _$PricingRuleTypeEnumMap = {
  PricingRuleType.seasonal: 'SEASONAL',
  PricingRuleType.weekend: 'WEEKEND',
  PricingRuleType.weekday: 'WEEKDAY',
  PricingRuleType.special: 'SPECIAL',
  PricingRuleType.lastMinute: 'LAST_MINUTE',
  PricingRuleType.earlyBird: 'EARLY_BIRD',
};

const _$PricingRuleStatusEnumMap = {
  PricingRuleStatus.active: 'ACTIVE',
  PricingRuleStatus.inactive: 'INACTIVE',
  PricingRuleStatus.expired: 'EXPIRED',
};
