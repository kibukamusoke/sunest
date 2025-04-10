import { Injectable, Logger } from '@nestjs/common';
import { FirebaseNotificationService } from './firebase-notification.service';
import { TelegramNotificationService } from './telegram-notification.service';
import { MailgunService } from './mailgun.service';
import { 
  NotificationDto, 
  FirebaseNotificationDto, 
  TelegramNotificationDto,
  PhotoNotificationDto,
  DocumentNotificationDto,
  NotificationType
} from './dto/notification.dto';
import { EmailDto, EmailTemplateDto } from './dto/email.dto';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    private firebaseService: FirebaseNotificationService,
    private telegramService: TelegramNotificationService,
    private mailgunService: MailgunService,
  ) {}

  /**
   * Send a notification to all available channels (Firebase, Telegram, Email)
   */
  async sendAll(notification: NotificationDto, emails?: string[]): Promise<boolean> {
    const promises = [
      this.sendFirebaseNotification({
        ...notification,
      }),
      this.sendTelegramNotification({
        message: `<b>${notification.title}</b>\n\n${notification.body}`,
      }),
    ];

    // If emails are provided, send email notifications
    if (emails && emails.length > 0) {
      promises.push(
        this.mailgunService.sendEmail({
          to: emails.map(email => ({ email })),
          subject: notification.title,
          text: notification.body,
          html: `<h2>${notification.title}</h2><p>${notification.body}</p>`,
        })
      );
    }
    
    const results = await Promise.all(promises);
    return results.some(result => result);
  }

  /**
   * Send a Firebase notification to specified tokens or topic
   */
  async sendFirebaseNotification(notification: FirebaseNotificationDto): Promise<boolean> {
    try {
      const { title, body, data, tokens, topic, type = NotificationType.INFO } = notification;
      
      const payload = {
        notification: {
          title,
          body,
        },
        data: {
          ...data,
          type,
          click_action: 'FLUTTER_NOTIFICATION_CLICK',
        },
      };
      
      if (tokens && tokens.length > 0) {
        return this.firebaseService.sendToDevices(tokens, payload);
      } else if (topic) {
        return this.firebaseService.sendToTopic(topic, payload);
      } else {
        this.logger.warn('No tokens or topic provided for Firebase notification');
        return false;
      }
    } catch (error) {
      this.logger.error(`Error sending Firebase notification: ${error.message}`, error.stack);
      return false;
    }
  }

  /**
   * Send a Telegram text message
   */
  async sendTelegramNotification(notification: TelegramNotificationDto): Promise<boolean> {
    try {
      const { message, chatId } = notification;
      return this.telegramService.sendMessage(message, chatId);
    } catch (error) {
      this.logger.error(`Error sending Telegram notification: ${error.message}`, error.stack);
      return false;
    }
  }

  /**
   * Send a Telegram photo
   */
  async sendTelegramPhoto(notification: PhotoNotificationDto): Promise<boolean> {
    try {
      const { photoUrl, caption, chatId } = notification;
      return this.telegramService.sendPhoto(photoUrl, caption, chatId);
    } catch (error) {
      this.logger.error(`Error sending Telegram photo: ${error.message}`, error.stack);
      return false;
    }
  }

  /**
   * Send a Telegram document
   */
  async sendTelegramDocument(notification: DocumentNotificationDto): Promise<boolean> {
    try {
      const { documentUrl, caption, chatId } = notification;
      return this.telegramService.sendDocument(documentUrl, caption, chatId);
    } catch (error) {
      this.logger.error(`Error sending Telegram document: ${error.message}`, error.stack);
      return false;
    }
  }

  /**
   * Send a system alert to Telegram and email (used for internal error reporting)
   */
  async sendSystemAlert(message: string, error?: Error): Promise<boolean> {
    const promises = [
      // Send to Telegram
      this.telegramService.sendMessage(`🚨 <b>SYSTEM ALERT</b>\n\n${message}${error ? `\n\n<pre>${error.message}</pre>\n<pre>${error.stack}</pre>` : ''}`),
      // Send to email
      this.mailgunService.sendSystemEmail('System Alert', message, error)
    ];
    
    const results = await Promise.all(promises);
    return results.some(result => result);
  }
  
  /**
   * Send an email directly
   */
  async sendEmail(emailDto: EmailDto): Promise<boolean> {
    return this.mailgunService.sendEmail(emailDto);
  }
  
  /**
   * Send an email using a template
   */
  async sendTemplateEmail(templateDto: EmailTemplateDto): Promise<boolean> {
    return this.mailgunService.sendTemplateEmail(templateDto);
  }
  
  /**
   * Send a verification email to a user
   */
  async sendVerificationEmail(userEmail: string, userName: string, verificationToken: string): Promise<boolean> {
    return this.mailgunService.sendVerificationEmail(userEmail, userName, verificationToken);
  }
  
  /**
   * Send a password reset email
   */
  async sendPasswordResetEmail(userEmail: string, userName: string, resetToken: string): Promise<boolean> {
    return this.mailgunService.sendPasswordResetEmail(userEmail, userName, resetToken);
  }
  
  /**
   * Send a welcome email after signup
   */
  async sendWelcomeEmail(userEmail: string, userName: string): Promise<boolean> {
    return this.mailgunService.sendWelcomeEmail(userEmail, userName);
  }
}