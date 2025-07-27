//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.18

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

part of openapi.api;

class CreatePresignedUrlDto {
  /// Returns a new [CreatePresignedUrlDto] instance.
  CreatePresignedUrlDto({
    required this.filename,
    required this.mimetype,
  });

  String filename;

  String mimetype;

  @override
  bool operator ==(Object other) => identical(this, other) || other is CreatePresignedUrlDto &&
    other.filename == filename &&
    other.mimetype == mimetype;

  @override
  int get hashCode =>
    // ignore: unnecessary_parenthesis
    (filename.hashCode) +
    (mimetype.hashCode);

  @override
  String toString() => 'CreatePresignedUrlDto[filename=$filename, mimetype=$mimetype]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
      json[r'filename'] = this.filename;
      json[r'mimetype'] = this.mimetype;
    return json;
  }

  /// Returns a new [CreatePresignedUrlDto] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static CreatePresignedUrlDto? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key), 'Required key "CreatePresignedUrlDto[$key]" is missing from JSON.');
          assert(json[key] != null, 'Required key "CreatePresignedUrlDto[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return CreatePresignedUrlDto(
        filename: mapValueOfType<String>(json, r'filename')!,
        mimetype: mapValueOfType<String>(json, r'mimetype')!,
      );
    }
    return null;
  }

  static List<CreatePresignedUrlDto> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <CreatePresignedUrlDto>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = CreatePresignedUrlDto.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, CreatePresignedUrlDto> mapFromJson(dynamic json) {
    final map = <String, CreatePresignedUrlDto>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = CreatePresignedUrlDto.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of CreatePresignedUrlDto-objects as value to a dart map
  static Map<String, List<CreatePresignedUrlDto>> mapListFromJson(dynamic json, {bool growable = false,}) {
    final map = <String, List<CreatePresignedUrlDto>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = CreatePresignedUrlDto.listFromJson(entry.value, growable: growable,);
      }
    }
    return map;
  }

  /// The list of required keys that must be present in a JSON.
  static const requiredKeys = <String>{
    'filename',
    'mimetype',
  };
}

