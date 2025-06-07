// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'mention.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

T _$identity<T>(T value) => value;

final _privateConstructorUsedError = UnsupportedError(
    'It seems like you constructed your class using `MyClass._()`. This constructor is only meant to be used by freezed and you are not supposed to need it nor use it.\nPlease check the documentation here for more information: https://github.com/rrousselGit/freezed#adding-getters-and-methods-to-our-models');

MentionData _$MentionDataFromJson(Map<String, dynamic> json) {
  return _MentionData.fromJson(json);
}

/// @nodoc
mixin _$MentionData {
  String get id => throw _privateConstructorUsedError;
  String get mentionedById => throw _privateConstructorUsedError;
  String get mentionedToId => throw _privateConstructorUsedError;
  String get type => throw _privateConstructorUsedError;
  String? get taskId => throw _privateConstructorUsedError;
  String? get propertyId => throw _privateConstructorUsedError;
  String? get content => throw _privateConstructorUsedError;
  bool get isRead => throw _privateConstructorUsedError;
  String? get agencyId => throw _privateConstructorUsedError;
  DateTime get createdAt => throw _privateConstructorUsedError;
  DateTime get updatedAt => throw _privateConstructorUsedError;
  DateTime? get deletedAt => throw _privateConstructorUsedError;
  String? get userId => throw _privateConstructorUsedError;

  /// Serializes this MentionData to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of MentionData
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $MentionDataCopyWith<MentionData> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $MentionDataCopyWith<$Res> {
  factory $MentionDataCopyWith(
          MentionData value, $Res Function(MentionData) then) =
      _$MentionDataCopyWithImpl<$Res, MentionData>;
  @useResult
  $Res call(
      {String id,
      String mentionedById,
      String mentionedToId,
      String type,
      String? taskId,
      String? propertyId,
      String? content,
      bool isRead,
      String? agencyId,
      DateTime createdAt,
      DateTime updatedAt,
      DateTime? deletedAt,
      String? userId});
}

/// @nodoc
class _$MentionDataCopyWithImpl<$Res, $Val extends MentionData>
    implements $MentionDataCopyWith<$Res> {
  _$MentionDataCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of MentionData
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? mentionedById = null,
    Object? mentionedToId = null,
    Object? type = null,
    Object? taskId = freezed,
    Object? propertyId = freezed,
    Object? content = freezed,
    Object? isRead = null,
    Object? agencyId = freezed,
    Object? createdAt = null,
    Object? updatedAt = null,
    Object? deletedAt = freezed,
    Object? userId = freezed,
  }) {
    return _then(_value.copyWith(
      id: null == id
          ? _value.id
          : id // ignore: cast_nullable_to_non_nullable
              as String,
      mentionedById: null == mentionedById
          ? _value.mentionedById
          : mentionedById // ignore: cast_nullable_to_non_nullable
              as String,
      mentionedToId: null == mentionedToId
          ? _value.mentionedToId
          : mentionedToId // ignore: cast_nullable_to_non_nullable
              as String,
      type: null == type
          ? _value.type
          : type // ignore: cast_nullable_to_non_nullable
              as String,
      taskId: freezed == taskId
          ? _value.taskId
          : taskId // ignore: cast_nullable_to_non_nullable
              as String?,
      propertyId: freezed == propertyId
          ? _value.propertyId
          : propertyId // ignore: cast_nullable_to_non_nullable
              as String?,
      content: freezed == content
          ? _value.content
          : content // ignore: cast_nullable_to_non_nullable
              as String?,
      isRead: null == isRead
          ? _value.isRead
          : isRead // ignore: cast_nullable_to_non_nullable
              as bool,
      agencyId: freezed == agencyId
          ? _value.agencyId
          : agencyId // ignore: cast_nullable_to_non_nullable
              as String?,
      createdAt: null == createdAt
          ? _value.createdAt
          : createdAt // ignore: cast_nullable_to_non_nullable
              as DateTime,
      updatedAt: null == updatedAt
          ? _value.updatedAt
          : updatedAt // ignore: cast_nullable_to_non_nullable
              as DateTime,
      deletedAt: freezed == deletedAt
          ? _value.deletedAt
          : deletedAt // ignore: cast_nullable_to_non_nullable
              as DateTime?,
      userId: freezed == userId
          ? _value.userId
          : userId // ignore: cast_nullable_to_non_nullable
              as String?,
    ) as $Val);
  }
}

