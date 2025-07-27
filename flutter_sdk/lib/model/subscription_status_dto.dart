//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.18

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

part of openapi.api;

class SubscriptionStatusDto {
  /// Returns a new [SubscriptionStatusDto] instance.
  SubscriptionStatusDto({
    required this.success,
    required this.data,
    required this.message,
  });

  /// Success status
  bool success;

  /// Subscription status information
  Object data;

  /// Response message
  String message;

  @override
  bool operator ==(Object other) => identical(this, other) || other is SubscriptionStatusDto &&
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
  String toString() => 'SubscriptionStatusDto[success=$success, data=$data, message=$message]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
      json[r'success'] = this.success;
      json[r'data'] = this.data;
      json[r'message'] = this.message;
    return json;
  }

  /// Returns a new [SubscriptionStatusDto] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static SubscriptionStatusDto? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key), 'Required key "SubscriptionStatusDto[$key]" is missing from JSON.');
          assert(json[key] != null, 'Required key "SubscriptionStatusDto[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return SubscriptionStatusDto(
        success: mapValueOfType<bool>(json, r'success')!,
        data: mapValueOfType<Object>(json, r'data')!,
        message: mapValueOfType<String>(json, r'message')!,
      );
    }
    return null;
  }

  static List<SubscriptionStatusDto> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <SubscriptionStatusDto>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = SubscriptionStatusDto.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, SubscriptionStatusDto> mapFromJson(dynamic json) {
    final map = <String, SubscriptionStatusDto>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = SubscriptionStatusDto.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of SubscriptionStatusDto-objects as value to a dart map
  static Map<String, List<SubscriptionStatusDto>> mapListFromJson(dynamic json, {bool growable = false,}) {
    final map = <String, List<SubscriptionStatusDto>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = SubscriptionStatusDto.listFromJson(entry.value, growable: growable,);
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

