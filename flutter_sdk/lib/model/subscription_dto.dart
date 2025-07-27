//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.18

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

part of openapi.api;

class SubscriptionDto {
  /// Returns a new [SubscriptionDto] instance.
  SubscriptionDto({
    required this.id,
    this.deviceId,
    this.customerId,
    this.subscriptionId,
    this.priceId,
    this.status,
    this.currentPeriodStart,
    this.currentPeriodEnd,
    this.isActive,
    this.appId,
    this.createdAt,
    this.updatedAt,
  });

  /// Subscription ID
  String id;

  /// Device ID
  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  String? deviceId;

  /// Stripe Customer ID
  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  Object? customerId;

  /// Stripe Subscription ID
  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  String? subscriptionId;

  /// Stripe Price ID
  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  String? priceId;

  /// Subscription status
  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  String? status;

  /// Current period start
  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  Object? currentPeriodStart;

  /// Current period end
  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  Object? currentPeriodEnd;

  /// Whether subscription is active
  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  bool? isActive;

  /// App ID for multi-tenancy
  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  String? appId;

  /// Created at timestamp
  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  Object? createdAt;

  /// Updated at timestamp
  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  Object? updatedAt;

  @override
  bool operator ==(Object other) => identical(this, other) || other is SubscriptionDto &&
    other.id == id &&
    other.deviceId == deviceId &&
    other.customerId == customerId &&
    other.subscriptionId == subscriptionId &&
    other.priceId == priceId &&
    other.status == status &&
    other.currentPeriodStart == currentPeriodStart &&
    other.currentPeriodEnd == currentPeriodEnd &&
    other.isActive == isActive &&
    other.appId == appId &&
    other.createdAt == createdAt &&
    other.updatedAt == updatedAt;

  @override
  int get hashCode =>
    // ignore: unnecessary_parenthesis
    (id.hashCode) +
    (deviceId == null ? 0 : deviceId!.hashCode) +
    (customerId == null ? 0 : customerId!.hashCode) +
    (subscriptionId == null ? 0 : subscriptionId!.hashCode) +
    (priceId == null ? 0 : priceId!.hashCode) +
    (status == null ? 0 : status!.hashCode) +
    (currentPeriodStart == null ? 0 : currentPeriodStart!.hashCode) +
    (currentPeriodEnd == null ? 0 : currentPeriodEnd!.hashCode) +
    (isActive == null ? 0 : isActive!.hashCode) +
    (appId == null ? 0 : appId!.hashCode) +
    (createdAt == null ? 0 : createdAt!.hashCode) +
    (updatedAt == null ? 0 : updatedAt!.hashCode);

  @override
  String toString() => 'SubscriptionDto[id=$id, deviceId=$deviceId, customerId=$customerId, subscriptionId=$subscriptionId, priceId=$priceId, status=$status, currentPeriodStart=$currentPeriodStart, currentPeriodEnd=$currentPeriodEnd, isActive=$isActive, appId=$appId, createdAt=$createdAt, updatedAt=$updatedAt]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
      json[r'id'] = this.id;
    if (this.deviceId != null) {
      json[r'deviceId'] = this.deviceId;
    } else {
      json[r'deviceId'] = null;
    }
    if (this.customerId != null) {
      json[r'customerId'] = this.customerId;
    } else {
      json[r'customerId'] = null;
    }
    if (this.subscriptionId != null) {
      json[r'subscriptionId'] = this.subscriptionId;
    } else {
      json[r'subscriptionId'] = null;
    }
    if (this.priceId != null) {
      json[r'priceId'] = this.priceId;
    } else {
      json[r'priceId'] = null;
    }
    if (this.status != null) {
      json[r'status'] = this.status;
    } else {
      json[r'status'] = null;
    }
    if (this.currentPeriodStart != null) {
      json[r'currentPeriodStart'] = this.currentPeriodStart;
    } else {
      json[r'currentPeriodStart'] = null;
    }
    if (this.currentPeriodEnd != null) {
      json[r'currentPeriodEnd'] = this.currentPeriodEnd;
    } else {
      json[r'currentPeriodEnd'] = null;
    }
    if (this.isActive != null) {
      json[r'isActive'] = this.isActive;
    } else {
      json[r'isActive'] = null;
    }
    if (this.appId != null) {
      json[r'appId'] = this.appId;
    } else {
      json[r'appId'] = null;
    }
    if (this.createdAt != null) {
      json[r'createdAt'] = this.createdAt;
    } else {
      json[r'createdAt'] = null;
    }
    if (this.updatedAt != null) {
      json[r'updatedAt'] = this.updatedAt;
    } else {
      json[r'updatedAt'] = null;
    }
    return json;
  }

  /// Returns a new [SubscriptionDto] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static SubscriptionDto? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key), 'Required key "SubscriptionDto[$key]" is missing from JSON.');
          assert(json[key] != null, 'Required key "SubscriptionDto[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return SubscriptionDto(
        id: mapValueOfType<String>(json, r'id')!,
        deviceId: mapValueOfType<String>(json, r'deviceId'),
        customerId: mapValueOfType<Object>(json, r'customerId'),
        subscriptionId: mapValueOfType<String>(json, r'subscriptionId'),
        priceId: mapValueOfType<String>(json, r'priceId'),
        status: mapValueOfType<String>(json, r'status'),
        currentPeriodStart: mapValueOfType<Object>(json, r'currentPeriodStart'),
        currentPeriodEnd: mapValueOfType<Object>(json, r'currentPeriodEnd'),
        isActive: mapValueOfType<bool>(json, r'isActive'),
        appId: mapValueOfType<String>(json, r'appId'),
        createdAt: mapValueOfType<Object>(json, r'createdAt'),
        updatedAt: mapValueOfType<Object>(json, r'updatedAt'),
      );
    }
    return null;
  }

  static List<SubscriptionDto> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <SubscriptionDto>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = SubscriptionDto.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, SubscriptionDto> mapFromJson(dynamic json) {
    final map = <String, SubscriptionDto>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = SubscriptionDto.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of SubscriptionDto-objects as value to a dart map
  static Map<String, List<SubscriptionDto>> mapListFromJson(dynamic json, {bool growable = false,}) {
    final map = <String, List<SubscriptionDto>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = SubscriptionDto.listFromJson(entry.value, growable: growable,);
      }
    }
    return map;
  }

  /// The list of required keys that must be present in a JSON.
  static const requiredKeys = <String>{
    'id',
  };
}

