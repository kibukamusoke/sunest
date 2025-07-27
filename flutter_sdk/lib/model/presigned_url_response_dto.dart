//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.18

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

part of openapi.api;

class PresignedUrlResponseDto {
  /// Returns a new [PresignedUrlResponseDto] instance.
  PresignedUrlResponseDto({
    required this.fileId,
    required this.key,
    required this.presignedUrl,
    required this.expiresIn,
  });

  String fileId;

  String key;

  String presignedUrl;

  num expiresIn;

  @override
  bool operator ==(Object other) => identical(this, other) || other is PresignedUrlResponseDto &&
    other.fileId == fileId &&
    other.key == key &&
    other.presignedUrl == presignedUrl &&
    other.expiresIn == expiresIn;

  @override
  int get hashCode =>
    // ignore: unnecessary_parenthesis
    (fileId.hashCode) +
    (key.hashCode) +
    (presignedUrl.hashCode) +
    (expiresIn.hashCode);

  @override
  String toString() => 'PresignedUrlResponseDto[fileId=$fileId, key=$key, presignedUrl=$presignedUrl, expiresIn=$expiresIn]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
      json[r'fileId'] = this.fileId;
      json[r'key'] = this.key;
      json[r'presignedUrl'] = this.presignedUrl;
      json[r'expiresIn'] = this.expiresIn;
    return json;
  }

  /// Returns a new [PresignedUrlResponseDto] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static PresignedUrlResponseDto? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key), 'Required key "PresignedUrlResponseDto[$key]" is missing from JSON.');
          assert(json[key] != null, 'Required key "PresignedUrlResponseDto[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return PresignedUrlResponseDto(
        fileId: mapValueOfType<String>(json, r'fileId')!,
        key: mapValueOfType<String>(json, r'key')!,
        presignedUrl: mapValueOfType<String>(json, r'presignedUrl')!,
        expiresIn: num.parse('${json[r'expiresIn']}'),
      );
    }
    return null;
  }

  static List<PresignedUrlResponseDto> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <PresignedUrlResponseDto>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = PresignedUrlResponseDto.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, PresignedUrlResponseDto> mapFromJson(dynamic json) {
    final map = <String, PresignedUrlResponseDto>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = PresignedUrlResponseDto.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of PresignedUrlResponseDto-objects as value to a dart map
  static Map<String, List<PresignedUrlResponseDto>> mapListFromJson(dynamic json, {bool growable = false,}) {
    final map = <String, List<PresignedUrlResponseDto>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = PresignedUrlResponseDto.listFromJson(entry.value, growable: growable,);
      }
    }
    return map;
  }

  /// The list of required keys that must be present in a JSON.
  static const requiredKeys = <String>{
    'fileId',
    'key',
    'presignedUrl',
    'expiresIn',
  };
}

