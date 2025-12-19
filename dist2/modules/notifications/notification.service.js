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
var NotificationService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const common_1 = require("@nestjs/common");
const firebase_notification_service_1 = require("./firebase-notification.service");
const telegram_notification_service_1 = require("./telegram-notification.service");
const mailgun_service_1 = require("./mailgun.service");
const notification_dto_1 = require("./dto/notification.dto");
let NotificationService = NotificationService_1 = class NotificationService {
    constructor(firebaseService, telegramService, mailgunService) {
        this.firebaseService = firebaseService;
        this.telegramService = telegramService;
        this.mailgunService = mailgunService;
        this.logger = new common_1.Logger(NotificationService_1.name);
    }
    async sendAll(notification, emails) {
        const promises = [
            this.sendFirebaseNotification({
                ...notification,
            }),
            this.sendTelegramNotification({
                message: `<b>${notification.title}</b>\n\n${notification.body}`,
            }),
        ];
        if (emails && emails.length > 0) {
            promises.push(this.mailgunService.sendEmail({
                to: emails.map((email) => ({ email })),
                subject: notification.title,
                text: notification.body,
                html: `<h2>${notification.title}</h2><p>${notification.body}</p>`,
            }));
        }
        const results = await Promise.all(promises);
        return results.some((result) => result);
    }
    async sendFirebaseNotification(notification) {
        try {
            const { title, body, data, tokens, topic, type = notification_dto_1.NotificationType.INFO, } = notification;
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
            }
            else if (topic) {
                return this.firebaseService.sendToTopic(topic, payload);
            }
            else {
                this.logger.warn('No tokens or topic provided for Firebase notification');
                return false;
            }
        }
        catch (error) {
            this.logger.error(`Error sending Firebase notification: ${error.message}`, error.stack);
            return false;
        }
    }
    async sendTelegramNotification(notification) {
        try {
            const { message, chatId } = notification;
            return this.telegramService.sendMessage(message, chatId);
        }
        catch (error) {
            this.logger.error(`Error sending Telegram notification: ${error.message}`, error.stack);
            return false;
        }
    }
    async sendTelegramPhoto(notification) {
        try {
            const { photoUrl, caption, chatId } = notification;
            return this.telegramService.sendPhoto(photoUrl, caption, chatId);
        }
        catch (error) {
            this.logger.error(`Error sending Telegram photo: ${error.message}`, error.stack);
            return false;
        }
    }
    async sendTelegramDocument(notification) {
        try {
            const { documentUrl, caption, chatId } = notification;
            return this.telegramService.sendDocument(documentUrl, caption, chatId);
        }
        catch (error) {
            this.logger.error(`Error sending Telegram document: ${error.message}`, error.stack);
            return false;
        }
    }
    async sendSystemAlert(message, error) {
        const promises = [
            this.telegramService.sendMessage(`🚨 <b>SYSTEM ALERT</b>\n\n${message}${error ? `\n\n<pre>${error.message}</pre>\n<pre>${error.stack}</pre>` : ''}`),
            this.mailgunService.sendSystemEmail('System Alert', message, error),
        ];
        const results = await Promise.all(promises);
        return results.some((result) => result);
    }
    async sendEmail(emailDto) {
        return this.mailgunService.sendEmail(emailDto);
    }
    async sendTemplateEmail(templateDto) {
        return this.mailgunService.sendTemplateEmail(templateDto);
    }
    async sendVerificationEmail(userEmail, userName, verificationToken) {
        return this.mailgunService.sendVerificationEmail(userEmail, userName, verificationToken);
    }
    async sendPasswordResetEmail(userEmail, userName, resetToken) {
        return this.mailgunService.sendPasswordResetEmail(userEmail, userName, resetToken);
    }
    async sendWelcomeEmail(userEmail, userName) {
        return this.mailgunService.sendWelcomeEmail(userEmail, userName);
    }
    async sendFileSharedNotification(userEmail, userName, ownerName, fileName, printLimit) {
        const subject = `${ownerName} has shared a file with you`;
        const text = `${ownerName} has shared the file "${fileName}" with you on Qart. You can print this file up to ${printLimit} times.`;
        const html = `
      <h2>${ownerName} has shared a file with you</h2>
      <p>You have been granted access to the file <strong>${fileName}</strong> on Qart.</p>
      <p>Print limit: <strong>${printLimit} ${printLimit === 1 ? 'copy' : 'copies'}</strong></p>
      <p>Login to your Qart account to view and print this file.</p>
    `;
        const emailSent = await this.mailgunService.sendEmail({
            to: [{ email: userEmail, name: userName }],
            subject,
            text,
            html,
        });
        const notificationSent = await this.sendFirebaseNotification({
            title: 'New Shared File',
            body: `${ownerName} has shared "${fileName}" with you`,
            data: {
                type: 'file_shared',
                fileName,
                ownerName,
            },
            topic: `user_${userEmail.replace('@', '_at_')}`,
        });
        return emailSent || notificationSent;
    }
    async sendFolderSharedNotification(userEmail, userName, ownerName, folderName, permissions) {
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
        const emailSent = await this.mailgunService.sendEmail({
            to: [{ email: userEmail, name: userName }],
            subject,
            text,
            html,
        });
        const notificationSent = await this.sendFirebaseNotification({
            title: 'New Shared Folder',
            body: `${ownerName} has shared "${folderName}" with you`,
            data: {
                type: 'folder_shared',
                folderName,
                ownerName,
            },
            topic: `user_${userEmail.replace('@', '_at_')}`,
        });
        return emailSent || notificationSent;
    }
    async sendPrintLimitNotification(userEmail, userName, fileName, isOwner, printLimit) {
        const subject = `Print limit reached for ${fileName}`;
        const text = `You have reached the print limit (${printLimit}) for the file "${fileName}" on Qart.`;
        const html = `
      <h2>Print Limit Reached</h2>
      <p>You have reached the maximum number of prints (${printLimit}) for the file <strong>${fileName}</strong>.</p>
      ${isOwner
            ? '<p>As the owner, you can increase the print limit from your Qart dashboard.</p>'
            : '<p>Please contact the file owner if you need to print additional copies.</p>'}
    `;
        const emailSent = await this.mailgunService.sendEmail({
            to: [{ email: userEmail, name: userName }],
            subject,
            text,
            html,
        });
        const notificationSent = await this.sendFirebaseNotification({
            title: 'Print Limit Reached',
            body: `You've reached the print limit for "${fileName}"`,
            type: notification_dto_1.NotificationType.WARNING,
            data: {
                type: 'print_limit_reached',
                fileName,
            },
            topic: `user_${userEmail.replace('@', '_at_')}`,
        });
        return emailSent || notificationSent;
    }
    async sendPrintLimitWarningNotification(userEmail, userName, fileName, currentCount, printLimit) {
        const remainingPrints = printLimit - currentCount;
        const subject = `Print limit almost reached for ${fileName}`;
        const text = `You are approaching the print limit for the file "${fileName}" on Qart. You have ${remainingPrints} prints remaining.`;
        const html = `
      <h2>Print Limit Warning</h2>
      <p>You are approaching the maximum number of prints for the file <strong>${fileName}</strong>.</p>
      <p>You have <strong>${remainingPrints}</strong> prints remaining out of ${printLimit}.</p>
    `;
        const emailSent = await this.mailgunService.sendEmail({
            to: [{ email: userEmail, name: userName }],
            subject,
            text,
            html,
        });
        const notificationSent = await this.sendFirebaseNotification({
            title: 'Print Limit Warning',
            body: `${remainingPrints} prints remaining for "${fileName}"`,
            type: notification_dto_1.NotificationType.WARNING,
            data: {
                type: 'print_limit_warning',
                fileName,
                remainingPrints,
            },
            topic: `user_${userEmail.replace('@', '_at_')}`,
        });
        return emailSent || notificationSent;
    }
};
exports.NotificationService = NotificationService;
exports.NotificationService = NotificationService = NotificationService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [firebase_notification_service_1.FirebaseNotificationService,
        telegram_notification_service_1.TelegramNotificationService,
        mailgun_service_1.MailgunService])
], NotificationService);
//# sourceMappingURL=notification.service.js.map