//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.18

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

part of openapi.api;

class SuccessResponseDto {
  /// Returns a new [SuccessResponseDto] instance.
  SuccessResponseDto({
    required this.success,
    this.message,
  });

  /// Whether the operation was successful
  bool success;

  /// Optional message
  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  String? message;

  @override
  bool operator ==(Object other) => identical(this, other) || other is SuccessResponseDto &&
    other.success == success &&
    other.message == message;

  @override
  int get hashCode =>
    // ignore: unnecessary_parenthesis
    (success.hashCode) +
    (message == null ? 0 : message!.hashCode);

  @override
  String toString() => 'SuccessResponseDto[success=$success, message=$message]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
      json[r'success'] = this.success;
    if (this.message != null) {
      json[r'message'] = this.message;
    } else {
      json[r'message'] = null;
    }
    return json;
  }

  /// Returns a new [SuccessResponseDto] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static SuccessResponseDto? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key), 'Required key "SuccessResponseDto[$key]" is missing from JSON.');
          assert(json[key] != null, 'Required key "SuccessResponseDto[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return SuccessResponseDto(
        success: mapValueOfType<bool>(json, r'success')!,
        message: mapValueOfType<String>(json, r'message'),
      );
    }
    return null;
  }

  static List<SuccessResponseDto> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <SuccessResponseDto>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = SuccessResponseDto.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, SuccessResponseDto> mapFromJson(dynamic json) {
    final map = <String, SuccessResponseDto>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = SuccessResponseDto.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of SuccessResponseDto-objects as value to a dart map
  static Map<String, List<SuccessResponseDto>> mapListFromJson(dynamic json, {bool growable = false,}) {
    final map = <String, List<SuccessResponseDto>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = SuccessResponseDto.listFromJson(entry.value, growable: growable,);
      }
    }
    return map;
  }

  /// The list of required keys that must be present in a JSON.
  static const requiredKeys = <String>{
    'success',
  };
}

