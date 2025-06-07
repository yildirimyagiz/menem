import 'package:json_annotation/json_annotation.dart';
import 'base_model.dart';
import 'user.dart';
import 'facility.dart';
import 'included_service.dart';
import 'extra_charge.dart';

part 'agency.g.dart';

enum AgencyStatus {
  @JsonValue('PENDING')
  pending,
  @JsonValue('ACTIVE')
  active,
  @JsonValue('SUSPENDED')
  suspended,
}

@JsonSerializable()
class Agency extends BaseModel {
  final String name;
  final String? description;
  final String? phone;
  final String? email;
  final String? website;
  final String? address;
  final String? logoUrl;
  final AgencyStatus status;
  final String? facilityId;
  final String? includedServiceId;
  final String? extraChargeId;
  @override
  final bool isActive;
  final String? ownerId;
  final Map<String, dynamic>? settings;
  final String? theme;
  final String? externalId;
  final Map<String, dynamic>? integration;

  // Relations
  final User? owner;
  final Facility? facility;
  final IncludedService? includedService;
  final ExtraCharge? extraCharge;

  /// Creates an [Agency] instance. Throws [ArgumentError] if required fields are empty.
  Agency({
    required super.id,
    required this.name,
    this.description,
    this.phone,
    this.email,
    this.website,
    this.address,
    this.logoUrl,
    this.status = AgencyStatus.pending,
    this.facilityId,
    this.includedServiceId,
    this.extraChargeId,
    this.isActive = true,
    this.ownerId,
    this.settings,
    this.theme,
    this.externalId,
    this.integration,
    this.owner,
    this.facility,
    this.includedService,
    this.extraCharge,
    required super.createdAt,
    required super.updatedAt,
    super.deletedAt,
  }) {
    if (name.isEmpty) throw ArgumentError('Agency name cannot be empty');
  }

  factory Agency.fromJson(Map<String, dynamic> json) => _$AgencyFromJson(json);

  @override
  Map<String, dynamic> toJson() => _$AgencyToJson(this);

  /// Returns a copy of this Agency with the given fields replaced by new values.
  /// For nullable fields, pass `explicitNull: true` to explicitly set them to null.
  Agency copyWith({
    String? id,
    String? name,
    String? description,
    bool descriptionExplicitNull = false,
    String? phone,
    bool phoneExplicitNull = false,
    String? email,
    bool emailExplicitNull = false,
    String? website,
    bool websiteExplicitNull = false,
    String? address,
    bool addressExplicitNull = false,
    String? logoUrl,
    bool logoUrlExplicitNull = false,
    AgencyStatus? status,
    String? facilityId,
    bool facilityIdExplicitNull = false,
    String? includedServiceId,
    bool includedServiceIdExplicitNull = false,
    String? extraChargeId,
    bool extraChargeIdExplicitNull = false,
    bool? isActive,
    String? ownerId,
    bool ownerIdExplicitNull = false,
    Map<String, dynamic>? settings,
    bool settingsExplicitNull = false,
    String? theme,
    bool themeExplicitNull = false,
    String? externalId,
    bool externalIdExplicitNull = false,
    Map<String, dynamic>? integration,
    bool integrationExplicitNull = false,
    User? owner,
    bool ownerExplicitNull = false,
    Facility? facility,
    bool facilityExplicitNull = false,
    IncludedService? includedService,
    bool includedServiceExplicitNull = false,
    ExtraCharge? extraCharge,
    bool extraChargeExplicitNull = false,
    DateTime? createdAt,
    DateTime? updatedAt,
    DateTime? deletedAt,
  }) {
    return Agency(
      id: id ?? this.id,
      name: name ?? this.name,
      description: descriptionExplicitNull ? null : (description ?? this.description),
      phone: phoneExplicitNull ? null : (phone ?? this.phone),
      email: emailExplicitNull ? null : (email ?? this.email),
      website: websiteExplicitNull ? null : (website ?? this.website),
      address: addressExplicitNull ? null : (address ?? this.address),
      logoUrl: logoUrlExplicitNull ? null : (logoUrl ?? this.logoUrl),
      status: status ?? this.status,
      facilityId: facilityIdExplicitNull ? null : (facilityId ?? this.facilityId),
      includedServiceId: includedServiceIdExplicitNull ? null : (includedServiceId ?? this.includedServiceId),
      extraChargeId: extraChargeIdExplicitNull ? null : (extraChargeId ?? this.extraChargeId),
      isActive: isActive ?? this.isActive,
      ownerId: ownerIdExplicitNull ? null : (ownerId ?? this.ownerId),
      settings: settingsExplicitNull ? null : (settings ?? this.settings),
      theme: themeExplicitNull ? null : (theme ?? this.theme),
      externalId: externalIdExplicitNull ? null : (externalId ?? this.externalId),
      integration: integrationExplicitNull ? null : (integration ?? this.integration),
      owner: ownerExplicitNull ? null : (owner ?? this.owner),
      facility: facilityExplicitNull ? null : (facility ?? this.facility),
      includedService: includedServiceExplicitNull ? null : (includedService ?? this.includedService),
      extraCharge: extraChargeExplicitNull ? null : (extraCharge ?? this.extraCharge),
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
      deletedAt: deletedAt ?? this.deletedAt,
    );
  }
}
