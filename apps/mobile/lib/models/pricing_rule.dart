import 'package:json_annotation/json_annotation.dart';
import 'base_model.dart';
import 'property.dart';

part 'pricing_rule.g.dart';

enum PricingRuleType {
  @JsonValue('SEASONAL')
  seasonal,
  @JsonValue('WEEKEND')
  weekend,
  @JsonValue('WEEKDAY')
  weekday,
  @JsonValue('SPECIAL')
  special,
  @JsonValue('LAST_MINUTE')
  lastMinute,
  @JsonValue('EARLY_BIRD')
  earlyBird,
}

enum PricingRuleStatus {
  @JsonValue('ACTIVE')
  active,
  @JsonValue('INACTIVE')
  inactive,
  @JsonValue('EXPIRED')
  expired,
}

@JsonSerializable()
class PricingRule extends BaseModel {
  final String name;
  final String? description;
  final PricingRuleType type;
  final PricingRuleStatus status;
  final double multiplier;
  final double? fixedPrice;
  final Map<String, dynamic>? conditions;
  @override
  final bool isActive;
  final String propertyId;

  // Relations
  final Property? property;

  PricingRule({
    required super.id,
    required super.createdAt,
    required super.updatedAt,
    super.deletedAt,
    required this.name,
    this.description,
    required this.type,
    required this.status,
    required this.multiplier,
    this.fixedPrice,
    this.conditions,
    this.isActive = true,
    required this.propertyId,
    this.property,
  }) {
    if (multiplier <= 0) {
      throw ArgumentError('Multiplier must be greater than 0');
    }
    if (fixedPrice != null && fixedPrice! <= 0) {
      throw ArgumentError('Fixed price must be greater than 0');
    }
  }

  bool get isFixedPrice => fixedPrice != null;
  bool get isMultiplier => !isFixedPrice;
  bool get isActiveNow =>
      isActive &&
      DateTime.now().isAfter(createdAt!) &&
      DateTime.now().isBefore(updatedAt!);

  factory PricingRule.fromJson(Map<String, dynamic> json) =>
      _$PricingRuleFromJson(json);

  @override
  Map<String, dynamic> toJson() => _$PricingRuleToJson(this);

  PricingRule copyWith({
    String? id,
    DateTime? createdAt,
    DateTime? updatedAt,
    DateTime? deletedAt,
    String? name,
    String? description,
    PricingRuleType? type,
    PricingRuleStatus? status,
    double? multiplier,
    double? fixedPrice,
    Map<String, dynamic>? conditions,
    bool? isActive,
    String? propertyId,
    Property? property,
  }) {
    return PricingRule(
      id: id ?? this.id,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
      deletedAt: deletedAt ?? this.deletedAt,
      name: name ?? this.name,
      description: description ?? this.description,
      type: type ?? this.type,
      status: status ?? this.status,
      multiplier: multiplier ?? this.multiplier,
      fixedPrice: fixedPrice ?? this.fixedPrice,
      conditions: conditions ?? this.conditions,
      isActive: isActive ?? this.isActive,
      propertyId: propertyId ?? this.propertyId,
      property: property ?? this.property,
    );
  }
}
