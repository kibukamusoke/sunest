# doctopussdk.api.UsersApi

## Load the API package
```dart
import 'package:doctopussdk/api.dart';
```

All URIs are relative to *http://localhost:3000*

Method | HTTP request | Description
------------- | ------------- | -------------
[**usersControllerFindOne**](UsersApi.md#userscontrollerfindone) | **GET** /api/users/{id} | Get a user by ID
[**usersControllerGetAllUsers**](UsersApi.md#userscontrollergetallusers) | **GET** /api/users | Get all users with pagination and filtering
[**usersControllerUpdateProfile**](UsersApi.md#userscontrollerupdateprofile) | **PATCH** /api/users/profile | Update user profile
[**usersControllerUpdateUserRoles**](UsersApi.md#userscontrollerupdateuserroles) | **PATCH** /api/users/{id}/roles | Update user roles (Admin only)


# **usersControllerFindOne**
> User usersControllerFindOne(id)

Get a user by ID

### Example
```dart
import 'package:doctopussdk/api.dart';
// TODO Configure HTTP Bearer authorization: bearer
// Case 1. Use String Token
//defaultApiClient.getAuthentication<HttpBearerAuth>('bearer').setAccessToken('YOUR_ACCESS_TOKEN');
// Case 2. Use Function which generate token.
// String yourTokenGeneratorFunction() { ... }
//defaultApiClient.getAuthentication<HttpBearerAuth>('bearer').setAccessToken(yourTokenGeneratorFunction);

final api_instance = UsersApi();
final id = id_example; // String | User ID

try {
    final result = api_instance.usersControllerFindOne(id);
    print(result);
} catch (e) {
    print('Exception when calling UsersApi->usersControllerFindOne: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**| User ID | 

### Return type

[**User**](User.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **usersControllerGetAllUsers**
> UsersControllerGetAllUsers200Response usersControllerGetAllUsers(page, limit, search, status, role, appId)

Get all users with pagination and filtering

### Example
```dart
import 'package:doctopussdk/api.dart';
// TODO Configure HTTP Bearer authorization: bearer
// Case 1. Use String Token
//defaultApiClient.getAuthentication<HttpBearerAuth>('bearer').setAccessToken('YOUR_ACCESS_TOKEN');
// Case 2. Use Function which generate token.
// String yourTokenGeneratorFunction() { ... }
//defaultApiClient.getAuthentication<HttpBearerAuth>('bearer').setAccessToken(yourTokenGeneratorFunction);

final api_instance = UsersApi();
final page = 1; // String | Page number
final limit = 20; // String | Items per page
final search = search_example; // String | Search term for email or name
final status = status_example; // String | Filter by user status (active/inactive)
final role = role_example; // String | Filter by user role (admin/user)
final appId = appId_example; // String | Filter by app ID

try {
    final result = api_instance.usersControllerGetAllUsers(page, limit, search, status, role, appId);
    print(result);
} catch (e) {
    print('Exception when calling UsersApi->usersControllerGetAllUsers: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **page** | **String**| Page number | [optional] 
 **limit** | **String**| Items per page | [optional] 
 **search** | **String**| Search term for email or name | [optional] 
 **status** | **String**| Filter by user status (active/inactive) | [optional] 
 **role** | **String**| Filter by user role (admin/user) | [optional] 
 **appId** | **String**| Filter by app ID | [optional] 

### Return type

[**UsersControllerGetAllUsers200Response**](UsersControllerGetAllUsers200Response.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **usersControllerUpdateProfile**
> User usersControllerUpdateProfile(updateProfileDto)

Update user profile

### Example
```dart
import 'package:doctopussdk/api.dart';
// TODO Configure HTTP Bearer authorization: bearer
// Case 1. Use String Token
//defaultApiClient.getAuthentication<HttpBearerAuth>('bearer').setAccessToken('YOUR_ACCESS_TOKEN');
// Case 2. Use Function which generate token.
// String yourTokenGeneratorFunction() { ... }
//defaultApiClient.getAuthentication<HttpBearerAuth>('bearer').setAccessToken(yourTokenGeneratorFunction);

final api_instance = UsersApi();
final updateProfileDto = UpdateProfileDto(); // UpdateProfileDto | User profile data to update

try {
    final result = api_instance.usersControllerUpdateProfile(updateProfileDto);
    print(result);
} catch (e) {
    print('Exception when calling UsersApi->usersControllerUpdateProfile: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **updateProfileDto** | [**UpdateProfileDto**](UpdateProfileDto.md)| User profile data to update | 

### Return type

[**User**](User.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **usersControllerUpdateUserRoles**
> User usersControllerUpdateUserRoles(id, usersControllerUpdateUserRolesRequest)

Update user roles (Admin only)

### Example
```dart
import 'package:doctopussdk/api.dart';
// TODO Configure HTTP Bearer authorization: bearer
// Case 1. Use String Token
//defaultApiClient.getAuthentication<HttpBearerAuth>('bearer').setAccessToken('YOUR_ACCESS_TOKEN');
// Case 2. Use Function which generate token.
// String yourTokenGeneratorFunction() { ... }
//defaultApiClient.getAuthentication<HttpBearerAuth>('bearer').setAccessToken(yourTokenGeneratorFunction);

final api_instance = UsersApi();
final id = id_example; // String | User ID
final usersControllerUpdateUserRolesRequest = UsersControllerUpdateUserRolesRequest(); // UsersControllerUpdateUserRolesRequest | 

try {
    final result = api_instance.usersControllerUpdateUserRoles(id, usersControllerUpdateUserRolesRequest);
    print(result);
} catch (e) {
    print('Exception when calling UsersApi->usersControllerUpdateUserRoles: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**| User ID | 
 **usersControllerUpdateUserRolesRequest** | [**UsersControllerUpdateUserRolesRequest**](UsersControllerUpdateUserRolesRequest.md)|  | 

### Return type

[**User**](User.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

