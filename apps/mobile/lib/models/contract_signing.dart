import 'package:json_annotation/json_annotation.dart';
import 'base_model.dart';

part 'contract_signing.g.dart';

@JsonSerializable()
/// Model representing a contract signing event, optionally including contract details for richer UI.
@JsonSerializable()
class ContractSigning extends BaseModel {
  final String contractId;
  final String signedBy;
  final DateTime signedAt;
  final String? notes;

  /// Optionally include contract for richer display (not persisted in backend)
  final Map<String, dynamic>? contract;

  ContractSigning({
    required super.id,
    required super.createdAt,
    required super.updatedAt,
    super.deletedAt,
    required this.contractId,
    required this.signedBy,
    required this.signedAt,
    this.notes,
    this.contract,
  });

  /// Returns contract name if available, otherwise contractId
  String get contractName => contract != null && contract!['name'] != null
      ? contract!['name'] as String
      : contractId;

  factory ContractSigning.fromJson(Map<String, dynamic> json) => _$ContractSigningFromJson(json);
  @override
  Map<String, dynamic> toJson() => _$ContractSigningToJson(this);
  /// Returns a copy of this ContractSigning with the given fields replaced by new values.
  /// For nullable fields, pass the corresponding `ExplicitNull` flag as true to explicitly set them to null.
  ContractSigning copyWith({
    String? id,
    DateTime? createdAt,
    DateTime? updatedAt,
    DateTime? deletedAt,
    String? contractId,
    String? signedBy,
    DateTime? signedAt,
    String? notes,
    bool notesExplicitNull = false,
    Map<String, dynamic>? contract,
    bool contractExplicitNull = false,
  }) {
    return ContractSigning(
      id: id ?? this.id,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
      deletedAt: deletedAt ?? this.deletedAt,
      contractId: contractId ?? this.contractId,
      signedBy: signedBy ?? this.signedBy,
      signedAt: signedAt ?? this.signedAt,
      notes: notesExplicitNull ? null : (notes ?? this.notes),
      contract: contractExplicitNull ? null : (contract ?? this.contract),
    );
  }
}
