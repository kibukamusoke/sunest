# S3 Bucket Configuration for Public URLs

This document outlines the required S3 bucket configuration to enable permanent public URLs for uploaded files.

## Overview

The storage service has been updated to generate permanent public URLs instead of temporary presigned URLs. For these URLs to work properly, the S3 bucket must be configured to allow public read access.

## Required S3 Bucket Configuration

### 1. Bucket Policy

Add the following bucket policy to allow public read access to all objects:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::YOUR_BUCKET_NAME/*"
        }
    ]
}
```

**Important**: Replace `YOUR_BUCKET_NAME` with your actual S3 bucket name.

### 2. Block Public Access Settings

Ensure the following settings are configured in your S3 bucket:

- **Block public access to buckets and objects granted through new access control lists (ACLs)**: ✅ Enabled
- **Block public access to buckets and objects granted through any access control lists (ACLs)**: ✅ Enabled  
- **Block public access to buckets and objects granted through new public bucket or access point policies**: ❌ Disabled
- **Block public access to buckets and objects granted through any public bucket or access point policies**: ❌ Disabled

### 3. CORS Configuration (Optional)

If you need to access files from web browsers, configure CORS:

```json
[
    {
        "AllowedHeaders": ["*"],
        "AllowedMethods": ["GET", "HEAD"],
        "AllowedOrigins": ["*"],
        "ExposeHeaders": ["ETag"]
    }
]
```

## Implementation Changes

### Backend Changes Made

1. **S3StorageService**: 
   - Added `generatePublicUrl()` method to create permanent URLs
   - Added `getPublicUrl()` method to retrieve permanent URLs
   - Modified `confirmFileUpload()` to store permanent URLs in database

2. **StorageController**:
   - Updated `/download/:fileId` endpoint to return permanent URLs
   - Added `/public-url/:fileId` endpoint for explicit public URL access

### URL Format

Permanent public URLs follow this format:
```
https://{bucket-name}.s3.{region}.amazonaws.com/{file-key}
```

Example:
```
https://my-bucket.s3.us-east-1.amazonaws.com/1641234567890-abc123def456.jpg
```

## Security Considerations

1. **Public Access**: All uploaded files will be publicly accessible via their URLs
2. **File Keys**: File keys are generated with timestamps and random strings to prevent guessing
3. **Authentication**: Upload and management operations still require authentication
4. **Access Control**: Consider implementing additional access controls if needed

## Testing

After configuring your S3 bucket:

1. Upload a file using the existing upload flow
2. Confirm the upload via the `/storage/confirm-upload` endpoint
3. Retrieve the public URL via `/storage/download/:fileId`
4. Test the URL in a browser or HTTP client

## Troubleshooting

### Common Issues

1. **403 Forbidden**: Check bucket policy and public access settings
2. **404 Not Found**: Verify the file was uploaded successfully and the key is correct
3. **CORS Errors**: Configure CORS settings if accessing from web browsers

### Verification Steps

1. Check bucket policy is applied correctly
2. Verify public access settings allow bucket policies
3. Confirm file exists in S3 console
4. Test URL directly in browser

## Migration Notes

Existing files uploaded before this change will not have permanent URLs stored in the database. The `getPublicUrl()` method will generate URLs for these files on-demand, but they will only work if the bucket is properly configured for public access.