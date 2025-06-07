import 'package:json_annotation/json_annotation.dart';
import 'base_model.dart';

part 'commission_rule.g.dart';

enum CommissionRuleType {
  @JsonValue('SEASONAL')
  seasonal,
  @JsonValue('VOLUME')
  volume,
  @JsonValue('PROPERTY_TYPE')
  propertyType,
  @JsonValue('LOCATION_BASED')
  locationBased,
  @JsonValue('BOOKING_VALUE')
  bookingValue,
  @JsonValue('LOYALTY')
  loyalty,
  @JsonValue('SPECIAL_PROMOTION')
  specialPromotion,
  @JsonValue('PACKAGE_DEAL')
  packageDeal,
  @JsonValue('PRICE_COMPARISON')
  priceComparison,
  @JsonValue('COMMISSION_SUMMARY')
  commissionSummary,
  @JsonValue('BOOKING_VOLUME')
  bookingVolume,
  @JsonValue('REVENUE')
  revenue,
  @JsonValue('PERFORMANCE')
  performance,
}

@JsonSerializable()
class CommissionRule extends BaseModel {
  String get name => providerId;
  CommissionRuleType get type => ruleType;
  double get rate => commission;
  final bool? _isActive;
  @override
  bool get isActive =>
      !isDeleted && (_isActive ?? true); // field only, no getter
  final String providerId;
  final CommissionRuleType ruleType;
  final DateTime? startDate;
  final DateTime? endDate;
  final double commission;
  final int? minVolume;
  final int? maxVolume;
  final Map<String, dynamic>? conditions;
  @JsonKey(name: 'Provider')
  final Map<String, dynamic>? provider;

  CommissionRule({
    required super.id,
    bool? isActive,
    required super.createdAt,
    required super.updatedAt,
    super.deletedAt,
    required this.providerId,
    required this.ruleType,
    this.startDate,
    this.endDate,
    required this.commission,
    this.minVolume,
    this.maxVolume,
    this.conditions,
    this.provider,
  }) : _isActive = isActive {
    if (commission < 0) {
      throw ArgumentError('Commission cannot be negative');
    }
    if (minVolume != null && maxVolume != null && minVolume! > maxVolume!) {
      throw ArgumentError('Min volume cannot be greater than max volume');
    }
    if (startDate != null && endDate != null && startDate!.isAfter(endDate!)) {
      throw ArgumentError('Start date cannot be after end date');
    }
  }

  bool get isVolumeBased => ruleType == CommissionRuleType.volume;
  bool get isSeasonal => ruleType == CommissionRuleType.seasonal;
  bool get isLocationBased => ruleType == CommissionRuleType.locationBased;
  bool get isLoyaltyBased => ruleType == CommissionRuleType.loyalty;
  bool get isSpecialPromotion =>
      ruleType == CommissionRuleType.specialPromotion;

  factory CommissionRule.fromJson(Map<String, dynamic> json) => CommissionRule(
        id: json['id'] as String,
        createdAt: DateTime.parse(json['createdAt'] as String),
        updatedAt: DateTime.parse(json['updatedAt'] as String),
        deletedAt: json['deletedAt'] != null
            ? DateTime.parse(json['deletedAt'] as String)
            : null,
        providerId: json['providerId'] as String,
        ruleType: CommissionRuleType.values.firstWhere((e) =>
            e.toString().split('.').last.toUpperCase() ==
            (json['ruleType'] as String).toUpperCase()),
        startDate: json['startDate'] != null
            ? DateTime.parse(json['startDate'] as String)
            : null,
        endDate: json['endDate'] != null
            ? DateTime.parse(json['endDate'] as String)
            : null,
        commission: (json['commission'] as num).toDouble(),
        minVolume: json['minVolume'] as int?,
        maxVolume: json['maxVolume'] as int?,
        conditions: json['conditions'] as Map<String, dynamic>?,
        provider: json['Provider'] as Map<String, dynamic>?,
        isActive: json['isActive'] as bool?,
      );

  @override
  Map<String, dynamic> toJson() => {
        ..._$CommissionRuleToJson(this),
        'isActive': _isActive,
      };

  /// Returns a copy of this CommissionRule with the given fields replaced by new values.
  /// For nullable fields, pass `explicitNull: true` to explicitly set them to null.
  CommissionRule copyWith({
    String? id,
    DateTime? createdAt,
    DateTime? updatedAt,
    DateTime? deletedAt,
    String? providerId,
    CommissionRuleType? ruleType,
    DateTime? startDate,
    bool startDateExplicitNull = false,
    DateTime? endDate,
    bool endDateExplicitNull = false,
    double? commission,
    int? minVolume,
    bool minVolumeExplicitNull = false,
    int? maxVolume,
    bool maxVolumeExplicitNull = false,
    Map<String, dynamic>? conditions,
    bool conditionsExplicitNull = false,
    Map<String, dynamic>? provider,
    bool providerExplicitNull = false,
    bool? isActive,
    bool isActiveExplicitNull = false,
  }) {
    return CommissionRule(
      id: id ?? this.id,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
      deletedAt: deletedAt ?? this.deletedAt,
      providerId: providerId ?? this.providerId,
      ruleType: ruleType ?? this.ruleType,
      startDate: startDateExplicitNull ? null : (startDate ?? this.startDate),
      endDate: endDateExplicitNull ? null : (endDate ?? this.endDate),
      commission: commission ?? this.commission,
      minVolume: minVolumeExplicitNull ? null : (minVolume ?? this.minVolume),
      maxVolume: maxVolumeExplicitNull ? null : (maxVolume ?? this.maxVolume),
      conditions: conditionsExplicitNull ? null : (conditions ?? this.conditions),
      provider: providerExplicitNull ? null : (provider ?? this.provider),
      isActive: isActiveExplicitNull ? null : (isActive ?? _isActive),
    );
  }
}
