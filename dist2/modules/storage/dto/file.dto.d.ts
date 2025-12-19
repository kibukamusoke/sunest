export declare enum FileStatus {
    PENDING = "PENDING",
    UPLOADED = "UPLOADED",
    FAILED = "FAILED"
}
export declare class FileDto {
    id: string;
    key: string;
    filename: string;
    mimetype: string;
    size?: number;
    bucket: string;
    uploadedBy?: string;
    userId?: string;
    status: FileStatus;
    createdAt: Date;
    updatedAt: Date;
}
