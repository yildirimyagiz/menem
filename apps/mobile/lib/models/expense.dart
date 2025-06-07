import 'package:json_annotation/json_annotation.dart';
import 'base_model.dart';

part 'expense.g.dart';

enum ExpenseType {
  @JsonValue('UTILITY')
  utility,
  @JsonValue('MAINTENANCE')
  maintenance,
  @JsonValue('REPAIR')
  repair,
  @JsonValue('CLEANING')
  cleaning,
  @JsonValue('INSURANCE')
  insurance,
  @JsonValue('TAX')
  tax,
  @JsonValue('OTHER')
  other,
}

enum ExpenseStatus {
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
class Expense extends BaseModel {
  final String title;
  final String description;
  final ExpenseType type;
  final ExpenseStatus status;
  final double amount;
  final String currency;
  final DateTime dueDate;
  final DateTime? paidDate;
  final String propertyId;
  final String? vendorId;
  final String? invoiceNumber;
  final String? invoiceUrl;
  final String? paymentMethod;
  final String? paymentReference;
  final bool isRecurring;
  final String? recurringFrequency;
  final DateTime? nextDueDate;
  final Map<String, dynamic>? metadata;
  final String? createdBy;
  final String? updatedBy;
  final Map<String, dynamic>? customFields;

  Expense({
    required super.id,
    required super.createdAt,
    required super.updatedAt,
    super.deletedAt,
    required this.title,
    required this.description,
    required this.type,
    required this.status,
    required this.amount,
    required this.currency,
    required this.dueDate,
    this.paidDate,
    required this.propertyId,
    this.vendorId,
    this.invoiceNumber,
    this.invoiceUrl,
    this.paymentMethod,
    this.paymentReference,
    required this.isRecurring,
    this.recurringFrequency,
    this.nextDueDate,
    this.metadata,
    this.createdBy,
    this.updatedBy,
    this.customFields,
  });

  factory Expense.fromJson(Map<String, dynamic> json) {
    return Expense(
      id: json['id'],
      createdAt: DateTime.parse(json['createdAt']),
      updatedAt: DateTime.parse(json['updatedAt']),
      deletedAt:
          json['deletedAt'] != null ? DateTime.parse(json['deletedAt']) : null,
      title: json['title'],
      description: json['description'],
      type: ExpenseType.values.firstWhere(
        (e) => e.toString().split('.').last == json['type'],
      ),
      status: ExpenseStatus.values.firstWhere(
        (e) => e.toString().split('.').last == json['status'],
      ),
      amount: json['amount'].toDouble(),
      currency: json['currency'],
      dueDate: DateTime.parse(json['dueDate']),
      paidDate:
          json['paidDate'] != null ? DateTime.parse(json['paidDate']) : null,
      propertyId: json['propertyId'],
      vendorId: json['vendorId'],
      invoiceNumber: json['invoiceNumber'],
      invoiceUrl: json['invoiceUrl'],
      paymentMethod: json['paymentMethod'],
      paymentReference: json['paymentReference'],
      isRecurring: json['isRecurring'],
      recurringFrequency: json['recurringFrequency'],
      nextDueDate: json['nextDueDate'] != null
          ? DateTime.parse(json['nextDueDate'])
          : null,
      metadata: json['metadata'],
      createdBy: json['createdBy'],
      updatedBy: json['updatedBy'],
      customFields: json['customFields'],
    );
  }

  get name => null;

  get notes => null;

  @override
  Map<String, dynamic> toJson() {
    return {
      ...super.toJson(),
      'title': title,
      'description': description,
      'type': type.toString().split('.').last,
      'status': status.toString().split('.').last,
      'amount': amount,
      'currency': currency,
      'dueDate': dueDate.toIso8601String(),
      'paidDate': paidDate?.toIso8601String(),
      'propertyId': propertyId,
      'vendorId': vendorId,
      'invoiceNumber': invoiceNumber,
      'invoiceUrl': invoiceUrl,
      'paymentMethod': paymentMethod,
      'paymentReference': paymentReference,
      'isRecurring': isRecurring,
      'recurringFrequency': recurringFrequency,
      'nextDueDate': nextDueDate?.toIso8601String(),
      'metadata': metadata,
      'createdBy': createdBy,
      'updatedBy': updatedBy,
      'customFields': customFields,
    };
  }

  copyWith(
      {double? amount,
      required String currencyId,
      String? notes,
      required String type,
      String? status,
      DateTime? dueDate,
      DateTime? paidDate}) {}
}
