//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.18

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

part of openapi.api;


class AppManagementApi {
  AppManagementApi([ApiClient? apiClient]) : apiClient = apiClient ?? defaultApiClient;

  final ApiClient apiClient;

  /// Create a new app
  ///
  /// Note: This method returns the HTTP [Response].
  ///
  /// Parameters:
  ///
  /// * [CreateAppDto] createAppDto (required):
  Future<Response> appManagementControllerCreateAppWithHttpInfo(CreateAppDto createAppDto,) async {
    // ignore: prefer_const_declarations
    final path = r'/api/app-management';

    // ignore: prefer_final_locals
    Object? postBody = createAppDto;

    final queryParams = <QueryParam>[];
    final headerParams = <String, String>{};
    final formParams = <String, String>{};

    const contentTypes = <String>['application/json'];


    return apiClient.invokeAPI(
      path,
      'POST',
      queryParams,
      postBody,
      headerParams,
      formParams,
      contentTypes.isEmpty ? null : contentTypes.first,
    );
  }

  /// Create a new app
  ///
  /// Parameters:
  ///
  /// * [CreateAppDto] createAppDto (required):
  Future<AppResponseDto?> appManagementControllerCreateApp(CreateAppDto createAppDto,) async {
    final response = await appManagementControllerCreateAppWithHttpInfo(createAppDto,);
    if (response.statusCode >= HttpStatus.badRequest) {
      throw ApiException(response.statusCode, await _decodeBodyBytes(response));
    }
    // When a remote server returns no body with a status of 204, we shall not decode it.
    // At the time of writing this, `dart:convert` will throw an "Unexpected end of input"
    // FormatException when trying to decode an empty string.
    if (response.body.isNotEmpty && response.statusCode != HttpStatus.noContent) {
      return await apiClient.deserializeAsync(await _decodeBodyBytes(response), 'AppResponseDto',) as AppResponseDto;
    
    }
    return null;
  }

  /// Delete an app
  ///
  /// Note: This method returns the HTTP [Response].
  ///
  /// Parameters:
  ///
  /// * [String] id (required):
  ///   App ID
  Future<Response> appManagementControllerDeleteAppWithHttpInfo(String id,) async {
    // ignore: prefer_const_declarations
    final path = r'/api/app-management/{id}'
      .replaceAll('{id}', id);

    // ignore: prefer_final_locals
    Object? postBody;

    final queryParams = <QueryParam>[];
    final headerParams = <String, String>{};
    final formParams = <String, String>{};

    const contentTypes = <String>[];


    return apiClient.invokeAPI(
      path,
      'DELETE',
      queryParams,
      postBody,
      headerParams,
      formParams,
      contentTypes.isEmpty ? null : contentTypes.first,
    );
  }

  /// Delete an app
  ///
  /// Parameters:
  ///
  /// * [String] id (required):
  ///   App ID
  Future<void> appManagementControllerDeleteApp(String id,) async {
    final response = await appManagementControllerDeleteAppWithHttpInfo(id,);
    if (response.statusCode >= HttpStatus.badRequest) {
      throw ApiException(response.statusCode, await _decodeBodyBytes(response));
    }
  }

