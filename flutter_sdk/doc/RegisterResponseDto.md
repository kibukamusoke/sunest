# doctopussdk.model.RegisterResponseDto

## Load the model package
```dart
import 'package:doctopussdk/api.dart';
```

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **String** | User ID | 
**email** | **String** | User email address | 
**displayName** | [**Object**](.md) | User display name | [optional] 
**avatar** | [**Object**](.md) | URL to user avatar image | [optional] 
**isActive** | **bool** | Whether user account is active | [default to true]
**emailVerified** | **bool** | Whether user email is verified | [default to false]
**provider** | [**Object**](.md) | Authentication provider (local, google, github) | [optional] 
**providerId** | [**Object**](.md) | ID from auth provider | [optional] 
**roles** | **List<String>** | User roles | [default to const []]
**files** | [**List<FileDto>**](FileDto.md) | Files owned by user | [optional] [default to const []]
**createdAt** | [**DateTime**](DateTime.md) | Account creation date | 
**updatedAt** | [**DateTime**](DateTime.md) | Account last updated date | 

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


