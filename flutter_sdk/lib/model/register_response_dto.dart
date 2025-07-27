//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.18

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

part of openapi.api;

class RegisterResponseDto {
  /// Returns a new [RegisterResponseDto] instance.
  RegisterResponseDto({
    required this.id,
    required this.email,
    this.displayName,
    this.avatar,
    this.isActive = true,
    this.emailVerified = false,
    this.provider,
    this.providerId,
    this.roles = const [],
    this.files = const [],
    required this.createdAt,
    required this.updatedAt,
  });

  /// User ID
  String id;

  /// User email address
  String email;

  /// User display name
  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  Object? displayName;

  /// URL to user avatar image
  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  Object? avatar;

  /// Whether user account is active
  bool isActive;

  /// Whether user email is verified
  bool emailVerified;

  /// Authentication provider (local, google, github)
  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  Object? provider;

  /// ID from auth provider
  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  Object? providerId;

  /// User roles
  List<String> roles;

  /// Files owned by user
  List<FileDto> files;

  /// Account creation date
  DateTime createdAt;

  /// Account last updated date
  DateTime updatedAt;

  @override
  bool operator ==(Object other) => identical(this, other) || other is RegisterResponseDto &&
    other.id == id &&
    other.email == email &&
    other.displayName == displayName &&
    other.avatar == avatar &&
    other.isActive == isActive &&
    other.emailVerified == emailVerified &&
    other.provider == provider &&
    other.providerId == providerId &&
    _deepEquality.equals(other.roles, roles) &&
    _deepEquality.equals(other.files, files) &&
    other.createdAt == createdAt &&
    other.updatedAt == updatedAt;

  @override
  int get hashCode =>
    // ignore: unnecessary_parenthesis
    (id.hashCode) +
    (email.hashCode) +
    (displayName == null ? 0 : displayName!.hashCode) +
    (avatar == null ? 0 : avatar!.hashCode) +
    (isActive.hashCode) +
    (emailVerified.hashCode) +
    (provider == null ? 0 : provider!.hashCode) +
    (providerId == null ? 0 : providerId!.hashCode) +
    (roles.hashCode) +
    (files.hashCode) +
    (createdAt.hashCode) +
    (updatedAt.hashCode);

  @override
  String toString() => 'RegisterResponseDto[id=$id, email=$email, displayName=$displayName, avatar=$avatar, isActive=$isActive, emailVerified=$emailVerified, provider=$provider, providerId=$providerId, roles=$roles, files=$files, createdAt=$createdAt, updatedAt=$updatedAt]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
      json[r'id'] = this.id;
      json[r'email'] = this.email;
    if (this.displayName != null) {
      json[r'displayName'] = this.displayName;
    } else {
      json[r'displayName'] = null;
    }
    if (this.avatar != null) {
      json[r'avatar'] = this.avatar;
    } else {
      json[r'avatar'] = null;
    }
      json[r'isActive'] = this.isActive;
      json[r'emailVerified'] = this.emailVerified;
    if (this.provider != null) {
      json[r'provider'] = this.provider;
    } else {
      json[r'provider'] = null;
    }
    if (this.providerId != null) {
      json[r'providerId'] = this.providerId;
    } else {
      json[r'providerId'] = null;
    }
      json[r'roles'] = this.roles;
      json[r'files'] = this.files;
      json[r'createdAt'] = this.createdAt.toUtc().toIso8601String();
      json[r'updatedAt'] = this.updatedAt.toUtc().toIso8601String();
    return json;
  }

  /// Returns a new [RegisterResponseDto] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static RegisterResponseDto? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key), 'Required key "RegisterResponseDto[$key]" is missing from JSON.');
          assert(json[key] != null, 'Required key "RegisterResponseDto[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return RegisterResponseDto(
        id: mapValueOfType<String>(json, r'id')!,
        email: mapValueOfType<String>(json, r'email')!,
        displayName: mapValueOfType<Object>(json, r'displayName'),
        avatar: mapValueOfType<Object>(json, r'avatar'),
        isActive: mapValueOfType<bool>(json, r'isActive')!,
        emailVerified: mapValueOfType<bool>(json, r'emailVerified')!,
        provider: mapValueOfType<Object>(json, r'provider'),
        providerId: mapValueOfType<Object>(json, r'providerId'),
        roles: json[r'roles'] is Iterable
            ? (json[r'roles'] as Iterable).cast<String>().toList(growable: false)
            : const [],
        files: FileDto.listFromJson(json[r'files']),
        createdAt: mapDateTime(json, r'createdAt', r'')!,
        updatedAt: mapDateTime(json, r'updatedAt', r'')!,
      );
    }
    return null;
  }

  static List<RegisterResponseDto> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <RegisterResponseDto>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = RegisterResponseDto.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, RegisterResponseDto> mapFromJson(dynamic json) {
    final map = <String, RegisterResponseDto>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = RegisterResponseDto.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of RegisterResponseDto-objects as value to a dart map
  static Map<String, List<RegisterResponseDto>> mapListFromJson(dynamic json, {bool growable = false,}) {
    final map = <String, List<RegisterResponseDto>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = RegisterResponseDto.listFromJson(entry.value, growable: growable,);
      }
    }
    return map;
  }

  /// The list of required keys that must be present in a JSON.
  static const requiredKeys = <String>{
    'id',
    'email',
    'isActive',
    'emailVerified',
    'roles',
    'createdAt',
    'updatedAt',
  };
}

