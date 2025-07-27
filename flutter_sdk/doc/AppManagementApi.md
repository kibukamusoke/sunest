# doctopussdk.api.AppManagementApi

## Load the API package
```dart
import 'package:doctopussdk/api.dart';
```

All URIs are relative to *http://localhost:3000*

Method | HTTP request | Description
------------- | ------------- | -------------
[**appManagementControllerCreateApp**](AppManagementApi.md#appmanagementcontrollercreateapp) | **POST** /api/app-management | Create a new app
[**appManagementControllerDeleteApp**](AppManagementApi.md#appmanagementcontrollerdeleteapp) | **DELETE** /api/app-management/{id} | Delete an app
[**appManagementControllerGetApp**](AppManagementApi.md#appmanagementcontrollergetapp) | **GET** /api/app-management/{id} | Get an app by ID
[**appManagementControllerGetAppStatistics**](AppManagementApi.md#appmanagementcontrollergetappstatistics) | **GET** /api/app-management/{id}/statistics | Get app statistics
[**appManagementControllerGetApps**](AppManagementApi.md#appmanagementcontrollergetapps) | **GET** /api/app-management | Get all apps
[**appManagementControllerUpdateApp**](AppManagementApi.md#appmanagementcontrollerupdateapp) | **PUT** /api/app-management/{id} | Update an app


# **appManagementControllerCreateApp**
> AppResponseDto appManagementControllerCreateApp(createAppDto)

Create a new app

### Example
```dart
import 'package:doctopussdk/api.dart';
// TODO Configure HTTP Bearer authorization: bearer
// Case 1. Use String Token
//defaultApiClient.getAuthentication<HttpBearerAuth>('bearer').setAccessToken('YOUR_ACCESS_TOKEN');
// Case 2. Use Function which generate token.
// String yourTokenGeneratorFunction() { ... }
//defaultApiClient.getAuthentication<HttpBearerAuth>('bearer').setAccessToken(yourTokenGeneratorFunction);

final api_instance = AppManagementApi();
final createAppDto = CreateAppDto(); // CreateAppDto | 

try {
    final result = api_instance.appManagementControllerCreateApp(createAppDto);
    print(result);
} catch (e) {
    print('Exception when calling AppManagementApi->appManagementControllerCreateApp: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **createAppDto** | [**CreateAppDto**](CreateAppDto.md)|  | 

### Return type

[**AppResponseDto**](AppResponseDto.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **appManagementControllerDeleteApp**
> appManagementControllerDeleteApp(id)

Delete an app

### Example
```dart
import 'package:doctopussdk/api.dart';
// TODO Configure HTTP Bearer authorization: bearer
// Case 1. Use String Token
//defaultApiClient.getAuthentication<HttpBearerAuth>('bearer').setAccessToken('YOUR_ACCESS_TOKEN');
// Case 2. Use Function which generate token.
// String yourTokenGeneratorFunction() { ... }
//defaultApiClient.getAuthentication<HttpBearerAuth>('bearer').setAccessToken(yourTokenGeneratorFunction);

final api_instance = AppManagementApi();
final id = id_example; // String | App ID

try {
    api_instance.appManagementControllerDeleteApp(id);
} catch (e) {
    print('Exception when calling AppManagementApi->appManagementControllerDeleteApp: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**| App ID | 

### Return type

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **appManagementControllerGetApp**
> AppResponseDto appManagementControllerGetApp(id)

Get an app by ID

### Example
```dart
import 'package:doctopussdk/api.dart';
// TODO Configure HTTP Bearer authorization: bearer
// Case 1. Use String Token
//defaultApiClient.getAuthentication<HttpBearerAuth>('bearer').setAccessToken('YOUR_ACCESS_TOKEN');
// Case 2. Use Function which generate token.
// String yourTokenGeneratorFunction() { ... }
//defaultApiClient.getAuthentication<HttpBearerAuth>('bearer').setAccessToken(yourTokenGeneratorFunction);

final api_instance = AppManagementApi();
final id = id_example; // String | App ID

try {
    final result = api_instance.appManagementControllerGetApp(id);
    print(result);
} catch (e) {
    print('Exception when calling AppManagementApi->appManagementControllerGetApp: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**| App ID | 

### Return type

[**AppResponseDto**](AppResponseDto.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **appManagementControllerGetAppStatistics**
> appManagementControllerGetAppStatistics(id)

Get app statistics

### Example
```dart
import 'package:doctopussdk/api.dart';
// TODO Configure HTTP Bearer authorization: bearer
// Case 1. Use String Token
//defaultApiClient.getAuthentication<HttpBearerAuth>('bearer').setAccessToken('YOUR_ACCESS_TOKEN');
// Case 2. Use Function which generate token.
// String yourTokenGeneratorFunction() { ... }
//defaultApiClient.getAuthentication<HttpBearerAuth>('bearer').setAccessToken(yourTokenGeneratorFunction);

final api_instance = AppManagementApi();
final id = id_example; // String | App ID

try {
    api_instance.appManagementControllerGetAppStatistics(id);
} catch (e) {
    print('Exception when calling AppManagementApi->appManagementControllerGetAppStatistics: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**| App ID | 

### Return type

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **appManagementControllerGetApps**
> List<AppResponseDto> appManagementControllerGetApps(page, limit, search)

Get all apps

### Example
```dart
import 'package:doctopussdk/api.dart';
// TODO Configure HTTP Bearer authorization: bearer
// Case 1. Use String Token
//defaultApiClient.getAuthentication<HttpBearerAuth>('bearer').setAccessToken('YOUR_ACCESS_TOKEN');
// Case 2. Use Function which generate token.
// String yourTokenGeneratorFunction() { ... }
//defaultApiClient.getAuthentication<HttpBearerAuth>('bearer').setAccessToken(yourTokenGeneratorFunction);

final api_instance = AppManagementApi();
final page = 8.14; // num | Page number
final limit = 8.14; // num | Items per page
final search = search_example; // String | Search term

try {
    final result = api_instance.appManagementControllerGetApps(page, limit, search);
    print(result);
} catch (e) {
    print('Exception when calling AppManagementApi->appManagementControllerGetApps: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **page** | **num**| Page number | [optional] 
 **limit** | **num**| Items per page | [optional] 
 **search** | **String**| Search term | [optional] 

### Return type

[**List<AppResponseDto>**](AppResponseDto.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **appManagementControllerUpdateApp**
> AppResponseDto appManagementControllerUpdateApp(id, updateAppDto)

Update an app

### Example
```dart
import 'package:doctopussdk/api.dart';
// TODO Configure HTTP Bearer authorization: bearer
// Case 1. Use String Token
//defaultApiClient.getAuthentication<HttpBearerAuth>('bearer').setAccessToken('YOUR_ACCESS_TOKEN');
// Case 2. Use Function which generate token.
// String yourTokenGeneratorFunction() { ... }
//defaultApiClient.getAuthentication<HttpBearerAuth>('bearer').setAccessToken(yourTokenGeneratorFunction);

final api_instance = AppManagementApi();
final id = id_example; // String | App ID
final updateAppDto = UpdateAppDto(); // UpdateAppDto | 

try {
    final result = api_instance.appManagementControllerUpdateApp(id, updateAppDto);
    print(result);
} catch (e) {
    print('Exception when calling AppManagementApi->appManagementControllerUpdateApp: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**| App ID | 
 **updateAppDto** | [**UpdateAppDto**](UpdateAppDto.md)|  | 

### Return type

[**AppResponseDto**](AppResponseDto.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

