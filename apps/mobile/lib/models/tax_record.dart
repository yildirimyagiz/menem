import 'package:json_annotation/json_annotation.dart';
import 'base_model.dart';

part 'tax_record.g.dart';

enum TaxStatus {
  @JsonValue('PENDING')
  pending,
  @JsonValue('PAID')
  paid,
  @JsonValue('OVERDUE')
  overdue,
  @JsonValue('CANCELLED')
  cancelled,
}

@JsonSerializable()
class TaxRecord extends BaseModel {
  final int year;
  final int quarter;
  final double totalIncome;
  final double totalExpenses;
  final double taxableIncome;
  final double taxAmount;
  final TaxStatus status;
  final DateTime dueDate;
  final DateTime? paidDate;
  final Map<String, dynamic>? metadata;
  final String? createdBy;
  final String? updatedBy;

  TaxRecord({
    required super.id,
    required super.createdAt,
    required super.updatedAt,
    super.deletedAt,
    required this.year,
    required this.quarter,
    required this.totalIncome,
    required this.totalExpenses,
    required this.taxableIncome,
    required this.taxAmount,
    required this.status,
    required this.dueDate,
    this.paidDate,
    this.metadata,
    this.createdBy,
    this.updatedBy,
  }) {
    if (year < 2000 || year > 2100) {
      throw ArgumentError('Year must be between 2000 and 2100');
    }
    if (quarter < 1 || quarter > 4) {
      throw ArgumentError('Quarter must be between 1 and 4');
    }
    if (totalIncome < 0) {
      throw ArgumentError('Total income cannot be negative');
    }
    if (totalExpenses < 0) {
      throw ArgumentError('Total expenses cannot be negative');
    }
    if (taxableIncome < 0) {
      throw ArgumentError('Taxable income cannot be negative');
    }
    if (taxAmount < 0) {
      throw ArgumentError('Tax amount cannot be negative');
    }
  }

  bool get isPending => status == TaxStatus.pending;
  bool get isPaid => status == TaxStatus.paid;
  bool get isOverdue => status == TaxStatus.overdue;
  bool get isCancelled => status == TaxStatus.cancelled;
  bool get hasOverdue => DateTime.now().isAfter(dueDate) && !isPaid;
  bool get canBePaid => isPending || hasOverdue;
  bool get canBeCancelled => isPending;

  factory TaxRecord.fromJson(Map<String, dynamic> json) =>
      _$TaxRecordFromJson(json);

  get amount => null;

  get documentUrl => null;

  @override
  Map<String, dynamic> toJson() => _$TaxRecordToJson(this);

  TaxRecord copyWith({
    String? id,
    DateTime? createdAt,
    DateTime? updatedAt,
    DateTime? deletedAt,
    int? year,
    int? quarter,
    double? totalIncome,
    double? totalExpenses,
    double? taxableIncome,
    double? taxAmount,
    TaxStatus? status,
    DateTime? dueDate,
    DateTime? paidDate,
    Map<String, dynamic>? metadata,
    String? createdBy,
    String? updatedBy,
  }) {
    return TaxRecord(
      id: id ?? this.id,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
      deletedAt: deletedAt ?? this.deletedAt,
      year: year ?? this.year,
      quarter: quarter ?? this.quarter,
      totalIncome: totalIncome ?? this.totalIncome,
      totalExpenses: totalExpenses ?? this.totalExpenses,
      taxableIncome: taxableIncome ?? this.taxableIncome,
      taxAmount: taxAmount ?? this.taxAmount,
      status: status ?? this.status,
      dueDate: dueDate ?? this.dueDate,
      paidDate: paidDate ?? this.paidDate,
      metadata: metadata ?? this.metadata,
      createdBy: createdBy ?? this.createdBy,
      updatedBy: updatedBy ?? this.updatedBy,
    );
  }
}
