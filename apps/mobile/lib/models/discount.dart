import 'package:json_annotation/json_annotation.dart';
import 'base_model.dart';

part 'discount.g.dart';

enum DiscountType {
  @JsonValue('PERCENTAGE')
  percentage,
  @JsonValue('FIXED')
  fixed,
  @JsonValue('SEASONAL')
  seasonal,
  @JsonValue('LOYALTY')
  loyalty,
  @JsonValue('PROMOTION')
  promotion,
  @JsonValue('COUPON')
  coupon,
}

enum DiscountStatus {
  @JsonValue('ACTIVE')
  active,
  @JsonValue('INACTIVE')
  inactive,
  @JsonValue('EXPIRED')
  expired,
}

@JsonSerializable()
class Discount extends BaseModel {
  final String? name;
  final String code;
  final String description;
  final DiscountType type;
  final DiscountStatus status;
  final double value;
  final String? currency;
  final DateTime startDate;
  final DateTime endDate;
  final int? maxUses;
  final int currentUses;
  final double? minAmount;
  final double? maxAmount;
  final bool isPublic;
  final List<String>? applicablePropertyIds;
  final List<String>? applicableUserIds;
  final Map<String, dynamic>? conditions;
  final int? minNights;
  final int? maxNights;
  final DateTime? firstBookingDate;
  final DateTime? lastBookingDate;
  final Map<String, dynamic>? metadata;
  final String? createdBy;
  final String? updatedBy;
  final Map<String, dynamic>? customFields;
  final String? propertyId;
  final String? pricingRuleId;

  Discount({
    required super.id,
    required super.createdAt,
    required super.updatedAt,
    super.deletedAt,
    this.name,
    required this.code,
    required this.description,
    required this.type,
    required this.status,
    required this.value,
    this.currency,
    required this.startDate,
    required this.endDate,
    this.maxUses,
    required this.currentUses,
    this.minAmount,
    this.maxAmount,
    required this.isPublic,
    this.applicablePropertyIds,
    this.applicableUserIds,
    this.conditions,
    this.minNights,
    this.maxNights,
    this.firstBookingDate,
    this.lastBookingDate,
    this.metadata,
    this.createdBy,
    this.updatedBy,
    this.customFields,
    this.propertyId,
    this.pricingRuleId,
  }) {
    if (code.isEmpty) {
      throw ArgumentError('Discount code cannot be empty');
    }
    if (value < 0) {
      throw ArgumentError('Discount value cannot be negative');
    }
    if (maxAmount != null && maxAmount! < 0) {
      throw ArgumentError('Max amount cannot be negative');
    }
    if (minAmount != null && minAmount! < 0) {
      throw ArgumentError('Min amount cannot be negative');
    }
    if (maxUses != null && maxUses! < 0) {
      throw ArgumentError('Max uses cannot be negative');
    }
    if (currentUses < 0) {
      throw ArgumentError('Current uses cannot be negative');
    }
    if (startDate.isAfter(endDate)) {
      throw ArgumentError('Start date cannot be after end date');
    }
  }

  bool get isPercentage => type == DiscountType.percentage;
  bool get isFixed => type == DiscountType.fixed;
  bool get isSeasonal => type == DiscountType.seasonal;
  bool get isLoyalty => type == DiscountType.loyalty;
  bool get isPromotion => type == DiscountType.promotion;
  bool get isCoupon => type == DiscountType.coupon;
  bool get isExpired => DateTime.now().isAfter(endDate);
  bool get isValid =>
      status == DiscountStatus.active &&
      !isExpired &&
      (maxUses == null || currentUses < maxUses!);

