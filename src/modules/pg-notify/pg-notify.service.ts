import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from 'pg';
import { NotificationService } from '../notifications/notification.service';
import { 
  NotificationChannel, 
  PgNotification, 
  UserCreatedPayload, 
  UserUpdatedPayload,
  FileUploadedPayload,
  SystemEventPayload
} from './pg-notify.interface';

@Injectable()
export class PgNotifyService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PgNotifyService.name);
  private client: Client;
  private initialized = false;
  private handlers: Map<string, ((payload: any) => Promise<void>)[]> = new Map();

  constructor(
    private readonly configService: ConfigService,
    private readonly notificationService: NotificationService,
  ) {}

  async onModuleInit() {
    await this.initializeClient();
    this.setupDefaultHandlers();
  }

  async onModuleDestroy() {
    await this.disconnect();
  }

  private async initializeClient() {
    try {
      const databaseUrl = this.configService.get<string>('DATABASE_URL');
      
      if (!databaseUrl) {
        this.logger.warn('Database URL not configured, skipping PG notify initialization');
        return;
      }
      
      this.client = new Client({ connectionString: databaseUrl });
      
      this.client.on('notification', (msg) => this.handleNotification(msg));
      
      this.client.on('error', (err) => {
        this.logger.error(`PostgreSQL notification client error: ${err.message}`, err.stack);
        this.notificationService.sendSystemAlert('PostgreSQL notification client error', err);
      });
      
      await this.client.connect();
      
      // Listen to all notification channels
      for (const channel of Object.values(NotificationChannel)) {
        await this.client.query(`LISTEN ${channel}`);
      }
      
      this.initialized = true;
      this.logger.log('PostgreSQL notification listener initialized successfully');
    } catch (error) {
      this.logger.error(`Failed to initialize PostgreSQL notification listener: ${error.message}`, error.stack);
      await this.notificationService.sendSystemAlert('Failed to initialize PG notification listener', error);
    }
  }

  private async disconnect() {
    if (this.client) {
      try {
        // Unlisten all channels
        for (const channel of Object.values(NotificationChannel)) {
          await this.client.query(`UNLISTEN ${channel}`);
        }
        
        await this.client.end();
        this.logger.log('PostgreSQL notification listener disconnected');
      } catch (error) {
        this.logger.error(`Error disconnecting from PostgreSQL: ${error.message}`, error.stack);
      }
    }
  }

  /**
   * Handle incoming notifications from PostgreSQL
   */
  private async handleNotification(msg: any) {
    try {
      this.logger.debug(`Received notification on channel '${msg.channel}': ${msg.payload}`);
      
      const payload = JSON.parse(msg.payload);
      
      // Call all registered handlers for this channel
      const channelHandlers = this.handlers.get(msg.channel) || [];
      
      for (const handler of channelHandlers) {
        try {
          await handler(payload);
        } catch (handlerError) {
          this.logger.error(
            `Error in notification handler for channel ${msg.channel}: ${handlerError.message}`,
            handlerError.stack
          );
        }
      }
    } catch (error) {
      this.logger.error(`Error handling notification: ${error.message}`, error.stack);
    }
  }

  /**
   * Register a new notification handler for a specific channel
   */
  registerHandler<T>(channel: NotificationChannel, handler: (payload: T) => Promise<void>): void {
    if (!this.handlers.has(channel)) {
      this.handlers.set(channel, []);
    }
    
    this.handlers.get(channel)!.push(handler);
    this.logger.log(`Registered new handler for channel: ${channel}`);
  }

  /**
   * Remove a handler from a channel
   */
  removeHandler<T>(channel: NotificationChannel, handler: (payload: T) => Promise<void>): void {
    if (this.handlers.has(channel)) {
      const handlers = this.handlers.get(channel)!;
      const index = handlers.indexOf(handler as any);
      
      if (index !== -1) {
        handlers.splice(index, 1);
        this.logger.log(`Removed handler from channel: ${channel}`);
      }
    }
  }

  /**
   * Manually emit a notification (for testing or internal events)
   * In production, you would typically emit events directly from the database
   */
  async emitNotification(channel: NotificationChannel, payload: any): Promise<void> {
    if (!this.initialized) {
      this.logger.warn('PG notify service not initialized, cannot emit notification');
      return;
    }
    
    try {
      const payloadJson = JSON.stringify(payload);
      await this.client.query(`SELECT pg_notify($1, $2)`, [channel, payloadJson]);
      this.logger.debug(`Emitted notification on channel '${channel}': ${payloadJson}`);
    } catch (error) {
      this.logger.error(`Error emitting notification: ${error.message}`, error.stack);
    }
  }

  /**
   * Setup default handlers for common notifications
   */
  private setupDefaultHandlers() {
    // Example: Handle user creations
    this.registerHandler<UserCreatedPayload>(
      NotificationChannel.USER_CREATED,
      async (payload) => {
        this.logger.log(`New user created: ${payload.email} (${payload.id})`);
        
        // Example: Send notification to admin channel
        await this.notificationService.sendTelegramNotification({
          message: `👤 <b>New User Registered</b>\n\nEmail: ${payload.email}\nID: ${payload.id}\nTime: ${new Date(payload.createdAt).toLocaleString()}`
        });
      }
    );
    
    // Example: Handle file uploads
    this.registerHandler<FileUploadedPayload>(
      NotificationChannel.FILE_UPLOADED,
      async (payload) => {
        this.logger.log(`New file uploaded: ${payload.filename} (${payload.id})`);
        
        // Example: Send notification for large files
        if (payload.size > 10 * 1024 * 1024) { // 10MB
          await this.notificationService.sendTelegramNotification({
            message: `📁 <b>Large File Uploaded</b>\n\nFilename: ${payload.filename}\nSize: ${(payload.size / (1024 * 1024)).toFixed(2)} MB\nUser: ${payload.userId || 'Anonymous'}`
          });
        }
      }
    );
    
    // Example: Handle system events
    this.registerHandler<SystemEventPayload>(
      NotificationChannel.SYSTEM_EVENT,
      async (payload) => {
        this.logger.log(`System event: ${payload.event} - ${payload.message}`);
        
        if (payload.severity === 'error') {
          await this.notificationService.sendSystemAlert(
            `System Event: ${payload.event}`,
            new Error(payload.message)
          );
        }
      }
    );
  }
}