/// @nodoc
abstract class _$$MentionDataImplCopyWith<$Res>
    implements $MentionDataCopyWith<$Res> {
  factory _$$MentionDataImplCopyWith(
          _$MentionDataImpl value, $Res Function(_$MentionDataImpl) then) =
      __$$MentionDataImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call(
      {String id,
      String mentionedById,
      String mentionedToId,
      String type,
      String? taskId,
      String? propertyId,
      String? content,
      bool isRead,
      String? agencyId,
      DateTime createdAt,
      DateTime updatedAt,
      DateTime? deletedAt,
      String? userId});
}

/// @nodoc
class __$$MentionDataImplCopyWithImpl<$Res>
    extends _$MentionDataCopyWithImpl<$Res, _$MentionDataImpl>
    implements _$$MentionDataImplCopyWith<$Res> {
  __$$MentionDataImplCopyWithImpl(
      _$MentionDataImpl _value, $Res Function(_$MentionDataImpl) _then)
      : super(_value, _then);

  /// Create a copy of MentionData
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? mentionedById = null,
    Object? mentionedToId = null,
    Object? type = null,
    Object? taskId = freezed,
    Object? propertyId = freezed,
    Object? content = freezed,
    Object? isRead = null,
    Object? agencyId = freezed,
    Object? createdAt = null,
    Object? updatedAt = null,
    Object? deletedAt = freezed,
    Object? userId = freezed,
  }) {
    return _then(_$MentionDataImpl(
      id: null == id
          ? _value.id
          : id // ignore: cast_nullable_to_non_nullable
              as String,
      mentionedById: null == mentionedById
          ? _value.mentionedById
          : mentionedById // ignore: cast_nullable_to_non_nullable
              as String,
      mentionedToId: null == mentionedToId
          ? _value.mentionedToId
          : mentionedToId // ignore: cast_nullable_to_non_nullable
              as String,
      type: null == type
          ? _value.type
          : type // ignore: cast_nullable_to_non_nullable
              as String,
      taskId: freezed == taskId
          ? _value.taskId
          : taskId // ignore: cast_nullable_to_non_nullable
              as String?,
      propertyId: freezed == propertyId
          ? _value.propertyId
          : propertyId // ignore: cast_nullable_to_non_nullable
              as String?,
      content: freezed == content
          ? _value.content
          : content // ignore: cast_nullable_to_non_nullable
              as String?,
      isRead: null == isRead
          ? _value.isRead
          : isRead // ignore: cast_nullable_to_non_nullable
              as bool,
      agencyId: freezed == agencyId
          ? _value.agencyId
          : agencyId // ignore: cast_nullable_to_non_nullable
              as String?,
      createdAt: null == createdAt
          ? _value.createdAt
          : createdAt // ignore: cast_nullable_to_non_nullable
              as DateTime,
      updatedAt: null == updatedAt
          ? _value.updatedAt
          : updatedAt // ignore: cast_nullable_to_non_nullable
              as DateTime,
      deletedAt: freezed == deletedAt
          ? _value.deletedAt
          : deletedAt // ignore: cast_nullable_to_non_nullable
              as DateTime?,
      userId: freezed == userId
          ? _value.userId
          : userId // ignore: cast_nullable_to_non_nullable
              as String?,
    ));
  }
}