  factory Discount.fromJson(Map<String, dynamic> json) {
    return Discount(
      id: json['id'],
      createdAt: DateTime.parse(json['createdAt']),
      name: json['name'] as String?,
      updatedAt: DateTime.parse(json['updatedAt']),
      deletedAt:
          json['deletedAt'] != null ? DateTime.parse(json['deletedAt']) : null,
      code: json['code'],
      description: json['description'],
      type: DiscountType.values.firstWhere(
        (e) => e.toString().split('.').last == json['type'],
      ),
      status: DiscountStatus.values.firstWhere(
        (e) => e.toString().split('.').last == json['status'],
      ),
      value: json['value'].toDouble(),
      currency: json['currency'],
      startDate: DateTime.parse(json['startDate']),
      endDate: DateTime.parse(json['endDate']),
      maxUses: json['maxUses'],
      currentUses: json['currentUses'],
      minAmount: json['minAmount']?.toDouble(),
      maxAmount: json['maxAmount']?.toDouble(),
      isPublic: json['isPublic'],
      applicablePropertyIds: json['applicablePropertyIds'] != null
          ? List<String>.from(json['applicablePropertyIds'])
          : null,
      applicableUserIds: json['applicableUserIds'] != null
          ? List<String>.from(json['applicableUserIds'])
          : null,
      conditions: json['conditions'],
      minNights: json['minNights'],
      maxNights: json['maxNights'],
      firstBookingDate: json['firstBookingDate'] != null
          ? DateTime.parse(json['firstBookingDate'])
          : null,
      lastBookingDate: json['lastBookingDate'] != null
          ? DateTime.parse(json['lastBookingDate'])
          : null,
      metadata: json['metadata'],
      createdBy: json['createdBy'],
      updatedBy: json['updatedBy'],
      customFields: json['customFields'],
      propertyId: json['propertyId'] as String?,
      pricingRuleId: json['pricingRuleId'] as String?,
    );
  }

  get amount => null;

  @override
  Map<String, dynamic> toJson() {
    return {
      ...super.toJson(),
      'code': code,
      'description': description,
      'name': name,
      'type': type.toString().split('.').last,
      'status': status.toString().split('.').last,
      'value': value,
      'currency': currency,
      'startDate': startDate.toIso8601String(),
      'endDate': endDate.toIso8601String(),
      'maxUses': maxUses,
      'currentUses': currentUses,
      'minAmount': minAmount,
      'maxAmount': maxAmount,
      'isPublic': isPublic,
      'applicablePropertyIds': applicablePropertyIds,
      'applicableUserIds': applicableUserIds,
      'conditions': conditions,
      'minNights': minNights,
      'maxNights': maxNights,
      'firstBookingDate': firstBookingDate?.toIso8601String(),
      'lastBookingDate': lastBookingDate?.toIso8601String(),
      'metadata': metadata,
      'createdBy': createdBy,
      'updatedBy': updatedBy,
      'customFields': customFields,
    };
  }

  Discount copyWith({
    String? id,
    DateTime? createdAt,
    DateTime? updatedAt,
    DateTime? deletedAt,
    String? name,
    String? code,
    String? description,
    DiscountType? type,
    DiscountStatus? status,
    double? value,
    String? currency,
    DateTime? startDate,
    DateTime? endDate, // Ensure isActive is here
    int? maxUses,
    int? currentUses,
    double? minAmount,
    double? maxAmount,
    bool? isPublic,
    List<String>? applicablePropertyIds,
    List<String>? applicableUserIds,
    Map<String, dynamic>? conditions,
    int? minNights,
    int? maxNights,
    DateTime? firstBookingDate,
    DateTime? lastBookingDate,
    Map<String, dynamic>? metadata,
    String? createdBy,
    String? updatedBy,
    Map<String, dynamic>? customFields,
    String? propertyId,
    String? pricingRuleId,
    bool? isActive, // Added isActive to map to status
  }) {
    return Discount(
      id: id ?? this.id,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
      deletedAt: deletedAt ?? this.deletedAt,
      code: code ?? this.code,
      name: name ?? this.name,
      description: description ?? this.description,
      type: type ?? this.type,
      status: isActive != null
          ? (isActive ? DiscountStatus.active : DiscountStatus.inactive)
          : (status ?? this.status),
      value: value ?? this.value,
      currency: currency ?? this.currency,
      startDate: startDate ?? this.startDate,
      endDate: endDate ?? this.endDate,
      maxUses: maxUses ?? this.maxUses,
      currentUses: currentUses ?? this.currentUses,
      minAmount: minAmount ?? this.minAmount,
      maxAmount: maxAmount ?? this.maxAmount,
      isPublic: isPublic ?? this.isPublic,
      applicablePropertyIds:
          applicablePropertyIds ?? this.applicablePropertyIds,
      applicableUserIds: applicableUserIds ?? this.applicableUserIds,
      conditions: conditions ?? this.conditions,
      minNights: minNights ?? this.minNights,
      maxNights: maxNights ?? this.maxNights,
      firstBookingDate: firstBookingDate ?? this.firstBookingDate,
      lastBookingDate: lastBookingDate ?? this.lastBookingDate,
      metadata: metadata ?? this.metadata,
      createdBy: createdBy ?? this.createdBy,
      updatedBy: updatedBy ?? this.updatedBy,
      customFields: customFields ?? this.customFields,
      propertyId: propertyId ?? this.propertyId,
      pricingRuleId: pricingRuleId ?? this.pricingRuleId,
    );
  }
}
