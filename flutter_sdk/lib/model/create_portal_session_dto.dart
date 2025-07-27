//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.18

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

part of openapi.api;

class CreatePortalSessionDto {
  /// Returns a new [CreatePortalSessionDto] instance.
  CreatePortalSessionDto({
    required this.deviceId,
    this.returnUrl,
  });

  /// Device ID
  String deviceId;

  /// Return URL
  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  String? returnUrl;

  @override
  bool operator ==(Object other) => identical(this, other) || other is CreatePortalSessionDto &&
    other.deviceId == deviceId &&
    other.returnUrl == returnUrl;

  @override
  int get hashCode =>
    // ignore: unnecessary_parenthesis
    (deviceId.hashCode) +
    (returnUrl == null ? 0 : returnUrl!.hashCode);

  @override
  String toString() => 'CreatePortalSessionDto[deviceId=$deviceId, returnUrl=$returnUrl]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
      json[r'deviceId'] = this.deviceId;
    if (this.returnUrl != null) {
      json[r'returnUrl'] = this.returnUrl;
    } else {
      json[r'returnUrl'] = null;
    }
    return json;
  }

  /// Returns a new [CreatePortalSessionDto] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static CreatePortalSessionDto? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key), 'Required key "CreatePortalSessionDto[$key]" is missing from JSON.');
          assert(json[key] != null, 'Required key "CreatePortalSessionDto[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return CreatePortalSessionDto(
        deviceId: mapValueOfType<String>(json, r'deviceId')!,
        returnUrl: mapValueOfType<String>(json, r'returnUrl'),
      );
    }
    return null;
  }

  static List<CreatePortalSessionDto> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <CreatePortalSessionDto>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = CreatePortalSessionDto.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, CreatePortalSessionDto> mapFromJson(dynamic json) {
    final map = <String, CreatePortalSessionDto>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = CreatePortalSessionDto.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of CreatePortalSessionDto-objects as value to a dart map
  static Map<String, List<CreatePortalSessionDto>> mapListFromJson(dynamic json, {bool growable = false,}) {
    final map = <String, List<CreatePortalSessionDto>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = CreatePortalSessionDto.listFromJson(entry.value, growable: growable,);
      }
    }
    return map;
  }

  /// The list of required keys that must be present in a JSON.
  static const requiredKeys = <String>{
    'deviceId',
  };
}

