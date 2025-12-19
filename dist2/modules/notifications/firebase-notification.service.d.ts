import { OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';
export declare class FirebaseNotificationService implements OnModuleInit {
    private configService;
    private readonly logger;
    private firebaseApp;
    private initialized;
    constructor(configService: ConfigService);
    onModuleInit(): void;
    sendToDevice(token: string, payload: admin.messaging.MessagingPayload): Promise<boolean>;
    sendToDevices(tokens: string[], payload: admin.messaging.MessagingPayload): Promise<boolean>;
    sendToTopic(topic: string, payload: admin.messaging.MessagingPayload): Promise<boolean>;
    subscribeToTopic(token: string, topic: string): Promise<boolean>;
    unsubscribeFromTopic(token: string, topic: string): Promise<boolean>;
}
