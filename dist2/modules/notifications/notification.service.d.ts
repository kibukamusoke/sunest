import { FirebaseNotificationService } from './firebase-notification.service';
import { TelegramNotificationService } from './telegram-notification.service';
import { MailgunService } from './mailgun.service';
import { NotificationDto, FirebaseNotificationDto, TelegramNotificationDto, PhotoNotificationDto, DocumentNotificationDto } from './dto/notification.dto';
import { EmailDto, EmailTemplateDto } from './dto/email.dto';
export declare class NotificationService {
    private firebaseService;
    private telegramService;
    private mailgunService;
    private readonly logger;
    constructor(firebaseService: FirebaseNotificationService, telegramService: TelegramNotificationService, mailgunService: MailgunService);
    sendAll(notification: NotificationDto, emails?: string[]): Promise<boolean>;
    sendFirebaseNotification(notification: FirebaseNotificationDto): Promise<boolean>;
    sendTelegramNotification(notification: TelegramNotificationDto): Promise<boolean>;
    sendTelegramPhoto(notification: PhotoNotificationDto): Promise<boolean>;
    sendTelegramDocument(notification: DocumentNotificationDto): Promise<boolean>;
    sendSystemAlert(message: string, error?: Error): Promise<boolean>;
    sendEmail(emailDto: EmailDto): Promise<boolean>;
    sendTemplateEmail(templateDto: EmailTemplateDto): Promise<boolean>;
    sendVerificationEmail(userEmail: string, userName: string, verificationToken: string): Promise<boolean>;
    sendPasswordResetEmail(userEmail: string, userName: string, resetToken: string): Promise<boolean>;
    sendWelcomeEmail(userEmail: string, userName: string): Promise<boolean>;
    sendFileSharedNotification(userEmail: string, userName: string, ownerName: string, fileName: string, printLimit: number): Promise<boolean>;
    sendFolderSharedNotification(userEmail: string, userName: string, ownerName: string, folderName: string, permissions: {
        canEdit: boolean;
        canShare: boolean;
    }): Promise<boolean>;
    sendPrintLimitNotification(userEmail: string, userName: string, fileName: string, isOwner: boolean, printLimit: number): Promise<boolean>;
    sendPrintLimitWarningNotification(userEmail: string, userName: string, fileName: string, currentCount: number, printLimit: number): Promise<boolean>;
}
