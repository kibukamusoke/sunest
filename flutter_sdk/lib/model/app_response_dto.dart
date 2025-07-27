//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.18

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

part of openapi.api;

class AppResponseDto {
  /// Returns a new [AppResponseDto] instance.
  AppResponseDto({
    required this.id,
    required this.name,
    required this.displayName,
    this.description,
    this.domain,
    required this.isActive,
    this.settings,
    required this.createdAt,
    required this.updatedAt,
  });

  /// App ID
  String id;

  /// App name
  String name;

  /// Display name
  String displayName;

  /// App description
  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  String? description;

  /// App domain
  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  String? domain;

  /// Whether the app is active
  bool isActive;

  /// App-specific settings
  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  Object? settings;

  /// Creation timestamp
  DateTime createdAt;

  /// Last update timestamp
  DateTime updatedAt;

  @override
  bool operator ==(Object other) => identical(this, other) || other is AppResponseDto &&
    other.id == id &&
    other.name == name &&
    other.displayName == displayName &&
    other.description == description &&
    other.domain == domain &&
    other.isActive == isActive &&
    other.settings == settings &&
    other.createdAt == createdAt &&
    other.updatedAt == updatedAt;

  @override
  int get hashCode =>
    // ignore: unnecessary_parenthesis
    (id.hashCode) +
    (name.hashCode) +
    (displayName.hashCode) +
    (description == null ? 0 : description!.hashCode) +
    (domain == null ? 0 : domain!.hashCode) +
    (isActive.hashCode) +
    (settings == null ? 0 : settings!.hashCode) +
    (createdAt.hashCode) +
    (updatedAt.hashCode);

  @override
  String toString() => 'AppResponseDto[id=$id, name=$name, displayName=$displayName, description=$description, domain=$domain, isActive=$isActive, settings=$settings, createdAt=$createdAt, updatedAt=$updatedAt]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
      json[r'id'] = this.id;
      json[r'name'] = this.name;
      json[r'displayName'] = this.displayName;
    if (this.description != null) {
      json[r'description'] = this.description;
    } else {
      json[r'description'] = null;
    }
    if (this.domain != null) {
      json[r'domain'] = this.domain;
    } else {
      json[r'domain'] = null;
    }
      json[r'isActive'] = this.isActive;
    if (this.settings != null) {
      json[r'settings'] = this.settings;
    } else {
      json[r'settings'] = null;
    }
      json[r'createdAt'] = this.createdAt.toUtc().toIso8601String();
      json[r'updatedAt'] = this.updatedAt.toUtc().toIso8601String();
    return json;
  }

  /// Returns a new [AppResponseDto] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static AppResponseDto? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key), 'Required key "AppResponseDto[$key]" is missing from JSON.');
          assert(json[key] != null, 'Required key "AppResponseDto[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return AppResponseDto(
        id: mapValueOfType<String>(json, r'id')!,
        name: mapValueOfType<String>(json, r'name')!,
        displayName: mapValueOfType<String>(json, r'displayName')!,
        description: mapValueOfType<String>(json, r'description'),
        domain: mapValueOfType<String>(json, r'domain'),
        isActive: mapValueOfType<bool>(json, r'isActive')!,
        settings: mapValueOfType<Object>(json, r'settings'),
        createdAt: mapDateTime(json, r'createdAt', r'')!,
        updatedAt: mapDateTime(json, r'updatedAt', r'')!,
      );
    }
    return null;
  }

  static List<AppResponseDto> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <AppResponseDto>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = AppResponseDto.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, AppResponseDto> mapFromJson(dynamic json) {
    final map = <String, AppResponseDto>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = AppResponseDto.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of AppResponseDto-objects as value to a dart map
  static Map<String, List<AppResponseDto>> mapListFromJson(dynamic json, {bool growable = false,}) {
    final map = <String, List<AppResponseDto>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = AppResponseDto.listFromJson(entry.value, growable: growable,);
      }
    }
    return map;
  }

  /// The list of required keys that must be present in a JSON.
  static const requiredKeys = <String>{
    'id',
    'name',
    'displayName',
    'isActive',
    'createdAt',
    'updatedAt',
  };
}

