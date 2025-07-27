# doctopussdk.api.AuthApi

## Load the API package
```dart
import 'package:doctopussdk/api.dart';
```

All URIs are relative to *http://localhost:3000*

Method | HTTP request | Description
------------- | ------------- | -------------
[**authControllerForgotPassword**](AuthApi.md#authcontrollerforgotpassword) | **POST** /api/auth/forgot-password | Request a password reset
[**authControllerGetProfile**](AuthApi.md#authcontrollergetprofile) | **GET** /api/auth/profile | Get the current user profile
[**authControllerLogin**](AuthApi.md#authcontrollerlogin) | **POST** /api/auth/login | Login with email and password
[**authControllerLogout**](AuthApi.md#authcontrollerlogout) | **POST** /api/auth/logout | Logout the current user
[**authControllerRefreshToken**](AuthApi.md#authcontrollerrefreshtoken) | **POST** /api/auth/refresh | Refresh an access token using a refresh token
[**authControllerRegister**](AuthApi.md#authcontrollerregister) | **POST** /api/auth/register | Register a new user
[**authControllerResetPassword**](AuthApi.md#authcontrollerresetpassword) | **POST** /api/auth/reset-password | Reset password using token
[**authControllerVerifyEmail**](AuthApi.md#authcontrollerverifyemail) | **GET** /api/auth/verify-email | Verify user email address


# **authControllerForgotPassword**
> ForgotPasswordResponseDto authControllerForgotPassword(forgotPasswordDto)

Request a password reset

### Example
```dart
import 'package:doctopussdk/api.dart';

final api_instance = AuthApi();
final forgotPasswordDto = ForgotPasswordDto(); // ForgotPasswordDto | 

try {
    final result = api_instance.authControllerForgotPassword(forgotPasswordDto);
    print(result);
} catch (e) {
    print('Exception when calling AuthApi->authControllerForgotPassword: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **forgotPasswordDto** | [**ForgotPasswordDto**](ForgotPasswordDto.md)|  | 

### Return type

[**ForgotPasswordResponseDto**](ForgotPasswordResponseDto.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **authControllerGetProfile**
> ProfileResponseDto authControllerGetProfile()

Get the current user profile

### Example
```dart
import 'package:doctopussdk/api.dart';
// TODO Configure HTTP Bearer authorization: bearer
// Case 1. Use String Token
//defaultApiClient.getAuthentication<HttpBearerAuth>('bearer').setAccessToken('YOUR_ACCESS_TOKEN');
// Case 2. Use Function which generate token.
// String yourTokenGeneratorFunction() { ... }
//defaultApiClient.getAuthentication<HttpBearerAuth>('bearer').setAccessToken(yourTokenGeneratorFunction);

final api_instance = AuthApi();

try {
    final result = api_instance.authControllerGetProfile();
    print(result);
} catch (e) {
    print('Exception when calling AuthApi->authControllerGetProfile: $e\n');
}
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**ProfileResponseDto**](ProfileResponseDto.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **authControllerLogin**
> LoginResponseDto authControllerLogin(loginDto)

Login with email and password

### Example
```dart
import 'package:doctopussdk/api.dart';

final api_instance = AuthApi();
final loginDto = LoginDto(); // LoginDto | 

try {
    final result = api_instance.authControllerLogin(loginDto);
    print(result);
} catch (e) {
    print('Exception when calling AuthApi->authControllerLogin: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **loginDto** | [**LoginDto**](LoginDto.md)|  | 

### Return type

[**LoginResponseDto**](LoginResponseDto.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **authControllerLogout**
> SuccessResponseDto authControllerLogout()

Logout the current user

### Example
```dart
import 'package:doctopussdk/api.dart';
// TODO Configure HTTP Bearer authorization: bearer
// Case 1. Use String Token
//defaultApiClient.getAuthentication<HttpBearerAuth>('bearer').setAccessToken('YOUR_ACCESS_TOKEN');
// Case 2. Use Function which generate token.
// String yourTokenGeneratorFunction() { ... }
//defaultApiClient.getAuthentication<HttpBearerAuth>('bearer').setAccessToken(yourTokenGeneratorFunction);

final api_instance = AuthApi();

try {
    final result = api_instance.authControllerLogout();
    print(result);
} catch (e) {
    print('Exception when calling AuthApi->authControllerLogout: $e\n');
}
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**SuccessResponseDto**](SuccessResponseDto.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **authControllerRefreshToken**
> RefreshTokenResponseDto authControllerRefreshToken(refreshTokenDto)

Refresh an access token using a refresh token

### Example
```dart
import 'package:doctopussdk/api.dart';

final api_instance = AuthApi();
final refreshTokenDto = RefreshTokenDto(); // RefreshTokenDto | 

try {
    final result = api_instance.authControllerRefreshToken(refreshTokenDto);
    print(result);
} catch (e) {
    print('Exception when calling AuthApi->authControllerRefreshToken: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **refreshTokenDto** | [**RefreshTokenDto**](RefreshTokenDto.md)|  | 

### Return type

[**RefreshTokenResponseDto**](RefreshTokenResponseDto.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **authControllerRegister**
> RegisterResponseDto authControllerRegister(registerDto)

Register a new user

### Example
```dart
import 'package:doctopussdk/api.dart';

final api_instance = AuthApi();
final registerDto = RegisterDto(); // RegisterDto | 

try {
    final result = api_instance.authControllerRegister(registerDto);
    print(result);
} catch (e) {
    print('Exception when calling AuthApi->authControllerRegister: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **registerDto** | [**RegisterDto**](RegisterDto.md)|  | 

### Return type

[**RegisterResponseDto**](RegisterResponseDto.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **authControllerResetPassword**
> ResetPasswordResponseDto authControllerResetPassword(resetPasswordDto)

Reset password using token

### Example
```dart
import 'package:doctopussdk/api.dart';

final api_instance = AuthApi();
final resetPasswordDto = ResetPasswordDto(); // ResetPasswordDto | 

try {
    final result = api_instance.authControllerResetPassword(resetPasswordDto);
    print(result);
} catch (e) {
    print('Exception when calling AuthApi->authControllerResetPassword: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **resetPasswordDto** | [**ResetPasswordDto**](ResetPasswordDto.md)|  | 

### Return type

[**ResetPasswordResponseDto**](ResetPasswordResponseDto.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **authControllerVerifyEmail**
> VerifyEmailResponseDto authControllerVerifyEmail(token)

Verify user email address

### Example
```dart
import 'package:doctopussdk/api.dart';

final api_instance = AuthApi();
final token = token_example; // String | 

try {
    final result = api_instance.authControllerVerifyEmail(token);
    print(result);
} catch (e) {
    print('Exception when calling AuthApi->authControllerVerifyEmail: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **token** | **String**|  | 

### Return type

[**VerifyEmailResponseDto**](VerifyEmailResponseDto.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

