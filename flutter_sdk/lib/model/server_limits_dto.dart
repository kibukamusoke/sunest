//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.18

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

part of openapi.api;

class ServerLimitsDto {
  /// Returns a new [ServerLimitsDto] instance.
  ServerLimitsDto({
    required this.success,
    required this.data,
    required this.message,
  });

  /// Success status
  bool success;

  /// Server creation limits
  Object data;

  /// Response message
  String message;

  @override
  bool operator ==(Object other) => identical(this, other) || other is ServerLimitsDto &&
    other.success == success &&
    other.data == data &&
    other.message == message;

  @override
  int get hashCode =>
    // ignore: unnecessary_parenthesis
    (success.hashCode) +
    (data.hashCode) +
    (message.hashCode);

  @override
  String toString() => 'ServerLimitsDto[success=$success, data=$data, message=$message]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
      json[r'success'] = this.success;
      json[r'data'] = this.data;
      json[r'message'] = this.message;
    return json;
  }

  /// Returns a new [ServerLimitsDto] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static ServerLimitsDto? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key), 'Required key "ServerLimitsDto[$key]" is missing from JSON.');
          assert(json[key] != null, 'Required key "ServerLimitsDto[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return ServerLimitsDto(
        success: mapValueOfType<bool>(json, r'success')!,
        data: mapValueOfType<Object>(json, r'data')!,
        message: mapValueOfType<String>(json, r'message')!,
      );
    }
    return null;
  }

  static List<ServerLimitsDto> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <ServerLimitsDto>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = ServerLimitsDto.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, ServerLimitsDto> mapFromJson(dynamic json) {
    final map = <String, ServerLimitsDto>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = ServerLimitsDto.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of ServerLimitsDto-objects as value to a dart map
  static Map<String, List<ServerLimitsDto>> mapListFromJson(dynamic json, {bool growable = false,}) {
    final map = <String, List<ServerLimitsDto>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = ServerLimitsDto.listFromJson(entry.value, growable: growable,);
      }
    }
    return map;
  }

  /// The list of required keys that must be present in a JSON.
  static const requiredKeys = <String>{
    'success',
    'data',
    'message',
  };
}

