//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.18

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

part of openapi.api;

class CheckoutSessionDto {
  /// Returns a new [CheckoutSessionDto] instance.
  CheckoutSessionDto({
    required this.success,
    required this.data,
    required this.message,
  });

  /// Success status
  bool success;

  /// Checkout session information
  Object data;

  /// Response message
  String message;

  @override
  bool operator ==(Object other) => identical(this, other) || other is CheckoutSessionDto &&
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
  String toString() => 'CheckoutSessionDto[success=$success, data=$data, message=$message]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
      json[r'success'] = this.success;
      json[r'data'] = this.data;
      json[r'message'] = this.message;
    return json;
  }

  /// Returns a new [CheckoutSessionDto] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static CheckoutSessionDto? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key), 'Required key "CheckoutSessionDto[$key]" is missing from JSON.');
          assert(json[key] != null, 'Required key "CheckoutSessionDto[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return CheckoutSessionDto(
        success: mapValueOfType<bool>(json, r'success')!,
        data: mapValueOfType<Object>(json, r'data')!,
        message: mapValueOfType<String>(json, r'message')!,
      );
    }
    return null;
  }

  static List<CheckoutSessionDto> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <CheckoutSessionDto>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = CheckoutSessionDto.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, CheckoutSessionDto> mapFromJson(dynamic json) {
    final map = <String, CheckoutSessionDto>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = CheckoutSessionDto.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of CheckoutSessionDto-objects as value to a dart map
  static Map<String, List<CheckoutSessionDto>> mapListFromJson(dynamic json, {bool growable = false,}) {
    final map = <String, List<CheckoutSessionDto>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = CheckoutSessionDto.listFromJson(entry.value, growable: growable,);
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

