# doctopussdk.model.SubscriptionPlanDto

## Load the model package
```dart
import 'package:doctopussdk/api.dart';
```

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **String** | Plan ID | 
**name** | **String** | Plan name | 
**stripePriceId** | **String** | Stripe Price ID | 
**stripeProductId** | **String** | Stripe Product ID | [optional] 
**description** | **String** | Plan description | [optional] 
**amount** | **num** | Plan amount in cents | 
**currency** | **String** | Currency code | 
**interval** | **String** | Billing interval | 
**features** | **List<String>** | Plan features | [default to const []]
**isActive** | **bool** | Whether plan is active | 
**subscriberCount** | **num** | Number of subscribers | 
**appId** | **String** | App ID for multi-tenancy | [optional] 

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


