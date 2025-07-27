//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.18

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

part of openapi.api;

class SubscriptionsControllerCreateCheckoutSessionRequest {
  /// Returns a new [SubscriptionsControllerCreateCheckoutSessionRequest] instance.
  SubscriptionsControllerCreateCheckoutSessionRequest({
    required this.priceId,
    required this.deviceId,
    this.successUrl,
    this.cancelUrl,
  });

  /// Stripe Price ID
  String priceId;

  /// Device ID
  String deviceId;

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

  @override
  bool operator ==(Object other) => identical(this, other) || other is SubscriptionsControllerCreateCheckoutSessionRequest &&
    other.priceId == priceId &&
    other.deviceId == deviceId &&
    other.successUrl == successUrl &&
    other.cancelUrl == cancelUrl;

  @override
  int get hashCode =>
    // ignore: unnecessary_parenthesis
    (priceId.hashCode) +
    (deviceId.hashCode) +
    (successUrl == null ? 0 : successUrl!.hashCode) +
    (cancelUrl == null ? 0 : cancelUrl!.hashCode);

  @override
  String toString() => 'SubscriptionsControllerCreateCheckoutSessionRequest[priceId=$priceId, deviceId=$deviceId, successUrl=$successUrl, cancelUrl=$cancelUrl]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
      json[r'priceId'] = this.priceId;
      json[r'deviceId'] = this.deviceId;
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
    return json;
  }

  /// Returns a new [SubscriptionsControllerCreateCheckoutSessionRequest] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static SubscriptionsControllerCreateCheckoutSessionRequest? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key), 'Required key "SubscriptionsControllerCreateCheckoutSessionRequest[$key]" is missing from JSON.');
          assert(json[key] != null, 'Required key "SubscriptionsControllerCreateCheckoutSessionRequest[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return SubscriptionsControllerCreateCheckoutSessionRequest(
        priceId: mapValueOfType<String>(json, r'priceId')!,
        deviceId: mapValueOfType<String>(json, r'deviceId')!,
        successUrl: mapValueOfType<String>(json, r'successUrl'),
        cancelUrl: mapValueOfType<String>(json, r'cancelUrl'),
      );
    }
    return null;
  }

  static List<SubscriptionsControllerCreateCheckoutSessionRequest> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <SubscriptionsControllerCreateCheckoutSessionRequest>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = SubscriptionsControllerCreateCheckoutSessionRequest.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, SubscriptionsControllerCreateCheckoutSessionRequest> mapFromJson(dynamic json) {
    final map = <String, SubscriptionsControllerCreateCheckoutSessionRequest>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = SubscriptionsControllerCreateCheckoutSessionRequest.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of SubscriptionsControllerCreateCheckoutSessionRequest-objects as value to a dart map
  static Map<String, List<SubscriptionsControllerCreateCheckoutSessionRequest>> mapListFromJson(dynamic json, {bool growable = false,}) {
    final map = <String, List<SubscriptionsControllerCreateCheckoutSessionRequest>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = SubscriptionsControllerCreateCheckoutSessionRequest.listFromJson(entry.value, growable: growable,);
      }
    }
    return map;
  }

  /// The list of required keys that must be present in a JSON.
  static const requiredKeys = <String>{
    'priceId',
    'deviceId',
  };
}

