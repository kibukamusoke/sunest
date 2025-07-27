//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.18

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

part of openapi.api;

class CreateSubscriptionDto {
  /// Returns a new [CreateSubscriptionDto] instance.
  CreateSubscriptionDto({
    required this.deviceId,
    required this.email,
    required this.priceId,
    required this.successUrl,
    required this.cancelUrl,
    this.displayName,
    this.appId,
  });

  /// Device ID
  String deviceId;

  /// Customer email
  String email;

  /// Stripe price ID
  String priceId;

  /// Success URL after payment
  String successUrl;

  /// Cancel URL if payment is cancelled
  String cancelUrl;

  /// Display name for the customer
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
  bool operator ==(Object other) => identical(this, other) || other is CreateSubscriptionDto &&
    other.deviceId == deviceId &&
    other.email == email &&
    other.priceId == priceId &&
    other.successUrl == successUrl &&
    other.cancelUrl == cancelUrl &&
    other.displayName == displayName &&
    other.appId == appId;

  @override
  int get hashCode =>
    // ignore: unnecessary_parenthesis
    (deviceId.hashCode) +
    (email.hashCode) +
    (priceId.hashCode) +
    (successUrl.hashCode) +
    (cancelUrl.hashCode) +
    (displayName == null ? 0 : displayName!.hashCode) +
    (appId == null ? 0 : appId!.hashCode);

  @override
  String toString() => 'CreateSubscriptionDto[deviceId=$deviceId, email=$email, priceId=$priceId, successUrl=$successUrl, cancelUrl=$cancelUrl, displayName=$displayName, appId=$appId]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
      json[r'deviceId'] = this.deviceId;
      json[r'email'] = this.email;
      json[r'priceId'] = this.priceId;
      json[r'successUrl'] = this.successUrl;
      json[r'cancelUrl'] = this.cancelUrl;
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

  /// Returns a new [CreateSubscriptionDto] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static CreateSubscriptionDto? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key), 'Required key "CreateSubscriptionDto[$key]" is missing from JSON.');
          assert(json[key] != null, 'Required key "CreateSubscriptionDto[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return CreateSubscriptionDto(
        deviceId: mapValueOfType<String>(json, r'deviceId')!,
        email: mapValueOfType<String>(json, r'email')!,
        priceId: mapValueOfType<String>(json, r'priceId')!,
        successUrl: mapValueOfType<String>(json, r'successUrl')!,
        cancelUrl: mapValueOfType<String>(json, r'cancelUrl')!,
        displayName: mapValueOfType<String>(json, r'displayName'),
        appId: mapValueOfType<String>(json, r'appId'),
      );
    }
    return null;
  }

  static List<CreateSubscriptionDto> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <CreateSubscriptionDto>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = CreateSubscriptionDto.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, CreateSubscriptionDto> mapFromJson(dynamic json) {
    final map = <String, CreateSubscriptionDto>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = CreateSubscriptionDto.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of CreateSubscriptionDto-objects as value to a dart map
  static Map<String, List<CreateSubscriptionDto>> mapListFromJson(dynamic json, {bool growable = false,}) {
    final map = <String, List<CreateSubscriptionDto>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = CreateSubscriptionDto.listFromJson(entry.value, growable: growable,);
      }
    }
    return map;
  }

  /// The list of required keys that must be present in a JSON.
  static const requiredKeys = <String>{
    'deviceId',
    'email',
    'priceId',
    'successUrl',
    'cancelUrl',
  };
}

