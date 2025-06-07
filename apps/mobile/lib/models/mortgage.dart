import 'package:json_annotation/json_annotation.dart';
import 'base_model.dart';

part 'mortgage.g.dart';

enum MortgageType {
  @JsonValue('FIXED')
  fixed,
  @JsonValue('VARIABLE')
  variable,
  @JsonValue('ADJUSTABLE')
  adjustable,
  @JsonValue('INTEREST_ONLY')
  interestOnly,
  @JsonValue('OTHER')
  other,
}

enum MortgageStatus {
  @JsonValue('PENDING')
  pending,
  @JsonValue('APPROVED')
  approved,
  @JsonValue('REJECTED')
  rejected,
  @JsonValue('ACTIVE')
  active,
  @JsonValue('PAID')
  paid,
  @JsonValue('DEFAULTED')
  defaulted,
}

@JsonSerializable()
class Mortgage extends BaseModel {
  final String propertyId;
  final String userId;
  final double amount;
  final double interestRate;
  final int termInMonths;
  final DateTime startDate;
  final DateTime? endDate;
  final MortgageStatus status;
  final String? description;
  final Map<String, dynamic>? metadata;
  final String? currencyId;
  final String? agencyId;
  final String? agentId;

  Mortgage({
    required super.id,
    required super.createdAt,
    required super.updatedAt,
    super.deletedAt,
    required this.propertyId,
    required this.userId,
    required this.amount,
    required this.interestRate,
    required this.termInMonths,
    required this.startDate,
    this.endDate,
    required this.status,
    this.description,
    this.metadata,
    this.currencyId,
    this.agencyId,
    this.agentId,
  }) {
    if (amount <= 0) {
      throw ArgumentError('Amount must be greater than 0');
    }
    if (interestRate < 0) {
      throw ArgumentError('Interest rate cannot be negative');
    }
    if (startDate.isAfter(endDate ?? DateTime.now())) {
      throw ArgumentError('Start date cannot be after end date');
    }
  }

  factory Mortgage.fromJson(Map<String, dynamic> json) =>
      _$MortgageFromJson(json);

  @override
  Map<String, dynamic> toJson() => _$MortgageToJson(this);

  @override
  bool get isActive => status == MortgageStatus.active;
  bool get isPending => status == MortgageStatus.pending;
  bool get isApproved => status == MortgageStatus.approved;
  bool get isRejected => status == MortgageStatus.rejected;
  bool get isPaid => status == MortgageStatus.paid;
  bool get isDefaulted => status == MortgageStatus.defaulted;

  double get monthlyPayment {
    final r = interestRate / 12 / 100; // Monthly interest rate
    final n =
        endDate?.difference(startDate).inDays ?? 0 / 30; // Number of months
    return amount * r * (1 + r) * n / ((1 + r) * n - 1);
  }
}
