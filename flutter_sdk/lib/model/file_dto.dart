//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.18

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

part of openapi.api;

class FileDto {
  /// Returns a new [FileDto] instance.
  FileDto({
    required this.id,
    required this.key,
    required this.filename,
    required this.mimetype,
    this.size,
    required this.bucket,
    this.uploadedBy,
    this.userId,
    required this.status,
    required this.createdAt,
    required this.updatedAt,
  });

  /// File ID
  String id;

  /// File storage key/path
  String key;

  /// Original filename
  String filename;

  /// File MIME type
  String mimetype;

  /// File size in bytes
  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  num? size;

  /// Storage bucket name
  String bucket;

  /// User ID who uploaded the file
  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  String? uploadedBy;

  /// User ID who owns the file
  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  String? userId;

  /// File status
  FileDtoStatusEnum status;

  /// File creation date
  DateTime createdAt;

  /// File last update date
  DateTime updatedAt;

  @override
  bool operator ==(Object other) => identical(this, other) || other is FileDto &&
    other.id == id &&
    other.key == key &&
    other.filename == filename &&
    other.mimetype == mimetype &&
    other.size == size &&
    other.bucket == bucket &&
    other.uploadedBy == uploadedBy &&
    other.userId == userId &&
    other.status == status &&
    other.createdAt == createdAt &&
    other.updatedAt == updatedAt;

  @override
  int get hashCode =>
    // ignore: unnecessary_parenthesis
    (id.hashCode) +
    (key.hashCode) +
    (filename.hashCode) +
    (mimetype.hashCode) +
    (size == null ? 0 : size!.hashCode) +
    (bucket.hashCode) +
    (uploadedBy == null ? 0 : uploadedBy!.hashCode) +
    (userId == null ? 0 : userId!.hashCode) +
    (status.hashCode) +
    (createdAt.hashCode) +
    (updatedAt.hashCode);

  @override
  String toString() => 'FileDto[id=$id, key=$key, filename=$filename, mimetype=$mimetype, size=$size, bucket=$bucket, uploadedBy=$uploadedBy, userId=$userId, status=$status, createdAt=$createdAt, updatedAt=$updatedAt]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
      json[r'id'] = this.id;
      json[r'key'] = this.key;
      json[r'filename'] = this.filename;
      json[r'mimetype'] = this.mimetype;
    if (this.size != null) {
      json[r'size'] = this.size;
    } else {
      json[r'size'] = null;
    }
      json[r'bucket'] = this.bucket;
    if (this.uploadedBy != null) {
      json[r'uploadedBy'] = this.uploadedBy;
    } else {
      json[r'uploadedBy'] = null;
    }
    if (this.userId != null) {
      json[r'userId'] = this.userId;
    } else {
      json[r'userId'] = null;
    }
      json[r'status'] = this.status;
      json[r'createdAt'] = this.createdAt.toUtc().toIso8601String();
      json[r'updatedAt'] = this.updatedAt.toUtc().toIso8601String();
    return json;
  }

  /// Returns a new [FileDto] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static FileDto? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key), 'Required key "FileDto[$key]" is missing from JSON.');
          assert(json[key] != null, 'Required key "FileDto[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return FileDto(
        id: mapValueOfType<String>(json, r'id')!,
        key: mapValueOfType<String>(json, r'key')!,
        filename: mapValueOfType<String>(json, r'filename')!,
        mimetype: mapValueOfType<String>(json, r'mimetype')!,
        size: num.parse('${json[r'size']}'),
        bucket: mapValueOfType<String>(json, r'bucket')!,
        uploadedBy: mapValueOfType<String>(json, r'uploadedBy'),
        userId: mapValueOfType<String>(json, r'userId'),
        status: FileDtoStatusEnum.fromJson(json[r'status'])!,
        createdAt: mapDateTime(json, r'createdAt', r'')!,
        updatedAt: mapDateTime(json, r'updatedAt', r'')!,
      );
    }
    return null;
  }

  static List<FileDto> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <FileDto>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = FileDto.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, FileDto> mapFromJson(dynamic json) {
    final map = <String, FileDto>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = FileDto.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of FileDto-objects as value to a dart map
  static Map<String, List<FileDto>> mapListFromJson(dynamic json, {bool growable = false,}) {
    final map = <String, List<FileDto>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = FileDto.listFromJson(entry.value, growable: growable,);
      }
    }
    return map;
  }

  /// The list of required keys that must be present in a JSON.
  static const requiredKeys = <String>{
    'id',
    'key',
    'filename',
    'mimetype',
    'bucket',
    'status',
    'createdAt',
    'updatedAt',
  };
}

/// File status
class FileDtoStatusEnum {
  /// Instantiate a new enum with the provided [value].
  const FileDtoStatusEnum._(this.value);

  /// The underlying value of this enum member.
  final String value;

  @override
  String toString() => value;

  String toJson() => value;

  static const PENDING = FileDtoStatusEnum._(r'PENDING');
  static const UPLOADED = FileDtoStatusEnum._(r'UPLOADED');
  static const FAILED = FileDtoStatusEnum._(r'FAILED');

  /// List of all possible values in this [enum][FileDtoStatusEnum].
  static const values = <FileDtoStatusEnum>[
    PENDING,
    UPLOADED,
    FAILED,
  ];

  static FileDtoStatusEnum? fromJson(dynamic value) => FileDtoStatusEnumTypeTransformer().decode(value);

  static List<FileDtoStatusEnum> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <FileDtoStatusEnum>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = FileDtoStatusEnum.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }
}

/// Transformation class that can [encode] an instance of [FileDtoStatusEnum] to String,
/// and [decode] dynamic data back to [FileDtoStatusEnum].
class FileDtoStatusEnumTypeTransformer {
  factory FileDtoStatusEnumTypeTransformer() => _instance ??= const FileDtoStatusEnumTypeTransformer._();

  const FileDtoStatusEnumTypeTransformer._();

  String encode(FileDtoStatusEnum data) => data.value;

  /// Decodes a [dynamic value][data] to a FileDtoStatusEnum.
  ///
  /// If [allowNull] is true and the [dynamic value][data] cannot be decoded successfully,
  /// then null is returned. However, if [allowNull] is false and the [dynamic value][data]
  /// cannot be decoded successfully, then an [UnimplementedError] is thrown.
  ///
  /// The [allowNull] is very handy when an API changes and a new enum value is added or removed,
  /// and users are still using an old app with the old code.
  FileDtoStatusEnum? decode(dynamic data, {bool allowNull = true}) {
    if (data != null) {
      switch (data) {
        case r'PENDING': return FileDtoStatusEnum.PENDING;
        case r'UPLOADED': return FileDtoStatusEnum.UPLOADED;
        case r'FAILED': return FileDtoStatusEnum.FAILED;
        default:
          if (!allowNull) {
            throw ArgumentError('Unknown enum value to decode: $data');
          }
      }
    }
    return null;
  }

  /// Singleton [FileDtoStatusEnumTypeTransformer] instance.
  static FileDtoStatusEnumTypeTransformer? _instance;
}


