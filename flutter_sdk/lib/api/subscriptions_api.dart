//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.18

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

part of openapi.api;


class SubscriptionsApi {
  SubscriptionsApi([ApiClient? apiClient]) : apiClient = apiClient ?? defaultApiClient;

  final ApiClient apiClient;

  /// Check if device can create more servers
  ///
  /// Note: This method returns the HTTP [Response].
  ///
  /// Parameters:
  ///
  /// * [String] deviceId (required):
  ///   Device ID
  Future<Response> subscriptionsControllerCanCreateServerWithHttpInfo(String deviceId,) async {
    // ignore: prefer_const_declarations
    final path = r'/api/subscriptions/device/{deviceId}/can-create-server'
      .replaceAll('{deviceId}', deviceId);

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

  /// Check if device can create more servers
  ///
  /// Parameters:
  ///
  /// * [String] deviceId (required):
  ///   Device ID
  Future<ServerLimitsDto?> subscriptionsControllerCanCreateServer(String deviceId,) async {
    final response = await subscriptionsControllerCanCreateServerWithHttpInfo(deviceId,);
    if (response.statusCode >= HttpStatus.badRequest) {
      throw ApiException(response.statusCode, await _decodeBodyBytes(response));
    }
    // When a remote server returns no body with a status of 204, we shall not decode it.
    // At the time of writing this, `dart:convert` will throw an "Unexpected end of input"
    // FormatException when trying to decode an empty string.
    if (response.body.isNotEmpty && response.statusCode != HttpStatus.noContent) {
      return await apiClient.deserializeAsync(await _decodeBodyBytes(response), 'ServerLimitsDto',) as ServerLimitsDto;
    
    }
    return null;
  }

  /// Check if device can view logs
  ///
  /// Note: This method returns the HTTP [Response].
  ///
  /// Parameters:
  ///
  /// * [String] deviceId (required):
  ///   Device ID
  Future<Response> subscriptionsControllerCanViewLogsWithHttpInfo(String deviceId,) async {
    // ignore: prefer_const_declarations
    final path = r'/api/subscriptions/device/{deviceId}/can-view-logs'
      .replaceAll('{deviceId}', deviceId);

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

  /// Check if device can view logs
  ///
  /// Parameters:
  ///
  /// * [String] deviceId (required):
  ///   Device ID
  Future<LogAccessDto?> subscriptionsControllerCanViewLogs(String deviceId,) async {
    final response = await subscriptionsControllerCanViewLogsWithHttpInfo(deviceId,);
    if (response.statusCode >= HttpStatus.badRequest) {
      throw ApiException(response.statusCode, await _decodeBodyBytes(response));
    }
    // When a remote server returns no body with a status of 204, we shall not decode it.
    // At the time of writing this, `dart:convert` will throw an "Unexpected end of input"
    // FormatException when trying to decode an empty string.
    if (response.body.isNotEmpty && response.statusCode != HttpStatus.noContent) {
      return await apiClient.deserializeAsync(await _decodeBodyBytes(response), 'LogAccessDto',) as LogAccessDto;
    
    }
    return null;
  }

  /// Check if device has access to a specific feature
  ///
  /// Note: This method returns the HTTP [Response].
  ///
  /// Parameters:
  ///
  /// * [String] deviceId (required):
  ///   Device ID
  ///
  /// * [String] feature (required):
  ///   Feature name
  Future<Response> subscriptionsControllerCheckFeatureAccessWithHttpInfo(String deviceId, String feature,) async {
    // ignore: prefer_const_declarations
    final path = r'/api/subscriptions/device/{deviceId}/check-feature/{feature}'
      .replaceAll('{deviceId}', deviceId)
      .replaceAll('{feature}', feature);

    // ignore: prefer_final_locals
    Object? postBody;

    final queryParams = <QueryParam>[];
    final headerParams = <String, String>{};
    final formParams = <String, String>{};

    const contentTypes = <String>[];


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

  /// Check if device has access to a specific feature
  ///
  /// Parameters:
  ///
  /// * [String] deviceId (required):
  ///   Device ID
  ///
  /// * [String] feature (required):
  ///   Feature name
  Future<void> subscriptionsControllerCheckFeatureAccess(String deviceId, String feature,) async {
    final response = await subscriptionsControllerCheckFeatureAccessWithHttpInfo(deviceId, feature,);
    if (response.statusCode >= HttpStatus.badRequest) {
      throw ApiException(response.statusCode, await _decodeBodyBytes(response));
    }
  }

  /// Create a Stripe checkout session
  ///
  /// Note: This method returns the HTTP [Response].
  ///
  /// Parameters:
  ///
  /// * [CreateCheckoutDto] createCheckoutDto (required):
  Future<Response> subscriptionsControllerCreateCheckoutSessionWithHttpInfo(CreateCheckoutDto createCheckoutDto,) async {
    // ignore: prefer_const_declarations
    final path = r'/api/subscriptions/checkout';

    // ignore: prefer_final_locals
    Object? postBody = createCheckoutDto;

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

  /// Create a Stripe checkout session
  ///
  /// Parameters:
  ///
  /// * [CreateCheckoutDto] createCheckoutDto (required):
  Future<CheckoutSessionDto?> subscriptionsControllerCreateCheckoutSession(CreateCheckoutDto createCheckoutDto,) async {
    final response = await subscriptionsControllerCreateCheckoutSessionWithHttpInfo(createCheckoutDto,);
    if (response.statusCode >= HttpStatus.badRequest) {
      throw ApiException(response.statusCode, await _decodeBodyBytes(response));
    }
    // When a remote server returns no body with a status of 204, we shall not decode it.
    // At the time of writing this, `dart:convert` will throw an "Unexpected end of input"
    // FormatException when trying to decode an empty string.
    if (response.body.isNotEmpty && response.statusCode != HttpStatus.noContent) {
      return await apiClient.deserializeAsync(await _decodeBodyBytes(response), 'CheckoutSessionDto',) as CheckoutSessionDto;
    
    }
    return null;
  }

  /// Create a Stripe payment intent for mobile payment sheet
  ///
  /// Note: This method returns the HTTP [Response].
  ///
  /// Parameters:
  ///
  /// * [CreatePaymentIntentDto] createPaymentIntentDto (required):
  Future<Response> subscriptionsControllerCreatePaymentIntentWithHttpInfo(CreatePaymentIntentDto createPaymentIntentDto,) async {
    // ignore: prefer_const_declarations
    final path = r'/api/subscriptions/payment-intent';

    // ignore: prefer_final_locals
    Object? postBody = createPaymentIntentDto;

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

  /// Create a Stripe payment intent for mobile payment sheet
  ///
  /// Parameters:
  ///
  /// * [CreatePaymentIntentDto] createPaymentIntentDto (required):
  Future<PaymentIntentDto?> subscriptionsControllerCreatePaymentIntent(CreatePaymentIntentDto createPaymentIntentDto,) async {
    final response = await subscriptionsControllerCreatePaymentIntentWithHttpInfo(createPaymentIntentDto,);
    if (response.statusCode >= HttpStatus.badRequest) {
      throw ApiException(response.statusCode, await _decodeBodyBytes(response));
    }
    // When a remote server returns no body with a status of 204, we shall not decode it.
    // At the time of writing this, `dart:convert` will throw an "Unexpected end of input"
    // FormatException when trying to decode an empty string.
    if (response.body.isNotEmpty && response.statusCode != HttpStatus.noContent) {
      return await apiClient.deserializeAsync(await _decodeBodyBytes(response), 'PaymentIntentDto',) as PaymentIntentDto;
    
    }
    return null;
  }

  /// Create a Stripe customer portal session
  ///
  /// Note: This method returns the HTTP [Response].
  ///
  /// Parameters:
  ///
  /// * [CreatePortalSessionDto] createPortalSessionDto (required):
  Future<Response> subscriptionsControllerCreatePortalSessionWithHttpInfo(CreatePortalSessionDto createPortalSessionDto,) async {
    // ignore: prefer_const_declarations
    final path = r'/api/subscriptions/portal';

    // ignore: prefer_final_locals
    Object? postBody = createPortalSessionDto;

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

  /// Create a Stripe customer portal session
  ///
  /// Parameters:
  ///
  /// * [CreatePortalSessionDto] createPortalSessionDto (required):
  Future<PortalSessionResponseDto?> subscriptionsControllerCreatePortalSession(CreatePortalSessionDto createPortalSessionDto,) async {
    final response = await subscriptionsControllerCreatePortalSessionWithHttpInfo(createPortalSessionDto,);
    if (response.statusCode >= HttpStatus.badRequest) {
      throw ApiException(response.statusCode, await _decodeBodyBytes(response));
    }
    // When a remote server returns no body with a status of 204, we shall not decode it.
    // At the time of writing this, `dart:convert` will throw an "Unexpected end of input"
    // FormatException when trying to decode an empty string.
    if (response.body.isNotEmpty && response.statusCode != HttpStatus.noContent) {
      return await apiClient.deserializeAsync(await _decodeBodyBytes(response), 'PortalSessionResponseDto',) as PortalSessionResponseDto;
    
    }
    return null;
  }

  /// Debug endpoint to see all plans in database
  ///
  /// Note: This method returns the HTTP [Response].
  Future<Response> subscriptionsControllerDebugPlansWithHttpInfo() async {
    // ignore: prefer_const_declarations
    final path = r'/api/subscriptions/debug-plans';

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

  /// Debug endpoint to see all plans in database
  Future<SubscriptionPlansResponseDto?> subscriptionsControllerDebugPlans() async {
    final response = await subscriptionsControllerDebugPlansWithHttpInfo();
    if (response.statusCode >= HttpStatus.badRequest) {
      throw ApiException(response.statusCode, await _decodeBodyBytes(response));
    }
    // When a remote server returns no body with a status of 204, we shall not decode it.
    // At the time of writing this, `dart:convert` will throw an "Unexpected end of input"
    // FormatException when trying to decode an empty string.
    if (response.body.isNotEmpty && response.statusCode != HttpStatus.noContent) {
      return await apiClient.deserializeAsync(await _decodeBodyBytes(response), 'SubscriptionPlansResponseDto',) as SubscriptionPlansResponseDto;
    
    }
    return null;
  }

  /// Get all devices (admin only)
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
  ///
  /// * [String] status:
  ///   Filter by status
  ///
  /// * [String] appId:
  ///   App ID to filter devices by
  Future<Response> subscriptionsControllerGetAllDevicesWithHttpInfo({ num? page, num? limit, String? search, String? status, String? appId, }) async {
    // ignore: prefer_const_declarations
    final path = r'/api/subscriptions/devices';

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

  /// Get all devices (admin only)
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
  ///
  /// * [String] status:
  ///   Filter by status
  ///
  /// * [String] appId:
  ///   App ID to filter devices by
  Future<DevicesListResponseDto?> subscriptionsControllerGetAllDevices({ num? page, num? limit, String? search, String? status, String? appId, }) async {
    final response = await subscriptionsControllerGetAllDevicesWithHttpInfo( page: page, limit: limit, search: search, status: status, appId: appId, );
    if (response.statusCode >= HttpStatus.badRequest) {
      throw ApiException(response.statusCode, await _decodeBodyBytes(response));
    }
    // When a remote server returns no body with a status of 204, we shall not decode it.
    // At the time of writing this, `dart:convert` will throw an "Unexpected end of input"
    // FormatException when trying to decode an empty string.
    if (response.body.isNotEmpty && response.statusCode != HttpStatus.noContent) {
      return await apiClient.deserializeAsync(await _decodeBodyBytes(response), 'DevicesListResponseDto',) as DevicesListResponseDto;
    
    }
    return null;
  }

  /// Get all subscriptions with pagination and filtering
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
  ///
  /// * [String] status:
  ///   Filter by status
  ///
  /// * [String] appId:
  ///   App ID to filter subscriptions by
  Future<Response> subscriptionsControllerGetAllSubscriptionsWithHttpInfo({ num? page, num? limit, String? search, String? status, String? appId, }) async {
    // ignore: prefer_const_declarations
    final path = r'/api/subscriptions/all';

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

  /// Get all subscriptions with pagination and filtering
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
  ///
  /// * [String] status:
  ///   Filter by status
  ///
  /// * [String] appId:
  ///   App ID to filter subscriptions by
  Future<SubscriptionsListResponseDto?> subscriptionsControllerGetAllSubscriptions({ num? page, num? limit, String? search, String? status, String? appId, }) async {
    final response = await subscriptionsControllerGetAllSubscriptionsWithHttpInfo( page: page, limit: limit, search: search, status: status, appId: appId, );
    if (response.statusCode >= HttpStatus.badRequest) {
      throw ApiException(response.statusCode, await _decodeBodyBytes(response));
    }
    // When a remote server returns no body with a status of 204, we shall not decode it.
    // At the time of writing this, `dart:convert` will throw an "Unexpected end of input"
    // FormatException when trying to decode an empty string.
    if (response.body.isNotEmpty && response.statusCode != HttpStatus.noContent) {
      return await apiClient.deserializeAsync(await _decodeBodyBytes(response), 'SubscriptionsListResponseDto',) as SubscriptionsListResponseDto;
    
    }
    return null;
  }

  /// Get available subscription prices from local database
  ///
  /// Note: This method returns the HTTP [Response].
  ///
  /// Parameters:
  ///
  /// * [String] appId:
  ///   App ID to filter plans by
  Future<Response> subscriptionsControllerGetPricesWithHttpInfo({ String? appId, }) async {
    // ignore: prefer_const_declarations
    final path = r'/api/subscriptions/prices';

    // ignore: prefer_final_locals
    Object? postBody;

    final queryParams = <QueryParam>[];
    final headerParams = <String, String>{};
    final formParams = <String, String>{};

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

  /// Get available subscription prices from local database
  ///
  /// Parameters:
  ///
  /// * [String] appId:
  ///   App ID to filter plans by
  Future<SubscriptionPlansResponseDto?> subscriptionsControllerGetPrices({ String? appId, }) async {
    final response = await subscriptionsControllerGetPricesWithHttpInfo( appId: appId, );
    if (response.statusCode >= HttpStatus.badRequest) {
      throw ApiException(response.statusCode, await _decodeBodyBytes(response));
    }
    // When a remote server returns no body with a status of 204, we shall not decode it.
    // At the time of writing this, `dart:convert` will throw an "Unexpected end of input"
    // FormatException when trying to decode an empty string.
    if (response.body.isNotEmpty && response.statusCode != HttpStatus.noContent) {
      return await apiClient.deserializeAsync(await _decodeBodyBytes(response), 'SubscriptionPlansResponseDto',) as SubscriptionPlansResponseDto;
    
    }
    return null;
  }

  /// Get subscription limits for a device
  ///
  /// Note: This method returns the HTTP [Response].
  ///
  /// Parameters:
  ///
  /// * [String] deviceId (required):
  ///   Device ID
  Future<Response> subscriptionsControllerGetSubscriptionLimitsWithHttpInfo(String deviceId,) async {
    // ignore: prefer_const_declarations
    final path = r'/api/subscriptions/limits/{deviceId}'
      .replaceAll('{deviceId}', deviceId);

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

  /// Get subscription limits for a device
  ///
  /// Parameters:
  ///
  /// * [String] deviceId (required):
  ///   Device ID
  Future<void> subscriptionsControllerGetSubscriptionLimits(String deviceId,) async {
    final response = await subscriptionsControllerGetSubscriptionLimitsWithHttpInfo(deviceId,);
    if (response.statusCode >= HttpStatus.badRequest) {
      throw ApiException(response.statusCode, await _decodeBodyBytes(response));
    }
  }

  /// Get subscription status for a device
  ///
  /// Note: This method returns the HTTP [Response].
  ///
  /// Parameters:
  ///
  /// * [String] deviceId (required):
  ///   Device ID
  ///
  /// * [String] appId:
  ///   App ID to filter subscriptions by
  Future<Response> subscriptionsControllerGetSubscriptionStatusWithHttpInfo(String deviceId, { String? appId, }) async {
    // ignore: prefer_const_declarations
    final path = r'/api/subscriptions/status/{deviceId}'
      .replaceAll('{deviceId}', deviceId);

    // ignore: prefer_final_locals
    Object? postBody;

    final queryParams = <QueryParam>[];
    final headerParams = <String, String>{};
    final formParams = <String, String>{};

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

  /// Get subscription status for a device
  ///
  /// Parameters:
  ///
  /// * [String] deviceId (required):
  ///   Device ID
  ///
  /// * [String] appId:
  ///   App ID to filter subscriptions by
  Future<SubscriptionStatusDto?> subscriptionsControllerGetSubscriptionStatus(String deviceId, { String? appId, }) async {
    final response = await subscriptionsControllerGetSubscriptionStatusWithHttpInfo(deviceId,  appId: appId, );
    if (response.statusCode >= HttpStatus.badRequest) {
      throw ApiException(response.statusCode, await _decodeBodyBytes(response));
    }
    // When a remote server returns no body with a status of 204, we shall not decode it.
    // At the time of writing this, `dart:convert` will throw an "Unexpected end of input"
    // FormatException when trying to decode an empty string.
    if (response.body.isNotEmpty && response.statusCode != HttpStatus.noContent) {
      return await apiClient.deserializeAsync(await _decodeBodyBytes(response), 'SubscriptionStatusDto',) as SubscriptionStatusDto;
    
    }
    return null;
  }

  /// Record server creation for a device
  ///
  /// Note: This method returns the HTTP [Response].
  ///
  /// Parameters:
  ///
  /// * [String] deviceId (required):
  ///   Device ID
  Future<Response> subscriptionsControllerRecordServerCreatedWithHttpInfo(String deviceId,) async {
    // ignore: prefer_const_declarations
    final path = r'/api/subscriptions/device/{deviceId}/server-created'
      .replaceAll('{deviceId}', deviceId);

    // ignore: prefer_final_locals
    Object? postBody;

    final queryParams = <QueryParam>[];
    final headerParams = <String, String>{};
    final formParams = <String, String>{};

    const contentTypes = <String>[];


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

  /// Record server creation for a device
  ///
  /// Parameters:
  ///
  /// * [String] deviceId (required):
  ///   Device ID
  Future<DeviceUpdateResponseDto?> subscriptionsControllerRecordServerCreated(String deviceId,) async {
    final response = await subscriptionsControllerRecordServerCreatedWithHttpInfo(deviceId,);
    if (response.statusCode >= HttpStatus.badRequest) {
      throw ApiException(response.statusCode, await _decodeBodyBytes(response));
    }
    // When a remote server returns no body with a status of 204, we shall not decode it.
    // At the time of writing this, `dart:convert` will throw an "Unexpected end of input"
    // FormatException when trying to decode an empty string.
    if (response.body.isNotEmpty && response.statusCode != HttpStatus.noContent) {
      return await apiClient.deserializeAsync(await _decodeBodyBytes(response), 'DeviceUpdateResponseDto',) as DeviceUpdateResponseDto;
    
    }
    return null;
  }

  /// Record server deletion for a device
  ///
  /// Note: This method returns the HTTP [Response].
  ///
  /// Parameters:
  ///
  /// * [String] deviceId (required):
  ///   Device ID
  Future<Response> subscriptionsControllerRecordServerDeletedWithHttpInfo(String deviceId,) async {
    // ignore: prefer_const_declarations
    final path = r'/api/subscriptions/device/{deviceId}/server-deleted'
      .replaceAll('{deviceId}', deviceId);

    // ignore: prefer_final_locals
    Object? postBody;

    final queryParams = <QueryParam>[];
    final headerParams = <String, String>{};
    final formParams = <String, String>{};

    const contentTypes = <String>[];


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

  /// Record server deletion for a device
  ///
  /// Parameters:
  ///
  /// * [String] deviceId (required):
  ///   Device ID
  Future<void> subscriptionsControllerRecordServerDeleted(String deviceId,) async {
    final response = await subscriptionsControllerRecordServerDeletedWithHttpInfo(deviceId,);
    if (response.statusCode >= HttpStatus.badRequest) {
      throw ApiException(response.statusCode, await _decodeBodyBytes(response));
    }
  }

  /// Register or update a device
  ///
  /// Note: This method returns the HTTP [Response].
  ///
  /// Parameters:
  ///
  /// * [DeviceRegistrationDto] deviceRegistrationDto (required):
  Future<Response> subscriptionsControllerRegisterDeviceWithHttpInfo(DeviceRegistrationDto deviceRegistrationDto,) async {
    // ignore: prefer_const_declarations
    final path = r'/api/subscriptions/device/register';

    // ignore: prefer_final_locals
    Object? postBody = deviceRegistrationDto;

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

  /// Register or update a device
  ///
  /// Parameters:
  ///
  /// * [DeviceRegistrationDto] deviceRegistrationDto (required):
  Future<DeviceRegistrationResponseDto?> subscriptionsControllerRegisterDevice(DeviceRegistrationDto deviceRegistrationDto,) async {
    final response = await subscriptionsControllerRegisterDeviceWithHttpInfo(deviceRegistrationDto,);
    if (response.statusCode >= HttpStatus.badRequest) {
      throw ApiException(response.statusCode, await _decodeBodyBytes(response));
    }
    // When a remote server returns no body with a status of 204, we shall not decode it.
    // At the time of writing this, `dart:convert` will throw an "Unexpected end of input"
    // FormatException when trying to decode an empty string.
    if (response.body.isNotEmpty && response.statusCode != HttpStatus.noContent) {
      return await apiClient.deserializeAsync(await _decodeBodyBytes(response), 'DeviceRegistrationResponseDto',) as DeviceRegistrationResponseDto;
    
    }
    return null;
  }

  /// Sync subscription plans and prices from Stripe to local database
  ///
  /// Note: This method returns the HTTP [Response].
  Future<Response> subscriptionsControllerSyncStripePlansWithHttpInfo() async {
    // ignore: prefer_const_declarations
    final path = r'/api/subscriptions/sync-stripe-plans';

    // ignore: prefer_final_locals
    Object? postBody;

    final queryParams = <QueryParam>[];
    final headerParams = <String, String>{};
    final formParams = <String, String>{};

    const contentTypes = <String>[];


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

  /// Sync subscription plans and prices from Stripe to local database
  Future<SyncStripePlansResponseDto?> subscriptionsControllerSyncStripePlans() async {
    final response = await subscriptionsControllerSyncStripePlansWithHttpInfo();
    if (response.statusCode >= HttpStatus.badRequest) {
      throw ApiException(response.statusCode, await _decodeBodyBytes(response));
    }
    // When a remote server returns no body with a status of 204, we shall not decode it.
    // At the time of writing this, `dart:convert` will throw an "Unexpected end of input"
    // FormatException when trying to decode an empty string.
    if (response.body.isNotEmpty && response.statusCode != HttpStatus.noContent) {
      return await apiClient.deserializeAsync(await _decodeBodyBytes(response), 'SyncStripePlansResponseDto',) as SyncStripePlansResponseDto;
    
    }
    return null;
  }

  /// Test Stripe connection and list products/prices
  ///
  /// Note: This method returns the HTTP [Response].
  Future<Response> subscriptionsControllerTestStripeConnectionWithHttpInfo() async {
    // ignore: prefer_const_declarations
    final path = r'/api/subscriptions/test-stripe-connection';

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

  /// Test Stripe connection and list products/prices
  Future<StripeConnectionTestResponseDto?> subscriptionsControllerTestStripeConnection() async {
    final response = await subscriptionsControllerTestStripeConnectionWithHttpInfo();
    if (response.statusCode >= HttpStatus.badRequest) {
      throw ApiException(response.statusCode, await _decodeBodyBytes(response));
    }
    // When a remote server returns no body with a status of 204, we shall not decode it.
    // At the time of writing this, `dart:convert` will throw an "Unexpected end of input"
    // FormatException when trying to decode an empty string.
    if (response.body.isNotEmpty && response.statusCode != HttpStatus.noContent) {
      return await apiClient.deserializeAsync(await _decodeBodyBytes(response), 'StripeConnectionTestResponseDto',) as StripeConnectionTestResponseDto;
    
    }
    return null;
  }
}
