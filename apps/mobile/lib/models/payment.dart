import 'package:json_annotation/json_annotation.dart';
import 'base_model.dart';

part 'payment.g.dart';

enum PaymentType {
  @JsonValue('RENT')
  rent,
  @JsonValue('DEPOSIT')
  deposit,
  @JsonValue('FEE')
  fee,
  @JsonValue('REFUND')
  refund,
  @JsonValue('OTHER')
  other,
}

enum PaymentMethod {
  @JsonValue('CREDIT_CARD')
  creditCard,
  @JsonValue('DEBIT_CARD')
  debitCard,
  @JsonValue('BANK_TRANSFER')
  bankTransfer,
  @JsonValue('CASH')
  cash,
  @JsonValue('CHECK')
  check,
  @JsonValue('OTHER')
  other,
}

enum PaymentStatus {
  @JsonValue('PENDING')
  pending,
  @JsonValue('COMPLETED')
  completed,
  @JsonValue('FAILED')
  failed,
  @JsonValue('REFUNDED')
  refunded,
  @JsonValue('CANCELLED')
  cancelled,
}

@JsonSerializable()
class Payment extends BaseModel {
  final String propertyId;
  final String userId;
  final PaymentType type;
  final PaymentMethod method;
  final PaymentStatus status;
  final double amount;
  final String currency;
  final DateTime? paidAt;
  final String? transactionId;
  final String? description;
  final Map<String, dynamic>? metadata;
  final String? createdBy;
  final String? updatedBy;
  final String reservationId;
  final String? paymentIntentId;
  final String? clientSecret;

  Payment({
    required super.id,
    required super.createdAt,
    required super.updatedAt,
    super.deletedAt,
    required this.propertyId,
    required this.userId,
    required this.type,
    required this.method,
    required this.status,
    required this.amount,
    required this.currency,
    this.paidAt,
    this.transactionId,
    this.description,
    this.metadata,
    this.createdBy,
    this.updatedBy,
    required this.reservationId,
    this.paymentIntentId,
    this.clientSecret,
  }) {
    if (propertyId.isEmpty) {
      throw ArgumentError('Property ID cannot be empty');
    }
    if (userId.isEmpty) {
      throw ArgumentError('User ID cannot be empty');
    }
    if (amount <= 0) {
      throw ArgumentError('Amount must be greater than zero');
    }
    if (currency.isEmpty) {
      throw ArgumentError('Currency cannot be empty');
    }
  }

  bool get isRent => type == PaymentType.rent;
  bool get isDeposit => type == PaymentType.deposit;
  bool get isFee => type == PaymentType.fee;
  bool get isRefund => type == PaymentType.refund;
  bool get isOther => type == PaymentType.other;
  bool get isCreditCard => method == PaymentMethod.creditCard;
  bool get isDebitCard => method == PaymentMethod.debitCard;
  bool get isBankTransfer => method == PaymentMethod.bankTransfer;
  bool get isCash => method == PaymentMethod.cash;
  bool get isCheck => method == PaymentMethod.check;
  bool get isPending => status == PaymentStatus.pending;
  bool get isCompleted => status == PaymentStatus.completed;
  bool get isFailed => status == PaymentStatus.failed;
  bool get isRefunded => status == PaymentStatus.refunded;
  bool get isCancelled => status == PaymentStatus.cancelled;

  factory Payment.fromJson(Map<String, dynamic> json) =>
      _$PaymentFromJson(json);

  @override
  Map<String, dynamic> toJson() => _$PaymentToJson(this);

  /// Returns a copy of this Payment with the given fields replaced by new values.
  /// For nullable fields, pass `explicitNull: true` to explicitly set them to null.
  Payment copyWith({
    String? id,
    DateTime? createdAt,
    DateTime? updatedAt,
    DateTime? deletedAt,
    String? propertyId,
    String? userId,
    PaymentType? type,
    PaymentMethod? method,
    PaymentStatus? status,
    double? amount,
    String? currency,
    DateTime? paidAt,
    bool paidAtExplicitNull = false,
    String? transactionId,
    bool transactionIdExplicitNull = false,
    String? description,
    bool descriptionExplicitNull = false,
    Map<String, dynamic>? metadata,
    bool metadataExplicitNull = false,
    String? createdBy,
    bool createdByExplicitNull = false,
    String? updatedBy,
    bool updatedByExplicitNull = false,
    String? reservationId,
    bool reservationIdExplicitNull = false,
    String? paymentIntentId,
    bool paymentIntentIdExplicitNull = false,
    String? clientSecret,
    bool clientSecretExplicitNull = false,
  }) {
    return Payment(
      id: id ?? this.id,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
      deletedAt: deletedAt ?? this.deletedAt,
      propertyId: propertyId ?? this.propertyId,
      userId: userId ?? this.userId,
      type: type ?? this.type,
      method: method ?? this.method,
      status: status ?? this.status,
      amount: amount ?? this.amount,
      currency: currency ?? this.currency,
      paidAt: paidAtExplicitNull ? null : (paidAt ?? this.paidAt),
      transactionId: transactionIdExplicitNull
          ? null
          : (transactionId ?? this.transactionId),
      description:
          descriptionExplicitNull ? null : (description ?? this.description),
      metadata: metadataExplicitNull ? null : (metadata ?? this.metadata),
      createdBy: createdByExplicitNull ? null : (createdBy ?? this.createdBy),
      updatedBy: updatedByExplicitNull ? null : (updatedBy ?? this.updatedBy),
      reservationId: reservationId ?? this.reservationId,
      paymentIntentId: paymentIntentIdExplicitNull
          ? null
          : (paymentIntentId ?? this.paymentIntentId),
      clientSecret:
          clientSecretExplicitNull ? null : (clientSecret ?? this.clientSecret),
    );
  }
}
