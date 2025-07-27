//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.18

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

part of openapi.api;


class StorageApi {
  StorageApi([ApiClient? apiClient]) : apiClient = apiClient ?? defaultApiClient;

  final ApiClient apiClient;

  /// Confirm that a file was successfully uploaded to S3
  ///
  /// Note: This method returns the HTTP [Response].
  ///
  /// Parameters:
  ///
  /// * [ConfirmUploadDto] confirmUploadDto (required):
  Future<Response> storageControllerConfirmUploadWithHttpInfo(ConfirmUploadDto confirmUploadDto,) async {
    // ignore: prefer_const_declarations
    final path = r'/api/storage/confirm-upload';

    // ignore: prefer_final_locals
    Object? postBody = confirmUploadDto;

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

  /// Confirm that a file was successfully uploaded to S3
  ///
  /// Parameters:
  ///
  /// * [ConfirmUploadDto] confirmUploadDto (required):
  Future<void> storageControllerConfirmUpload(ConfirmUploadDto confirmUploadDto,) async {
    final response = await storageControllerConfirmUploadWithHttpInfo(confirmUploadDto,);
    if (response.statusCode >= HttpStatus.badRequest) {
      throw ApiException(response.statusCode, await _decodeBodyBytes(response));
    }
  }

  /// Get a presigned URL for uploading a file to S3
  ///
  /// Note: This method returns the HTTP [Response].
  ///
  /// Parameters:
  ///
  /// * [CreatePresignedUrlDto] createPresignedUrlDto (required):
  Future<Response> storageControllerCreatePresignedUrlWithHttpInfo(CreatePresignedUrlDto createPresignedUrlDto,) async {
    // ignore: prefer_const_declarations
    final path = r'/api/storage/presigned-url';

    // ignore: prefer_final_locals
    Object? postBody = createPresignedUrlDto;

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

  /// Get a presigned URL for uploading a file to S3
  ///
  /// Parameters:
  ///
  /// * [CreatePresignedUrlDto] createPresignedUrlDto (required):
  Future<PresignedUrlResponseDto?> storageControllerCreatePresignedUrl(CreatePresignedUrlDto createPresignedUrlDto,) async {
    final response = await storageControllerCreatePresignedUrlWithHttpInfo(createPresignedUrlDto,);
    if (response.statusCode >= HttpStatus.badRequest) {
      throw ApiException(response.statusCode, await _decodeBodyBytes(response));
    }
    // When a remote server returns no body with a status of 204, we shall not decode it.
    // At the time of writing this, `dart:convert` will throw an "Unexpected end of input"
    // FormatException when trying to decode an empty string.
    if (response.body.isNotEmpty && response.statusCode != HttpStatus.noContent) {
      return await apiClient.deserializeAsync(await _decodeBodyBytes(response), 'PresignedUrlResponseDto',) as PresignedUrlResponseDto;
    
    }
    return null;
  }

  /// Delete a file
  ///
  /// Note: This method returns the HTTP [Response].
  ///
  /// Parameters:
  ///
  /// * [String] fileId (required):
  Future<Response> storageControllerDeleteFileWithHttpInfo(String fileId,) async {
    // ignore: prefer_const_declarations
    final path = r'/api/storage/{fileId}'
      .replaceAll('{fileId}', fileId);

    // ignore: prefer_final_locals
    Object? postBody;

    final queryParams = <QueryParam>[];
    final headerParams = <String, String>{};
    final formParams = <String, String>{};

    const contentTypes = <String>[];


    return apiClient.invokeAPI(
      path,
      'DELETE',
      queryParams,
      postBody,
      headerParams,
      formParams,
      contentTypes.isEmpty ? null : contentTypes.first,
    );
  }

  /// Delete a file
  ///
  /// Parameters:
  ///
  /// * [String] fileId (required):
  Future<void> storageControllerDeleteFile(String fileId,) async {
    final response = await storageControllerDeleteFileWithHttpInfo(fileId,);
    if (response.statusCode >= HttpStatus.badRequest) {
      throw ApiException(response.statusCode, await _decodeBodyBytes(response));
    }
  }

  /// Get a presigned URL for downloading a file from S3
  ///
  /// Note: This method returns the HTTP [Response].
  ///
  /// Parameters:
  ///
  /// * [String] fileId (required):
  Future<Response> storageControllerGetDownloadUrlWithHttpInfo(String fileId,) async {
    // ignore: prefer_const_declarations
    final path = r'/api/storage/download/{fileId}'
      .replaceAll('{fileId}', fileId);

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

  /// Get a presigned URL for downloading a file from S3
  ///
  /// Parameters:
  ///
  /// * [String] fileId (required):
  Future<void> storageControllerGetDownloadUrl(String fileId,) async {
    final response = await storageControllerGetDownloadUrlWithHttpInfo(fileId,);
    if (response.statusCode >= HttpStatus.badRequest) {
      throw ApiException(response.statusCode, await _decodeBodyBytes(response));
    }
  }

  /// Get all files for the current user
  ///
  /// Note: This method returns the HTTP [Response].
  Future<Response> storageControllerGetUserFilesWithHttpInfo() async {
    // ignore: prefer_const_declarations
    final path = r'/api/storage/files';

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

  /// Get all files for the current user
  Future<void> storageControllerGetUserFiles() async {
    final response = await storageControllerGetUserFilesWithHttpInfo();
    if (response.statusCode >= HttpStatus.badRequest) {
      throw ApiException(response.statusCode, await _decodeBodyBytes(response));
    }
  }
}
