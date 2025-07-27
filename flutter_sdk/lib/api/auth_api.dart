//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.18

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

part of openapi.api;


class AuthApi {
  AuthApi([ApiClient? apiClient]) : apiClient = apiClient ?? defaultApiClient;

  final ApiClient apiClient;

  /// Request a password reset
  ///
  /// Note: This method returns the HTTP [Response].
  ///
  /// Parameters:
  ///
  /// * [ForgotPasswordDto] forgotPasswordDto (required):
  Future<Response> authControllerForgotPasswordWithHttpInfo(ForgotPasswordDto forgotPasswordDto,) async {
    // ignore: prefer_const_declarations
    final path = r'/api/auth/forgot-password';

    // ignore: prefer_final_locals
    Object? postBody = forgotPasswordDto;

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

  /// Request a password reset
  ///
  /// Parameters:
  ///
  /// * [ForgotPasswordDto] forgotPasswordDto (required):
  Future<ForgotPasswordResponseDto?> authControllerForgotPassword(ForgotPasswordDto forgotPasswordDto,) async {
    final response = await authControllerForgotPasswordWithHttpInfo(forgotPasswordDto,);
    if (response.statusCode >= HttpStatus.badRequest) {
      throw ApiException(response.statusCode, await _decodeBodyBytes(response));
    }
    // When a remote server returns no body with a status of 204, we shall not decode it.
    // At the time of writing this, `dart:convert` will throw an "Unexpected end of input"
    // FormatException when trying to decode an empty string.
    if (response.body.isNotEmpty && response.statusCode != HttpStatus.noContent) {
      return await apiClient.deserializeAsync(await _decodeBodyBytes(response), 'ForgotPasswordResponseDto',) as ForgotPasswordResponseDto;
    
    }
    return null;
  }

  /// Get the current user profile
  ///
  /// Note: This method returns the HTTP [Response].
  Future<Response> authControllerGetProfileWithHttpInfo() async {
    // ignore: prefer_const_declarations
    final path = r'/api/auth/profile';

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

  /// Get the current user profile
  Future<ProfileResponseDto?> authControllerGetProfile() async {
    final response = await authControllerGetProfileWithHttpInfo();
    if (response.statusCode >= HttpStatus.badRequest) {
      throw ApiException(response.statusCode, await _decodeBodyBytes(response));
    }
    // When a remote server returns no body with a status of 204, we shall not decode it.
    // At the time of writing this, `dart:convert` will throw an "Unexpected end of input"
    // FormatException when trying to decode an empty string.
    if (response.body.isNotEmpty && response.statusCode != HttpStatus.noContent) {
      return await apiClient.deserializeAsync(await _decodeBodyBytes(response), 'ProfileResponseDto',) as ProfileResponseDto;
    
    }
    return null;
  }

  /// Login with email and password
  ///
  /// Note: This method returns the HTTP [Response].
  ///
  /// Parameters:
  ///
  /// * [LoginDto] loginDto (required):
  Future<Response> authControllerLoginWithHttpInfo(LoginDto loginDto,) async {
    // ignore: prefer_const_declarations
    final path = r'/api/auth/login';

    // ignore: prefer_final_locals
    Object? postBody = loginDto;

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

  /// Login with email and password
  ///
  /// Parameters:
  ///
  /// * [LoginDto] loginDto (required):
  Future<LoginResponseDto?> authControllerLogin(LoginDto loginDto,) async {
    final response = await authControllerLoginWithHttpInfo(loginDto,);
    if (response.statusCode >= HttpStatus.badRequest) {
      throw ApiException(response.statusCode, await _decodeBodyBytes(response));
    }
    // When a remote server returns no body with a status of 204, we shall not decode it.
    // At the time of writing this, `dart:convert` will throw an "Unexpected end of input"
    // FormatException when trying to decode an empty string.
    if (response.body.isNotEmpty && response.statusCode != HttpStatus.noContent) {
      return await apiClient.deserializeAsync(await _decodeBodyBytes(response), 'LoginResponseDto',) as LoginResponseDto;
    
    }
    return null;
  }

  /// Logout the current user
  ///
  /// Note: This method returns the HTTP [Response].
  Future<Response> authControllerLogoutWithHttpInfo() async {
    // ignore: prefer_const_declarations
    final path = r'/api/auth/logout';

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

  /// Logout the current user
  Future<SuccessResponseDto?> authControllerLogout() async {
    final response = await authControllerLogoutWithHttpInfo();
    if (response.statusCode >= HttpStatus.badRequest) {
      throw ApiException(response.statusCode, await _decodeBodyBytes(response));
    }
    // When a remote server returns no body with a status of 204, we shall not decode it.
    // At the time of writing this, `dart:convert` will throw an "Unexpected end of input"
    // FormatException when trying to decode an empty string.
    if (response.body.isNotEmpty && response.statusCode != HttpStatus.noContent) {
      return await apiClient.deserializeAsync(await _decodeBodyBytes(response), 'SuccessResponseDto',) as SuccessResponseDto;
    
    }
    return null;
  }

  /// Refresh an access token using a refresh token
  ///
  /// Note: This method returns the HTTP [Response].
  ///
  /// Parameters:
  ///
  /// * [RefreshTokenDto] refreshTokenDto (required):
  Future<Response> authControllerRefreshTokenWithHttpInfo(RefreshTokenDto refreshTokenDto,) async {
    // ignore: prefer_const_declarations
    final path = r'/api/auth/refresh';

    // ignore: prefer_final_locals
    Object? postBody = refreshTokenDto;

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

  /// Refresh an access token using a refresh token
  ///
  /// Parameters:
  ///
  /// * [RefreshTokenDto] refreshTokenDto (required):
  Future<RefreshTokenResponseDto?> authControllerRefreshToken(RefreshTokenDto refreshTokenDto,) async {
    final response = await authControllerRefreshTokenWithHttpInfo(refreshTokenDto,);
    if (response.statusCode >= HttpStatus.badRequest) {
      throw ApiException(response.statusCode, await _decodeBodyBytes(response));
    }
    // When a remote server returns no body with a status of 204, we shall not decode it.
    // At the time of writing this, `dart:convert` will throw an "Unexpected end of input"
    // FormatException when trying to decode an empty string.
    if (response.body.isNotEmpty && response.statusCode != HttpStatus.noContent) {
      return await apiClient.deserializeAsync(await _decodeBodyBytes(response), 'RefreshTokenResponseDto',) as RefreshTokenResponseDto;
    
    }
    return null;
  }

  /// Register a new user
  ///
  /// Note: This method returns the HTTP [Response].
  ///
  /// Parameters:
  ///
  /// * [RegisterDto] registerDto (required):
  Future<Response> authControllerRegisterWithHttpInfo(RegisterDto registerDto,) async {
    // ignore: prefer_const_declarations
    final path = r'/api/auth/register';

    // ignore: prefer_final_locals
    Object? postBody = registerDto;

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

  /// Register a new user
  ///
  /// Parameters:
  ///
  /// * [RegisterDto] registerDto (required):
  Future<RegisterResponseDto?> authControllerRegister(RegisterDto registerDto,) async {
    final response = await authControllerRegisterWithHttpInfo(registerDto,);
    if (response.statusCode >= HttpStatus.badRequest) {
      throw ApiException(response.statusCode, await _decodeBodyBytes(response));
    }
    // When a remote server returns no body with a status of 204, we shall not decode it.
    // At the time of writing this, `dart:convert` will throw an "Unexpected end of input"
    // FormatException when trying to decode an empty string.
    if (response.body.isNotEmpty && response.statusCode != HttpStatus.noContent) {
      return await apiClient.deserializeAsync(await _decodeBodyBytes(response), 'RegisterResponseDto',) as RegisterResponseDto;
    
    }
    return null;
  }

  /// Reset password using token
  ///
  /// Note: This method returns the HTTP [Response].
  ///
  /// Parameters:
  ///
  /// * [ResetPasswordDto] resetPasswordDto (required):
  Future<Response> authControllerResetPasswordWithHttpInfo(ResetPasswordDto resetPasswordDto,) async {
    // ignore: prefer_const_declarations
    final path = r'/api/auth/reset-password';

    // ignore: prefer_final_locals
    Object? postBody = resetPasswordDto;

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

  /// Reset password using token
  ///
  /// Parameters:
  ///
  /// * [ResetPasswordDto] resetPasswordDto (required):
  Future<ResetPasswordResponseDto?> authControllerResetPassword(ResetPasswordDto resetPasswordDto,) async {
    final response = await authControllerResetPasswordWithHttpInfo(resetPasswordDto,);
    if (response.statusCode >= HttpStatus.badRequest) {
      throw ApiException(response.statusCode, await _decodeBodyBytes(response));
    }
    // When a remote server returns no body with a status of 204, we shall not decode it.
    // At the time of writing this, `dart:convert` will throw an "Unexpected end of input"
    // FormatException when trying to decode an empty string.
    if (response.body.isNotEmpty && response.statusCode != HttpStatus.noContent) {
      return await apiClient.deserializeAsync(await _decodeBodyBytes(response), 'ResetPasswordResponseDto',) as ResetPasswordResponseDto;
    
    }
    return null;
  }

  /// Verify user email address
  ///
  /// Note: This method returns the HTTP [Response].
  ///
  /// Parameters:
  ///
  /// * [String] token (required):
  Future<Response> authControllerVerifyEmailWithHttpInfo(String token,) async {
    // ignore: prefer_const_declarations
    final path = r'/api/auth/verify-email';

    // ignore: prefer_final_locals
    Object? postBody;

    final queryParams = <QueryParam>[];
    final headerParams = <String, String>{};
    final formParams = <String, String>{};

      queryParams.addAll(_queryParams('', 'token', token));

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

  /// Verify user email address
  ///
  /// Parameters:
  ///
  /// * [String] token (required):
  Future<VerifyEmailResponseDto?> authControllerVerifyEmail(String token,) async {
    final response = await authControllerVerifyEmailWithHttpInfo(token,);
    if (response.statusCode >= HttpStatus.badRequest) {
      throw ApiException(response.statusCode, await _decodeBodyBytes(response));
    }
    // When a remote server returns no body with a status of 204, we shall not decode it.
    // At the time of writing this, `dart:convert` will throw an "Unexpected end of input"
    // FormatException when trying to decode an empty string.
    if (response.body.isNotEmpty && response.statusCode != HttpStatus.noContent) {
      return await apiClient.deserializeAsync(await _decodeBodyBytes(response), 'VerifyEmailResponseDto',) as VerifyEmailResponseDto;
    
    }
    return null;
  }
}
