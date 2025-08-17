import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as FormData from 'form-data';
import { EmailDto, EmailTemplateDto } from './dto/email.dto';

import { MailgunMessageData, MailgunService as Mailgun } from 'nestjs-mailgun';

@Injectable()
export class MailgunService implements OnModuleInit {
  private readonly logger = new Logger(MailgunService.name);
  private initialized = false;
  private domain: string;
  private fromEmail: string;
  private fromName: string;

  constructor(
    private configService: ConfigService,
    private mailgunService: Mailgun,
  ) { }

  async onModuleInit() {
    try {
      this.domain = this.configService.get<string>('MAILGUN_DOMAIN') || '';
      this.fromEmail = this.configService.get<string>('MAILGUN_FROM_EMAIL') || '';
      this.fromName = this.configService.get<string>('MAILGUN_FROM_NAME') || 'QART';

      if (!this.domain || !this.fromEmail) {
        this.logger.warn('Mailgun configuration incomplete. Email sending will be disabled.');
        return;
      }

      this.initialized = true;
      this.logger.log('Mailgun service initialized successfully');
    } catch (error) {
      this.logger.error('Failed to initialize Mailgun service', error.stack);
    }
  }

  /**
   * Sends an email using Mailgun
   */
  async sendEmail(emailDto: EmailDto): Promise<boolean> {
    if (!this.initialized) {
      this.logger.warn('Mailgun not initialized. Cannot send email.');
      return false;
    }

    try {
      const { to, cc, bcc, subject, text, html, attachments } = emailDto;

      const options: MailgunMessageData = {
        from: `${this.fromName} <${this.fromEmail}>`,
        to: to
          .map((recipient) =>
            recipient.name
              ? `${recipient.name} <${recipient.email}>`
              : recipient.email,
          )
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
            .map((recipient) =>
              recipient.name
                ? `${recipient.name} <${recipient.email}>`
                : recipient.email,
            )
            .join(',')
          : '',
        bcc: bcc && bcc.length > 0
          ? bcc
            .map((recipient) =>
              recipient.name
                ? `${recipient.name} <${recipient.email}>`
                : recipient.email,
            )
            .join(',')
          : '',
        'o:testmode': 'no',
        'h:X-Mailgun-Variables': JSON.stringify({ system: 'qart' }),
      };

      const response = await this.mailgunService.createEmail(this.domain, options);

      this.logger.debug(`Email sent successfully: ${response.id}`);
      return true;
    } catch (error) {
      this.logger.error(`Error sending email: ${error.message}`, error.stack);
      return false;
    }
  }

  /**
   * Sends an email using a template
   */
  async sendTemplateEmail(templateDto: EmailTemplateDto): Promise<boolean> {
    if (!this.initialized) {
      this.logger.warn('Mailgun not initialized. Cannot send template email.');
      return false;
    }

    try {
      const { to, templateName, templateVars } = templateDto;

      const options: MailgunMessageData = {
        from: `${this.fromName} <${this.fromEmail}>`,
        to: to
          .map((recipient) =>
            recipient.name
              ? `${recipient.name} <${recipient.email}>`
              : recipient.email,
          )
          .join(','),
        template: templateName,
        text: '',
        html: '',
        attachment: '',
        cc: '',
        bcc: '',
        'o:testmode': 'no',
        'h:X-Mailgun-Variables': JSON.stringify({ ...templateVars, system: 'qart' }),
      };

      const response = await this.mailgunService.createEmail(this.domain, options);

      this.logger.debug(`Template email sent successfully: ${response.id}`);
      return true;
    } catch (error) {
      this.logger.error(
        `Error sending template email: ${error.message}`,
        error.stack,
      );
      return false;
    }
  }

