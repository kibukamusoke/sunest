//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.18

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

part of openapi.api;

class UpdateAppDto {
  /// Returns a new [UpdateAppDto] instance.
  UpdateAppDto({
    this.displayName,
    this.description,
    this.domain,
    this.isActive,
    this.settings,
  });

  /// Human-readable display name
  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  String? displayName;

  /// App description
  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  String? description;

  /// App domain (optional)
  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  String? domain;

  /// Whether the app is active
  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  bool? isActive;

  /// App-specific settings (JSON object)
  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  Object? settings;

  @override
  bool operator ==(Object other) => identical(this, other) || other is UpdateAppDto &&
    other.displayName == displayName &&
    other.description == description &&
    other.domain == domain &&
    other.isActive == isActive &&
    other.settings == settings;

  @override
  int get hashCode =>
    // ignore: unnecessary_parenthesis
    (displayName == null ? 0 : displayName!.hashCode) +
    (description == null ? 0 : description!.hashCode) +
    (domain == null ? 0 : domain!.hashCode) +
    (isActive == null ? 0 : isActive!.hashCode) +
    (settings == null ? 0 : settings!.hashCode);

  @override
  String toString() => 'UpdateAppDto[displayName=$displayName, description=$description, domain=$domain, isActive=$isActive, settings=$settings]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
    if (this.displayName != null) {
      json[r'displayName'] = this.displayName;
    } else {
      json[r'displayName'] = null;
    }
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
    if (this.isActive != null) {
      json[r'isActive'] = this.isActive;
    } else {
      json[r'isActive'] = null;
    }
    if (this.settings != null) {
      json[r'settings'] = this.settings;
    } else {
      json[r'settings'] = null;
    }
    return json;
  }

  /// Returns a new [UpdateAppDto] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static UpdateAppDto? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key), 'Required key "UpdateAppDto[$key]" is missing from JSON.');
          assert(json[key] != null, 'Required key "UpdateAppDto[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return UpdateAppDto(
        displayName: mapValueOfType<String>(json, r'displayName'),
        description: mapValueOfType<String>(json, r'description'),
        domain: mapValueOfType<String>(json, r'domain'),
        isActive: mapValueOfType<bool>(json, r'isActive'),
        settings: mapValueOfType<Object>(json, r'settings'),
      );
    }
    return null;
  }

  static List<UpdateAppDto> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <UpdateAppDto>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = UpdateAppDto.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, UpdateAppDto> mapFromJson(dynamic json) {
    final map = <String, UpdateAppDto>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = UpdateAppDto.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of UpdateAppDto-objects as value to a dart map
  static Map<String, List<UpdateAppDto>> mapListFromJson(dynamic json, {bool growable = false,}) {
    final map = <String, List<UpdateAppDto>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = UpdateAppDto.listFromJson(entry.value, growable: growable,);
      }
    }
    return map;
  }

  /// The list of required keys that must be present in a JSON.
  static const requiredKeys = <String>{
  };
}

