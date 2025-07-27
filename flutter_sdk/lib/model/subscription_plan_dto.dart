//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.18

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

part of openapi.api;

class SubscriptionPlanDto {
  /// Returns a new [SubscriptionPlanDto] instance.
  SubscriptionPlanDto({
    required this.id,
    required this.name,
    required this.stripePriceId,
    this.stripeProductId,
    this.description,
    required this.amount,
    required this.currency,
    required this.interval,
    this.features = const [],
    required this.isActive,
    required this.subscriberCount,
    this.appId,
  });

  /// Plan ID
  String id;

  /// Plan name
  String name;

  /// Stripe Price ID
  String stripePriceId;

  /// Stripe Product ID
  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  String? stripeProductId;

  /// Plan description
  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  String? description;

  /// Plan amount in cents
  num amount;

  /// Currency code
  String currency;

  /// Billing interval
  String interval;

  /// Plan features
  List<String> features;

  /// Whether plan is active
  bool isActive;

  /// Number of subscribers
  num subscriberCount;

  /// App ID for multi-tenancy
  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  String? appId;

  @override
  bool operator ==(Object other) => identical(this, other) || other is SubscriptionPlanDto &&
    other.id == id &&
    other.name == name &&
    other.stripePriceId == stripePriceId &&
    other.stripeProductId == stripeProductId &&
    other.description == description &&
    other.amount == amount &&
    other.currency == currency &&
    other.interval == interval &&
    _deepEquality.equals(other.features, features) &&
    other.isActive == isActive &&
    other.subscriberCount == subscriberCount &&
    other.appId == appId;

  @override
  int get hashCode =>
    // ignore: unnecessary_parenthesis
    (id.hashCode) +
    (name.hashCode) +
    (stripePriceId.hashCode) +
    (stripeProductId == null ? 0 : stripeProductId!.hashCode) +
    (description == null ? 0 : description!.hashCode) +
    (amount.hashCode) +
    (currency.hashCode) +
    (interval.hashCode) +
    (features.hashCode) +
    (isActive.hashCode) +
    (subscriberCount.hashCode) +
    (appId == null ? 0 : appId!.hashCode);

  @override
  String toString() => 'SubscriptionPlanDto[id=$id, name=$name, stripePriceId=$stripePriceId, stripeProductId=$stripeProductId, description=$description, amount=$amount, currency=$currency, interval=$interval, features=$features, isActive=$isActive, subscriberCount=$subscriberCount, appId=$appId]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
      json[r'id'] = this.id;
      json[r'name'] = this.name;
      json[r'stripePriceId'] = this.stripePriceId;
    if (this.stripeProductId != null) {
      json[r'stripeProductId'] = this.stripeProductId;
    } else {
      json[r'stripeProductId'] = null;
    }
    if (this.description != null) {
      json[r'description'] = this.description;
    } else {
      json[r'description'] = null;
    }
      json[r'amount'] = this.amount;
      json[r'currency'] = this.currency;
      json[r'interval'] = this.interval;
      json[r'features'] = this.features;
      json[r'isActive'] = this.isActive;
      json[r'subscriberCount'] = this.subscriberCount;
    if (this.appId != null) {
      json[r'appId'] = this.appId;
    } else {
      json[r'appId'] = null;
    }
    return json;
  }

  /// Returns a new [SubscriptionPlanDto] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static SubscriptionPlanDto? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key), 'Required key "SubscriptionPlanDto[$key]" is missing from JSON.');
          assert(json[key] != null, 'Required key "SubscriptionPlanDto[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return SubscriptionPlanDto(
        id: mapValueOfType<String>(json, r'id')!,
        name: mapValueOfType<String>(json, r'name')!,
        stripePriceId: mapValueOfType<String>(json, r'stripePriceId')!,
        stripeProductId: mapValueOfType<String>(json, r'stripeProductId'),
        description: mapValueOfType<String>(json, r'description'),
        amount: num.parse('${json[r'amount']}'),
        currency: mapValueOfType<String>(json, r'currency')!,
        interval: mapValueOfType<String>(json, r'interval')!,
        features: json[r'features'] is Iterable
            ? (json[r'features'] as Iterable).cast<String>().toList(growable: false)
            : const [],
        isActive: mapValueOfType<bool>(json, r'isActive')!,
        subscriberCount: num.parse('${json[r'subscriberCount']}'),
        appId: mapValueOfType<String>(json, r'appId'),
      );
    }
    return null;
  }

  static List<SubscriptionPlanDto> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <SubscriptionPlanDto>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = SubscriptionPlanDto.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, SubscriptionPlanDto> mapFromJson(dynamic json) {
    final map = <String, SubscriptionPlanDto>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = SubscriptionPlanDto.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of SubscriptionPlanDto-objects as value to a dart map
  static Map<String, List<SubscriptionPlanDto>> mapListFromJson(dynamic json, {bool growable = false,}) {
    final map = <String, List<SubscriptionPlanDto>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = SubscriptionPlanDto.listFromJson(entry.value, growable: growable,);
      }
    }
    return map;
  }

  /// The list of required keys that must be present in a JSON.
  static const requiredKeys = <String>{
    'id',
    'name',
    'stripePriceId',
    'amount',
    'currency',
    'interval',
    'features',
    'isActive',
    'subscriberCount',
  };
}

