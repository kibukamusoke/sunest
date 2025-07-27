//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.18

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

part of openapi.api;

class DeviceDto {
  /// Returns a new [DeviceDto] instance.
  DeviceDto({
    required this.id,
    this.deviceId,
    this.deviceName,
    this.platform,
    this.appVersion,
    required this.serverCount,
    this.userId,
    required this.isActive,
    required this.lastSeen,
    required this.createdAt,
    required this.updatedAt,
    required this.hasActiveSubscription,
    required this.maxServers,
    required this.canViewLogs,
    this.appId,
    this.osVersion,
    this.manufacturer,
    this.model,
    this.sdkVersion,
    this.product,
    this.localizedModel,
  });

  /// Device ID
  String id;

  /// Device identifier
  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  Object? deviceId;

  /// Device name
  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  Object? deviceName;

  /// Platform (ios, android, etc.)
  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  Object? platform;

  /// App version
  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  Object? appVersion;

  /// Number of servers
  num serverCount;

  /// User ID
  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  Object? userId;

  /// Whether device is active
  bool isActive;

  /// Last seen timestamp
  DateTime lastSeen;

  /// Created at timestamp
  DateTime createdAt;

  /// Updated at timestamp
  DateTime updatedAt;

  /// Whether device has active subscription
  bool hasActiveSubscription;

  /// Maximum number of servers
  num maxServers;

  /// Whether device can view logs
  bool canViewLogs;

  /// App ID for multi-tenancy
  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  Object? appId;

  /// OS version
  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  Object? osVersion;

  /// Device manufacturer
  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  Object? manufacturer;

  /// Device model
  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  Object? model;

  /// SDK version (Android)
  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  Object? sdkVersion;

  /// Product name
  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  Object? product;

  /// Localized model name
  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  Object? localizedModel;

  @override
  bool operator ==(Object other) => identical(this, other) || other is DeviceDto &&
    other.id == id &&
    other.deviceId == deviceId &&
    other.deviceName == deviceName &&
    other.platform == platform &&
    other.appVersion == appVersion &&
    other.serverCount == serverCount &&
    other.userId == userId &&
    other.isActive == isActive &&
    other.lastSeen == lastSeen &&
    other.createdAt == createdAt &&
    other.updatedAt == updatedAt &&
    other.hasActiveSubscription == hasActiveSubscription &&
    other.maxServers == maxServers &&
    other.canViewLogs == canViewLogs &&
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
    (id.hashCode) +
    (deviceId == null ? 0 : deviceId!.hashCode) +
    (deviceName == null ? 0 : deviceName!.hashCode) +
    (platform == null ? 0 : platform!.hashCode) +
    (appVersion == null ? 0 : appVersion!.hashCode) +
    (serverCount.hashCode) +
    (userId == null ? 0 : userId!.hashCode) +
    (isActive.hashCode) +
    (lastSeen.hashCode) +
    (createdAt.hashCode) +
    (updatedAt.hashCode) +
    (hasActiveSubscription.hashCode) +
    (maxServers.hashCode) +
    (canViewLogs.hashCode) +
    (appId == null ? 0 : appId!.hashCode) +
    (osVersion == null ? 0 : osVersion!.hashCode) +
    (manufacturer == null ? 0 : manufacturer!.hashCode) +
    (model == null ? 0 : model!.hashCode) +
    (sdkVersion == null ? 0 : sdkVersion!.hashCode) +
    (product == null ? 0 : product!.hashCode) +
    (localizedModel == null ? 0 : localizedModel!.hashCode);

  @override
  String toString() => 'DeviceDto[id=$id, deviceId=$deviceId, deviceName=$deviceName, platform=$platform, appVersion=$appVersion, serverCount=$serverCount, userId=$userId, isActive=$isActive, lastSeen=$lastSeen, createdAt=$createdAt, updatedAt=$updatedAt, hasActiveSubscription=$hasActiveSubscription, maxServers=$maxServers, canViewLogs=$canViewLogs, appId=$appId, osVersion=$osVersion, manufacturer=$manufacturer, model=$model, sdkVersion=$sdkVersion, product=$product, localizedModel=$localizedModel]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
      json[r'id'] = this.id;
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
      json[r'serverCount'] = this.serverCount;
    if (this.userId != null) {
      json[r'userId'] = this.userId;
    } else {
      json[r'userId'] = null;
    }
      json[r'isActive'] = this.isActive;
      json[r'lastSeen'] = this.lastSeen.toUtc().toIso8601String();
      json[r'createdAt'] = this.createdAt.toUtc().toIso8601String();
      json[r'updatedAt'] = this.updatedAt.toUtc().toIso8601String();
      json[r'hasActiveSubscription'] = this.hasActiveSubscription;
      json[r'maxServers'] = this.maxServers;
      json[r'canViewLogs'] = this.canViewLogs;
    if (this.appId != null) {
      json[r'appId'] = this.appId;
    } else {
      json[r'appId'] = null;
    }
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

  /// Returns a new [DeviceDto] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static DeviceDto? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key), 'Required key "DeviceDto[$key]" is missing from JSON.');
          assert(json[key] != null, 'Required key "DeviceDto[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return DeviceDto(
        id: mapValueOfType<String>(json, r'id')!,
        deviceId: mapValueOfType<Object>(json, r'deviceId'),
        deviceName: mapValueOfType<Object>(json, r'deviceName'),
        platform: mapValueOfType<Object>(json, r'platform'),
        appVersion: mapValueOfType<Object>(json, r'appVersion'),
        serverCount: num.parse('${json[r'serverCount']}'),
        userId: mapValueOfType<Object>(json, r'userId'),
        isActive: mapValueOfType<bool>(json, r'isActive')!,
        lastSeen: mapDateTime(json, r'lastSeen', r'')!,
        createdAt: mapDateTime(json, r'createdAt', r'')!,
        updatedAt: mapDateTime(json, r'updatedAt', r'')!,
        hasActiveSubscription: mapValueOfType<bool>(json, r'hasActiveSubscription')!,
        maxServers: num.parse('${json[r'maxServers']}'),
        canViewLogs: mapValueOfType<bool>(json, r'canViewLogs')!,
        appId: mapValueOfType<Object>(json, r'appId'),
        osVersion: mapValueOfType<Object>(json, r'osVersion'),
        manufacturer: mapValueOfType<Object>(json, r'manufacturer'),
        model: mapValueOfType<Object>(json, r'model'),
        sdkVersion: mapValueOfType<Object>(json, r'sdkVersion'),
        product: mapValueOfType<Object>(json, r'product'),
        localizedModel: mapValueOfType<Object>(json, r'localizedModel'),
      );
    }
    return null;
  }

  static List<DeviceDto> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <DeviceDto>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = DeviceDto.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, DeviceDto> mapFromJson(dynamic json) {
    final map = <String, DeviceDto>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = DeviceDto.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of DeviceDto-objects as value to a dart map
  static Map<String, List<DeviceDto>> mapListFromJson(dynamic json, {bool growable = false,}) {
    final map = <String, List<DeviceDto>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = DeviceDto.listFromJson(entry.value, growable: growable,);
      }
    }
    return map;
  }

  /// The list of required keys that must be present in a JSON.
  static const requiredKeys = <String>{
    'id',
    'serverCount',
    'isActive',
    'lastSeen',
    'createdAt',
    'updatedAt',
    'hasActiveSubscription',
    'maxServers',
    'canViewLogs',
  };
}

