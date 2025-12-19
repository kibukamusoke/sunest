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
var MailgunService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailgunService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const nestjs_mailgun_1 = require("nestjs-mailgun");
let MailgunService = MailgunService_1 = class MailgunService {
    constructor(configService, mailgunService) {
        this.configService = configService;
        this.mailgunService = mailgunService;
        this.logger = new common_1.Logger(MailgunService_1.name);
        this.initialized = false;
    }
    async onModuleInit() {
        try {
            this.domain = this.configService.get('MAILGUN_DOMAIN') || '';
            this.fromEmail =
                this.configService.get('MAILGUN_FROM_EMAIL') || '';
            this.fromName =
                this.configService.get('MAILGUN_FROM_NAME') || 'QART';
            if (!this.domain || !this.fromEmail) {
                this.logger.warn('Mailgun configuration incomplete. Email sending will be disabled.');
                return;
            }
            this.initialized = true;
            this.logger.log('Mailgun service initialized successfully');
        }
        catch (error) {
            this.logger.error('Failed to initialize Mailgun service', error.stack);
        }
    }
    async sendEmail(emailDto) {
        if (!this.initialized) {
            this.logger.warn('Mailgun not initialized. Cannot send email.');
            return false;
        }
        try {
            const { to, cc, bcc, subject, text, html, attachments } = emailDto;
            const options = {
                from: `${this.fromName} <${this.fromEmail}>`,
                to: to
                    .map((recipient) => recipient.name
                    ? `${recipient.name} <${recipient.email}>`
                    : recipient.email)
                    .join(','),
                subject,
                text,
                html: html || '',
                attachment: attachments && attachments.length > 0
                    ? attachments.map((attachment) => ({
                        filename: attachment.filename,
                        data: Buffer.from(attachment.data, 'base64'),
                    }))
                    : '',
                cc: cc && cc.length > 0
                    ? cc
                        .map((recipient) => recipient.name
                        ? `${recipient.name} <${recipient.email}>`
                        : recipient.email)
                        .join(',')
                    : '',
                bcc: bcc && bcc.length > 0
                    ? bcc
                        .map((recipient) => recipient.name
                        ? `${recipient.name} <${recipient.email}>`
                        : recipient.email)
                        .join(',')
                    : '',
                'o:testmode': 'no',
                'h:X-Mailgun-Variables': JSON.stringify({ system: 'qart' }),
            };
            const response = await this.mailgunService.createEmail(this.domain, options);
            this.logger.debug(`Email sent successfully: ${response.id}`);
            return true;
        }
        catch (error) {
            this.logger.error(`Error sending email: ${error.message}`, error.stack);
            return false;
        }
    }
    async sendTemplateEmail(templateDto) {
        if (!this.initialized) {
            this.logger.warn('Mailgun not initialized. Cannot send template email.');
            return false;
        }
        try {
            const { to, templateName, templateVars } = templateDto;
            const options = {
                from: `${this.fromName} <${this.fromEmail}>`,
                to: to
                    .map((recipient) => recipient.name
                    ? `${recipient.name} <${recipient.email}>`
                    : recipient.email)
                    .join(','),
                template: templateName,
                text: '',
                html: '',
                attachment: '',
                cc: '',
                bcc: '',
                'o:testmode': 'no',
                'h:X-Mailgun-Variables': JSON.stringify({
                    ...templateVars,
                    system: 'qart',
                }),
            };
            const response = await this.mailgunService.createEmail(this.domain, options);
            this.logger.debug(`Template email sent successfully: ${response.id}`);
            return true;
        }
        catch (error) {
            this.logger.error(`Error sending template email: ${error.message}`, error.stack);
            return false;
        }
    }
    async sendSystemEmail(subject, message, error) {
        const adminEmail = this.configService.get('ADMIN_EMAIL') || this.fromEmail;
        const emailContent = `
      <h2>System Notification</h2>
      <p>${message}</p>
      ${error
            ? `
        <h3>Error Details</h3>
        <p><strong>Message:</strong> ${error.message}</p>
        <pre>${error.stack}</pre>
      `
            : ''}
    `;
        const options = {
            from: `${this.fromName} <${this.fromEmail}>`,
            to: adminEmail,
            subject: `[SYSTEM] ${subject}`,
            text: message + (error ? `\n\nError: ${error.message}\n${error.stack}` : ''),
            html: emailContent,
            attachment: '',
            cc: '',
            bcc: '',
            'o:testmode': 'no',
            'h:X-Mailgun-Variables': JSON.stringify({
                system: 'qart',
                type: 'system_notification',
            }),
        };
        try {
            const response = await this.mailgunService.createEmail(this.domain, options);
            this.logger.debug(`System email sent successfully: ${response.id}`);
            return true;
        }
        catch (error) {
            this.logger.error(`Error sending system email: ${error.message}`, error.stack);
            return false;
        }
    }
    async sendVerificationEmail(userEmail, userName, verificationToken) {
        const verificationUrl = `${this.configService.get('APP_URL') || 'http://localhost:3000'}/verify-email?token=${verificationToken}`;
        const html = `
      <h2>Verify Your Email Address</h2>
      <p>Hello ${userName},</p>
      <p>Thank you for signing up! Please verify your email address by clicking the button below:</p>
      <p>
        <a href="${verificationUrl}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
          Verify Email
        </a>
      </p>
      <p>If the button doesn't work, you can also copy and paste the following link into your browser:</p>
      <p><a href="${verificationUrl}">${verificationUrl}</a></p>
      <p>This link will expire in 24 hours.</p>
      <p>If you didn't create an account, you can safely ignore this email.</p>
    `;
        const options = {
            from: `${this.fromName} <${this.fromEmail}>`,
            to: userEmail,
            subject: 'Verify Your Email Address',
            text: `Hello ${userName},\n\nThank you for signing up! Please verify your email address by visiting this URL: ${verificationUrl}\n\nThis link will expire in 24 hours.\n\nIf you didn't create an account, you can safely ignore this email.`,
            html,
            attachment: '',
            cc: '',
            bcc: '',
            'o:testmode': 'no',
            'h:X-Mailgun-Variables': JSON.stringify({
                system: 'qart',
                type: 'verification',
                user: userName,
            }),
        };
        try {
            const response = await this.mailgunService.createEmail(this.domain, options);
            this.logger.debug(`Verification email sent successfully: ${response.id}`);
            return true;
        }
        catch (error) {
            this.logger.error(`Error sending verification email: ${error.message}`, error.stack);
            return false;
        }
    }
    async sendPasswordResetEmail(userEmail, userName, resetToken) {
        const resetUrl = `${this.configService.get('APP_URL') || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
        const html = `
      <h2>Reset Your Password</h2>
      <p>Hello ${userName},</p>
      <p>We received a request to reset your password. Click the button below to create a new password:</p>
      <p>
        <a href="${resetUrl}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
          Reset Password
        </a>
      </p>
      <p>If the button doesn't work, you can also copy and paste the following link into your browser:</p>
      <p><a href="${resetUrl}">${resetUrl}</a></p>
      <p>This link will expire in 1 hour.</p>
      <p>If you didn't request a password reset, you can safely ignore this email.</p>
    `;
        const options = {
            from: `${this.fromName} <${this.fromEmail}>`,
            to: userEmail,
            subject: 'Reset Your Password',
            text: `Hello ${userName},\n\nWe received a request to reset your password. Please visit this URL to create a new password: ${resetUrl}\n\nThis link will expire in 1 hour.\n\nIf you didn't request a password reset, you can safely ignore this email.`,
            html,
            attachment: '',
            cc: '',
            bcc: '',
            'o:testmode': 'no',
            'h:X-Mailgun-Variables': JSON.stringify({
                system: 'qart',
                type: 'password_reset',
                user: userName,
            }),
        };
        try {
            const response = await this.mailgunService.createEmail(this.domain, options);
            this.logger.debug(`Password reset email sent successfully: ${response.id}`);
            return true;
        }
        catch (error) {
            this.logger.error(`Error sending password reset email: ${error.message}`, error.stack);
            return false;
        }
    }
    async sendWelcomeEmail(userEmail, userName) {
        const html = `
      <h2>Welcome to ${this.fromName}!</h2>
      <p>Hello ${userName},</p>
      <p>Thank you for joining us! We're excited to have you on board.</p>
      <p>Here are a few things you can do to get started:</p>
      <ul>
        <li>Complete your profile</li>
        <li>Explore our features</li>
        <li>Connect with other users</li>
      </ul>
      <p>If you have any questions, please don't hesitate to contact our support team.</p>
      <p>Best regards,<br>The ${this.fromName} Team</p>
    `;
        const options = {
            from: `${this.fromName} <${this.fromEmail}>`,
            to: userEmail,
            subject: `Welcome to ${this.fromName}!`,
            text: `Hello ${userName},\n\nThank you for joining us! We're excited to have you on board.\n\nHere are a few things you can do to get started:\n- Complete your profile\n- Explore our features\n- Connect with other users\n\nIf you have any questions, please don't hesitate to contact our support team.\n\nBest regards,\nThe ${this.fromName} Team`,
            html,
            attachment: '',
            cc: '',
            bcc: '',
            'o:testmode': 'no',
            'h:X-Mailgun-Variables': JSON.stringify({
                system: 'qart',
                type: 'welcome',
                user: userName,
            }),
        };
        try {
            const response = await this.mailgunService.createEmail(this.domain, options);
            this.logger.debug(`Welcome email sent successfully: ${response.id}`);
            return true;
        }
        catch (error) {
            this.logger.error(`Error sending welcome email: ${error.message}`, error.stack);
            return false;
        }
    }
};
exports.MailgunService = MailgunService;
exports.MailgunService = MailgunService = MailgunService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        nestjs_mailgun_1.MailgunService])
], MailgunService);
//# sourceMappingURL=mailgun.service.js.map