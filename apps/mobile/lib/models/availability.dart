import 'package:json_annotation/json_annotation.dart';
import 'base_model.dart';
import 'property.dart';
import 'reservation.dart';
import 'pricing_rule.dart';

part 'availability.g.dart';

@JsonSerializable()
class Availability extends BaseModel {
  final bool? _isActive;
  @override
  bool get isActive => !isDeleted && (_isActive ?? true);
  final DateTime date;
  final bool isBlocked;
  final bool isBooked;
  final String propertyId;
  final String? reservationId;
  final String? pricingRuleId;
  final int totalUnits;
  final int availableUnits;
  final int bookedUnits;
  final int blockedUnits;
  final Map<String, dynamic>? specialPricing;
  final double basePrice;
  final double currentPrice;
  final Map<String, dynamic>? priceSettings;
  final int? minNights;
  final int? maxNights;
  final int maxGuests;
  final Map<String, dynamic>? discountSettings;
  final double? weekendRate;
  final double? weekdayRate;
  final double? weekendMultiplier;
  final double? weekdayMultiplier;
  final double? seasonalMultiplier;

  // Relations
  final Property? property;
  final Reservation? reservation;
  final PricingRule? pricingRule;

  Availability({
    required this.date,
    required super.id,
    required super.createdAt,
    required super.updatedAt,
    super.deletedAt,
    required this.isBlocked,
    required this.isBooked,
    required this.propertyId,
    this.reservationId,
    this.pricingRuleId,
    required this.totalUnits,
    required this.availableUnits,
    required this.bookedUnits,
    required this.blockedUnits,
    this.specialPricing,
    required this.basePrice,
    required this.currentPrice,
    this.priceSettings,
    this.minNights,
    this.maxNights,
    required this.maxGuests,
    this.discountSettings,
    this.weekendRate,
    this.weekdayRate,
    this.weekendMultiplier,
    this.weekdayMultiplier,
    this.seasonalMultiplier,
    this.property,
    this.reservation,
    this.pricingRule,
    bool? isActive,
  }) : _isActive = isActive {
    if (totalUnits < 0) {
      throw ArgumentError('Total units cannot be negative');
    }
    if (availableUnits < 0) {
      throw ArgumentError('Available units cannot be negative');
    }
    if (bookedUnits < 0) {
      throw ArgumentError('Booked units cannot be negative');
    }
    if (blockedUnits < 0) {
      throw ArgumentError('Blocked units cannot be negative');
    }
    if (basePrice < 0) {
      throw ArgumentError('Base price cannot be negative');
    }
    if (currentPrice < 0) {
      throw ArgumentError('Current price cannot be negative');
    }
    if (maxGuests < 1) {
      throw ArgumentError('Max guests must be at least 1');
    }
  }

  bool get isAvailable => !isBlocked && !isBooked;
  bool get hasSpecialPricing => specialPricing != null;
  bool get hasDiscount => discountSettings != null;
  bool get isWeekend =>
      date.weekday == DateTime.saturday || date.weekday == DateTime.sunday;
  double get effectivePrice =>
      currentPrice *
      (isWeekend ? (weekendMultiplier ?? 1.0) : (weekdayMultiplier ?? 1.0)) *
      (seasonalMultiplier ?? 1.0);

  factory Availability.fromJson(Map<String, dynamic> json) =>
      Availability(
        id: json['id'] as String,
        createdAt: DateTime.parse(json['createdAt'] as String),
        updatedAt: DateTime.parse(json['updatedAt'] as String),
        deletedAt: json['deletedAt'] != null ? DateTime.parse(json['deletedAt'] as String) : null,
        date: DateTime.parse(json['date'] as String),
        isBlocked: json['isBlocked'] as bool,
        isBooked: json['isBooked'] as bool,
        propertyId: json['propertyId'] as String,
        reservationId: json['reservationId'] as String?,
        pricingRuleId: json['pricingRuleId'] as String?,
        totalUnits: json['totalUnits'] as int,
        availableUnits: json['availableUnits'] as int,
        bookedUnits: json['bookedUnits'] as int,
        blockedUnits: json['blockedUnits'] as int,
        specialPricing: json['specialPricing'] as Map<String, dynamic>?,
        basePrice: (json['basePrice'] as num).toDouble(),
        currentPrice: (json['currentPrice'] as num).toDouble(),
        priceSettings: json['priceSettings'] as Map<String, dynamic>?,
        minNights: json['minNights'] as int?,
        maxNights: json['maxNights'] as int?,
        maxGuests: json['maxGuests'] as int,
        discountSettings: json['discountSettings'] as Map<String, dynamic>?,
        weekendRate: (json['weekendRate'] as num?)?.toDouble(),
        weekdayRate: (json['weekdayRate'] as num?)?.toDouble(),
        weekendMultiplier: (json['weekendMultiplier'] as num?)?.toDouble(),
        weekdayMultiplier: (json['weekdayMultiplier'] as num?)?.toDouble(),
        seasonalMultiplier: (json['seasonalMultiplier'] as num?)?.toDouble(),
        property: null, // handle relations separately if needed
        reservation: null,
        pricingRule: null,
        isActive: json['isActive'] as bool?,
      );

