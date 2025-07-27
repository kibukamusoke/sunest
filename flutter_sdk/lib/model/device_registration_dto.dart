//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.18

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

part of openapi.api;

class DeviceRegistrationDto {
  /// Returns a new [DeviceRegistrationDto] instance.
  DeviceRegistrationDto({
    this.deviceId,
    this.deviceName,
    this.platform,
    this.appVersion,
    required this.appId,
    this.osVersion,
    this.manufacturer,
    this.model,
    this.sdkVersion,
    this.product,
    this.localizedModel,
  });

  /// Unique device identifier (optional, backend will generate if not provided)
  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  String? deviceId;

  /// Device name
  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  String? deviceName;

  /// Platform (ios, android, etc.)
  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  String? platform;

  /// App version
  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  String? appVersion;

  /// App ID for multi-tenancy
  String appId;

  /// OS version
  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  String? osVersion;

  /// Device manufacturer
  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  String? manufacturer;

  /// Device model
  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  String? model;

  /// SDK version (Android)
  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  String? sdkVersion;

  /// Product name
  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  String? product;

  /// Localized model name
  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  String? localizedModel;

  @override
  bool operator ==(Object other) => identical(this, other) || other is DeviceRegistrationDto &&
    other.deviceId == deviceId &&
    other.deviceName == deviceName &&
    other.platform == platform &&
    other.appVersion == appVersion &&
    other.appId == appId &&
    other.osVersion == osVersion &&
    other.manufacturer == manufacturer &&
    other.model == model &&
    other.sdkVersion == sdkVersion &&
    other.product == product &&
    other.localizedModel == localizedModel;

  @override
  int get hashCode =>
    // ignore: unnecessary_parenthesis
    (deviceId == null ? 0 : deviceId!.hashCode) +
    (deviceName == null ? 0 : deviceName!.hashCode) +
    (platform == null ? 0 : platform!.hashCode) +
    (appVersion == null ? 0 : appVersion!.hashCode) +
    (appId.hashCode) +
    (osVersion == null ? 0 : osVersion!.hashCode) +
    (manufacturer == null ? 0 : manufacturer!.hashCode) +
    (model == null ? 0 : model!.hashCode) +
    (sdkVersion == null ? 0 : sdkVersion!.hashCode) +
    (product == null ? 0 : product!.hashCode) +
    (localizedModel == null ? 0 : localizedModel!.hashCode);

  @override
  String toString() => 'DeviceRegistrationDto[deviceId=$deviceId, deviceName=$deviceName, platform=$platform, appVersion=$appVersion, appId=$appId, osVersion=$osVersion, manufacturer=$manufacturer, model=$model, sdkVersion=$sdkVersion, product=$product, localizedModel=$localizedModel]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
    if (this.deviceId != null) {
      json[r'deviceId'] = this.deviceId;
    } else {
      json[r'deviceId'] = null;
    }
    if (this.deviceName != null) {
      json[r'deviceName'] = this.deviceName;
    } else {
      json[r'deviceName'] = null;
    }
    if (this.platform != null) {
      json[r'platform'] = this.platform;
    } else {
      json[r'platform'] = null;
    }
    if (this.appVersion != null) {
      json[r'appVersion'] = this.appVersion;
    } else {
      json[r'appVersion'] = null;
    }
      json[r'appId'] = this.appId;
    if (this.osVersion != null) {
      json[r'osVersion'] = this.osVersion;
    } else {
      json[r'osVersion'] = null;
    }
    if (this.manufacturer != null) {
      json[r'manufacturer'] = this.manufacturer;
    } else {
      json[r'manufacturer'] = null;
    }
    if (this.model != null) {
      json[r'model'] = this.model;
    } else {
      json[r'model'] = null;
    }
    if (this.sdkVersion != null) {
      json[r'sdkVersion'] = this.sdkVersion;
    } else {
      json[r'sdkVersion'] = null;
    }
    if (this.product != null) {
      json[r'product'] = this.product;
    } else {
      json[r'product'] = null;
    }
    if (this.localizedModel != null) {
      json[r'localizedModel'] = this.localizedModel;
    } else {
      json[r'localizedModel'] = null;
    }
    return json;
  }

  /// Returns a new [DeviceRegistrationDto] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static DeviceRegistrationDto? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key), 'Required key "DeviceRegistrationDto[$key]" is missing from JSON.');
          assert(json[key] != null, 'Required key "DeviceRegistrationDto[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return DeviceRegistrationDto(
        deviceId: mapValueOfType<String>(json, r'deviceId'),
        deviceName: mapValueOfType<String>(json, r'deviceName'),
        platform: mapValueOfType<String>(json, r'platform'),
        appVersion: mapValueOfType<String>(json, r'appVersion'),
        appId: mapValueOfType<String>(json, r'appId')!,
        osVersion: mapValueOfType<String>(json, r'osVersion'),
        manufacturer: mapValueOfType<String>(json, r'manufacturer'),
        model: mapValueOfType<String>(json, r'model'),
        sdkVersion: mapValueOfType<String>(json, r'sdkVersion'),
        product: mapValueOfType<String>(json, r'product'),
        localizedModel: mapValueOfType<String>(json, r'localizedModel'),
      );
    }
    return null;
  }

  static List<DeviceRegistrationDto> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <DeviceRegistrationDto>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = DeviceRegistrationDto.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, DeviceRegistrationDto> mapFromJson(dynamic json) {
    final map = <String, DeviceRegistrationDto>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = DeviceRegistrationDto.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of DeviceRegistrationDto-objects as value to a dart map
  static Map<String, List<DeviceRegistrationDto>> mapListFromJson(dynamic json, {bool growable = false,}) {
    final map = <String, List<DeviceRegistrationDto>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = DeviceRegistrationDto.listFromJson(entry.value, growable: growable,);
      }
    }
    return map;
  }

  /// The list of required keys that must be present in a JSON.
  static const requiredKeys = <String>{
    'appId',
  };
}

