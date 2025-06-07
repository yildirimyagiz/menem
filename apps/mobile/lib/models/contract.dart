import 'package:json_annotation/json_annotation.dart';
import 'base_model.dart';

part 'contract.g.dart';

enum ContractStatus {
  @JsonValue('DRAFT')
  draft,
  @JsonValue('ACTIVE')
  active,
  @JsonValue('EXPIRED')
  expired,
  @JsonValue('TERMINATED')
  terminated,
  @JsonValue('RENEWED')
  renewed,
  @JsonValue('PENDING')
  pending,
  @JsonValue('ARCHIVED')
  archived
}

enum ContractType {
  @JsonValue('RENTAL')
  rental,
  @JsonValue('SALE')
  sale,
  @JsonValue('MANAGEMENT')
  management,
  @JsonValue('COMMISSION')
  commission,
  @JsonValue('SERVICE')
  service,
}

@JsonSerializable()
class Contract extends BaseModel {
  final String name;
  final String description;
  final ContractType type;
  final ContractStatus status;
  final DateTime startDate;
  final DateTime endDate;
  final double rentAmount;
  final String currency;
  final int noticePeriod;
  final String propertyId;
  final String tenantId;
  final String landlordId;
  final Map<String, dynamic> terms;
  final Map<String, dynamic>? conditions;
  final Map<String, dynamic>? metadata;
  final String? signedBy;
  final DateTime? signedAt;
  final String? terminatedBy;
  final DateTime? terminatedAt;
  final String? cancelledBy;
  final DateTime? cancelledAt;
  final String? ownerId;
  final String? agencyId;
  @JsonKey(name: 'Property')
  final Map<String, dynamic>? property;
  @JsonKey(name: 'Tenant')
  final Map<String, dynamic>? tenant;
  @JsonKey(name: 'Owner')
  final Map<String, dynamic>? owner;
  @JsonKey(name: 'Agency')
  final Map<String, dynamic>? agency;
  @JsonKey(name: 'Increase')
  final List<Map<String, dynamic>>? increases;

  Contract({
    required super.id,
    required super.createdAt,
    required super.updatedAt,
    super.deletedAt,
    required this.name,
    required this.description,
    required this.type,
    required this.status,
    required this.startDate,
    required this.endDate,
    required this.rentAmount,
    required this.currency,
    required this.noticePeriod,
    required this.propertyId,
    required this.tenantId,
    required this.landlordId,
    required this.terms,
    this.conditions,
    this.metadata,
    this.signedBy,
    this.signedAt,
    this.terminatedBy,
    this.terminatedAt,
    this.cancelledBy,
    this.cancelledAt,
    this.ownerId,
    this.agencyId,
    this.property,
    this.tenant,
    this.owner,
    this.agency,
    this.increases,
  }) {
    if (name.isEmpty) {
      throw ArgumentError('Contract name cannot be empty');
    }
    if (description.isEmpty) {
      throw ArgumentError('Contract description cannot be empty');
    }
    if (startDate.isAfter(endDate)) {
      throw ArgumentError('Start date cannot be after end date');
    }
  }

  factory Contract.fromJson(Map<String, dynamic> json) =>
      _$ContractFromJson(json);
  @override
  Map<String, dynamic> toJson() => _$ContractToJson(this);

  // Add all the getter methods
  bool get isDraft => status == ContractStatus.draft;
  bool get isPending => status == ContractStatus.pending;
  @override
  bool get isActive => status == ContractStatus.active;
  bool get isExpired => status == ContractStatus.expired;
  bool get isTerminated => status == ContractStatus.terminated;
  bool get isArchived => status == ContractStatus.archived;
  bool get isSigned => signedAt != null;
  bool get isRental => type == ContractType.rental;
  bool get isSale => type == ContractType.sale;
  bool get isManagement => type == ContractType.management;
  bool get isCommission => type == ContractType.commission;
  bool get isService => type == ContractType.service;
  bool get hasExpired => DateTime.now().isAfter(endDate);
  bool get isValid => isSigned && !hasExpired && !isTerminated && !isArchived;
  bool get hasTenant => tenantId.isNotEmpty;
  bool get hasProperty => propertyId.isNotEmpty;
  bool get hasAgency => agencyId?.isNotEmpty ?? false;
  bool get hasOwner => ownerId != null;
  bool get canBeSigned => isDraft && hasTenant && hasProperty && hasAgency;
  bool get canBeTerminated => isActive && !isTerminated;
  bool get canBeCancelled => isPending && !isCancelled;
  bool get isCancelled => cancelledAt != null;
  bool get isFullyValid =>
      isValid && hasTenant && hasProperty && hasAgency && hasOwner;
  bool get isRentalContract => type == ContractType.rental;
  bool get isSaleContract => type == ContractType.sale;
  bool get isManagementContract => type == ContractType.management;
  bool get isCommissionContract => type == ContractType.commission;
  bool get isServiceContract => type == ContractType.service;
  bool get requiresTenant => isRentalContract || isManagementContract;
  bool get requiresProperty =>
      isRentalContract || isSaleContract || isManagementContract;
  bool get requiresAgency =>
      isRentalContract ||
      isSaleContract ||
      isManagementContract ||
      isCommissionContract;
  bool get requiresOwner =>
      isRentalContract || isSaleContract || isManagementContract;

  void validateRelationships() {
    if (requiresTenant && !hasTenant) {
      throw ArgumentError('This contract type requires a tenant');
    }
    if (requiresProperty && !hasProperty) {
      throw ArgumentError('This contract type requires a property');
    }
    if (requiresAgency && !hasAgency) {
      throw ArgumentError('This contract type requires an agency');
    }
    if (requiresOwner && !hasOwner) {
      throw ArgumentError('This contract type requires an owner');
    }
  }

