//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.18

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

part of openapi.api;

class PortalSessionResponseDto {
  /// Returns a new [PortalSessionResponseDto] instance.
  PortalSessionResponseDto({
    required this.success,
    required this.data,
    this.message,
  });

  /// Success status
  bool success;

  /// Portal session information
  Object data;

  /// Response message
  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  String? message;

  @override
  bool operator ==(Object other) => identical(this, other) || other is PortalSessionResponseDto &&
    other.success == success &&
    other.data == data &&
    other.message == message;

  @override
  int get hashCode =>
    // ignore: unnecessary_parenthesis
    (success.hashCode) +
    (data.hashCode) +
    (message == null ? 0 : message!.hashCode);

  @override
  String toString() => 'PortalSessionResponseDto[success=$success, data=$data, message=$message]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
      json[r'success'] = this.success;
      json[r'data'] = this.data;
    if (this.message != null) {
      json[r'message'] = this.message;
    } else {
      json[r'message'] = null;
    }
    return json;
  }

  /// Returns a new [PortalSessionResponseDto] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static PortalSessionResponseDto? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key), 'Required key "PortalSessionResponseDto[$key]" is missing from JSON.');
          assert(json[key] != null, 'Required key "PortalSessionResponseDto[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return PortalSessionResponseDto(
        success: mapValueOfType<bool>(json, r'success')!,
        data: mapValueOfType<Object>(json, r'data')!,
        message: mapValueOfType<String>(json, r'message'),
      );
    }
    return null;
  }

  static List<PortalSessionResponseDto> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <PortalSessionResponseDto>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = PortalSessionResponseDto.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, PortalSessionResponseDto> mapFromJson(dynamic json) {
    final map = <String, PortalSessionResponseDto>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = PortalSessionResponseDto.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of PortalSessionResponseDto-objects as value to a dart map
  static Map<String, List<PortalSessionResponseDto>> mapListFromJson(dynamic json, {bool growable = false,}) {
    final map = <String, List<PortalSessionResponseDto>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = PortalSessionResponseDto.listFromJson(entry.value, growable: growable,);
      }
    }
    return map;
  }

  /// The list of required keys that must be present in a JSON.
  static const requiredKeys = <String>{
    'success',
    'data',
  };
}

