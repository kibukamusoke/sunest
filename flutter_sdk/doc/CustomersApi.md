# doctopussdk.api.CustomersApi

## Load the API package
```dart
import 'package:doctopussdk/api.dart';
```

All URIs are relative to *http://localhost:3000*

Method | HTTP request | Description
------------- | ------------- | -------------
[**customersControllerGetAllCustomers**](CustomersApi.md#customerscontrollergetallcustomers) | **GET** /api/customers | Get all customers with pagination
[**customersControllerGetCustomerById**](CustomersApi.md#customerscontrollergetcustomerbyid) | **GET** /api/customers/{id} | Get customer by ID
[**customersControllerGetCustomerSubscriptions**](CustomersApi.md#customerscontrollergetcustomersubscriptions) | **GET** /api/customers/{id}/subscriptions | Get customer subscriptions


# **customersControllerGetAllCustomers**
> customersControllerGetAllCustomers(search, appId, limit, page)

Get all customers with pagination

### Example
```dart
import 'package:doctopussdk/api.dart';

final api_instance = CustomersApi();
final search = search_example; // String | Search term
final appId = appId_example; // String | App ID filter
final limit = 8.14; // num | Items per page
final page = 8.14; // num | Page number

try {
    api_instance.customersControllerGetAllCustomers(search, appId, limit, page);
} catch (e) {
    print('Exception when calling CustomersApi->customersControllerGetAllCustomers: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **search** | **String**| Search term | [optional] 
 **appId** | **String**| App ID filter | [optional] 
 **limit** | **num**| Items per page | [optional] 
 **page** | **num**| Page number | [optional] 

### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **customersControllerGetCustomerById**
> customersControllerGetCustomerById(id)

Get customer by ID

### Example
```dart
import 'package:doctopussdk/api.dart';

final api_instance = CustomersApi();
final id = id_example; // String | 

try {
    api_instance.customersControllerGetCustomerById(id);
} catch (e) {
    print('Exception when calling CustomersApi->customersControllerGetCustomerById: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**|  | 

### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **customersControllerGetCustomerSubscriptions**
> customersControllerGetCustomerSubscriptions(id)

Get customer subscriptions

### Example
```dart
import 'package:doctopussdk/api.dart';

final api_instance = CustomersApi();
final id = id_example; // String | 

try {
    api_instance.customersControllerGetCustomerSubscriptions(id);
} catch (e) {
    print('Exception when calling CustomersApi->customersControllerGetCustomerSubscriptions: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**|  | 

### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

