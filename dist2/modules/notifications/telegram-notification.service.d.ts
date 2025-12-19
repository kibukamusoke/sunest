import { OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
export declare class TelegramNotificationService implements OnModuleInit {
    private configService;
    private readonly logger;
    private bot;
    private initialized;
    private defaultChatId;
    constructor(configService: ConfigService);
    onModuleInit(): void;
    sendMessage(message: string, chatId?: string): Promise<boolean>;
    sendPhoto(photoUrl: string, caption?: string, chatId?: string): Promise<boolean>;
    sendDocument(documentUrl: string, caption?: string, chatId?: string): Promise<boolean>;
    sendLocation(latitude: number, longitude: number, chatId?: string): Promise<boolean>;
}