  Contract sign(String signedBy) {
    if (!canBeSigned) {
      throw ArgumentError('Contract cannot be signed in its current state');
    }
    validateRelationships();
    return copyWith(
      status: ContractStatus.active,
      signedBy: signedBy,
      signedAt: DateTime.now(),
    );
  }

  Contract terminate(String terminatedBy) {
    if (!canBeTerminated) {
      throw ArgumentError('Contract cannot be terminated in its current state');
    }
    return copyWith(
      status: ContractStatus.terminated,
      terminatedBy: terminatedBy,
      terminatedAt: DateTime.now(),
    );
  }

  Contract cancel(String cancelledBy) {
    if (!canBeCancelled) {
      throw ArgumentError('Contract cannot be cancelled in its current state');
    }
    return copyWith(
      status: ContractStatus.archived,
      cancelledBy: cancelledBy,
      cancelledAt: DateTime.now(),
    );
  }

  Contract archive() {
    if (!isExpired && !isTerminated) {
      throw ArgumentError(
          'Only expired or terminated contracts can be archived');
    }
    return copyWith(status: ContractStatus.archived);
  }

  /// Returns a copy of this Contract with the given fields replaced by new values.
  /// For nullable fields, pass `explicitNull: true` to explicitly set them to null.
  Contract copyWith({
    String? id,
    DateTime? createdAt,
    DateTime? updatedAt,
    DateTime? deletedAt,
    String? name,
    String? description,
    ContractType? type,
    ContractStatus? status,
    DateTime? startDate,
    DateTime? endDate,
    double? rentAmount,
    String? currency,
    int? noticePeriod,
    String? propertyId,
    bool propertyIdExplicitNull = false,
    String? tenantId,
    bool tenantIdExplicitNull = false,
    String? landlordId,
    bool landlordIdExplicitNull = false,
    Map<String, dynamic>? terms,
    bool termsExplicitNull = false,
    Map<String, dynamic>? conditions,
    bool conditionsExplicitNull = false,
    Map<String, dynamic>? metadata,
    bool metadataExplicitNull = false,
    String? signedBy,
    bool signedByExplicitNull = false,
    DateTime? signedAt,
    bool signedAtExplicitNull = false,
    String? terminatedBy,
    bool terminatedByExplicitNull = false,
    DateTime? terminatedAt,
    bool terminatedAtExplicitNull = false,
    String? cancelledBy,
    bool cancelledByExplicitNull = false,
    DateTime? cancelledAt,
    bool cancelledAtExplicitNull = false,
    String? ownerId,
    bool ownerIdExplicitNull = false,
    String? agencyId,
    bool agencyIdExplicitNull = false,
    Map<String, dynamic>? property,
    bool propertyExplicitNull = false,
    Map<String, dynamic>? tenant,
    bool tenantExplicitNull = false,
    Map<String, dynamic>? owner,
    bool ownerExplicitNull = false,
    Map<String, dynamic>? agency,
    bool agencyExplicitNull = false,
    List<Map<String, dynamic>>? increases,
    bool increasesExplicitNull = false,
  }) {
    return Contract(
      id: id ?? this.id,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
      deletedAt: deletedAt ?? this.deletedAt,
      name: name ?? this.name,
      description: description ?? this.description,
      type: type ?? this.type,
      status: status ?? this.status,
      startDate: startDate ?? this.startDate,
      endDate: endDate ?? this.endDate,
      rentAmount: rentAmount ?? this.rentAmount,
      currency: currency ?? this.currency,
      noticePeriod: noticePeriod ?? this.noticePeriod,
      propertyId: propertyIdExplicitNull
          ? this.propertyId
          : (propertyId ?? this.propertyId),
      tenantId:
          tenantIdExplicitNull ? this.tenantId : (tenantId ?? this.tenantId),
      landlordId: landlordIdExplicitNull
          ? this.landlordId
          : (landlordId ?? this.landlordId),
      terms: termsExplicitNull ? this.terms : (terms ?? this.terms),
      conditions:
          conditionsExplicitNull ? null : (conditions ?? this.conditions),
      metadata: metadataExplicitNull ? null : (metadata ?? this.metadata),
      signedBy: signedByExplicitNull ? null : (signedBy ?? this.signedBy),
      signedAt: signedAtExplicitNull ? null : (signedAt ?? this.signedAt),
      terminatedBy:
          terminatedByExplicitNull ? null : (terminatedBy ?? this.terminatedBy),
      terminatedAt:
          terminatedAtExplicitNull ? null : (terminatedAt ?? this.terminatedAt),
      cancelledBy:
          cancelledByExplicitNull ? null : (cancelledBy ?? this.cancelledBy),
      cancelledAt:
          cancelledAtExplicitNull ? null : (cancelledAt ?? this.cancelledAt),
      ownerId: ownerIdExplicitNull ? null : (ownerId ?? this.ownerId),
      agencyId: agencyIdExplicitNull ? null : (agencyId ?? this.agencyId),
      property: propertyExplicitNull ? null : (property ?? this.property),
      tenant: tenantExplicitNull ? null : (tenant ?? this.tenant),
      owner: ownerExplicitNull ? null : (owner ?? this.owner),
      agency: agencyExplicitNull ? null : (agency ?? this.agency),
      increases: increasesExplicitNull ? null : (increases ?? this.increases),
    );
  }
}