  /// Get an app by ID
  ///
  /// Note: This method returns the HTTP [Response].
  ///
  /// Parameters:
  ///
  /// * [String] id (required):
  ///   App ID
  Future<Response> appManagementControllerGetAppWithHttpInfo(String id,) async {
    // ignore: prefer_const_declarations
    final path = r'/api/app-management/{id}'
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

  /// Get an app by ID
  ///
  /// Parameters:
  ///
  /// * [String] id (required):
  ///   App ID
  Future<AppResponseDto?> appManagementControllerGetApp(String id,) async {
    final response = await appManagementControllerGetAppWithHttpInfo(id,);
    if (response.statusCode >= HttpStatus.badRequest) {
      throw ApiException(response.statusCode, await _decodeBodyBytes(response));
    }
    // When a remote server returns no body with a status of 204, we shall not decode it.
    // At the time of writing this, `dart:convert` will throw an "Unexpected end of input"
    // FormatException when trying to decode an empty string.
    if (response.body.isNotEmpty && response.statusCode != HttpStatus.noContent) {
      return await apiClient.deserializeAsync(await _decodeBodyBytes(response), 'AppResponseDto',) as AppResponseDto;
    
    }
    return null;
  }

  /// Get app statistics
  ///
  /// Note: This method returns the HTTP [Response].
  ///
  /// Parameters:
  ///
  /// * [String] id (required):
  ///   App ID
  Future<Response> appManagementControllerGetAppStatisticsWithHttpInfo(String id,) async {
    // ignore: prefer_const_declarations
    final path = r'/api/app-management/{id}/statistics'
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

  /// Get app statistics
  ///
  /// Parameters:
  ///
  /// * [String] id (required):
  ///   App ID
  Future<void> appManagementControllerGetAppStatistics(String id,) async {
    final response = await appManagementControllerGetAppStatisticsWithHttpInfo(id,);
    if (response.statusCode >= HttpStatus.badRequest) {
      throw ApiException(response.statusCode, await _decodeBodyBytes(response));
    }
  }

  /// Get all apps
  ///
  /// Note: This method returns the HTTP [Response].
  ///
  /// Parameters:
  ///
  /// * [num] page:
  ///   Page number
  ///
  /// * [num] limit:
  ///   Items per page
  ///
  /// * [String] search:
  ///   Search term
  Future<Response> appManagementControllerGetAppsWithHttpInfo({ num? page, num? limit, String? search, }) async {
    // ignore: prefer_const_declarations
    final path = r'/api/app-management';

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

  /// Get all apps
  ///
  /// Parameters:
  ///
  /// * [num] page:
  ///   Page number
  ///
  /// * [num] limit:
  ///   Items per page
  ///
  /// * [String] search:
  ///   Search term
  Future<List<AppResponseDto>?> appManagementControllerGetApps({ num? page, num? limit, String? search, }) async {
    final response = await appManagementControllerGetAppsWithHttpInfo( page: page, limit: limit, search: search, );
    if (response.statusCode >= HttpStatus.badRequest) {
      throw ApiException(response.statusCode, await _decodeBodyBytes(response));
    }
    // When a remote server returns no body with a status of 204, we shall not decode it.
    // At the time of writing this, `dart:convert` will throw an "Unexpected end of input"
    // FormatException when trying to decode an empty string.
    if (response.body.isNotEmpty && response.statusCode != HttpStatus.noContent) {
      final responseBody = await _decodeBodyBytes(response);
      return (await apiClient.deserializeAsync(responseBody, 'List<AppResponseDto>') as List)
        .cast<AppResponseDto>()
        .toList(growable: false);

    }
    return null;
  }

  /// Update an app
  ///
  /// Note: This method returns the HTTP [Response].
  ///
  /// Parameters:
  ///
  /// * [String] id (required):
  ///   App ID
  ///
  /// * [UpdateAppDto] updateAppDto (required):
  Future<Response> appManagementControllerUpdateAppWithHttpInfo(String id, UpdateAppDto updateAppDto,) async {
    // ignore: prefer_const_declarations
    final path = r'/api/app-management/{id}'
      .replaceAll('{id}', id);

    // ignore: prefer_final_locals
    Object? postBody = updateAppDto;

    final queryParams = <QueryParam>[];
    final headerParams = <String, String>{};
    final formParams = <String, String>{};

    const contentTypes = <String>['application/json'];


    return apiClient.invokeAPI(
      path,
      'PUT',
      queryParams,
      postBody,
      headerParams,
      formParams,
      contentTypes.isEmpty ? null : contentTypes.first,
    );
  }

  /// Update an app
  ///
  /// Parameters:
  ///
  /// * [String] id (required):
  ///   App ID
  ///
  /// * [UpdateAppDto] updateAppDto (required):
  Future<AppResponseDto?> appManagementControllerUpdateApp(String id, UpdateAppDto updateAppDto,) async {
    final response = await appManagementControllerUpdateAppWithHttpInfo(id, updateAppDto,);
    if (response.statusCode >= HttpStatus.badRequest) {
      throw ApiException(response.statusCode, await _decodeBodyBytes(response));
    }
    // When a remote server returns no body with a status of 204, we shall not decode it.
    // At the time of writing this, `dart:convert` will throw an "Unexpected end of input"
    // FormatException when trying to decode an empty string.
    if (response.body.isNotEmpty && response.statusCode != HttpStatus.noContent) {
      return await apiClient.deserializeAsync(await _decodeBodyBytes(response), 'AppResponseDto',) as AppResponseDto;
    
    }
    return null;
  }
}
