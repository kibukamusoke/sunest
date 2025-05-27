import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseNotificationService implements OnModuleInit {
  private readonly logger = new Logger(FirebaseNotificationService.name);
  private firebaseApp: admin.app.App;
  private initialized = false;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    try {
      const projectId = this.configService.get<string>('FIREBASE_PROJECT_ID');
      const privateKey = this.configService.get<string>('FIREBASE_PRIVATE_KEY');
      const clientEmail = this.configService.get<string>(
        'FIREBASE_CLIENT_EMAIL',
      );
      const databaseURL = this.configService.get<string>(
        'FIREBASE_DATABASE_URL',
      );

      if (!projectId || !privateKey || !clientEmail) {
        this.logger.warn(
          'Firebase configuration missing or incomplete. Firebase notifications are disabled.',
        );
        return;
      }

      // For development, use a mock credential if running in development
      if (
        process.env.NODE_ENV === 'development' &&
        privateKey === 'your-private-key'
      ) {
        this.logger.warn(
          'Using placeholder Firebase credentials. Firebase notifications will not work correctly.',
        );
        this.initialized = false;
        return;
      }

      // Make sure the private key is properly formatted
      const formattedKey = privateKey.replace(/\\n/g, '\n');

      this.firebaseApp = admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          privateKey: formattedKey,
          clientEmail,
        }),
        databaseURL,
      });

      this.initialized = true;
      this.logger.log('Firebase Admin SDK initialized successfully');
    } catch (error) {
      this.logger.error(
        `Error initializing Firebase: ${error.message}`,
        error.stack,
      );
    }
  }

  /**
   * Send a notification to a specific device
   */
  async sendToDevice(
    token: string,
    payload: admin.messaging.MessagingPayload,
  ): Promise<boolean> {
    if (!this.initialized) {
      this.logger.warn('Firebase not initialized. Cannot send notification.');
      return false;
    }

    try {
      const message: admin.messaging.Message = {
        token: token,
        notification: payload.notification,
        data: payload.data,
      };

      const response = await this.firebaseApp.messaging().send(message);
      this.logger.debug(
        `Notification sent successfully to ${token}: ${response}`,
      );
      return true;
    } catch (error) {
      this.logger.error(
        `Error sending notification: ${error.message}`,
        error.stack,
      );
      return false;
    }
  }

  /**
   * Send a notification to multiple devices
   */
  async sendToDevices(
    tokens: string[],
    payload: admin.messaging.MessagingPayload,
  ): Promise<boolean> {
    if (!this.initialized) {
      this.logger.warn('Firebase not initialized. Cannot send notification.');
      return false;
    }

    try {
      const messages = tokens.map((token) => ({
        token,
        notification: payload.notification,
        data: payload.data,
      }));

      const batchResponse = await this.firebaseApp
        .messaging()
        .sendEach(messages);

      this.logger.debug(
        `Batch notification sent: ${batchResponse.successCount} succeeded, ${batchResponse.failureCount} failed`,
      );

      if (batchResponse.failureCount > 0) {
        const failedTokens: string[] = [];
        batchResponse.responses.forEach((resp, idx) => {
          if (!resp.success) {
            failedTokens.push(tokens[idx]);
            this.logger.error(
              `Error sending to token at index ${idx}: ${resp.error?.message}`,
            );
          }
        });
      }

      return batchResponse.successCount > 0;
    } catch (error) {
      this.logger.error(
        `Error sending batch notification: ${error.message}`,
        error.stack,
      );
      return false;
    }
  }

  /**
   * Send a notification to a topic
   */
  async sendToTopic(
    topic: string,
    payload: admin.messaging.MessagingPayload,
  ): Promise<boolean> {
    if (!this.initialized) {
      this.logger.warn('Firebase not initialized. Cannot send notification.');
      return false;
    }

    try {
      const message: admin.messaging.Message = {
        topic: topic,
        notification: payload.notification,
        data: payload.data,
      };

      const response = await this.firebaseApp.messaging().send(message);
      this.logger.debug(`Notification sent to topic ${topic}: ${response}`);
      return true;
    } catch (error) {
      this.logger.error(
        `Error sending notification to topic: ${error.message}`,
        error.stack,
      );
      return false;
    }
  }

  /**
   * Subscribe a device to a topic
   */
  async subscribeToTopic(token: string, topic: string): Promise<boolean> {
    if (!this.initialized) {
      this.logger.warn('Firebase not initialized. Cannot subscribe to topic.');
      return false;
    }

    try {
      const response = await this.firebaseApp
        .messaging()
        .subscribeToTopic([token], topic);
      this.logger.debug(
        `Device subscribed to topic ${topic}: ${response.successCount} succeeded, ${response.failureCount} failed`,
      );
      return response.successCount > 0;
    } catch (error) {
      this.logger.error(
        `Error subscribing to topic: ${error.message}`,
        error.stack,
      );
      return false;
    }
  }

  /**
   * Unsubscribe a device from a topic
   */
  async unsubscribeFromTopic(token: string, topic: string): Promise<boolean> {
    if (!this.initialized) {
      this.logger.warn(
        'Firebase not initialized. Cannot unsubscribe from topic.',
      );
      return false;
    }

    try {
      const response = await this.firebaseApp
        .messaging()
        .unsubscribeFromTopic([token], topic);
      this.logger.debug(
        `Device unsubscribed from topic ${topic}: ${response.successCount} succeeded, ${response.failureCount} failed`,
      );
      return response.successCount > 0;
    } catch (error) {
      this.logger.error(
        `Error unsubscribing from topic: ${error.message}`,
        error.stack,
      );
      return false;
    }
  }
}
