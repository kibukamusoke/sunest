export interface PgNotification {
  channel: string;
  payload: string;
  processId: number;
}

export enum NotificationChannel {
  USER_CREATED = 'user_created',
  USER_UPDATED = 'user_updated',
  USER_DELETED = 'user_deleted',
  FILE_UPLOADED = 'file_uploaded',
  FILE_DELETED = 'file_deleted',
  SYSTEM_EVENT = 'system_event',
}

export interface UserCreatedPayload {
  id: string;
  email: string;
  createdAt: string;
}

export interface UserUpdatedPayload {
  id: string;
  updatedFields: string[];
  updatedAt: string;
}

export interface FileUploadedPayload {
  id: string;
  filename: string;
  size: number;
  userId?: string;
  uploadedAt: string;
}

export interface SystemEventPayload {
  event: string;
  severity: 'info' | 'warning' | 'error';
  message: string;
  timestamp: string;
  metadata?: Record<string, any>;
}