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
var TelegramNotificationService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TelegramNotificationService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const TelegramBot = require("node-telegram-bot-api");
let TelegramNotificationService = TelegramNotificationService_1 = class TelegramNotificationService {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(TelegramNotificationService_1.name);
        this.initialized = false;
    }
    onModuleInit() {
        try {
            const token = this.configService.get('TELEGRAM_BOT_TOKEN');
            this.defaultChatId = this.configService.get('TELEGRAM_CHAT_ID');
            if (!token) {
                this.logger.warn('Telegram Bot token missing. Telegram notifications are disabled.');
                return;
            }
            if (process.env.NODE_ENV === 'development' &&
                token === 'your-bot-token') {
                this.logger.warn('Using placeholder Telegram credentials. Telegram notifications will not work correctly.');
                return;
            }
            this.bot = new TelegramBot(token, { polling: false });
            this.initialized = true;
            this.logger.log('Telegram Bot initialized successfully');
        }
        catch (error) {
            this.logger.error(`Error initializing Telegram Bot: ${error.message}`, error.stack);
        }
    }
    async sendMessage(message, chatId) {
        if (!this.initialized) {
            this.logger.warn('Telegram Bot not initialized. Cannot send message.');
            return false;
        }
        try {
            const targetChatId = chatId || this.defaultChatId;
            if (!targetChatId) {
                this.logger.warn('No chat ID provided and no default chat ID set.');
                return false;
            }
            const response = await this.bot.sendMessage(targetChatId, message, {
                parse_mode: 'HTML',
            });
            this.logger.debug(`Message sent to chat ${targetChatId}: ${response.message_id}`);
            return true;
        }
        catch (error) {
            this.logger.error(`Error sending Telegram message: ${error.message}`, error.stack);
            return false;
        }
    }
    async sendPhoto(photoUrl, caption, chatId) {
        if (!this.initialized) {
            this.logger.warn('Telegram Bot not initialized. Cannot send photo.');
            return false;
        }
        try {
            const targetChatId = chatId || this.defaultChatId;
            if (!targetChatId) {
                this.logger.warn('No chat ID provided and no default chat ID set.');
                return false;
            }
            const response = await this.bot.sendPhoto(targetChatId, photoUrl, {
                caption,
                parse_mode: 'HTML',
            });
            this.logger.debug(`Photo sent to chat ${targetChatId}: ${response.message_id}`);
            return true;
        }
        catch (error) {
            this.logger.error(`Error sending Telegram photo: ${error.message}`, error.stack);
            return false;
        }
    }
    async sendDocument(documentUrl, caption, chatId) {
        if (!this.initialized) {
            this.logger.warn('Telegram Bot not initialized. Cannot send document.');
            return false;
        }
        try {
            const targetChatId = chatId || this.defaultChatId;
            if (!targetChatId) {
                this.logger.warn('No chat ID provided and no default chat ID set.');
                return false;
            }
            const response = await this.bot.sendDocument(targetChatId, documentUrl, {
                caption,
                parse_mode: 'HTML',
            });
            this.logger.debug(`Document sent to chat ${targetChatId}: ${response.message_id}`);
            return true;
        }
        catch (error) {
            this.logger.error(`Error sending Telegram document: ${error.message}`, error.stack);
            return false;
        }
    }
    async sendLocation(latitude, longitude, chatId) {
        if (!this.initialized) {
            this.logger.warn('Telegram Bot not initialized. Cannot send location.');
            return false;
        }
        try {
            const targetChatId = chatId || this.defaultChatId;
            if (!targetChatId) {
                this.logger.warn('No chat ID provided and no default chat ID set.');
                return false;
            }
            const response = await this.bot.sendLocation(targetChatId, latitude, longitude);
            this.logger.debug(`Location sent to chat ${targetChatId}: ${response.message_id}`);
            return true;
        }
        catch (error) {
            this.logger.error(`Error sending Telegram location: ${error.message}`, error.stack);
            return false;
        }
    }
};
exports.TelegramNotificationService = TelegramNotificationService;
exports.TelegramNotificationService = TelegramNotificationService = TelegramNotificationService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], TelegramNotificationService);
//# sourceMappingURL=telegram-notification.service.js.map