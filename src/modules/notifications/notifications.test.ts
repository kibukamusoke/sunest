import { Test, TestingModule } from '@nestjs/testing';
import { NotificationService } from './notification.service';
import { FirebaseNotificationService } from './firebase-notification.service';
import { TelegramNotificationService } from './telegram-notification.service';
import { ConfigService } from '@nestjs/config';
import { NotificationType } from './dto/notification.dto';

// Mock the services
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
  let service: NotificationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationService,
        {
          provide: FirebaseNotificationService,
          useValue: mockFirebaseService,
        },
        {
          provide: TelegramNotificationService,
          useValue: mockTelegramService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<NotificationService>(NotificationService);

    // Reset all mocks
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
        type: NotificationType.INFO,
      };

      const result = await service.sendFirebaseNotification(notification);

      expect(result).toBe(true);
      expect(mockFirebaseService.sendToDevices).toHaveBeenCalledWith(
        ['token1', 'token2'],
        expect.objectContaining({
          notification: {
            title: 'Test Title',
            body: 'Test Body',
          },
          data: expect.objectContaining({
            type: 'info',
          }),
        }),
      );
    });

    it('should send to topic when topic is provided', async () => {
      mockFirebaseService.sendToTopic.mockResolvedValue(true);

      const notification = {
        title: 'Test Title',
        body: 'Test Body',
        topic: 'testTopic',
        type: NotificationType.WARNING,
      };

      const result = await service.sendFirebaseNotification(notification);

      expect(result).toBe(true);
      expect(mockFirebaseService.sendToTopic).toHaveBeenCalledWith(
        'testTopic',
        expect.objectContaining({
          notification: {
            title: 'Test Title',
            body: 'Test Body',
          },
          data: expect.objectContaining({
            type: 'warning',
          }),
        }),
      );
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
      expect(mockTelegramService.sendMessage).toHaveBeenCalledWith(
        'Test Message',
        '123456789',
      );
    });
  });

  describe('sendSystemAlert', () => {
    it('should send a system alert to telegram', async () => {
      mockTelegramService.sendMessage.mockResolvedValue(true);

      const result = await service.sendSystemAlert('Test Alert');

      expect(result).toBe(true);
      expect(mockTelegramService.sendMessage).toHaveBeenCalledWith(
        expect.stringContaining('SYSTEM ALERT'),
      );
    });
  });
});
