# doctopussdk.api.StorageApi

## Load the API package
```dart
import 'package:doctopussdk/api.dart';
```

All URIs are relative to *http://localhost:3000*

Method | HTTP request | Description
------------- | ------------- | -------------
[**storageControllerConfirmUpload**](StorageApi.md#storagecontrollerconfirmupload) | **POST** /api/storage/confirm-upload | Confirm that a file was successfully uploaded to S3
[**storageControllerCreatePresignedUrl**](StorageApi.md#storagecontrollercreatepresignedurl) | **POST** /api/storage/presigned-url | Get a presigned URL for uploading a file to S3
[**storageControllerDeleteFile**](StorageApi.md#storagecontrollerdeletefile) | **DELETE** /api/storage/{fileId} | Delete a file
[**storageControllerGetDownloadUrl**](StorageApi.md#storagecontrollergetdownloadurl) | **GET** /api/storage/download/{fileId} | Get a presigned URL for downloading a file from S3
[**storageControllerGetUserFiles**](StorageApi.md#storagecontrollergetuserfiles) | **GET** /api/storage/files | Get all files for the current user


# **storageControllerConfirmUpload**
> storageControllerConfirmUpload(confirmUploadDto)

Confirm that a file was successfully uploaded to S3

### Example
```dart
import 'package:doctopussdk/api.dart';
// TODO Configure HTTP Bearer authorization: bearer
// Case 1. Use String Token
//defaultApiClient.getAuthentication<HttpBearerAuth>('bearer').setAccessToken('YOUR_ACCESS_TOKEN');
// Case 2. Use Function which generate token.
// String yourTokenGeneratorFunction() { ... }
//defaultApiClient.getAuthentication<HttpBearerAuth>('bearer').setAccessToken(yourTokenGeneratorFunction);

final api_instance = StorageApi();
final confirmUploadDto = ConfirmUploadDto(); // ConfirmUploadDto | 

try {
    api_instance.storageControllerConfirmUpload(confirmUploadDto);
} catch (e) {
    print('Exception when calling StorageApi->storageControllerConfirmUpload: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **confirmUploadDto** | [**ConfirmUploadDto**](ConfirmUploadDto.md)|  | 

### Return type

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **storageControllerCreatePresignedUrl**
> PresignedUrlResponseDto storageControllerCreatePresignedUrl(createPresignedUrlDto)

Get a presigned URL for uploading a file to S3

### Example
```dart
import 'package:doctopussdk/api.dart';
// TODO Configure HTTP Bearer authorization: bearer
// Case 1. Use String Token
//defaultApiClient.getAuthentication<HttpBearerAuth>('bearer').setAccessToken('YOUR_ACCESS_TOKEN');
// Case 2. Use Function which generate token.
// String yourTokenGeneratorFunction() { ... }
//defaultApiClient.getAuthentication<HttpBearerAuth>('bearer').setAccessToken(yourTokenGeneratorFunction);

final api_instance = StorageApi();
final createPresignedUrlDto = CreatePresignedUrlDto(); // CreatePresignedUrlDto | 

try {
    final result = api_instance.storageControllerCreatePresignedUrl(createPresignedUrlDto);
    print(result);
} catch (e) {
    print('Exception when calling StorageApi->storageControllerCreatePresignedUrl: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **createPresignedUrlDto** | [**CreatePresignedUrlDto**](CreatePresignedUrlDto.md)|  | 

### Return type

[**PresignedUrlResponseDto**](PresignedUrlResponseDto.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **storageControllerDeleteFile**
> storageControllerDeleteFile(fileId)

Delete a file

### Example
```dart
import 'package:doctopussdk/api.dart';
// TODO Configure HTTP Bearer authorization: bearer
// Case 1. Use String Token
//defaultApiClient.getAuthentication<HttpBearerAuth>('bearer').setAccessToken('YOUR_ACCESS_TOKEN');
// Case 2. Use Function which generate token.
// String yourTokenGeneratorFunction() { ... }
//defaultApiClient.getAuthentication<HttpBearerAuth>('bearer').setAccessToken(yourTokenGeneratorFunction);

final api_instance = StorageApi();
final fileId = fileId_example; // String | 

try {
    api_instance.storageControllerDeleteFile(fileId);
} catch (e) {
    print('Exception when calling StorageApi->storageControllerDeleteFile: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **fileId** | **String**|  | 

### Return type

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **storageControllerGetDownloadUrl**
> storageControllerGetDownloadUrl(fileId)

Get a presigned URL for downloading a file from S3

### Example
```dart
import 'package:doctopussdk/api.dart';
// TODO Configure HTTP Bearer authorization: bearer
// Case 1. Use String Token
//defaultApiClient.getAuthentication<HttpBearerAuth>('bearer').setAccessToken('YOUR_ACCESS_TOKEN');
// Case 2. Use Function which generate token.
// String yourTokenGeneratorFunction() { ... }
//defaultApiClient.getAuthentication<HttpBearerAuth>('bearer').setAccessToken(yourTokenGeneratorFunction);

final api_instance = StorageApi();
final fileId = fileId_example; // String | 

try {
    api_instance.storageControllerGetDownloadUrl(fileId);
} catch (e) {
    print('Exception when calling StorageApi->storageControllerGetDownloadUrl: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **fileId** | **String**|  | 

### Return type

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **storageControllerGetUserFiles**
> storageControllerGetUserFiles()

Get all files for the current user

### Example
```dart
import 'package:doctopussdk/api.dart';
// TODO Configure HTTP Bearer authorization: bearer
// Case 1. Use String Token
//defaultApiClient.getAuthentication<HttpBearerAuth>('bearer').setAccessToken('YOUR_ACCESS_TOKEN');
// Case 2. Use Function which generate token.
// String yourTokenGeneratorFunction() { ... }
//defaultApiClient.getAuthentication<HttpBearerAuth>('bearer').setAccessToken(yourTokenGeneratorFunction);

final api_instance = StorageApi();

try {
    api_instance.storageControllerGetUserFiles();
} catch (e) {
    print('Exception when calling StorageApi->storageControllerGetUserFiles: $e\n');
}
```

### Parameters
This endpoint does not need any parameter.

### Return type

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

