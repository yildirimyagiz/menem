import 'package:json_annotation/json_annotation.dart';
import 'base_model.dart';

part 'provider.g.dart';

enum ProviderType {
  @JsonValue('SERVICE')
  service,
  @JsonValue('SUPPLIER')
  supplier,
  @JsonValue('CONTRACTOR')
  contractor,
  @JsonValue('OTHER')
  other,
}

enum ProviderStatus {
  @JsonValue('ACTIVE')
  active,
  @JsonValue('INACTIVE')
  inactive,
  @JsonValue('SUSPENDED')
  suspended,
}

@JsonSerializable()
class Provider extends BaseModel {
  final String name;
  final String description;
  final ProviderType type;
  final ProviderStatus status;
  final String? contactName;
  final String? contactEmail;
  final String? contactPhone;
  final String? address;
  final String? city;
  final String? state;
  final String? country;
  final String? postalCode;
  final Map<String, dynamic>? metadata;
  final String? createdBy;
  final String? updatedBy;

  Provider({
    required super.id,
    required super.createdAt,
    required super.updatedAt,
    super.deletedAt,
    required this.name,
    required this.description,
    required this.type,
    required this.status,
    this.contactName,
    this.contactEmail,
    this.contactPhone,
    this.address,
    this.city,
    this.state,
    this.country,
    this.postalCode,
    this.metadata,
    this.createdBy,
    this.updatedBy,
  }) {
    if (name.isEmpty) {
      throw ArgumentError('Provider name cannot be empty');
    }
    if (description.isEmpty) {
      throw ArgumentError('Provider description cannot be empty');
    }
  }

  bool get isService => type == ProviderType.service;
  bool get isSupplier => type == ProviderType.supplier;
  bool get isContractor => type == ProviderType.contractor;
  bool get isOther => type == ProviderType.other;
  @override
  bool get isActive => status == ProviderStatus.active;
  bool get isInactive => status == ProviderStatus.inactive;
  bool get isSuspended => status == ProviderStatus.suspended;

  factory Provider.fromJson(Map<String, dynamic> json) =>
      _$ProviderFromJson(json);

  @override
  Map<String, dynamic> toJson() => _$ProviderToJson(this);

  Provider copyWith({
    String? id,
    DateTime? createdAt,
    DateTime? updatedAt,
    DateTime? deletedAt,
    String? name,
    String? description,
    ProviderType? type,
    ProviderStatus? status,
    String? contactName,
    String? contactEmail,
    String? contactPhone,
    String? address,
    String? city,
    String? state,
    String? country,
    String? postalCode,
    Map<String, dynamic>? metadata,
    String? createdBy,
    String? updatedBy,
  }) {
    return Provider(
      id: id ?? this.id,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
      deletedAt: deletedAt ?? this.deletedAt,
      name: name ?? this.name,
      description: description ?? this.description,
      type: type ?? this.type,
      status: status ?? this.status,
      contactName: contactName ?? this.contactName,
      contactEmail: contactEmail ?? this.contactEmail,
      contactPhone: contactPhone ?? this.contactPhone,
      address: address ?? this.address,
      city: city ?? this.city,
      state: state ?? this.state,
      country: country ?? this.country,
      postalCode: postalCode ?? this.postalCode,
      metadata: metadata ?? this.metadata,
      createdBy: createdBy ?? this.createdBy,
      updatedBy: updatedBy ?? this.updatedBy,
    );
  }
}
