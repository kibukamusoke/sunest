# doctopussdk.api.SubscriptionsApi

## Load the API package
```dart
import 'package:doctopussdk/api.dart';
```

All URIs are relative to *http://localhost:3000*

Method | HTTP request | Description
------------- | ------------- | -------------
[**subscriptionsControllerCanCreateServer**](SubscriptionsApi.md#subscriptionscontrollercancreateserver) | **GET** /api/subscriptions/device/{deviceId}/can-create-server | Check if device can create more servers
[**subscriptionsControllerCanViewLogs**](SubscriptionsApi.md#subscriptionscontrollercanviewlogs) | **GET** /api/subscriptions/device/{deviceId}/can-view-logs | Check if device can view logs
[**subscriptionsControllerCheckFeatureAccess**](SubscriptionsApi.md#subscriptionscontrollercheckfeatureaccess) | **POST** /api/subscriptions/device/{deviceId}/check-feature/{feature} | Check if device has access to a specific feature
[**subscriptionsControllerCreateCheckoutSession**](SubscriptionsApi.md#subscriptionscontrollercreatecheckoutsession) | **POST** /api/subscriptions/checkout | Create a Stripe checkout session
[**subscriptionsControllerCreatePaymentIntent**](SubscriptionsApi.md#subscriptionscontrollercreatepaymentintent) | **POST** /api/subscriptions/payment-intent | Create a Stripe payment intent for mobile payment sheet
[**subscriptionsControllerCreatePortalSession**](SubscriptionsApi.md#subscriptionscontrollercreateportalsession) | **POST** /api/subscriptions/portal | Create a Stripe customer portal session
[**subscriptionsControllerDebugPlans**](SubscriptionsApi.md#subscriptionscontrollerdebugplans) | **GET** /api/subscriptions/debug-plans | Debug endpoint to see all plans in database
[**subscriptionsControllerGetAllDevices**](SubscriptionsApi.md#subscriptionscontrollergetalldevices) | **GET** /api/subscriptions/devices | Get all devices (admin only)
[**subscriptionsControllerGetAllSubscriptions**](SubscriptionsApi.md#subscriptionscontrollergetallsubscriptions) | **GET** /api/subscriptions/all | Get all subscriptions with pagination and filtering
[**subscriptionsControllerGetPrices**](SubscriptionsApi.md#subscriptionscontrollergetprices) | **GET** /api/subscriptions/prices | Get available subscription prices from local database
[**subscriptionsControllerGetSubscriptionLimits**](SubscriptionsApi.md#subscriptionscontrollergetsubscriptionlimits) | **GET** /api/subscriptions/limits/{deviceId} | Get subscription limits for a device
[**subscriptionsControllerGetSubscriptionStatus**](SubscriptionsApi.md#subscriptionscontrollergetsubscriptionstatus) | **GET** /api/subscriptions/status/{deviceId} | Get subscription status for a device
[**subscriptionsControllerRecordServerCreated**](SubscriptionsApi.md#subscriptionscontrollerrecordservercreated) | **POST** /api/subscriptions/device/{deviceId}/server-created | Record server creation for a device
[**subscriptionsControllerRecordServerDeleted**](SubscriptionsApi.md#subscriptionscontrollerrecordserverdeleted) | **POST** /api/subscriptions/device/{deviceId}/server-deleted | Record server deletion for a device
[**subscriptionsControllerRegisterDevice**](SubscriptionsApi.md#subscriptionscontrollerregisterdevice) | **POST** /api/subscriptions/device/register | Register or update a device
[**subscriptionsControllerSyncStripePlans**](SubscriptionsApi.md#subscriptionscontrollersyncstripeplans) | **POST** /api/subscriptions/sync-stripe-plans | Sync subscription plans and prices from Stripe to local database
[**subscriptionsControllerTestStripeConnection**](SubscriptionsApi.md#subscriptionscontrollerteststripeconnection) | **GET** /api/subscriptions/test-stripe-connection | Test Stripe connection and list products/prices


# **subscriptionsControllerCanCreateServer**
> ServerLimitsDto subscriptionsControllerCanCreateServer(deviceId)

Check if device can create more servers

### Example
```dart
import 'package:doctopussdk/api.dart';

final api_instance = SubscriptionsApi();
final deviceId = deviceId_example; // String | Device ID

try {
    final result = api_instance.subscriptionsControllerCanCreateServer(deviceId);
    print(result);
} catch (e) {
    print('Exception when calling SubscriptionsApi->subscriptionsControllerCanCreateServer: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **deviceId** | **String**| Device ID | 

### Return type

[**ServerLimitsDto**](ServerLimitsDto.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **subscriptionsControllerCanViewLogs**
> LogAccessDto subscriptionsControllerCanViewLogs(deviceId)

Check if device can view logs

### Example
```dart
import 'package:doctopussdk/api.dart';

final api_instance = SubscriptionsApi();
final deviceId = deviceId_example; // String | Device ID

try {
    final result = api_instance.subscriptionsControllerCanViewLogs(deviceId);
    print(result);
} catch (e) {
    print('Exception when calling SubscriptionsApi->subscriptionsControllerCanViewLogs: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **deviceId** | **String**| Device ID | 

### Return type

[**LogAccessDto**](LogAccessDto.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **subscriptionsControllerCheckFeatureAccess**
> subscriptionsControllerCheckFeatureAccess(deviceId, feature)

Check if device has access to a specific feature

### Example
```dart
import 'package:doctopussdk/api.dart';
// TODO Configure HTTP Bearer authorization: bearer
// Case 1. Use String Token
//defaultApiClient.getAuthentication<HttpBearerAuth>('bearer').setAccessToken('YOUR_ACCESS_TOKEN');
// Case 2. Use Function which generate token.
// String yourTokenGeneratorFunction() { ... }
//defaultApiClient.getAuthentication<HttpBearerAuth>('bearer').setAccessToken(yourTokenGeneratorFunction);

final api_instance = SubscriptionsApi();
final deviceId = deviceId_example; // String | Device ID
final feature = feature_example; // String | Feature name

try {
    api_instance.subscriptionsControllerCheckFeatureAccess(deviceId, feature);
} catch (e) {
    print('Exception when calling SubscriptionsApi->subscriptionsControllerCheckFeatureAccess: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **deviceId** | **String**| Device ID | 
 **feature** | **String**| Feature name | 

### Return type

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **subscriptionsControllerCreateCheckoutSession**
> CheckoutSessionDto subscriptionsControllerCreateCheckoutSession(createCheckoutDto)

Create a Stripe checkout session

### Example
```dart
import 'package:doctopussdk/api.dart';

final api_instance = SubscriptionsApi();
final createCheckoutDto = CreateCheckoutDto(); // CreateCheckoutDto | 

try {
    final result = api_instance.subscriptionsControllerCreateCheckoutSession(createCheckoutDto);
    print(result);
} catch (e) {
    print('Exception when calling SubscriptionsApi->subscriptionsControllerCreateCheckoutSession: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **createCheckoutDto** | [**CreateCheckoutDto**](CreateCheckoutDto.md)|  | 

### Return type

[**CheckoutSessionDto**](CheckoutSessionDto.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **subscriptionsControllerCreatePaymentIntent**
> PaymentIntentDto subscriptionsControllerCreatePaymentIntent(createPaymentIntentDto)

Create a Stripe payment intent for mobile payment sheet

### Example
```dart
import 'package:doctopussdk/api.dart';

final api_instance = SubscriptionsApi();
final createPaymentIntentDto = CreatePaymentIntentDto(); // CreatePaymentIntentDto | 

try {
    final result = api_instance.subscriptionsControllerCreatePaymentIntent(createPaymentIntentDto);
    print(result);
} catch (e) {
    print('Exception when calling SubscriptionsApi->subscriptionsControllerCreatePaymentIntent: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **createPaymentIntentDto** | [**CreatePaymentIntentDto**](CreatePaymentIntentDto.md)|  | 

### Return type

[**PaymentIntentDto**](PaymentIntentDto.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **subscriptionsControllerCreatePortalSession**
> PortalSessionResponseDto subscriptionsControllerCreatePortalSession(createPortalSessionDto)

Create a Stripe customer portal session

### Example
```dart
import 'package:doctopussdk/api.dart';
// TODO Configure HTTP Bearer authorization: bearer
// Case 1. Use String Token
//defaultApiClient.getAuthentication<HttpBearerAuth>('bearer').setAccessToken('YOUR_ACCESS_TOKEN');
// Case 2. Use Function which generate token.
// String yourTokenGeneratorFunction() { ... }
//defaultApiClient.getAuthentication<HttpBearerAuth>('bearer').setAccessToken(yourTokenGeneratorFunction);

final api_instance = SubscriptionsApi();
final createPortalSessionDto = CreatePortalSessionDto(); // CreatePortalSessionDto | 

try {
    final result = api_instance.subscriptionsControllerCreatePortalSession(createPortalSessionDto);
    print(result);
} catch (e) {
    print('Exception when calling SubscriptionsApi->subscriptionsControllerCreatePortalSession: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **createPortalSessionDto** | [**CreatePortalSessionDto**](CreatePortalSessionDto.md)|  | 

### Return type

[**PortalSessionResponseDto**](PortalSessionResponseDto.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **subscriptionsControllerDebugPlans**
> SubscriptionPlansResponseDto subscriptionsControllerDebugPlans()

Debug endpoint to see all plans in database

### Example
```dart
import 'package:doctopussdk/api.dart';

final api_instance = SubscriptionsApi();

try {
    final result = api_instance.subscriptionsControllerDebugPlans();
    print(result);
} catch (e) {
    print('Exception when calling SubscriptionsApi->subscriptionsControllerDebugPlans: $e\n');
}
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**SubscriptionPlansResponseDto**](SubscriptionPlansResponseDto.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **subscriptionsControllerGetAllDevices**
> DevicesListResponseDto subscriptionsControllerGetAllDevices(page, limit, search, status, appId)

Get all devices (admin only)

### Example
```dart
import 'package:doctopussdk/api.dart';
// TODO Configure HTTP Bearer authorization: bearer
// Case 1. Use String Token
//defaultApiClient.getAuthentication<HttpBearerAuth>('bearer').setAccessToken('YOUR_ACCESS_TOKEN');
// Case 2. Use Function which generate token.
// String yourTokenGeneratorFunction() { ... }
//defaultApiClient.getAuthentication<HttpBearerAuth>('bearer').setAccessToken(yourTokenGeneratorFunction);

final api_instance = SubscriptionsApi();
final page = 8.14; // num | Page number
final limit = 8.14; // num | Items per page
final search = search_example; // String | Search term
final status = status_example; // String | Filter by status
final appId = appId_example; // String | App ID to filter devices by

try {
    final result = api_instance.subscriptionsControllerGetAllDevices(page, limit, search, status, appId);
    print(result);
} catch (e) {
    print('Exception when calling SubscriptionsApi->subscriptionsControllerGetAllDevices: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **page** | **num**| Page number | [optional] 
 **limit** | **num**| Items per page | [optional] 
 **search** | **String**| Search term | [optional] 
 **status** | **String**| Filter by status | [optional] 
 **appId** | **String**| App ID to filter devices by | [optional] 

### Return type

[**DevicesListResponseDto**](DevicesListResponseDto.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **subscriptionsControllerGetAllSubscriptions**
> SubscriptionsListResponseDto subscriptionsControllerGetAllSubscriptions(page, limit, search, status, appId)

Get all subscriptions with pagination and filtering

### Example
```dart
import 'package:doctopussdk/api.dart';
// TODO Configure HTTP Bearer authorization: bearer
// Case 1. Use String Token
//defaultApiClient.getAuthentication<HttpBearerAuth>('bearer').setAccessToken('YOUR_ACCESS_TOKEN');
// Case 2. Use Function which generate token.
// String yourTokenGeneratorFunction() { ... }
//defaultApiClient.getAuthentication<HttpBearerAuth>('bearer').setAccessToken(yourTokenGeneratorFunction);

final api_instance = SubscriptionsApi();
final page = 8.14; // num | Page number
final limit = 8.14; // num | Items per page
final search = search_example; // String | Search term
final status = status_example; // String | Filter by status
final appId = appId_example; // String | App ID to filter subscriptions by

try {
    final result = api_instance.subscriptionsControllerGetAllSubscriptions(page, limit, search, status, appId);
    print(result);
} catch (e) {
    print('Exception when calling SubscriptionsApi->subscriptionsControllerGetAllSubscriptions: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **page** | **num**| Page number | [optional] 
 **limit** | **num**| Items per page | [optional] 
 **search** | **String**| Search term | [optional] 
 **status** | **String**| Filter by status | [optional] 
 **appId** | **String**| App ID to filter subscriptions by | [optional] 

### Return type

[**SubscriptionsListResponseDto**](SubscriptionsListResponseDto.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **subscriptionsControllerGetPrices**
> SubscriptionPlansResponseDto subscriptionsControllerGetPrices(appId)

Get available subscription prices from local database

### Example
```dart
import 'package:doctopussdk/api.dart';

final api_instance = SubscriptionsApi();
final appId = appId_example; // String | App ID to filter plans by

try {
    final result = api_instance.subscriptionsControllerGetPrices(appId);
    print(result);
} catch (e) {
    print('Exception when calling SubscriptionsApi->subscriptionsControllerGetPrices: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **appId** | **String**| App ID to filter plans by | [optional] 

### Return type

[**SubscriptionPlansResponseDto**](SubscriptionPlansResponseDto.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **subscriptionsControllerGetSubscriptionLimits**
> subscriptionsControllerGetSubscriptionLimits(deviceId)

Get subscription limits for a device

### Example
```dart
import 'package:doctopussdk/api.dart';
// TODO Configure HTTP Bearer authorization: bearer
// Case 1. Use String Token
//defaultApiClient.getAuthentication<HttpBearerAuth>('bearer').setAccessToken('YOUR_ACCESS_TOKEN');
// Case 2. Use Function which generate token.
// String yourTokenGeneratorFunction() { ... }
//defaultApiClient.getAuthentication<HttpBearerAuth>('bearer').setAccessToken(yourTokenGeneratorFunction);

final api_instance = SubscriptionsApi();
final deviceId = deviceId_example; // String | Device ID

try {
    api_instance.subscriptionsControllerGetSubscriptionLimits(deviceId);
} catch (e) {
    print('Exception when calling SubscriptionsApi->subscriptionsControllerGetSubscriptionLimits: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **deviceId** | **String**| Device ID | 

### Return type

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **subscriptionsControllerGetSubscriptionStatus**
> SubscriptionStatusDto subscriptionsControllerGetSubscriptionStatus(deviceId, appId)

Get subscription status for a device

### Example
```dart
import 'package:doctopussdk/api.dart';

final api_instance = SubscriptionsApi();
final deviceId = deviceId_example; // String | Device ID
final appId = appId_example; // String | App ID to filter subscriptions by

try {
    final result = api_instance.subscriptionsControllerGetSubscriptionStatus(deviceId, appId);
    print(result);
} catch (e) {
    print('Exception when calling SubscriptionsApi->subscriptionsControllerGetSubscriptionStatus: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **deviceId** | **String**| Device ID | 
 **appId** | **String**| App ID to filter subscriptions by | [optional] 

### Return type

[**SubscriptionStatusDto**](SubscriptionStatusDto.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **subscriptionsControllerRecordServerCreated**
> DeviceUpdateResponseDto subscriptionsControllerRecordServerCreated(deviceId)

Record server creation for a device

### Example
```dart
import 'package:doctopussdk/api.dart';
// TODO Configure HTTP Bearer authorization: bearer
// Case 1. Use String Token
//defaultApiClient.getAuthentication<HttpBearerAuth>('bearer').setAccessToken('YOUR_ACCESS_TOKEN');
// Case 2. Use Function which generate token.
// String yourTokenGeneratorFunction() { ... }
//defaultApiClient.getAuthentication<HttpBearerAuth>('bearer').setAccessToken(yourTokenGeneratorFunction);

final api_instance = SubscriptionsApi();
final deviceId = deviceId_example; // String | Device ID

try {
    final result = api_instance.subscriptionsControllerRecordServerCreated(deviceId);
    print(result);
} catch (e) {
    print('Exception when calling SubscriptionsApi->subscriptionsControllerRecordServerCreated: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **deviceId** | **String**| Device ID | 

### Return type

[**DeviceUpdateResponseDto**](DeviceUpdateResponseDto.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **subscriptionsControllerRecordServerDeleted**
> subscriptionsControllerRecordServerDeleted(deviceId)

Record server deletion for a device

### Example
```dart
import 'package:doctopussdk/api.dart';
// TODO Configure HTTP Bearer authorization: bearer
// Case 1. Use String Token
//defaultApiClient.getAuthentication<HttpBearerAuth>('bearer').setAccessToken('YOUR_ACCESS_TOKEN');
// Case 2. Use Function which generate token.
// String yourTokenGeneratorFunction() { ... }
//defaultApiClient.getAuthentication<HttpBearerAuth>('bearer').setAccessToken(yourTokenGeneratorFunction);

final api_instance = SubscriptionsApi();
final deviceId = deviceId_example; // String | Device ID

try {
    api_instance.subscriptionsControllerRecordServerDeleted(deviceId);
} catch (e) {
    print('Exception when calling SubscriptionsApi->subscriptionsControllerRecordServerDeleted: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **deviceId** | **String**| Device ID | 

### Return type

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **subscriptionsControllerRegisterDevice**
> DeviceRegistrationResponseDto subscriptionsControllerRegisterDevice(deviceRegistrationDto)

Register or update a device

### Example
```dart
import 'package:doctopussdk/api.dart';

final api_instance = SubscriptionsApi();
final deviceRegistrationDto = DeviceRegistrationDto(); // DeviceRegistrationDto | 

try {
    final result = api_instance.subscriptionsControllerRegisterDevice(deviceRegistrationDto);
    print(result);
} catch (e) {
    print('Exception when calling SubscriptionsApi->subscriptionsControllerRegisterDevice: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **deviceRegistrationDto** | [**DeviceRegistrationDto**](DeviceRegistrationDto.md)|  | 

### Return type

[**DeviceRegistrationResponseDto**](DeviceRegistrationResponseDto.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **subscriptionsControllerSyncStripePlans**
> SyncStripePlansResponseDto subscriptionsControllerSyncStripePlans()

Sync subscription plans and prices from Stripe to local database

### Example
```dart
import 'package:doctopussdk/api.dart';
// TODO Configure HTTP Bearer authorization: bearer
// Case 1. Use String Token
//defaultApiClient.getAuthentication<HttpBearerAuth>('bearer').setAccessToken('YOUR_ACCESS_TOKEN');
// Case 2. Use Function which generate token.
// String yourTokenGeneratorFunction() { ... }
//defaultApiClient.getAuthentication<HttpBearerAuth>('bearer').setAccessToken(yourTokenGeneratorFunction);

final api_instance = SubscriptionsApi();

try {
    final result = api_instance.subscriptionsControllerSyncStripePlans();
    print(result);
} catch (e) {
    print('Exception when calling SubscriptionsApi->subscriptionsControllerSyncStripePlans: $e\n');
}
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**SyncStripePlansResponseDto**](SyncStripePlansResponseDto.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **subscriptionsControllerTestStripeConnection**
> StripeConnectionTestResponseDto subscriptionsControllerTestStripeConnection()

Test Stripe connection and list products/prices

### Example
```dart
import 'package:doctopussdk/api.dart';

final api_instance = SubscriptionsApi();

try {
    final result = api_instance.subscriptionsControllerTestStripeConnection();
    print(result);
} catch (e) {
    print('Exception when calling SubscriptionsApi->subscriptionsControllerTestStripeConnection: $e\n');
}
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**StripeConnectionTestResponseDto**](StripeConnectionTestResponseDto.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

