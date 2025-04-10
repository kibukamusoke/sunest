import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as TelegramBot from 'node-telegram-bot-api';

@Injectable()
export class TelegramNotificationService implements OnModuleInit {
  private readonly logger = new Logger(TelegramNotificationService.name);
  private bot: TelegramBot;
  private initialized = false;
  private defaultChatId: string | undefined;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    try {
      const token = this.configService.get<string>('TELEGRAM_BOT_TOKEN');
      this.defaultChatId = this.configService.get<string>('TELEGRAM_CHAT_ID');
      
      if (!token) {
        this.logger.warn('Telegram Bot token missing. Telegram notifications are disabled.');
        return;
      }

      // For development, if using placeholder token, don't initialize
      if (process.env.NODE_ENV === 'development' && token === 'your-bot-token') {
        this.logger.warn('Using placeholder Telegram credentials. Telegram notifications will not work correctly.');
        return;
      }

      // Create a bot instance with polling disabled
      this.bot = new TelegramBot(token, { polling: false });
      this.initialized = true;
      
      this.logger.log('Telegram Bot initialized successfully');
    } catch (error) {
      this.logger.error(`Error initializing Telegram Bot: ${error.message}`, error.stack);
    }
  }

  /**
   * Send a text message to the default chat ID or a specific chat ID
   */
  async sendMessage(message: string, chatId?: string): Promise<boolean> {
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
    } catch (error) {
      this.logger.error(`Error sending Telegram message: ${error.message}`, error.stack);
      return false;
    }
  }

  /**
   * Send a photo to the default chat ID or a specific chat ID
   */
  async sendPhoto(photoUrl: string, caption?: string, chatId?: string): Promise<boolean> {
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
    } catch (error) {
      this.logger.error(`Error sending Telegram photo: ${error.message}`, error.stack);
      return false;
    }
  }

  /**
   * Send a document to the default chat ID or a specific chat ID
   */
  async sendDocument(documentUrl: string, caption?: string, chatId?: string): Promise<boolean> {
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
    } catch (error) {
      this.logger.error(`Error sending Telegram document: ${error.message}`, error.stack);
      return false;
    }
  }

  /**
   * Send a location to the default chat ID or a specific chat ID
   */
  async sendLocation(latitude: number, longitude: number, chatId?: string): Promise<boolean> {
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
    } catch (error) {
      this.logger.error(`Error sending Telegram location: ${error.message}`, error.stack);
      return false;
    }
  }
}