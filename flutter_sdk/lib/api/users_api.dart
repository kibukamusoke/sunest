//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.18

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

part of openapi.api;


class UsersApi {
  UsersApi([ApiClient? apiClient]) : apiClient = apiClient ?? defaultApiClient;

  final ApiClient apiClient;

  /// Get a user by ID
  ///
  /// Note: This method returns the HTTP [Response].
  ///
  /// Parameters:
  ///
  /// * [String] id (required):
  ///   User ID
  Future<Response> usersControllerFindOneWithHttpInfo(String id,) async {
    // ignore: prefer_const_declarations
    final path = r'/api/users/{id}'
      .replaceAll('{id}', id);

    // ignore: prefer_final_locals
    Object? postBody;

    final queryParams = <QueryParam>[];
    final headerParams = <String, String>{};
    final formParams = <String, String>{};

    const contentTypes = <String>[];


    return apiClient.invokeAPI(
      path,
      'GET',
      queryParams,
      postBody,
      headerParams,
      formParams,
      contentTypes.isEmpty ? null : contentTypes.first,
    );
  }

  /// Get a user by ID
  ///
  /// Parameters:
  ///
  /// * [String] id (required):
  ///   User ID
  Future<User?> usersControllerFindOne(String id,) async {
    final response = await usersControllerFindOneWithHttpInfo(id,);
    if (response.statusCode >= HttpStatus.badRequest) {
      throw ApiException(response.statusCode, await _decodeBodyBytes(response));
    }
    // When a remote server returns no body with a status of 204, we shall not decode it.
    // At the time of writing this, `dart:convert` will throw an "Unexpected end of input"
    // FormatException when trying to decode an empty string.
    if (response.body.isNotEmpty && response.statusCode != HttpStatus.noContent) {
      return await apiClient.deserializeAsync(await _decodeBodyBytes(response), 'User',) as User;
    
    }
    return null;
  }

  /// Get all users with pagination and filtering
  ///
  /// Note: This method returns the HTTP [Response].
  ///
  /// Parameters:
  ///
  /// * [String] page:
  ///   Page number
  ///
  /// * [String] limit:
  ///   Items per page
  ///
  /// * [String] search:
  ///   Search term for email or name
  ///
  /// * [String] status:
  ///   Filter by user status (active/inactive)
  ///
  /// * [String] role:
  ///   Filter by user role (admin/user)
  ///
  /// * [String] appId:
  ///   Filter by app ID
  Future<Response> usersControllerGetAllUsersWithHttpInfo({ String? page, String? limit, String? search, String? status, String? role, String? appId, }) async {
    // ignore: prefer_const_declarations
    final path = r'/api/users';

    // ignore: prefer_final_locals
    Object? postBody;

    final queryParams = <QueryParam>[];
    final headerParams = <String, String>{};
    final formParams = <String, String>{};

    if (page != null) {
      queryParams.addAll(_queryParams('', 'page', page));
    }
    if (limit != null) {
      queryParams.addAll(_queryParams('', 'limit', limit));
    }
    if (search != null) {
      queryParams.addAll(_queryParams('', 'search', search));
    }
    if (status != null) {
      queryParams.addAll(_queryParams('', 'status', status));
    }
    if (role != null) {
      queryParams.addAll(_queryParams('', 'role', role));
    }
    if (appId != null) {
      queryParams.addAll(_queryParams('', 'appId', appId));
    }

    const contentTypes = <String>[];


    return apiClient.invokeAPI(
      path,
      'GET',
      queryParams,
      postBody,
      headerParams,
      formParams,
      contentTypes.isEmpty ? null : contentTypes.first,
    );
  }

  /// Get all users with pagination and filtering
  ///
  /// Parameters:
  ///
  /// * [String] page:
  ///   Page number
  ///
  /// * [String] limit:
  ///   Items per page
  ///
  /// * [String] search:
  ///   Search term for email or name
  ///
  /// * [String] status:
  ///   Filter by user status (active/inactive)
  ///
  /// * [String] role:
  ///   Filter by user role (admin/user)
  ///
  /// * [String] appId:
  ///   Filter by app ID
  Future<UsersControllerGetAllUsers200Response?> usersControllerGetAllUsers({ String? page, String? limit, String? search, String? status, String? role, String? appId, }) async {
    final response = await usersControllerGetAllUsersWithHttpInfo( page: page, limit: limit, search: search, status: status, role: role, appId: appId, );
    if (response.statusCode >= HttpStatus.badRequest) {
      throw ApiException(response.statusCode, await _decodeBodyBytes(response));
    }
    // When a remote server returns no body with a status of 204, we shall not decode it.
    // At the time of writing this, `dart:convert` will throw an "Unexpected end of input"
    // FormatException when trying to decode an empty string.
    if (response.body.isNotEmpty && response.statusCode != HttpStatus.noContent) {
      return await apiClient.deserializeAsync(await _decodeBodyBytes(response), 'UsersControllerGetAllUsers200Response',) as UsersControllerGetAllUsers200Response;
    
    }
    return null;
  }

