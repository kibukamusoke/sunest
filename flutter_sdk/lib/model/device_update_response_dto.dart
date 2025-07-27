//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.18

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

part of openapi.api;

class DeviceUpdateResponseDto {
  /// Returns a new [DeviceUpdateResponseDto] instance.
  DeviceUpdateResponseDto({
    required this.success,
    required this.data,
    this.message,
  });

  /// Success status
  bool success;

  /// Updated device information
  DeviceDto data;

  /// Response message
  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  String? message;

  @override
  bool operator ==(Object other) => identical(this, other) || other is DeviceUpdateResponseDto &&
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
  String toString() => 'DeviceUpdateResponseDto[success=$success, data=$data, message=$message]';

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

  /// Returns a new [DeviceUpdateResponseDto] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static DeviceUpdateResponseDto? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key), 'Required key "DeviceUpdateResponseDto[$key]" is missing from JSON.');
          assert(json[key] != null, 'Required key "DeviceUpdateResponseDto[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return DeviceUpdateResponseDto(
        success: mapValueOfType<bool>(json, r'success')!,
        data: DeviceDto.fromJson(json[r'data'])!,
        message: mapValueOfType<String>(json, r'message'),
      );
    }
    return null;
  }

  static List<DeviceUpdateResponseDto> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <DeviceUpdateResponseDto>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = DeviceUpdateResponseDto.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, DeviceUpdateResponseDto> mapFromJson(dynamic json) {
    final map = <String, DeviceUpdateResponseDto>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = DeviceUpdateResponseDto.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of DeviceUpdateResponseDto-objects as value to a dart map
  static Map<String, List<DeviceUpdateResponseDto>> mapListFromJson(dynamic json, {bool growable = false,}) {
    final map = <String, List<DeviceUpdateResponseDto>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = DeviceUpdateResponseDto.listFromJson(entry.value, growable: growable,);
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

