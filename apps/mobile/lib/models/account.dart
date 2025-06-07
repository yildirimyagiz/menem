import 'package:json_annotation/json_annotation.dart';
import 'base_model.dart';
import 'user.dart';

part 'account.g.dart';

enum AccountType {
  @JsonValue('OAUTH')
  oauth,
  @JsonValue('EMAIL')
  email,
  @JsonValue('OIDC')
  oidc,
  @JsonValue('CREDENTIALS')
  credentials,
  @JsonValue('GOOGLE')
  google,
  @JsonValue('FACEBOOK')
  facebook;
}

@JsonSerializable()
class Account extends BaseModel {
  @override
  final bool isActive;
  final String userId;
  final AccountType type;
  final String provider;
  final String providerAccountId;
  @JsonKey(name: 'refresh_token')
  final String? refreshToken;
  @JsonKey(name: 'access_token')
  final String? accessToken;
  @JsonKey(name: 'expires_at')
  final int? expiresAt;
  @JsonKey(name: 'token_type')
  final String? tokenType;
  final String? scope;
  @JsonKey(name: 'id_token')
  final String? idToken;
  @JsonKey(name: 'session_state')
  final String? sessionState;

  // Relations
  final User? user;

  Account({
    required super.id,
    required this.userId,
    required this.type,
    required this.provider,
    required this.providerAccountId,
    this.refreshToken,
    this.accessToken,
    this.expiresAt,
    this.tokenType,
    this.scope,
    this.idToken,
    this.sessionState,
    this.user,
    required this.isActive,
    required super.createdAt, // Assuming BaseModel requires createdAt
    required super.updatedAt,
    super.deletedAt,
  }) {
    if (userId.isEmpty) {
      throw ArgumentError('User ID cannot be empty');
    }
    if (provider.isEmpty) {
      throw ArgumentError('Provider cannot be empty');
    }
    if (providerAccountId.isEmpty) {
      throw ArgumentError('Provider Account ID cannot be empty');
    }
  }

  bool get isExpired =>
      expiresAt != null && DateTime.now().millisecondsSinceEpoch > expiresAt!;
  bool get hasValidToken => accessToken != null && !isExpired;
  bool get isOAuth => type == AccountType.oauth;
  bool get isEmail => type == AccountType.email;
  bool get isGoogle => type == AccountType.google;
  bool get isFacebook => type == AccountType.facebook;

  factory Account.fromJson(Map<String, dynamic> json) =>
      _$AccountFromJson(json);

  @override
  Map<String, dynamic> toJson() => _$AccountToJson(this);

  /// Returns a copy of this Account with the given fields replaced by new values.
  /// For nullable fields, pass `explicitNull: true` to explicitly set them to null.
  Account copyWith({
    String? id,
    String? userId,
    AccountType? type,
    String? provider,
    String? providerAccountId,
    String? refreshToken,
    bool refreshTokenExplicitNull = false,
    String? accessToken,
    bool accessTokenExplicitNull = false,
    int? expiresAt,
    bool expiresAtExplicitNull = false,
    String? tokenType,
    bool tokenTypeExplicitNull = false,
    String? scope,
    bool scopeExplicitNull = false,
    String? idToken,
    bool idTokenExplicitNull = false,
    String? sessionState,
    bool sessionStateExplicitNull = false,
    User? user,
    bool userExplicitNull = false,
    bool? isActive,
    DateTime? createdAt,
    DateTime? updatedAt,
    DateTime? deletedAt,
  }) {
    return Account(
      id: id ?? this.id,
      userId: userId ?? this.userId,
      type: type ?? this.type,
      provider: provider ?? this.provider,
      providerAccountId: providerAccountId ?? this.providerAccountId,
      refreshToken: refreshTokenExplicitNull ? null : (refreshToken ?? this.refreshToken),
      accessToken: accessTokenExplicitNull ? null : (accessToken ?? this.accessToken),
      expiresAt: expiresAtExplicitNull ? null : (expiresAt ?? this.expiresAt),
      tokenType: tokenTypeExplicitNull ? null : (tokenType ?? this.tokenType),
      scope: scopeExplicitNull ? null : (scope ?? this.scope),
      idToken: idTokenExplicitNull ? null : (idToken ?? this.idToken),
      sessionState: sessionStateExplicitNull ? null : (sessionState ?? this.sessionState),
      user: userExplicitNull ? null : (user ?? this.user),
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
      deletedAt: deletedAt ?? this.deletedAt,
      isActive: isActive ?? this.isActive,
    );
  }
}
