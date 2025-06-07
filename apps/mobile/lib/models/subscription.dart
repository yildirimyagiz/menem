import 'package:json_annotation/json_annotation.dart';
import 'base_model.dart';

part 'subscription.g.dart';

enum SubscriptionStatus {
  @JsonValue('active')
  active,
  @JsonValue('pending')
  pending,
  @JsonValue('cancelled')
  cancelled,
  @JsonValue('expired')
  expired
}

enum SubscriptionPlan {
  @JsonValue('basic')
  basic,
  @JsonValue('premium')
  premium,
  @JsonValue('enterprise')
  enterprise
}

@JsonSerializable()
class Subscription extends BaseModel {
  final SubscriptionPlan plan;
  final SubscriptionStatus status;
  final DateTime startDate;
  final DateTime endDate;
  final double price;
  final String currency;

  Subscription({
    required super.id,
    required this.plan,
    required this.status,
    required this.startDate,
    required this.endDate,
    required this.price,
    required this.currency,
    required super.createdAt,
    required super.updatedAt,
    super.deletedAt,
  }) {
    if (price <= 0) {
      throw ArgumentError('Price must be greater than 0');
    }
    if (startDate.isAfter(endDate)) {
      throw ArgumentError('Start date cannot be after end date');
    }
  }

  factory Subscription.fromJson(Map<String, dynamic> json) =>
      _$SubscriptionFromJson(json);

  @override
  Map<String, dynamic> toJson() => _$SubscriptionToJson(this);

  Subscription copyWith({
    String? id,
    SubscriptionPlan? plan,
    SubscriptionStatus? status,
    DateTime? startDate,
    DateTime? endDate,
    double? price,
    String? currency,
    DateTime? createdAt,
    DateTime? updatedAt,
    DateTime? deletedAt,
  }) {
    return Subscription(
      id: id ?? this.id,
      plan: plan ?? this.plan,
      status: status ?? this.status,
      startDate: startDate ?? this.startDate,
      endDate: endDate ?? this.endDate,
      price: price ?? this.price,
      currency: currency ?? this.currency,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
      deletedAt: deletedAt ?? this.deletedAt,
    );
  }

  @override
  bool get isActive => status == SubscriptionStatus.active;
  bool get isPending => status == SubscriptionStatus.pending;
  bool get isCancelled => status == SubscriptionStatus.cancelled;
  bool get isExpired => status == SubscriptionStatus.expired;

  bool get isBasic => plan == SubscriptionPlan.basic;
  bool get isPremium => plan == SubscriptionPlan.premium;
  bool get isEnterprise => plan == SubscriptionPlan.enterprise;

  bool get isExpiringSoon {
    final daysUntilExpiry = endDate.difference(DateTime.now()).inDays;
    return daysUntilExpiry <= 7 && daysUntilExpiry > 0;
  }

  Object? get type => null;

  get userId => null;
}
