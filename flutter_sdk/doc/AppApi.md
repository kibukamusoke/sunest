# doctopussdk.api.AppApi

## Load the API package
```dart
import 'package:doctopussdk/api.dart';
```

All URIs are relative to *http://localhost:3000*

Method | HTTP request | Description
------------- | ------------- | -------------
[**appControllerGetHello**](AppApi.md#appcontrollergethello) | **GET** /api/api/health | 


# **appControllerGetHello**
> appControllerGetHello()



### Example
```dart
import 'package:doctopussdk/api.dart';

final api_instance = AppApi();

try {
    api_instance.appControllerGetHello();
} catch (e) {
    print('Exception when calling AppApi->appControllerGetHello: $e\n');
}
```

### Parameters
This endpoint does not need any parameter.

### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

