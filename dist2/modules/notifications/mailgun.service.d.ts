import { OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EmailDto, EmailTemplateDto } from './dto/email.dto';
import { MailgunService as Mailgun } from 'nestjs-mailgun';
export declare class MailgunService implements OnModuleInit {
    private configService;
    private mailgunService;
    private readonly logger;
    private initialized;
    private domain;
    private fromEmail;
    private fromName;
    constructor(configService: ConfigService, mailgunService: Mailgun);
    onModuleInit(): Promise<void>;
    sendEmail(emailDto: EmailDto): Promise<boolean>;
    sendTemplateEmail(templateDto: EmailTemplateDto): Promise<boolean>;
    sendSystemEmail(subject: string, message: string, error?: Error): Promise<boolean>;
    sendVerificationEmail(userEmail: string, userName: string, verificationToken: string): Promise<boolean>;
    sendPasswordResetEmail(userEmail: string, userName: string, resetToken: string): Promise<boolean>;
    sendWelcomeEmail(userEmail: string, userName: string): Promise<boolean>;
}
