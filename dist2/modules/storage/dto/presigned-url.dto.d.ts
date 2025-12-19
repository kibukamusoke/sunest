export declare class CreatePresignedUrlDto {
    filename: string;
    mimetype: string;
}
export declare class PresignedUrlResponseDto {
    fileId: string;
    key: string;
    presignedUrl: string;
    expiresIn: number;
}
export declare class ConfirmUploadDto {
    fileId: string;
}
export declare class FileIdParamDto {
    fileId: string;
}
