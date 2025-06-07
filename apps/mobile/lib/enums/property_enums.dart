import 'package:json_annotation/json_annotation.dart';

enum ListingType {
  @JsonValue('SALE')
  sale,
  @JsonValue('RENT')
  rent,
  @JsonValue('BOOKING')
  booking,
}

enum PropertyType {
  @JsonValue('APARTMENT')
  apartment,
  @JsonValue('HOUSE')
  house,
  @JsonValue('OFFICE')
  office,
  @JsonValue('LAND')
  land,
  @JsonValue('COMMERCIAL')
  commercial,
  @JsonValue('INDUSTRIAL')
  industrial,
  @JsonValue('OTHER')
  other,
  residential,
}

enum PropertyStatus {
  @JsonValue('AVAILABLE')
  available,
  @JsonValue('PENDING')
  pending,
  @JsonValue('SOLD')
  sold,
  @JsonValue('RENTED')
  rented,
  @JsonValue('OFF_MARKET')
  offMarket,
  underContract,
  pendingApproval,
  maintenance,

  foreclosure,
  draft,
  inactive,
}

enum PropertyCategory {
  @JsonValue('RESIDENTIAL')
  residential,
  @JsonValue('COMMERCIAL')
  commercial,
  @JsonValue('INDUSTRIAL')
  industrial,
  @JsonValue('LAND')
  land,
  @JsonValue('OTHER')
  other,
  apartment,
}

enum PropertyCondition {
  @JsonValue('NEW_CONSTRUCTION')
  newConstruction,
  @JsonValue('EXCELLENT')
  excellent,
  @JsonValue('GOOD')
  good,
  @JsonValue('NEEDS_REPAIR')
  needsRepair,
  @JsonValue('RENOVATED')
  renovated,
  @JsonValue('FIXER_UPPER')
  fixerUpper,
}

enum BuildingClass {
  @JsonValue('A')
  a,
  @JsonValue('B')
  b,
  @JsonValue('C')
  c,
  @JsonValue('D')
  d,
}

enum EnergyRating {
  @JsonValue('A')
  a,
  @JsonValue('B')
  b,
  @JsonValue('C')
  c,
  @JsonValue('D')
  d,
  @JsonValue('E')
  e,
  @JsonValue('F')
  f,
  @JsonValue('G')
  g,
}

enum OwnershipType {
  @JsonValue('FREEHOLD')
  freehold,
  @JsonValue('LEASEHOLD')
  leasehold,
  @JsonValue('STRATA')
  strata,
  @JsonValue('CROSS_LEASE')
  crossLease,
  @JsonValue('COMPANY_SHARE')
  companyShare,
  @JsonValue('OTHER')
  other,
}

enum OwnershipCategory {
  @JsonValue('FREEHOLD')
  freehold,
  @JsonValue('LEASEHOLD')
  leasehold,
  @JsonValue('STRATA')
  strata,
  @JsonValue('CROSS_LEASE')
  crossLease,
  @JsonValue('COMPANY_SHARE')
  companyShare,
  @JsonValue('OTHER')
  other,
}

enum ContactMethod {
  @JsonValue('PHONE')
  phone,
  @JsonValue('EMAIL')
  email,
  @JsonValue('SMS')
  sms,
  @JsonValue('WHATSAPP')
  whatsapp,
  @JsonValue('OTHER')
  other,
}

enum PropertyFeatures {
  @JsonValue('AIR_CONDITIONING')
  airConditioning,
  @JsonValue('BALCONY')
  balcony,
  @JsonValue('FIREPLACE')
  fireplace,
  @JsonValue('GARAGE')
  garage,
  @JsonValue('GARDEN')
  garden,
  @JsonValue('POOL')
  pool,
  @JsonValue('SECURITY_SYSTEM')
  securitySystem,
  @JsonValue('ELEVATOR')
  elevator,
  @JsonValue('FURNISHED')
  furnished,
  @JsonValue('PETS_ALLOWED')
  petsAllowed,
  attic,
  smartHome,
  basement,
  parking,
  terrace,
}

enum PropertyAmenities {
  @JsonValue('GYM')
  gym,
  @JsonValue('PARKING')
  parking,
  @JsonValue('SECURITY')
  security,
  @JsonValue('SWIMMING_POOL')
  swimmingPool,
  @JsonValue('PLAYGROUND')
  playground,
  @JsonValue('ELEVATOR')
  elevator,
  @JsonValue('AIR_CONDITIONING')
  airConditioning,
  @JsonValue('HEATING')
  heating,
  @JsonValue('LAUNDRY')
  laundry,
  @JsonValue('STORAGE')
  storage,
  spa,
  sauna,
  tennisCourt,
  basketballCourt,
  communityCenter,
  businessCenter,
  conferenceRoom,
  petFriendly,
  wifi,
}
