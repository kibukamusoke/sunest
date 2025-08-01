//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.18

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

part of openapi.api;

class SyncStripePlansResponseDto {
  /// Returns a new [SyncStripePlansResponseDto] instance.
  SyncStripePlansResponseDto({
    required this.success,
    this.data = const [],
    required this.message,
  });

  /// Success status
  bool success;

  /// Synced plans
  List<SubscriptionPlanDto> data;

  /// Response message
  String message;

  @override
  bool operator ==(Object other) => identical(this, other) || other is SyncStripePlansResponseDto &&
    other.success == success &&
    _deepEquality.equals(other.data, data) &&
    other.message == message;

  @override
  int get hashCode =>
    // ignore: unnecessary_parenthesis
    (success.hashCode) +
    (data.hashCode) +
    (message.hashCode);

  @override
  String toString() => 'SyncStripePlansResponseDto[success=$success, data=$data, message=$message]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
      json[r'success'] = this.success;
      json[r'data'] = this.data;
      json[r'message'] = this.message;
    return json;
  }

  /// Returns a new [SyncStripePlansResponseDto] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static SyncStripePlansResponseDto? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key), 'Required key "SyncStripePlansResponseDto[$key]" is missing from JSON.');
          assert(json[key] != null, 'Required key "SyncStripePlansResponseDto[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return SyncStripePlansResponseDto(
        success: mapValueOfType<bool>(json, r'success')!,
        data: SubscriptionPlanDto.listFromJson(json[r'data']),
        message: mapValueOfType<String>(json, r'message')!,
      );
    }
    return null;
  }

  static List<SyncStripePlansResponseDto> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <SyncStripePlansResponseDto>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = SyncStripePlansResponseDto.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, SyncStripePlansResponseDto> mapFromJson(dynamic json) {
    final map = <String, SyncStripePlansResponseDto>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = SyncStripePlansResponseDto.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of SyncStripePlansResponseDto-objects as value to a dart map
  static Map<String, List<SyncStripePlansResponseDto>> mapListFromJson(dynamic json, {bool growable = false,}) {
    final map = <String, List<SyncStripePlansResponseDto>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = SyncStripePlansResponseDto.listFromJson(entry.value, growable: growable,);
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

