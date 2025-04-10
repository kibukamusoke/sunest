# Sunest - Modern NestJS Backend Boilerplate

<p align="center">
  <img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" />
</p>

<p align="center">A production-ready NestJS backend with advanced features for rapid application development.</p>

<p align="center">
  <a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
  <a href="LICENSE" target="_blank"><img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License" /></a>
  <a href="https://nodejs.org" target="_blank"><img src="https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg" alt="Node.js Version" /></a>
  <a href="https://www.typescriptlang.org" target="_blank"><img src="https://img.shields.io/badge/typescript-%3E%3D5.0.0-blue.svg" alt="TypeScript Version" /></a>
</p>

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Getting Started](#getting-started)
- [Core Modules](#core-modules)
  - [Authentication](#authentication)
  - [S3 Storage](#s3-storage)
  - [Notification System](#notification-system)
  - [Scheduled Jobs](#scheduled-jobs)
  - [PostgreSQL NOTIFY/LISTEN](#postgresql-notifylisten)
- [Configuration](#configuration)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Deployment Options](#deployment-options)
- [Contributing](#contributing)
- [License](#license)

## Overview

Sunest provides a robust foundation for building secure, maintainable, and scalable backend applications. It follows modern best practices and integrates essential tools and utilities to accelerate development while maintaining code quality.

## Features

- **Authentication & Authorization**
  - JWT authentication with refresh token rotation
  - Role-based access control (RBAC)
  - Support for OAuth providers (Google, GitHub)
  - Password reset with secure, time-limited tokens
  - Email verification flow
  - Built-in password reset UI

- **Real-time Communications**
  - WebSocket integration for live updates
  - Client subscription system for specific events
  - Broadcast and targeted message support
  - Secure authentication for WebSocket connections
  - Support for chat, notifications, and live updates

- **Database Integration**
  - PostgreSQL with Prisma ORM
  - Type-safe database access
  - Migration and seeding support
  - Automatic audit logging

- **S3 File Storage**
  - Direct client-to-S3 uploads via presigned URLs
  - File tracking in database
  - User-owned files with permission control
  - Efficient file management

- **Notification System**
  - Firebase Cloud Messaging integration for mobile push notifications
  - Telegram Bot integration for team alerts and monitoring
  - Mailgun email service for transactional emails
  - Unified service API for multiple channels
  - Support for different notification types (info, success, warning, error)
  - System alerts for critical events
  - Email templates for common user flows

- **Background Processing**
  - Scheduled jobs with flexible cron expressions
  - PostgreSQL NOTIFY/LISTEN for real-time events
  - Reliable task execution with error handling
  - Database-triggered notifications

- **API Documentation**
  - OpenAPI/Swagger UI at `/api`
  - Request validation with class-validator
  - Automatic SDK generation

- **Security**
  - Helmet for HTTP headers
  - Rate limiting
  - CORS configuration
  - CSRF protection

- **Observability**
  - Health check endpoints
  - Structured error handling
  - Request logging
  - Performance metrics

- **Developer Experience**
  - Docker and docker-compose for local development
  - Environment validation with Joi
  - ESLint and Prettier for code quality
  - Hot reloading in development

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm or yarn
- PostgreSQL database (configured and accessible)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   ```bash
   # Copy the example env file
   cp .env.example .env
   # Edit the .env file with your settings
   ```

   The most important configurations to update:
   - `DATABASE_URL`: Connection string to your PostgreSQL database
   - `JWT_SECRET`: A secure random string for JWT token signing
   - AWS S3 credentials (for file storage)
   - Notification service credentials (if using)

### Development

The application assumes you already have a PostgreSQL database set up and properly configured in your `.env` file.

#### Running the Application

```bash
# Generate Prisma client types from schema
npm run prisma:generate

# Start the development server with hot-reload
npm run start:dev

# Or start the server in debug mode
npm run start:debug

# For production builds
npm run build
npm run start:prod

# Launch Prisma Studio (database management UI)
npm run prisma:studio
```

#### API Endpoints

The application provides a comprehensive set of API endpoints:

- **Authentication**: Registration, login, logout, refresh token
- **User Management**: Profile updates, avatar settings
- **File Storage**: S3 integration with presigned URLs
- **Notifications**: Various notification channels (email, push, Telegram)
- **Real-time Communication**: WebSocket integration

All endpoints are documented using Swagger and available at the `/api` route when the application is running.

### Building for Production

```bash
# Build the application for production
npm run build

# Start the production server
npm run start:prod
```

### Code Quality and Testing

```bash
# Run linting
npm run lint

# Run unit tests
npm run test

# Run tests with coverage
npm run test:cov

# Run end-to-end tests
npm run test:e2e
```

## Core Modules

### Authentication

The authentication system provides a complete solution for user identity and access management.

#### Key Features

- Secure JWT tokens with refresh capability
- Local authentication strategy
- Database preparation for OAuth providers (Google, GitHub)
- Role-based permissions
- Account recovery flows
- Email verification with tokens
- Password reset with secure, time-limited tokens
- User profiles with optional avatar support

```typescript
// Auth endpoints
POST /auth/register          // Register with email, password, displayName and optional avatar
POST /auth/login             // Login with credentials
POST /auth/refresh           // Refresh access token
POST /auth/logout            // Logout (invalidate refresh token)
GET /auth/profile            // Get current user profile
POST /auth/forgot-password   // Request password reset
POST /auth/reset-password    // Reset password with token
GET /auth/verify-email       // Verify email with token

// User endpoints
GET /users/:id               // Get user by ID
PATCH /users/profile         // Update user profile (displayName, avatar)
```

#### Password Reset Flow

The application includes a complete password reset flow:

1. **Forgot Password Request**:
   - User submits their email via client application to `/auth/forgot-password`
   - System generates a secure, time-limited token (expires in 1 hour)
   - Email with reset link is sent to the user

2. **Reset Password UI**:
   - User clicks the link in the email which directs to the built-in reset password page
   - The link format is: `http://your-app-url/reset-password?token={token}`
   - The application provides a responsive form UI for entering a new password

3. **Password Update**:
   - User submits new password via the form
   - System verifies the token is valid and not expired
   - Password is securely updated if token is valid
   - User is redirected to login page

4. **Security Features**:
   - Tokens are single-use and expire after 1 hour
   - The forgot password endpoint doesn't reveal if an email exists (prevents enumeration attacks)
   - All reset attempts are logged for security monitoring
   - Password strength requirements are enforced

### WebSockets

The application includes a complete WebSocket system for real-time communication.

#### Key Features

- Real-time bidirectional communication
- Support for room-based messaging
- Secure authentication via JWT
- Built-in event system
- Support for private messaging and broadcasts

```typescript
// Client connection (browser)
const socket = io('http://your-server:3000', {
  extraHeaders: {
    Authorization: 'Bearer your-jwt-token'
  }
});

// Listen for messages
socket.on('message', (data) => {
  console.log('Received message:', data);
});

// Join a room (like a chat room or user-specific channel)
socket.emit('join', { room: 'roomName' });

// Send a message to a room
socket.emit('sendMessage', { 
  room: 'roomName',
  message: 'Hello everyone!'
});

// Send a private message to a specific user
socket.emit('sendPrivate', { 
  userId: 'user-uuid',
  message: 'Hello, this is private'
});
```

#### Server-side Events

The server can broadcast messages to clients in response to various events:

```typescript
// Broadcast a message to all clients in a room
webSocketService.broadcastToRoom('roomName', 'event', { 
  content: 'This is a broadcast message',
  timestamp: new Date()
});

// Send a message to a specific user
webSocketService.sendToUser('user-uuid', 'notification', {
  type: 'new_message',
  content: 'You have a new message',
  fromUser: 'sender-name'
});

// Broadcast to all connected clients
webSocketService.broadcastToAll('system', {
  type: 'maintenance',
  message: 'System will be down for maintenance in 5 minutes'
});
```

#### Integration with Other Features

WebSockets integrate with other system features:

- **Notifications**: Real-time delivery of notifications
- **Chat System**: Support for individual and group chats
- **Live Updates**: Inform clients about data changes
- **Collaboration**: Real-time document editing or status updates
- **Monitoring**: Send system status and health updates

### S3 Storage

The storage module provides a secure way to handle file uploads directly to S3 without passing through your server.

```typescript
// Get a presigned URL for uploading
const { presignedUrl, fileId } = await storageService.createPresignedUploadUrl(
  'my-image.jpg',
  'image/jpeg'
);

// Client uploads directly to the URL with appropriate headers
fetch(presignedUrl, {
  method: 'PUT',
  body: file,
  headers: { 'Content-Type': 'image/jpeg' }
});

// After upload completes, confirm it on the server
await storageService.confirmFileUpload(fileId);

// Get a download URL
const { presignedUrl } = await storageService.createPresignedDownloadUrl(fileId);
```

### Notification System

The application includes an integrated notification system with support for multiple channels.

#### Email with Mailgun

Send transactional emails using Mailgun:

```typescript
// Send a simple email
await notificationService.sendEmail({
  to: [{ email: 'user@example.com', name: 'John Doe' }],
  subject: 'Welcome to our platform',
  text: 'Thank you for signing up!',
  html: '<h1>Welcome!</h1><p>Thank you for signing up!</p>'
});

// Send a template email
await notificationService.sendTemplateEmail({
  to: [{ email: 'user@example.com', name: 'John Doe' }],
  templateName: 'welcome-email',
  templateVars: { name: 'John', accountType: 'premium' }
});

// Use pre-built email flows
await notificationService.sendVerificationEmail(
  'user@example.com',
  'John Doe',
  'verification-token-123'
);
```

#### Firebase Cloud Messaging

Send push notifications to mobile devices:

```typescript
// Send to specific devices
await notificationService.sendFirebaseNotification({
  title: 'New Update Available',
  body: 'Version 2.0 is now available with exciting features!',
  tokens: ['device_token_1', 'device_token_2'],
  type: NotificationType.INFO,
  data: { version: '2.0', url: '/updates' }
});

// Send to a topic
await notificationService.sendFirebaseNotification({
  title: 'Maintenance Scheduled',
  body: 'Our systems will be down for maintenance on Saturday',
  topic: 'all_users',
  type: NotificationType.WARNING
});
```

#### Telegram Notifications

Send operational alerts and monitoring notifications:

```typescript
// Simple text message
await notificationService.sendTelegramNotification({
  message: '<b>Database Backup</b>\nBackup completed successfully.',
});

// System alerts for critical events
await notificationService.sendSystemAlert(
  'API rate limit exceeded',
  new Error('Too many requests from client X')
);
```

### Scheduled Jobs

The application includes a robust job scheduling system for running background tasks at specified intervals.

#### Declarative Scheduled Jobs

```typescript
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression, Timeout } from '@nestjs/schedule';

@Injectable()
export class TasksService {
  // Run once when the application starts (after 5 seconds)
  @Timeout(5000)
  handleStartup() {
    console.log('Application has started');
  }

  // Run every 10 seconds
  @Cron('*/10 * * * * *')
  handleIntervalJob() {
    console.log('Task running every 10 seconds');
  }

  // Run at midnight every day
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  handleMidnightJob() {
    console.log('Task running at midnight');
  }
}
```

#### Dynamic Job Management

```typescript
// Inject the jobs service
constructor(private jobsService: JobsService) {}

// Get list of all scheduled jobs
const jobs = jobsService.listJobs();
console.log('Current jobs:', jobs);

// Register a new job dynamically
jobsService.registerDynamicJob(
  'data-export',       // unique job name
  '0 3 * * *',         // cron expression (3am daily)
  async () => {
    // Job implementation
    await exportDataToS3();
  }
);

// Remove a dynamic job
jobsService.removeDynamicJob('data-export');
```

### PostgreSQL NOTIFY/LISTEN

The application supports real-time events from PostgreSQL using the NOTIFY/LISTEN mechanism.

#### Event Handling

```typescript
// Inject the service
constructor(private pgNotifyService: PgNotifyService) {}

// Register a handler for a specific notification channel
pgNotifyService.registerHandler(
  NotificationChannel.USER_CREATED,
  async (payload) => {
    console.log(`New user created: ${payload.email}`);
    await sendWelcomeEmail(payload.email);
  }
);

// Manually emit a notification (for testing)
await pgNotifyService.emitNotification(
  NotificationChannel.SYSTEM_EVENT, 
  {
    event: 'maintenance',
    severity: 'info',
    message: 'System maintenance scheduled',
    timestamp: new Date().toISOString()
  }
);
```

#### Database Integration

To set up database triggers that emit notifications:

1. Apply the provided trigger functions from `prisma/triggers.sql`
2. Register handlers in your application code to respond to events

Example SQL trigger:

```sql
-- Function to emit user_created notifications
CREATE OR REPLACE FUNCTION notify_user_created()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM pg_notify('user_created', json_build_object(
    'id', NEW.id,
    'email', NEW.email,
    'createdAt', NEW.created_at
  )::text);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for user creation
CREATE TRIGGER user_created_trigger
AFTER INSERT ON "User"
FOR EACH ROW
EXECUTE FUNCTION notify_user_created();
```

## Configuration

The application uses environment variables for configuration. Create a `.env` file based on the provided `.env.example`:

```dotenv
# PostgreSQL Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/sunest?schema=public"

# Application
PORT=3000
NODE_ENV=development

# Authentication
JWT_SECRET="your-secret-key-change-in-production"
JWT_EXPIRATION=3600
JWT_REFRESH_EXPIRATION=86400

# S3 Storage
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-access-key-id
AWS_SECRET_ACCESS_KEY=your-secret-access-key
AWS_S3_BUCKET=your-bucket-name
AWS_PRESIGNED_URL_EXPIRES=900

# Firebase Configuration
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="your-private-key"
FIREBASE_CLIENT_EMAIL=your-client-email@example.com
FIREBASE_DATABASE_URL=https://your-project-id.firebaseio.com

# Telegram Configuration
TELEGRAM_BOT_TOKEN=your-bot-token
TELEGRAM_CHAT_ID=your-chat-id

# Mailgun Configuration
MAILGUN_API_KEY=your-mailgun-api-key
MAILGUN_DOMAIN=your-domain.com
MAILGUN_FROM_EMAIL=noreply@your-domain.com
MAILGUN_FROM_NAME=Your App Name

# OAuth (Prepared but not implemented yet)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback

GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
GITHUB_CALLBACK_URL=http://localhost:3000/auth/github/callback
```

All external services (Firebase, Telegram, Mailgun, OAuth) will initialize only if their respective configuration is present, making them optional dependencies.

## API Documentation

Once the application is running, visit:
- API documentation: http://localhost:3000/api

### OpenAPI and SDK Generation

The application automatically generates OpenAPI 3.0 specifications that can be used to create client SDKs for various platforms. The Swagger document is generated at startup and saved to `src/openapi/swagger.json`.

#### Available SDK Generation Scripts

```bash
# Generate OpenAPI document by starting the application
npm run openapi:generate

# Generate Angular SDK (TypeScript)
npm run openapi:angular

# Generate React SDK (TypeScript with Axios)
npm run openapi:react

# Generate TypeScript SDK (Generic)
npm run openapi:typescript

# Generate Flutter SDK (Dart)
npm run openapi:flutter

# Generate all SDKs at once
npm run generate:all-sdks
```

#### SDK Requirements

- Angular SDK: Angular 17+
- React SDK: React with Axios for API calls
- TypeScript SDK: Any TypeScript project with Axios
- Flutter SDK: Flutter with Dio HTTP client

#### Custom SDK Generation

You can customize the SDK generation by modifying the configuration in `src/openapi/openapi-generator-config.json`.

#### SDK Integration Examples

See the [Using SDKs Guide](src/openapi/using-sdks.md) for detailed examples of how to integrate the generated SDKs with Angular, React, TypeScript, and Flutter applications.

## Project Structure

```
src/
├── modules/           # Feature modules
│   ├── auth/          # Authentication functionality
│   ├── users/         # User management
│   ├── storage/       # File storage abstraction
│   ├── notifications/ # Notification services
│   ├── jobs/          # Scheduled jobs
│   ├── pg-notify/     # PostgreSQL NOTIFY/LISTEN
│   └── health/        # Health checks
├── common/            # Shared utilities
│   ├── guards/        # Auth guards
│   ├── decorators/    # Custom decorators
│   ├── interceptors/  # Response transformers
│   ├── filters/       # Exception filters
│   └── pipes/         # Validation pipes
├── config/            # Environment configuration
├── prisma/            # Database schema and migrations
│   ├── schema.prisma
│   ├── migrations/
│   └── triggers.sql   # PostgreSQL notification triggers
└── main.ts            # Application entry point
```

## Deployment Options

- **Docker**: Use the included Dockerfile for containerized deployment
- **Kubernetes**: Easily configurable for k8s deployment
- **Serverless**: Compatible with serverless platforms with minimal adaptation

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Planned Enhancements

The following features are planned for future releases:

### OAuth Integration

The database schema and environment configurations are already prepared for OAuth integration. Implementing OAuth providers would involve:

1. **Installing passport OAuth packages**:
   ```bash
   npm install --save passport-google-oauth20 passport-github2
   ```

2. **Creating OAuth strategies**:
   - Implementing `GoogleStrategy` and `GithubStrategy`
   - Adding callback controllers for OAuth redirects
   - Handling user creation/retrieval based on provider ID

3. **Adding frontend login buttons**:
   - Adding OAuth login buttons to the frontend
   - Handling OAuth redirects and callbacks

### Advanced Avatar Management

The current implementation supports avatar URLs. Future enhancements could include:

1. **Direct avatar uploads**:
   - Using the S3 storage module for avatar uploads
   - Adding image processing for different sizes
   - Implementing cropping and resizing

2. **Default avatars**:
   - Generating initials-based avatars
   - Providing a set of default avatar options

## License

[MIT License](LICENSE)# sunest
# sunest
#   s u n e s t  
 # sunest
