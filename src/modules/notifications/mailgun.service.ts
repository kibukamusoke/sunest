import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as FormData from 'form-data';
import Mailgun from 'mailgun.js';
import { EmailDto, EmailTemplateDto } from './dto/email.dto';

@Injectable()
export class MailgunService implements OnModuleInit {
  private readonly logger = new Logger(MailgunService.name);
  private mailgun: any;
  private initialized = false;
  private domain: string;
  private fromEmail: string;
  private fromName: string;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    try {
      const apiKey = this.configService.get<string>('MAILGUN_API_KEY');
      this.domain = this.configService.get<string>('MAILGUN_DOMAIN') || '';
      this.fromEmail = this.configService.get<string>('MAILGUN_FROM_EMAIL') || 'noreply@example.com';
      this.fromName = this.configService.get<string>('MAILGUN_FROM_NAME') || 'App';
      
      if (!apiKey || !this.domain) {
        this.logger.warn('Mailgun configuration missing or incomplete. Email sending is disabled.');
        return;
      }

      const mailgun = new Mailgun(FormData);
      this.mailgun = mailgun.client({ username: 'api', key: apiKey });
      
      this.initialized = true;
      this.logger.log('Mailgun client initialized successfully');
    } catch (error) {
      this.logger.error(`Error initializing Mailgun: ${error.message}`, error.stack);
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
      
      const message: any = {
        from: `${this.fromName} <${this.fromEmail}>`,
        to: to.map(recipient => recipient.name ? `${recipient.name} <${recipient.email}>` : recipient.email).join(','),
        subject,
        text,
      };

      if (html) {
        message.html = html;
      }

      if (cc && cc.length > 0) {
        message.cc = cc.map(recipient => recipient.name ? `${recipient.name} <${recipient.email}>` : recipient.email).join(',');
      }

      if (bcc && bcc.length > 0) {
        message.bcc = bcc.map(recipient => recipient.name ? `${recipient.name} <${recipient.email}>` : recipient.email).join(',');
      }

      if (attachments && attachments.length > 0) {
        message.attachment = attachments.map(attachment => {
          const buffer = Buffer.from(attachment.data, 'base64');
          return {
            filename: attachment.filename,
            data: buffer,
          };
        });
      }

      const response = await this.mailgun.messages.create(this.domain, message);
      
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
      const { to, templateName, templateVars, subject } = templateDto;
      
      const message: any = {
        from: `${this.fromName} <${this.fromEmail}>`,
        to: to.map(recipient => recipient.name ? `${recipient.name} <${recipient.email}>` : recipient.email).join(','),
        template: templateName,
        subject: subject || '',
        'h:X-Mailgun-Variables': JSON.stringify(templateVars),
      };

      const response = await this.mailgun.messages.create(this.domain, message);
      
      this.logger.debug(`Template email sent successfully: ${response.id}`);
      return true;
    } catch (error) {
      this.logger.error(`Error sending template email: ${error.message}`, error.stack);
      return false;
    }
  }

  /**
   * Sends a system notification email to administrators
   */
  async sendSystemEmail(subject: string, message: string, error?: Error): Promise<boolean> {
    const adminEmail = this.configService.get<string>('ADMIN_EMAIL') || this.fromEmail;
    
    const emailContent = `
      <h2>System Notification</h2>
      <p>${message}</p>
      ${error ? `
        <h3>Error Details</h3>
        <p><strong>Message:</strong> ${error.message}</p>
        <pre>${error.stack}</pre>
      ` : ''}
    `;
    
    return this.sendEmail({
      to: [{ email: adminEmail }],
      subject: `[SYSTEM] ${subject}`,
      text: message + (error ? `\n\nError: ${error.message}\n${error.stack}` : ''),
      html: emailContent,
    });
  }

  /**
   * Send a verification email to a user
   */
  async sendVerificationEmail(userEmail: string, userName: string, verificationToken: string): Promise<boolean> {
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
    
    return this.sendEmail({
      to: [{ email: userEmail, name: userName }],
      subject: 'Verify Your Email Address',
      text: `Hello ${userName},\n\nThank you for signing up! Please verify your email address by visiting this URL: ${verificationUrl}\n\nThis link will expire in 24 hours.\n\nIf you didn't create an account, you can safely ignore this email.`,
      html,
    });
  }

  /**
   * Send a password reset email
   */
  async sendPasswordResetEmail(userEmail: string, userName: string, resetToken: string): Promise<boolean> {
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
    
    return this.sendEmail({
      to: [{ email: userEmail, name: userName }],
      subject: 'Reset Your Password',
      text: `Hello ${userName},\n\nWe received a request to reset your password. Please visit this URL to create a new password: ${resetUrl}\n\nThis link will expire in 1 hour.\n\nIf you didn't request a password reset, you can safely ignore this email.`,
      html,
    });
  }

  /**
   * Send a welcome email after signup
   */
  async sendWelcomeEmail(userEmail: string, userName: string): Promise<boolean> {
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
    
    return this.sendEmail({
      to: [{ email: userEmail, name: userName }],
      subject: `Welcome to ${this.fromName}!`,
      text: `Hello ${userName},\n\nThank you for joining us! We're excited to have you on board.\n\nHere are a few things you can do to get started:\n- Complete your profile\n- Explore our features\n- Connect with other users\n\nIf you have any questions, please don't hesitate to contact our support team.\n\nBest regards,\nThe ${this.fromName} Team`,
      html,
    });
  }
}