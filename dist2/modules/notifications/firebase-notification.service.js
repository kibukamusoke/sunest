"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var FirebaseNotificationService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FirebaseNotificationService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const admin = require("firebase-admin");
let FirebaseNotificationService = FirebaseNotificationService_1 = class FirebaseNotificationService {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(FirebaseNotificationService_1.name);
        this.initialized = false;
    }
    onModuleInit() {
        try {
            const projectId = this.configService.get('FIREBASE_PROJECT_ID');
            const privateKey = this.configService.get('FIREBASE_PRIVATE_KEY');
            const clientEmail = this.configService.get('FIREBASE_CLIENT_EMAIL');
            const databaseURL = this.configService.get('FIREBASE_DATABASE_URL');
            if (!projectId || !privateKey || !clientEmail) {
                this.logger.warn('Firebase configuration missing or incomplete. Firebase notifications are disabled.');
                return;
            }
            if (process.env.NODE_ENV === 'development' &&
                privateKey === 'your-private-key') {
                this.logger.warn('Using placeholder Firebase credentials. Firebase notifications will not work correctly.');
                this.initialized = false;
                return;
            }
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
        }
        catch (error) {
            this.logger.error(`Error initializing Firebase: ${error.message}`, error.stack);
        }
    }
    async sendToDevice(token, payload) {
        if (!this.initialized) {
            this.logger.warn('Firebase not initialized. Cannot send notification.');
            return false;
        }
        try {
            const message = {
                token: token,
                notification: payload.notification,
                data: payload.data,
            };
            const response = await this.firebaseApp.messaging().send(message);
            this.logger.debug(`Notification sent successfully to ${token}: ${response}`);
            return true;
        }
        catch (error) {
            this.logger.error(`Error sending notification: ${error.message}`, error.stack);
            return false;
        }
    }
    async sendToDevices(tokens, payload) {
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
            this.logger.debug(`Batch notification sent: ${batchResponse.successCount} succeeded, ${batchResponse.failureCount} failed`);
            if (batchResponse.failureCount > 0) {
                const failedTokens = [];
                batchResponse.responses.forEach((resp, idx) => {
                    if (!resp.success) {
                        failedTokens.push(tokens[idx]);
                        this.logger.error(`Error sending to token at index ${idx}: ${resp.error?.message}`);
                    }
                });
            }
            return batchResponse.successCount > 0;
        }
        catch (error) {
            this.logger.error(`Error sending batch notification: ${error.message}`, error.stack);
            return false;
        }
    }
    async sendToTopic(topic, payload) {
        if (!this.initialized) {
            this.logger.warn('Firebase not initialized. Cannot send notification.');
            return false;
        }
        try {
            const message = {
                topic: topic,
                notification: payload.notification,
                data: payload.data,
            };
            const response = await this.firebaseApp.messaging().send(message);
            this.logger.debug(`Notification sent to topic ${topic}: ${response}`);
            return true;
        }
        catch (error) {
            this.logger.error(`Error sending notification to topic: ${error.message}`, error.stack);
            return false;
        }
    }
    async subscribeToTopic(token, topic) {
        if (!this.initialized) {
            this.logger.warn('Firebase not initialized. Cannot subscribe to topic.');
            return false;
        }
        try {
            const response = await this.firebaseApp
                .messaging()
                .subscribeToTopic([token], topic);
            this.logger.debug(`Device subscribed to topic ${topic}: ${response.successCount} succeeded, ${response.failureCount} failed`);
            return response.successCount > 0;
        }
        catch (error) {
            this.logger.error(`Error subscribing to topic: ${error.message}`, error.stack);
            return false;
        }
    }
    async unsubscribeFromTopic(token, topic) {
        if (!this.initialized) {
            this.logger.warn('Firebase not initialized. Cannot unsubscribe from topic.');
            return false;
        }
        try {
            const response = await this.firebaseApp
                .messaging()
                .unsubscribeFromTopic([token], topic);
            this.logger.debug(`Device unsubscribed from topic ${topic}: ${response.successCount} succeeded, ${response.failureCount} failed`);
            return response.successCount > 0;
        }
        catch (error) {
            this.logger.error(`Error unsubscribing from topic: ${error.message}`, error.stack);
            return false;
        }
    }
};
exports.FirebaseNotificationService = FirebaseNotificationService;
exports.FirebaseNotificationService = FirebaseNotificationService = FirebaseNotificationService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], FirebaseNotificationService);
//# sourceMappingURL=firebase-notification.service.js.map