/// @nodoc
@JsonSerializable()
class _$MentionDataImpl implements _MentionData {
  const _$MentionDataImpl(
      {required this.id,
      required this.mentionedById,
      required this.mentionedToId,
      required this.type,
      this.taskId,
      this.propertyId,
      this.content,
      required this.isRead,
      this.agencyId,
      required this.createdAt,
      required this.updatedAt,
      this.deletedAt,
      this.userId});

  factory _$MentionDataImpl.fromJson(Map<String, dynamic> json) =>
      _$$MentionDataImplFromJson(json);

  @override
  final String id;
  @override
  final String mentionedById;
  @override
  final String mentionedToId;
  @override
  final String type;
  @override
  final String? taskId;
  @override
  final String? propertyId;
  @override
  final String? content;
  @override
  final bool isRead;
  @override
  final String? agencyId;
  @override
  final DateTime createdAt;
  @override
  final DateTime updatedAt;
  @override
  final DateTime? deletedAt;
  @override
  final String? userId;

  @override
  String toString() {
    return 'MentionData(id: $id, mentionedById: $mentionedById, mentionedToId: $mentionedToId, type: $type, taskId: $taskId, propertyId: $propertyId, content: $content, isRead: $isRead, agencyId: $agencyId, createdAt: $createdAt, updatedAt: $updatedAt, deletedAt: $deletedAt, userId: $userId)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$MentionDataImpl &&
            (identical(other.id, id) || other.id == id) &&
            (identical(other.mentionedById, mentionedById) ||
                other.mentionedById == mentionedById) &&
            (identical(other.mentionedToId, mentionedToId) ||
                other.mentionedToId == mentionedToId) &&
            (identical(other.type, type) || other.type == type) &&
            (identical(other.taskId, taskId) || other.taskId == taskId) &&
            (identical(other.propertyId, propertyId) ||
                other.propertyId == propertyId) &&
            (identical(other.content, content) || other.content == content) &&
            (identical(other.isRead, isRead) || other.isRead == isRead) &&
            (identical(other.agencyId, agencyId) ||
                other.agencyId == agencyId) &&
            (identical(other.createdAt, createdAt) ||
                other.createdAt == createdAt) &&
            (identical(other.updatedAt, updatedAt) ||
                other.updatedAt == updatedAt) &&
            (identical(other.deletedAt, deletedAt) ||
                other.deletedAt == deletedAt) &&
            (identical(other.userId, userId) || other.userId == userId));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(
      runtimeType,
      id,
      mentionedById,
      mentionedToId,
      type,
      taskId,
      propertyId,
      content,
      isRead,
      agencyId,
      createdAt,
      updatedAt,
      deletedAt,
      userId);

  /// Create a copy of MentionData
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$MentionDataImplCopyWith<_$MentionDataImpl> get copyWith =>
      __$$MentionDataImplCopyWithImpl<_$MentionDataImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$MentionDataImplToJson(
      this,
    );
  }
}

abstract class _MentionData implements MentionData {
  const factory _MentionData(
      {required final String id,
      required final String mentionedById,
      required final String mentionedToId,
      required final String type,
      final String? taskId,
      final String? propertyId,
      final String? content,
      required final bool isRead,
      final String? agencyId,
      required final DateTime createdAt,
      required final DateTime updatedAt,
      final DateTime? deletedAt,
      final String? userId}) = _$MentionDataImpl;

  factory _MentionData.fromJson(Map<String, dynamic> json) =
      _$MentionDataImpl.fromJson;

  @override
  String get id;
  @override
  String get mentionedById;
  @override
  String get mentionedToId;
  @override
  String get type;
  @override
  String? get taskId;
  @override
  String? get propertyId;
  @override
  String? get content;
  @override
  bool get isRead;
  @override
  String? get agencyId;
  @override
  DateTime get createdAt;
  @override
  DateTime get updatedAt;
  @override
  DateTime? get deletedAt;
  @override
  String? get userId;

  /// Create a copy of MentionData
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$MentionDataImplCopyWith<_$MentionDataImpl> get copyWith =>
      throw _privateConstructorUsedError;
}
