import 'package:json_annotation/json_annotation.dart';
import 'base_model.dart';

part 'language.g.dart';

enum LanguageStatus {
  @JsonValue('ACTIVE')
  active,
  @JsonValue('INACTIVE')
  inactive,
}

@JsonSerializable()
class Language extends BaseModel {
  final String code;
  final String name;
  final String nativeName;
  final LanguageStatus status;
  final bool isDefault;
  final bool isRtl;
  final Map<String, dynamic>? metadata;
  final String? createdBy;
  final String? updatedBy;

  Language({
    required super.id,
    required super.createdAt,
    required super.updatedAt,
    super.deletedAt,
    required this.code,
    required this.name,
    required this.nativeName,
    required this.status,
    required this.isDefault,
    required this.isRtl,
    this.metadata,
    this.createdBy,
    this.updatedBy,
  }) {
    if (code.isEmpty) {
      throw ArgumentError('Language code cannot be empty');
    }
    if (name.isEmpty) {
      throw ArgumentError('Language name cannot be empty');
    }
    if (nativeName.isEmpty) {
      throw ArgumentError('Native name cannot be empty');
    }
  }

  @override
  bool get isActive => status == LanguageStatus.active;
  bool get isInactive => status == LanguageStatus.inactive;

  factory Language.fromJson(Map<String, dynamic> json) =>
      _$LanguageFromJson(json);

  @override
  Map<String, dynamic> toJson() => _$LanguageToJson(this);

  Language copyWith({
    String? id,
    DateTime? createdAt,
    DateTime? updatedAt,
    DateTime? deletedAt,
    String? code,
    String? name,
    String? nativeName,
    LanguageStatus? status,
    bool? isDefault,
    bool? isRtl,
    Map<String, dynamic>? metadata,
    String? createdBy,
    String? updatedBy,
  }) {
    return Language(
      id: id ?? this.id,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
      deletedAt: deletedAt ?? this.deletedAt,
      code: code ?? this.code,
      name: name ?? this.name,
      nativeName: nativeName ?? this.nativeName,
      status: status ?? this.status,
      isDefault: isDefault ?? this.isDefault,
      isRtl: isRtl ?? this.isRtl,
      metadata: metadata ?? this.metadata,
      createdBy: createdBy ?? this.createdBy,
      updatedBy: updatedBy ?? this.updatedBy,
    );
  }
}
