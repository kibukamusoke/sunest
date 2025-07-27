//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.18

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

part of openapi.api;

class UsersControllerGetAllUsers200Response {
  /// Returns a new [UsersControllerGetAllUsers200Response] instance.
  UsersControllerGetAllUsers200Response({
    this.users = const [],
    this.total,
    this.page,
    this.limit,
    this.pages,
  });

  List<User> users;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  num? total;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  num? page;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  num? limit;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  num? pages;

  @override
  bool operator ==(Object other) => identical(this, other) || other is UsersControllerGetAllUsers200Response &&
    _deepEquality.equals(other.users, users) &&
    other.total == total &&
    other.page == page &&
    other.limit == limit &&
    other.pages == pages;

  @override
  int get hashCode =>
    // ignore: unnecessary_parenthesis
    (users.hashCode) +
    (total == null ? 0 : total!.hashCode) +
    (page == null ? 0 : page!.hashCode) +
    (limit == null ? 0 : limit!.hashCode) +
    (pages == null ? 0 : pages!.hashCode);

  @override
  String toString() => 'UsersControllerGetAllUsers200Response[users=$users, total=$total, page=$page, limit=$limit, pages=$pages]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
      json[r'users'] = this.users;
    if (this.total != null) {
      json[r'total'] = this.total;
    } else {
      json[r'total'] = null;
    }
    if (this.page != null) {
      json[r'page'] = this.page;
    } else {
      json[r'page'] = null;
    }
    if (this.limit != null) {
      json[r'limit'] = this.limit;
    } else {
      json[r'limit'] = null;
    }
    if (this.pages != null) {
      json[r'pages'] = this.pages;
    } else {
      json[r'pages'] = null;
    }
    return json;
  }

  /// Returns a new [UsersControllerGetAllUsers200Response] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static UsersControllerGetAllUsers200Response? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key), 'Required key "UsersControllerGetAllUsers200Response[$key]" is missing from JSON.');
          assert(json[key] != null, 'Required key "UsersControllerGetAllUsers200Response[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return UsersControllerGetAllUsers200Response(
        users: User.listFromJson(json[r'users']),
        total: num.parse('${json[r'total']}'),
        page: num.parse('${json[r'page']}'),
        limit: num.parse('${json[r'limit']}'),
        pages: num.parse('${json[r'pages']}'),
      );
    }
    return null;
  }

  static List<UsersControllerGetAllUsers200Response> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <UsersControllerGetAllUsers200Response>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = UsersControllerGetAllUsers200Response.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, UsersControllerGetAllUsers200Response> mapFromJson(dynamic json) {
    final map = <String, UsersControllerGetAllUsers200Response>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = UsersControllerGetAllUsers200Response.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of UsersControllerGetAllUsers200Response-objects as value to a dart map
  static Map<String, List<UsersControllerGetAllUsers200Response>> mapListFromJson(dynamic json, {bool growable = false,}) {
    final map = <String, List<UsersControllerGetAllUsers200Response>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = UsersControllerGetAllUsers200Response.listFromJson(entry.value, growable: growable,);
      }
    }
    return map;
  }

  /// The list of required keys that must be present in a JSON.
  static const requiredKeys = <String>{
  };
}

