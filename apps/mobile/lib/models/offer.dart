import 'package:json_annotation/json_annotation.dart';
import 'base_model.dart';

part 'offer.g.dart';

enum OfferStatus {
  @JsonValue('PENDING')
  pending,
  @JsonValue('ACCEPTED')
  accepted,
  @JsonValue('REJECTED')
  rejected,
  @JsonValue('CANCELLED')
  cancelled,
  @JsonValue('EXPIRED')
  expired,
}

enum OfferType {
  @JsonValue('PURCHASE')
  purchase,
  @JsonValue('RENTAL')
  rental,
  @JsonValue('MAINTENANCE')
  maintenance,
  @JsonValue('SERVICE')
  service,
}

@JsonSerializable()
class Offer extends BaseModel {
  final String propertyId;
  final String userId;
  final OfferType type;
  final OfferStatus status;
  final double amount;
  final String currency;
  final DateTime? validUntil;
  final String? message;
  final Map<String, dynamic>? terms;
  final String? acceptedBy;
  final DateTime? acceptedAt;
  final String? rejectedBy;
  final DateTime? rejectedAt;
  final String? cancelledBy;
  final DateTime? cancelledAt;
  final Map<String, dynamic>? metadata;

  Offer({
    required super.id,
    required this.propertyId,
    required this.userId,
    required this.type,
    this.status = OfferStatus.pending,
    required this.amount,
    required this.currency,
    this.validUntil,
    this.message,
    this.terms,
    this.acceptedBy,
    this.acceptedAt,
    this.rejectedBy,
    this.rejectedAt,
    this.cancelledBy,
    this.cancelledAt,
    this.metadata,
    required super.createdAt,
    required super.updatedAt,
    super.deletedAt,
  });

  factory Offer.fromJson(Map<String, dynamic> json) => _$OfferFromJson(json);
  @override
  Map<String, dynamic> toJson() => _$OfferToJson(this);

  bool get isPending => status == OfferStatus.pending;
  bool get isAccepted => status == OfferStatus.accepted;
  bool get isRejected => status == OfferStatus.rejected;
  bool get isCancelled => status == OfferStatus.cancelled;
  bool get isExpired => status == OfferStatus.expired;
  bool get hasExpired =>
      validUntil != null && DateTime.now().isAfter(validUntil!);
  bool get canBeAccepted => isPending && !hasExpired;
  bool get canBeRejected => isPending && !hasExpired;
  bool get canBeCancelled => isPending && !hasExpired;

  Offer copyWith({
    String? id,
    String? propertyId,
    String? userId,
    OfferType? type,
    OfferStatus? status,
    double? amount,
    String? currency,
    DateTime? validUntil,
    String? message,
    Map<String, dynamic>? terms,
    String? acceptedBy,
    DateTime? acceptedAt,
    String? rejectedBy,
    DateTime? rejectedAt,
    String? cancelledBy,
    DateTime? cancelledAt,
    Map<String, dynamic>? metadata,
    DateTime? createdAt,
    DateTime? updatedAt,
    DateTime? deletedAt,
  }) {
    return Offer(
      id: id ?? this.id,
      propertyId: propertyId ?? this.propertyId,
      userId: userId ?? this.userId,
      type: type ?? this.type,
      status: status ?? this.status,
      amount: amount ?? this.amount,
      currency: currency ?? this.currency,
      validUntil: validUntil ?? this.validUntil,
      message: message ?? this.message,
      terms: terms ?? this.terms,
      acceptedBy: acceptedBy ?? this.acceptedBy,
      acceptedAt: acceptedAt ?? this.acceptedAt,
      rejectedBy: rejectedBy ?? this.rejectedBy,
      rejectedAt: rejectedAt ?? this.rejectedAt,
      cancelledBy: cancelledBy ?? this.cancelledBy,
      cancelledAt: cancelledAt ?? this.cancelledAt,
      metadata: metadata ?? this.metadata,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
      deletedAt: deletedAt ?? this.deletedAt,
    );
  }
}
