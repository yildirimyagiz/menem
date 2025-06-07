// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'expense.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

Expense _$ExpenseFromJson(Map<String, dynamic> json) => Expense(
      id: json['id'] as String,
      createdAt: json['createdAt'] == null
          ? null
          : DateTime.parse(json['createdAt'] as String),
      updatedAt: json['updatedAt'] == null
          ? null
          : DateTime.parse(json['updatedAt'] as String),
      deletedAt: json['deletedAt'] == null
          ? null
          : DateTime.parse(json['deletedAt'] as String),
      title: json['title'] as String,
      description: json['description'] as String,
      type: $enumDecode(_$ExpenseTypeEnumMap, json['type']),
      status: $enumDecode(_$ExpenseStatusEnumMap, json['status']),
      amount: (json['amount'] as num).toDouble(),
      currency: json['currency'] as String,
      dueDate: DateTime.parse(json['dueDate'] as String),
      paidDate: json['paidDate'] == null
          ? null
          : DateTime.parse(json['paidDate'] as String),
      propertyId: json['propertyId'] as String,
      vendorId: json['vendorId'] as String?,
      invoiceNumber: json['invoiceNumber'] as String?,
      invoiceUrl: json['invoiceUrl'] as String?,
      paymentMethod: json['paymentMethod'] as String?,
      paymentReference: json['paymentReference'] as String?,
      isRecurring: json['isRecurring'] as bool,
      recurringFrequency: json['recurringFrequency'] as String?,
      nextDueDate: json['nextDueDate'] == null
          ? null
          : DateTime.parse(json['nextDueDate'] as String),
      metadata: json['metadata'] as Map<String, dynamic>?,
      createdBy: json['createdBy'] as String?,
      updatedBy: json['updatedBy'] as String?,
      customFields: json['customFields'] as Map<String, dynamic>?,
    );

Map<String, dynamic> _$ExpenseToJson(Expense instance) => <String, dynamic>{
      'id': instance.id,
      'createdAt': instance.createdAt?.toIso8601String(),
      'updatedAt': instance.updatedAt?.toIso8601String(),
      'deletedAt': instance.deletedAt?.toIso8601String(),
      'title': instance.title,
      'description': instance.description,
      'type': _$ExpenseTypeEnumMap[instance.type]!,
      'status': _$ExpenseStatusEnumMap[instance.status]!,
      'amount': instance.amount,
      'currency': instance.currency,
      'dueDate': instance.dueDate.toIso8601String(),
      'paidDate': instance.paidDate?.toIso8601String(),
      'propertyId': instance.propertyId,
      'vendorId': instance.vendorId,
      'invoiceNumber': instance.invoiceNumber,
      'invoiceUrl': instance.invoiceUrl,
      'paymentMethod': instance.paymentMethod,
      'paymentReference': instance.paymentReference,
      'isRecurring': instance.isRecurring,
      'recurringFrequency': instance.recurringFrequency,
      'nextDueDate': instance.nextDueDate?.toIso8601String(),
      'metadata': instance.metadata,
      'createdBy': instance.createdBy,
      'updatedBy': instance.updatedBy,
      'customFields': instance.customFields,
    };

const _$ExpenseTypeEnumMap = {
  ExpenseType.utility: 'UTILITY',
  ExpenseType.maintenance: 'MAINTENANCE',
  ExpenseType.repair: 'REPAIR',
  ExpenseType.cleaning: 'CLEANING',
  ExpenseType.insurance: 'INSURANCE',
  ExpenseType.tax: 'TAX',
  ExpenseType.other: 'OTHER',
};

const _$ExpenseStatusEnumMap = {
  ExpenseStatus.pending: 'PENDING',
  ExpenseStatus.paid: 'PAID',
  ExpenseStatus.overdue: 'OVERDUE',
  ExpenseStatus.cancelled: 'CANCELLED',
};
