//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.18

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

part of openapi.api;


class CustomersApi {
  CustomersApi([ApiClient? apiClient]) : apiClient = apiClient ?? defaultApiClient;

  final ApiClient apiClient;

  /// Get all customers with pagination
  ///
  /// Note: This method returns the HTTP [Response].
  ///
  /// Parameters:
  ///
  /// * [String] search:
  ///   Search term
  ///
  /// * [String] appId:
  ///   App ID filter
  ///
  /// * [num] limit:
  ///   Items per page
  ///
  /// * [num] page:
  ///   Page number
  Future<Response> customersControllerGetAllCustomersWithHttpInfo({ String? search, String? appId, num? limit, num? page, }) async {
    // ignore: prefer_const_declarations
    final path = r'/api/customers';

    // ignore: prefer_final_locals
    Object? postBody;

    final queryParams = <QueryParam>[];
    final headerParams = <String, String>{};
    final formParams = <String, String>{};

    if (search != null) {
      queryParams.addAll(_queryParams('', 'search', search));
    }
    if (appId != null) {
      queryParams.addAll(_queryParams('', 'appId', appId));
    }
    if (limit != null) {
      queryParams.addAll(_queryParams('', 'limit', limit));
    }
    if (page != null) {
      queryParams.addAll(_queryParams('', 'page', page));
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

  /// Get all customers with pagination
  ///
  /// Parameters:
  ///
  /// * [String] search:
  ///   Search term
  ///
  /// * [String] appId:
  ///   App ID filter
  ///
  /// * [num] limit:
  ///   Items per page
  ///
  /// * [num] page:
  ///   Page number
  Future<void> customersControllerGetAllCustomers({ String? search, String? appId, num? limit, num? page, }) async {
    final response = await customersControllerGetAllCustomersWithHttpInfo( search: search, appId: appId, limit: limit, page: page, );
    if (response.statusCode >= HttpStatus.badRequest) {
      throw ApiException(response.statusCode, await _decodeBodyBytes(response));
    }
  }

  /// Get customer by ID
  ///
  /// Note: This method returns the HTTP [Response].
  ///
  /// Parameters:
  ///
  /// * [String] id (required):
  Future<Response> customersControllerGetCustomerByIdWithHttpInfo(String id,) async {
    // ignore: prefer_const_declarations
    final path = r'/api/customers/{id}'
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

  /// Get customer by ID
  ///
  /// Parameters:
  ///
  /// * [String] id (required):
  Future<void> customersControllerGetCustomerById(String id,) async {
    final response = await customersControllerGetCustomerByIdWithHttpInfo(id,);
    if (response.statusCode >= HttpStatus.badRequest) {
      throw ApiException(response.statusCode, await _decodeBodyBytes(response));
    }
  }

  /// Get customer subscriptions
  ///
  /// Note: This method returns the HTTP [Response].
  ///
  /// Parameters:
  ///
  /// * [String] id (required):
  Future<Response> customersControllerGetCustomerSubscriptionsWithHttpInfo(String id,) async {
    // ignore: prefer_const_declarations
    final path = r'/api/customers/{id}/subscriptions'
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

  /// Get customer subscriptions
  ///
  /// Parameters:
  ///
  /// * [String] id (required):
  Future<void> customersControllerGetCustomerSubscriptions(String id,) async {
    final response = await customersControllerGetCustomerSubscriptionsWithHttpInfo(id,);
    if (response.statusCode >= HttpStatus.badRequest) {
      throw ApiException(response.statusCode, await _decodeBodyBytes(response));
    }
  }
}
