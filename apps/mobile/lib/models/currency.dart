import 'package:json_annotation/json_annotation.dart';
import 'base_model.dart';

part 'currency.g.dart';

@JsonSerializable()
class Currency extends BaseModel {
  final String code;
  final String name;
  final String symbol;
  final int decimals;
  final String? country;
  final bool isDefault;
  @override
  final bool isActive;
  final double? exchangeRate;
  final DateTime? rateUpdatedAt;

  Currency({
    required super.id,
    required super.createdAt,
    required super.updatedAt,
    super.deletedAt,
    required this.code,
    required this.name,
    required this.symbol,
    required this.decimals,
    this.country,
    this.isDefault = false,
    this.isActive = true,
    this.exchangeRate,
    this.rateUpdatedAt,
  }) {
    if (code.isEmpty) {
      throw ArgumentError('Currency code cannot be empty');
    }
    if (name.isEmpty) {
      throw ArgumentError('Currency name cannot be empty');
    }
    if (symbol.isEmpty) {
      throw ArgumentError('Currency symbol cannot be empty');
    }
    if (decimals < 0) {
      throw ArgumentError('Decimals cannot be negative');
    }
    if (exchangeRate != null && exchangeRate! < 0) {
      throw ArgumentError('Exchange rate cannot be negative');
    }
  }

  bool get isFiat => country != null && country!.isNotEmpty;
  bool get isCrypto => country == null || country!.isEmpty;

  factory Currency.fromJson(Map<String, dynamic> json) =>
      _$CurrencyFromJson(json);

  @override
  Map<String, dynamic> toJson() => _$CurrencyToJson(this);

  Currency copyWith({
    String? id,
    DateTime? createdAt,
    DateTime? updatedAt,
    DateTime? deletedAt,
    String? code,
    String? name,
    String? symbol,
    int? decimals,
    String? country,
    bool? isDefault,
    bool? isActive,
    double? exchangeRate,
    DateTime? rateUpdatedAt,
  }) {
    return Currency(
      id: id ?? this.id,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
      deletedAt: deletedAt ?? this.deletedAt,
      code: code ?? this.code,
      name: name ?? this.name,
      symbol: symbol ?? this.symbol,
      decimals: decimals ?? this.decimals,
      country: country ?? this.country,
      isDefault: isDefault ?? this.isDefault,
      isActive: isActive ?? this.isActive,
      exchangeRate: exchangeRate ?? this.exchangeRate,
      rateUpdatedAt: rateUpdatedAt ?? this.rateUpdatedAt,
    );
  }
}