  /// Update user profile
  ///
  /// Note: This method returns the HTTP [Response].
  ///
  /// Parameters:
  ///
  /// * [UpdateProfileDto] updateProfileDto (required):
  ///   User profile data to update
  Future<Response> usersControllerUpdateProfileWithHttpInfo(UpdateProfileDto updateProfileDto,) async {
    // ignore: prefer_const_declarations
    final path = r'/api/users/profile';

    // ignore: prefer_final_locals
    Object? postBody = updateProfileDto;

    final queryParams = <QueryParam>[];
    final headerParams = <String, String>{};
    final formParams = <String, String>{};

    const contentTypes = <String>['application/json'];


    return apiClient.invokeAPI(
      path,
      'PATCH',
      queryParams,
      postBody,
      headerParams,
      formParams,
      contentTypes.isEmpty ? null : contentTypes.first,
    );
  }

  /// Update user profile
  ///
  /// Parameters:
  ///
  /// * [UpdateProfileDto] updateProfileDto (required):
  ///   User profile data to update
  Future<User?> usersControllerUpdateProfile(UpdateProfileDto updateProfileDto,) async {
    final response = await usersControllerUpdateProfileWithHttpInfo(updateProfileDto,);
    if (response.statusCode >= HttpStatus.badRequest) {
      throw ApiException(response.statusCode, await _decodeBodyBytes(response));
    }
    // When a remote server returns no body with a status of 204, we shall not decode it.
    // At the time of writing this, `dart:convert` will throw an "Unexpected end of input"
    // FormatException when trying to decode an empty string.
    if (response.body.isNotEmpty && response.statusCode != HttpStatus.noContent) {
      return await apiClient.deserializeAsync(await _decodeBodyBytes(response), 'User',) as User;
    
    }
    return null;
  }

  /// Update user roles (Admin only)
  ///
  /// Note: This method returns the HTTP [Response].
  ///
  /// Parameters:
  ///
  /// * [String] id (required):
  ///   User ID
  ///
  /// * [UsersControllerUpdateUserRolesRequest] usersControllerUpdateUserRolesRequest (required):
  Future<Response> usersControllerUpdateUserRolesWithHttpInfo(String id, UsersControllerUpdateUserRolesRequest usersControllerUpdateUserRolesRequest,) async {
    // ignore: prefer_const_declarations
    final path = r'/api/users/{id}/roles'
      .replaceAll('{id}', id);

    // ignore: prefer_final_locals
    Object? postBody = usersControllerUpdateUserRolesRequest;

    final queryParams = <QueryParam>[];
    final headerParams = <String, String>{};
    final formParams = <String, String>{};

    const contentTypes = <String>['application/json'];


    return apiClient.invokeAPI(
      path,
      'PATCH',
      queryParams,
      postBody,
      headerParams,
      formParams,
      contentTypes.isEmpty ? null : contentTypes.first,
    );
  }

  /// Update user roles (Admin only)
  ///
  /// Parameters:
  ///
  /// * [String] id (required):
  ///   User ID
  ///
  /// * [UsersControllerUpdateUserRolesRequest] usersControllerUpdateUserRolesRequest (required):
  Future<User?> usersControllerUpdateUserRoles(String id, UsersControllerUpdateUserRolesRequest usersControllerUpdateUserRolesRequest,) async {
    final response = await usersControllerUpdateUserRolesWithHttpInfo(id, usersControllerUpdateUserRolesRequest,);
    if (response.statusCode >= HttpStatus.badRequest) {
      throw ApiException(response.statusCode, await _decodeBodyBytes(response));
    }
    // When a remote server returns no body with a status of 204, we shall not decode it.
    // At the time of writing this, `dart:convert` will throw an "Unexpected end of input"
    // FormatException when trying to decode an empty string.
    if (response.body.isNotEmpty && response.statusCode != HttpStatus.noContent) {
      return await apiClient.deserializeAsync(await _decodeBodyBytes(response), 'User',) as User;
    
    }
    return null;
  }
}
