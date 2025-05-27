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
  NotificationType,
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
  async sendAll(
    notification: NotificationDto,
    emails?: string[],
  ): Promise<boolean> {
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
          to: emails.map((email) => ({ email })),
          subject: notification.title,
          text: notification.body,
          html: `<h2>${notification.title}</h2><p>${notification.body}</p>`,
        }),
      );
    }

    const results = await Promise.all(promises);
    return results.some((result) => result);
  }

  /**
   * Send a Firebase notification to specified tokens or topic
   */
  async sendFirebaseNotification(
    notification: FirebaseNotificationDto,
  ): Promise<boolean> {
    try {
      const {
        title,
        body,
        data,
        tokens,
        topic,
        type = NotificationType.INFO,
      } = notification;

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
        this.logger.warn(
          'No tokens or topic provided for Firebase notification',
        );
        return false;
      }
    } catch (error) {
      this.logger.error(
        `Error sending Firebase notification: ${error.message}`,
        error.stack,
      );
      return false;
    }
  }

  /**
   * Send a Telegram text message
   */
  async sendTelegramNotification(
    notification: TelegramNotificationDto,
  ): Promise<boolean> {
    try {
      const { message, chatId } = notification;
      return this.telegramService.sendMessage(message, chatId);
    } catch (error) {
      this.logger.error(
        `Error sending Telegram notification: ${error.message}`,
        error.stack,
      );
      return false;
    }
  }

  /**
   * Send a Telegram photo
   */
  async sendTelegramPhoto(
    notification: PhotoNotificationDto,
  ): Promise<boolean> {
    try {
      const { photoUrl, caption, chatId } = notification;
      return this.telegramService.sendPhoto(photoUrl, caption, chatId);
    } catch (error) {
      this.logger.error(
        `Error sending Telegram photo: ${error.message}`,
        error.stack,
      );
      return false;
    }
  }

  /**
   * Send a Telegram document
   */
  async sendTelegramDocument(
    notification: DocumentNotificationDto,
  ): Promise<boolean> {
    try {
      const { documentUrl, caption, chatId } = notification;
      return this.telegramService.sendDocument(documentUrl, caption, chatId);
    } catch (error) {
      this.logger.error(
        `Error sending Telegram document: ${error.message}`,
        error.stack,
      );
      return false;
    }
  }

  /**
   * Send a system alert to Telegram and email (used for internal error reporting)
   */
  async sendSystemAlert(message: string, error?: Error): Promise<boolean> {
    const promises = [
      // Send to Telegram
      this.telegramService.sendMessage(
        `🚨 <b>SYSTEM ALERT</b>\n\n${message}${error ? `\n\n<pre>${error.message}</pre>\n<pre>${error.stack}</pre>` : ''}`,
      ),
      // Send to email
      this.mailgunService.sendSystemEmail('System Alert', message, error),
    ];

    const results = await Promise.all(promises);
    return results.some((result) => result);
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
  async sendVerificationEmail(
    userEmail: string,
    userName: string,
    verificationToken: string,
  ): Promise<boolean> {
    return this.mailgunService.sendVerificationEmail(
      userEmail,
      userName,
      verificationToken,
    );
  }

  /**
   * Send a password reset email
   */
  async sendPasswordResetEmail(
    userEmail: string,
    userName: string,
    resetToken: string,
  ): Promise<boolean> {
    return this.mailgunService.sendPasswordResetEmail(
      userEmail,
      userName,
      resetToken,
    );
  }

  /**
   * Send a welcome email after signup
   */
  async sendWelcomeEmail(
    userEmail: string,
    userName: string,
  ): Promise<boolean> {
    return this.mailgunService.sendWelcomeEmail(userEmail, userName);
  }

  /**
   * Send a notification when a file is shared with a user
   */
  async sendFileSharedNotification(
    userEmail: string,
    userName: string,
    ownerName: string,
    fileName: string,
    printLimit: number,
  ): Promise<boolean> {
    const subject = `${ownerName} has shared a file with you`;
    const text = `${ownerName} has shared the file "${fileName}" with you on Qart. You can print this file up to ${printLimit} times.`;
    const html = `
      <h2>${ownerName} has shared a file with you</h2>
      <p>You have been granted access to the file <strong>${fileName}</strong> on Qart.</p>
      <p>Print limit: <strong>${printLimit} ${printLimit === 1 ? 'copy' : 'copies'}</strong></p>
      <p>Login to your Qart account to view and print this file.</p>
    `;

    // Send email notification
    const emailSent = await this.mailgunService.sendEmail({
      to: [{ email: userEmail, name: userName }],
      subject,
      text,
      html,
    });

    // Send app notification
    const notificationSent = await this.sendFirebaseNotification({
      title: 'New Shared File',
      body: `${ownerName} has shared "${fileName}" with you`,
      data: {
        type: 'file_shared',
        fileName,
        ownerName,
      },
      topic: `user_${userEmail.replace('@', '_at_')}`, // Topic format for user-specific notifications
    });

    return emailSent || notificationSent;
  }

  /**
   * Send a notification when a folder is shared with a user
   */
  async sendFolderSharedNotification(
    userEmail: string,
    userName: string,
    ownerName: string,
    folderName: string,
    permissions: { canEdit: boolean; canShare: boolean },
  ): Promise<boolean> {
    const subject = `${ownerName} has shared a folder with you`;
    const text = `${ownerName} has shared the folder "${folderName}" with you on Qart.`;

    let permissionsText = '';
    if (permissions.canEdit)
      permissionsText += 'You can edit the contents of this folder. ';
    if (permissions.canShare)
      permissionsText += 'You can share this folder with others. ';
    if (!permissions.canEdit && !permissions.canShare)
      permissionsText = 'You have view-only access to this folder. ';

    const html = `
      <h2>${ownerName} has shared a folder with you</h2>
      <p>You have been granted access to the folder <strong>${folderName}</strong> on Qart.</p>
      <p>${permissionsText}</p>
      <p>Login to your Qart account to access this folder.</p>
    `;

    // Send email notification
    const emailSent = await this.mailgunService.sendEmail({
      to: [{ email: userEmail, name: userName }],
      subject,
      text,
      html,
    });

    // Send app notification
    const notificationSent = await this.sendFirebaseNotification({
      title: 'New Shared Folder',
      body: `${ownerName} has shared "${folderName}" with you`,
      data: {
        type: 'folder_shared',
        folderName,
        ownerName,
      },
      topic: `user_${userEmail.replace('@', '_at_')}`, // Topic format for user-specific notifications
    });

    return emailSent || notificationSent;
  }

  /**
   * Send a notification when a print limit is reached
   */
  async sendPrintLimitNotification(
    userEmail: string,
    userName: string,
    fileName: string,
    isOwner: boolean,
    printLimit: number,
  ): Promise<boolean> {
    const subject = `Print limit reached for ${fileName}`;
    const text = `You have reached the print limit (${printLimit}) for the file "${fileName}" on Qart.`;
    const html = `
      <h2>Print Limit Reached</h2>
      <p>You have reached the maximum number of prints (${printLimit}) for the file <strong>${fileName}</strong>.</p>
      ${
        isOwner
          ? '<p>As the owner, you can increase the print limit from your Qart dashboard.</p>'
          : '<p>Please contact the file owner if you need to print additional copies.</p>'
      }
    `;

    // Send email notification
    const emailSent = await this.mailgunService.sendEmail({
      to: [{ email: userEmail, name: userName }],
      subject,
      text,
      html,
    });

    // Send app notification
    const notificationSent = await this.sendFirebaseNotification({
      title: 'Print Limit Reached',
      body: `You've reached the print limit for "${fileName}"`,
      type: NotificationType.WARNING,
      data: {
        type: 'print_limit_reached',
        fileName,
      },
      topic: `user_${userEmail.replace('@', '_at_')}`, // Topic format for user-specific notifications
    });

    return emailSent || notificationSent;
  }

  /**
   * Send a notification when a print limit is almost reached (e.g. 80%)
   */
  async sendPrintLimitWarningNotification(
    userEmail: string,
    userName: string,
    fileName: string,
    currentCount: number,
    printLimit: number,
  ): Promise<boolean> {
    const remainingPrints = printLimit - currentCount;
    const subject = `Print limit almost reached for ${fileName}`;
    const text = `You are approaching the print limit for the file "${fileName}" on Qart. You have ${remainingPrints} prints remaining.`;
    const html = `
      <h2>Print Limit Warning</h2>
      <p>You are approaching the maximum number of prints for the file <strong>${fileName}</strong>.</p>
      <p>You have <strong>${remainingPrints}</strong> prints remaining out of ${printLimit}.</p>
    `;

    // Send email notification
    const emailSent = await this.mailgunService.sendEmail({
      to: [{ email: userEmail, name: userName }],
      subject,
      text,
      html,
    });

    // Send app notification
    const notificationSent = await this.sendFirebaseNotification({
      title: 'Print Limit Warning',
      body: `${remainingPrints} prints remaining for "${fileName}"`,
      type: NotificationType.WARNING,
      data: {
        type: 'print_limit_warning',
        fileName,
        remainingPrints,
      },
      topic: `user_${userEmail.replace('@', '_at_')}`, // Topic format for user-specific notifications
    });

    return emailSent || notificationSent;
  }
}
