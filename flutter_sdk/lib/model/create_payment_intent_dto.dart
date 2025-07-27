//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.18

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

part of openapi.api;

class CreatePaymentIntentDto {
  /// Returns a new [CreatePaymentIntentDto] instance.
  CreatePaymentIntentDto({
    required this.priceId,
    required this.deviceId,
    required this.email,
    this.displayName,
    this.appId,
  });

  /// Stripe Price ID
  String priceId;

  /// Device ID
  String deviceId;

  /// Customer email
  String email;

  /// Customer display name
  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  String? displayName;

  /// App ID
  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  String? appId;

  @override
  bool operator ==(Object other) => identical(this, other) || other is CreatePaymentIntentDto &&
    other.priceId == priceId &&
    other.deviceId == deviceId &&
    other.email == email &&
    other.displayName == displayName &&
    other.appId == appId;

  @override
  int get hashCode =>
    // ignore: unnecessary_parenthesis
    (priceId.hashCode) +
    (deviceId.hashCode) +
    (email.hashCode) +
    (displayName == null ? 0 : displayName!.hashCode) +
    (appId == null ? 0 : appId!.hashCode);

  @override
  String toString() => 'CreatePaymentIntentDto[priceId=$priceId, deviceId=$deviceId, email=$email, displayName=$displayName, appId=$appId]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
      json[r'priceId'] = this.priceId;
      json[r'deviceId'] = this.deviceId;
      json[r'email'] = this.email;
    if (this.displayName != null) {
      json[r'displayName'] = this.displayName;
    } else {
      json[r'displayName'] = null;
    }
    if (this.appId != null) {
      json[r'appId'] = this.appId;
    } else {
      json[r'appId'] = null;
    }
    return json;
  }

  /// Returns a new [CreatePaymentIntentDto] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static CreatePaymentIntentDto? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key), 'Required key "CreatePaymentIntentDto[$key]" is missing from JSON.');
          assert(json[key] != null, 'Required key "CreatePaymentIntentDto[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return CreatePaymentIntentDto(
        priceId: mapValueOfType<String>(json, r'priceId')!,
        deviceId: mapValueOfType<String>(json, r'deviceId')!,
        email: mapValueOfType<String>(json, r'email')!,
        displayName: mapValueOfType<String>(json, r'displayName'),
        appId: mapValueOfType<String>(json, r'appId'),
      );
    }
    return null;
  }

  static List<CreatePaymentIntentDto> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <CreatePaymentIntentDto>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = CreatePaymentIntentDto.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, CreatePaymentIntentDto> mapFromJson(dynamic json) {
    final map = <String, CreatePaymentIntentDto>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = CreatePaymentIntentDto.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of CreatePaymentIntentDto-objects as value to a dart map
  static Map<String, List<CreatePaymentIntentDto>> mapListFromJson(dynamic json, {bool growable = false,}) {
    final map = <String, List<CreatePaymentIntentDto>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = CreatePaymentIntentDto.listFromJson(entry.value, growable: growable,);
      }
    }
    return map;
  }

  /// The list of required keys that must be present in a JSON.
  static const requiredKeys = <String>{
    'priceId',
    'deviceId',
    'email',
  };
}

