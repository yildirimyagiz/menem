// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'commission_rule.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

CommissionRule _$CommissionRuleFromJson(Map<String, dynamic> json) =>
    CommissionRule(
      id: json['id'] as String,
      isActive: json['isActive'] as bool?,
      createdAt: json['createdAt'] == null
          ? null
          : DateTime.parse(json['createdAt'] as String),
      updatedAt: json['updatedAt'] == null
          ? null
          : DateTime.parse(json['updatedAt'] as String),
      deletedAt: json['deletedAt'] == null
          ? null
          : DateTime.parse(json['deletedAt'] as String),
      providerId: json['providerId'] as String,
      ruleType: $enumDecode(_$CommissionRuleTypeEnumMap, json['ruleType']),
      startDate: json['startDate'] == null
          ? null
          : DateTime.parse(json['startDate'] as String),
      endDate: json['endDate'] == null
          ? null
          : DateTime.parse(json['endDate'] as String),
      commission: (json['commission'] as num).toDouble(),
      minVolume: (json['minVolume'] as num?)?.toInt(),
      maxVolume: (json['maxVolume'] as num?)?.toInt(),
      conditions: json['conditions'] as Map<String, dynamic>?,
      provider: json['Provider'] as Map<String, dynamic>?,
    );

Map<String, dynamic> _$CommissionRuleToJson(CommissionRule instance) =>
    <String, dynamic>{
      'id': instance.id,
      'createdAt': instance.createdAt?.toIso8601String(),
      'updatedAt': instance.updatedAt?.toIso8601String(),
      'deletedAt': instance.deletedAt?.toIso8601String(),
      'isActive': instance.isActive,
      'providerId': instance.providerId,
      'ruleType': _$CommissionRuleTypeEnumMap[instance.ruleType]!,
      'startDate': instance.startDate?.toIso8601String(),
      'endDate': instance.endDate?.toIso8601String(),
      'commission': instance.commission,
      'minVolume': instance.minVolume,
      'maxVolume': instance.maxVolume,
      'conditions': instance.conditions,
      'Provider': instance.provider,
    };

const _$CommissionRuleTypeEnumMap = {
  CommissionRuleType.seasonal: 'SEASONAL',
  CommissionRuleType.volume: 'VOLUME',
  CommissionRuleType.propertyType: 'PROPERTY_TYPE',
  CommissionRuleType.locationBased: 'LOCATION_BASED',
  CommissionRuleType.bookingValue: 'BOOKING_VALUE',
  CommissionRuleType.loyalty: 'LOYALTY',
  CommissionRuleType.specialPromotion: 'SPECIAL_PROMOTION',
  CommissionRuleType.packageDeal: 'PACKAGE_DEAL',
  CommissionRuleType.priceComparison: 'PRICE_COMPARISON',
  CommissionRuleType.commissionSummary: 'COMMISSION_SUMMARY',
  CommissionRuleType.bookingVolume: 'BOOKING_VOLUME',
  CommissionRuleType.revenue: 'REVENUE',
  CommissionRuleType.performance: 'PERFORMANCE',
};
