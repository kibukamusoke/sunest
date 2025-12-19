"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const notification_service_1 = require("./notification.service");
const firebase_notification_service_1 = require("./firebase-notification.service");
const telegram_notification_service_1 = require("./telegram-notification.service");
const config_1 = require("@nestjs/config");
const notification_dto_1 = require("./dto/notification.dto");
const mockFirebaseService = {
    sendToDevices: jest.fn(),
    sendToTopic: jest.fn(),
};
const mockTelegramService = {
    sendMessage: jest.fn(),
    sendPhoto: jest.fn(),
    sendDocument: jest.fn(),
};
const mockConfigService = {
    get: jest.fn(),
};
describe('NotificationService', () => {
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [
                notification_service_1.NotificationService,
                {
                    provide: firebase_notification_service_1.FirebaseNotificationService,
                    useValue: mockFirebaseService,
                },
                {
                    provide: telegram_notification_service_1.TelegramNotificationService,
                    useValue: mockTelegramService,
                },
                {
                    provide: config_1.ConfigService,
                    useValue: mockConfigService,
                },
            ],
        }).compile();
        service = module.get(notification_service_1.NotificationService);
        jest.clearAllMocks();
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
    describe('sendFirebaseNotification', () => {
        it('should send to devices when tokens are provided', async () => {
            mockFirebaseService.sendToDevices.mockResolvedValue(true);
            const notification = {
                title: 'Test Title',
                body: 'Test Body',
                tokens: ['token1', 'token2'],
                type: notification_dto_1.NotificationType.INFO,
            };
            const result = await service.sendFirebaseNotification(notification);
            expect(result).toBe(true);
            expect(mockFirebaseService.sendToDevices).toHaveBeenCalledWith(['token1', 'token2'], expect.objectContaining({
                notification: {
                    title: 'Test Title',
                    body: 'Test Body',
                },
                data: expect.objectContaining({
                    type: 'info',
                }),
            }));
        });
        it('should send to topic when topic is provided', async () => {
            mockFirebaseService.sendToTopic.mockResolvedValue(true);
            const notification = {
                title: 'Test Title',
                body: 'Test Body',
                topic: 'testTopic',
                type: notification_dto_1.NotificationType.WARNING,
            };
            const result = await service.sendFirebaseNotification(notification);
            expect(result).toBe(true);
            expect(mockFirebaseService.sendToTopic).toHaveBeenCalledWith('testTopic', expect.objectContaining({
                notification: {
                    title: 'Test Title',
                    body: 'Test Body',
                },
                data: expect.objectContaining({
                    type: 'warning',
                }),
            }));
        });
    });
    describe('sendTelegramNotification', () => {
        it('should send a message to telegram', async () => {
            mockTelegramService.sendMessage.mockResolvedValue(true);
            const notification = {
                message: 'Test Message',
                chatId: '123456789',
            };
            const result = await service.sendTelegramNotification(notification);
            expect(result).toBe(true);
            expect(mockTelegramService.sendMessage).toHaveBeenCalledWith('Test Message', '123456789');
        });
    });
    describe('sendSystemAlert', () => {
        it('should send a system alert to telegram', async () => {
            mockTelegramService.sendMessage.mockResolvedValue(true);
            const result = await service.sendSystemAlert('Test Alert');
            expect(result).toBe(true);
            expect(mockTelegramService.sendMessage).toHaveBeenCalledWith(expect.stringContaining('SYSTEM ALERT'));
        });
    });
});
//# sourceMappingURL=notifications.test.js.map