  /**
   * Sends a system notification email to administrators
   */
  async sendSystemEmail(
    subject: string,
    message: string,
    error?: Error,
  ): Promise<boolean> {
    const adminEmail =
      this.configService.get<string>('ADMIN_EMAIL') || this.fromEmail;

    const emailContent = `
      <h2>System Notification</h2>
      <p>${message}</p>
      ${error
        ? `
        <h3>Error Details</h3>
        <p><strong>Message:</strong> ${error.message}</p>
        <pre>${error.stack}</pre>
      `
        : ''
      }
    `;

    const options: MailgunMessageData = {
      from: `${this.fromName} <${this.fromEmail}>`,
      to: adminEmail,
      subject: `[SYSTEM] ${subject}`,
      text: message + (error ? `\n\nError: ${error.message}\n${error.stack}` : ''),
      html: emailContent,
      attachment: '',
      cc: '',
      bcc: '',
      'o:testmode': 'no',
      'h:X-Mailgun-Variables': JSON.stringify({ system: 'qart', type: 'system_notification' }),
    };

    try {
      const response = await this.mailgunService.createEmail(this.domain, options);
      this.logger.debug(`System email sent successfully: ${response.id}`);
      return true;
    } catch (error) {
      this.logger.error(`Error sending system email: ${error.message}`, error.stack);
      return false;
    }
  }

  /**
   * Send a verification email to a user
   */
  async sendVerificationEmail(
    userEmail: string,
    userName: string,
    verificationToken: string,
  ): Promise<boolean> {
    const verificationUrl = `${this.configService.get<string>('APP_URL') || 'http://localhost:3000'}/verify-email?token=${verificationToken}`;

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

    const options: MailgunMessageData = {
      from: `${this.fromName} <${this.fromEmail}>`,
      to: userEmail,
      subject: 'Verify Your Email Address',
      text: `Hello ${userName},\n\nThank you for signing up! Please verify your email address by visiting this URL: ${verificationUrl}\n\nThis link will expire in 24 hours.\n\nIf you didn't create an account, you can safely ignore this email.`,
      html,
      attachment: '',
      cc: '',
      bcc: '',
      'o:testmode': 'no',
      'h:X-Mailgun-Variables': JSON.stringify({ system: 'qart', type: 'verification', user: userName }),
    };

    try {
      const response = await this.mailgunService.createEmail(this.domain, options);
      this.logger.debug(`Verification email sent successfully: ${response.id}`);
      return true;
    } catch (error) {
      this.logger.error(`Error sending verification email: ${error.message}`, error.stack);
      return false;
    }
  }

  /**
   * Send a password reset email
   */
  async sendPasswordResetEmail(
    userEmail: string,
    userName: string,
    resetToken: string,
  ): Promise<boolean> {
    const resetUrl = `${this.configService.get<string>('APP_URL') || 'http://localhost:3000'}/reset-password?token=${resetToken}`;

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

    const options: MailgunMessageData = {
      from: `${this.fromName} <${this.fromEmail}>`,
      to: userEmail,
      subject: 'Reset Your Password',
      text: `Hello ${userName},\n\nWe received a request to reset your password. Please visit this URL to create a new password: ${resetUrl}\n\nThis link will expire in 1 hour.\n\nIf you didn't request a password reset, you can safely ignore this email.`,
      html,
      attachment: '',
      cc: '',
      bcc: '',
      'o:testmode': 'no',
      'h:X-Mailgun-Variables': JSON.stringify({ system: 'qart', type: 'password_reset', user: userName }),
    };

    try {
      const response = await this.mailgunService.createEmail(this.domain, options);
      this.logger.debug(`Password reset email sent successfully: ${response.id}`);
      return true;
    } catch (error) {
      this.logger.error(`Error sending password reset email: ${error.message}`, error.stack);
      return false;
    }
  }

  /**
   * Send a welcome email after signup
   */
  async sendWelcomeEmail(
    userEmail: string,
    userName: string,
  ): Promise<boolean> {
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

    const options: MailgunMessageData = {
      from: `${this.fromName} <${this.fromEmail}>`,
      to: userEmail,
      subject: `Welcome to ${this.fromName}!`,
      text: `Hello ${userName},\n\nThank you for joining us! We're excited to have you on board.\n\nHere are a few things you can do to get started:\n- Complete your profile\n- Explore our features\n- Connect with other users\n\nIf you have any questions, please don't hesitate to contact our support team.\n\nBest regards,\nThe ${this.fromName} Team`,
      html,
      attachment: '',
      cc: '',
      bcc: '',
      'o:testmode': 'no',
      'h:X-Mailgun-Variables': JSON.stringify({ system: 'qart', type: 'welcome', user: userName }),
    };

    try {
      const response = await this.mailgunService.createEmail(this.domain, options);
      this.logger.debug(`Welcome email sent successfully: ${response.id}`);
      return true;
    } catch (error) {
      this.logger.error(`Error sending welcome email: ${error.message}`, error.stack);
      return false;
    }
  }
}
