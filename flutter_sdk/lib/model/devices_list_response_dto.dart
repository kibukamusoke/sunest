//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.18

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

part of openapi.api;

class DevicesListResponseDto {
  /// Returns a new [DevicesListResponseDto] instance.
  DevicesListResponseDto({
    required this.success,
    this.data = const [],
    required this.pagination,
  });

  /// Success status
  bool success;

  /// List of devices
  List<DeviceDto> data;

  /// Pagination information
  Object pagination;

  @override
  bool operator ==(Object other) => identical(this, other) || other is DevicesListResponseDto &&
    other.success == success &&
    _deepEquality.equals(other.data, data) &&
    other.pagination == pagination;

  @override
  int get hashCode =>
    // ignore: unnecessary_parenthesis
    (success.hashCode) +
    (data.hashCode) +
    (pagination.hashCode);

  @override
  String toString() => 'DevicesListResponseDto[success=$success, data=$data, pagination=$pagination]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
      json[r'success'] = this.success;
      json[r'data'] = this.data;
      json[r'pagination'] = this.pagination;
    return json;
  }

  /// Returns a new [DevicesListResponseDto] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static DevicesListResponseDto? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key), 'Required key "DevicesListResponseDto[$key]" is missing from JSON.');
          assert(json[key] != null, 'Required key "DevicesListResponseDto[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return DevicesListResponseDto(
        success: mapValueOfType<bool>(json, r'success')!,
        data: DeviceDto.listFromJson(json[r'data']),
        pagination: mapValueOfType<Object>(json, r'pagination')!,
      );
    }
    return null;
  }

  static List<DevicesListResponseDto> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <DevicesListResponseDto>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = DevicesListResponseDto.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, DevicesListResponseDto> mapFromJson(dynamic json) {
    final map = <String, DevicesListResponseDto>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = DevicesListResponseDto.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of DevicesListResponseDto-objects as value to a dart map
  static Map<String, List<DevicesListResponseDto>> mapListFromJson(dynamic json, {bool growable = false,}) {
    final map = <String, List<DevicesListResponseDto>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = DevicesListResponseDto.listFromJson(entry.value, growable: growable,);
      }
    }
    return map;
  }

  /// The list of required keys that must be present in a JSON.
  static const requiredKeys = <String>{
    'success',
    'data',
    'pagination',
  };
}

