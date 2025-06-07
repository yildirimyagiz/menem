// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'availability.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

Availability _$AvailabilityFromJson(Map<String, dynamic> json) => Availability(
      date: DateTime.parse(json['date'] as String),
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
      isBlocked: json['isBlocked'] as bool,
      isBooked: json['isBooked'] as bool,
      propertyId: json['propertyId'] as String,
      reservationId: json['reservationId'] as String?,
      pricingRuleId: json['pricingRuleId'] as String?,
      totalUnits: (json['totalUnits'] as num).toInt(),
      availableUnits: (json['availableUnits'] as num).toInt(),
      bookedUnits: (json['bookedUnits'] as num).toInt(),
      blockedUnits: (json['blockedUnits'] as num).toInt(),
      specialPricing: json['specialPricing'] as Map<String, dynamic>?,
      basePrice: (json['basePrice'] as num).toDouble(),
      currentPrice: (json['currentPrice'] as num).toDouble(),
      priceSettings: json['priceSettings'] as Map<String, dynamic>?,
      minNights: (json['minNights'] as num?)?.toInt(),
      maxNights: (json['maxNights'] as num?)?.toInt(),
      maxGuests: (json['maxGuests'] as num).toInt(),
      discountSettings: json['discountSettings'] as Map<String, dynamic>?,
      weekendRate: (json['weekendRate'] as num?)?.toDouble(),
      weekdayRate: (json['weekdayRate'] as num?)?.toDouble(),
      weekendMultiplier: (json['weekendMultiplier'] as num?)?.toDouble(),
      weekdayMultiplier: (json['weekdayMultiplier'] as num?)?.toDouble(),
      seasonalMultiplier: (json['seasonalMultiplier'] as num?)?.toDouble(),
      property: json['property'] == null
          ? null
          : Property.fromJson(json['property'] as Map<String, dynamic>),
      reservation: json['reservation'] == null
          ? null
          : Reservation.fromJson(json['reservation'] as Map<String, dynamic>),
      pricingRule: json['pricingRule'] == null
          ? null
          : PricingRule.fromJson(json['pricingRule'] as Map<String, dynamic>),
      isActive: json['isActive'] as bool?,
    );

Map<String, dynamic> _$AvailabilityToJson(Availability instance) =>
    <String, dynamic>{
      'id': instance.id,
      'createdAt': instance.createdAt?.toIso8601String(),
      'updatedAt': instance.updatedAt?.toIso8601String(),
      'deletedAt': instance.deletedAt?.toIso8601String(),
      'isActive': instance.isActive,
      'date': instance.date.toIso8601String(),
      'isBlocked': instance.isBlocked,
      'isBooked': instance.isBooked,
      'propertyId': instance.propertyId,
      'reservationId': instance.reservationId,
      'pricingRuleId': instance.pricingRuleId,
      'totalUnits': instance.totalUnits,
      'availableUnits': instance.availableUnits,
      'bookedUnits': instance.bookedUnits,
      'blockedUnits': instance.blockedUnits,
      'specialPricing': instance.specialPricing,
      'basePrice': instance.basePrice,
      'currentPrice': instance.currentPrice,
      'priceSettings': instance.priceSettings,
      'minNights': instance.minNights,
      'maxNights': instance.maxNights,
      'maxGuests': instance.maxGuests,
      'discountSettings': instance.discountSettings,
      'weekendRate': instance.weekendRate,
      'weekdayRate': instance.weekdayRate,
      'weekendMultiplier': instance.weekendMultiplier,
      'weekdayMultiplier': instance.weekdayMultiplier,
      'seasonalMultiplier': instance.seasonalMultiplier,
      'property': instance.property,
      'reservation': instance.reservation,
      'pricingRule': instance.pricingRule,
    };
