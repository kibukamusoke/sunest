//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.18

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

part of openapi.api;

class CreateCheckoutDto {
  /// Returns a new [CreateCheckoutDto] instance.
  CreateCheckoutDto({
    required this.priceId,
    required this.deviceId,
    required this.email,
    this.displayName,
    this.successUrl,
    this.cancelUrl,
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

  /// Success URL
  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  String? successUrl;

  /// Cancel URL
  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  String? cancelUrl;

  /// App ID
  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  String? appId;

  @override
  bool operator ==(Object other) => identical(this, other) || other is CreateCheckoutDto &&
    other.priceId == priceId &&
    other.deviceId == deviceId &&
    other.email == email &&
    other.displayName == displayName &&
    other.successUrl == successUrl &&
    other.cancelUrl == cancelUrl &&
    other.appId == appId;

  @override
  int get hashCode =>
    // ignore: unnecessary_parenthesis
    (priceId.hashCode) +
    (deviceId.hashCode) +
    (email.hashCode) +
    (displayName == null ? 0 : displayName!.hashCode) +
    (successUrl == null ? 0 : successUrl!.hashCode) +
    (cancelUrl == null ? 0 : cancelUrl!.hashCode) +
    (appId == null ? 0 : appId!.hashCode);

  @override
  String toString() => 'CreateCheckoutDto[priceId=$priceId, deviceId=$deviceId, email=$email, displayName=$displayName, successUrl=$successUrl, cancelUrl=$cancelUrl, appId=$appId]';

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
    if (this.successUrl != null) {
      json[r'successUrl'] = this.successUrl;
    } else {
      json[r'successUrl'] = null;
    }
    if (this.cancelUrl != null) {
      json[r'cancelUrl'] = this.cancelUrl;
    } else {
      json[r'cancelUrl'] = null;
    }
    if (this.appId != null) {
      json[r'appId'] = this.appId;
    } else {
      json[r'appId'] = null;
    }
    return json;
  }

  /// Returns a new [CreateCheckoutDto] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static CreateCheckoutDto? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key), 'Required key "CreateCheckoutDto[$key]" is missing from JSON.');
          assert(json[key] != null, 'Required key "CreateCheckoutDto[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return CreateCheckoutDto(
        priceId: mapValueOfType<String>(json, r'priceId')!,
        deviceId: mapValueOfType<String>(json, r'deviceId')!,
        email: mapValueOfType<String>(json, r'email')!,
        displayName: mapValueOfType<String>(json, r'displayName'),
        successUrl: mapValueOfType<String>(json, r'successUrl'),
        cancelUrl: mapValueOfType<String>(json, r'cancelUrl'),
        appId: mapValueOfType<String>(json, r'appId'),
      );
    }
    return null;
  }

  static List<CreateCheckoutDto> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <CreateCheckoutDto>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = CreateCheckoutDto.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, CreateCheckoutDto> mapFromJson(dynamic json) {
    final map = <String, CreateCheckoutDto>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = CreateCheckoutDto.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of CreateCheckoutDto-objects as value to a dart map
  static Map<String, List<CreateCheckoutDto>> mapListFromJson(dynamic json, {bool growable = false,}) {
    final map = <String, List<CreateCheckoutDto>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = CreateCheckoutDto.listFromJson(entry.value, growable: growable,);
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