  @override
  Map<String, dynamic> toJson() => {
    ..._$AvailabilityToJson(this),
    'isActive': _isActive,
  };

  /// Returns a copy of this Availability with the given fields replaced by new values.
  /// For nullable fields, pass `explicitNull: true` to explicitly set them to null.
  Availability copyWith({
    String? id,
    DateTime? createdAt,
    DateTime? updatedAt,
    DateTime? deletedAt,
    DateTime? date,
    bool? isBlocked,
    bool? isBooked,
    String? propertyId,
    String? reservationId,
    bool reservationIdExplicitNull = false,
    String? pricingRuleId,
    bool pricingRuleIdExplicitNull = false,
    int? totalUnits,
    int? availableUnits,
    int? bookedUnits,
    int? blockedUnits,
    Map<String, dynamic>? specialPricing,
    bool specialPricingExplicitNull = false,
    double? basePrice,
    double? currentPrice,
    Map<String, dynamic>? priceSettings,
    bool priceSettingsExplicitNull = false,
    int? minNights,
    bool minNightsExplicitNull = false,
    int? maxNights,
    bool maxNightsExplicitNull = false,
    int? maxGuests,
    Map<String, dynamic>? discountSettings,
    bool discountSettingsExplicitNull = false,
    double? weekendRate,
    bool weekendRateExplicitNull = false,
    double? weekdayRate,
    bool weekdayRateExplicitNull = false,
    double? weekendMultiplier,
    double? weekdayMultiplier,
    double? seasonalMultiplier,
    Property? property,
    bool propertyExplicitNull = false,
    Reservation? reservation,
    bool reservationExplicitNull = false,
    PricingRule? pricingRule,
    bool pricingRuleExplicitNull = false,
    bool? isActive,
  }) {
    return Availability(
      id: id ?? this.id,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
      deletedAt: deletedAt ?? this.deletedAt,
      date: date ?? this.date,
      isBlocked: isBlocked ?? this.isBlocked,
      isBooked: isBooked ?? this.isBooked,
      propertyId: propertyId ?? this.propertyId,
      reservationId: reservationIdExplicitNull ? null : (reservationId ?? this.reservationId),
      pricingRuleId: pricingRuleIdExplicitNull ? null : (pricingRuleId ?? this.pricingRuleId),
      totalUnits: totalUnits ?? this.totalUnits,
      availableUnits: availableUnits ?? this.availableUnits,
      bookedUnits: bookedUnits ?? this.bookedUnits,
      blockedUnits: blockedUnits ?? this.blockedUnits,
      specialPricing: specialPricingExplicitNull ? null : (specialPricing ?? this.specialPricing),
      basePrice: basePrice ?? this.basePrice,
      currentPrice: currentPrice ?? this.currentPrice,
      priceSettings: priceSettingsExplicitNull ? null : (priceSettings ?? this.priceSettings),
      minNights: minNightsExplicitNull ? null : (minNights ?? this.minNights),
      maxNights: maxNightsExplicitNull ? null : (maxNights ?? this.maxNights),
      maxGuests: maxGuests ?? this.maxGuests,
      discountSettings: discountSettingsExplicitNull ? null : (discountSettings ?? this.discountSettings),
      weekendRate: weekendRateExplicitNull ? null : (weekendRate ?? this.weekendRate),
      weekdayRate: weekdayRateExplicitNull ? null : (weekdayRate ?? this.weekdayRate),
      weekendMultiplier: weekendMultiplier ?? this.weekendMultiplier,
      weekdayMultiplier: weekdayMultiplier ?? this.weekdayMultiplier,
      seasonalMultiplier: seasonalMultiplier ?? this.seasonalMultiplier,
      property: propertyExplicitNull ? null : (property ?? this.property),
      reservation: reservationExplicitNull ? null : (reservation ?? this.reservation),
      pricingRule: pricingRuleExplicitNull ? null : (pricingRule ?? this.pricingRule),
      isActive: isActive ?? _isActive,
    );
  }
}
