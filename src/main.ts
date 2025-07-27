console.log('Script started - outside any function');

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from './config/prisma.service';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { CustomValidationPipe } from './pipes/custom-validation.pipe';
import { AllExceptionsFilter } from './filters/all-exceptions.filter';
import * as express from 'express';
async function bootstrap() {
  console.log('Starting application bootstrap...');
  try {
    console.log('Creating NestJS application instance...');
    const app = await NestFactory.create<NestExpressApplication>(AppModule, {
      logger: ['error', 'warn', 'log', 'debug', 'verbose', 'fatal'],
      rawBody: true, // Enable raw body for webhooks
    });

    console.log('Application instance created successfully.');

    console.log('Getting ConfigService...');
    const configService = app.get(ConfigService);

    console.log('Getting PrismaService...');
    const prismaService = app.get(PrismaService);
    console.log('Services retrieved successfully.');

    // Configure raw body middleware for webhooks BEFORE other middleware
    app.use('/api/webhooks/stripe', express.raw({ type: 'application/json' }));

    // Apply global exception filter for stack traces
    app.useGlobalFilters(new AllExceptionsFilter());

    // Enable graceful shutdown
    prismaService.enableShutdownHooks();



    // Setup view engine
    app.setBaseViewsDir(join(__dirname, '..', 'src/views'));
    app.setViewEngine('hbs');

    // Apply global pipes
    /*app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: false,
      }),
    ); */

    app.useGlobalPipes(new CustomValidationPipe());

    // Security
    app.use(
      helmet({
        contentSecurityPolicy: {
          directives: {
            defaultSrc: [`'self'`],
            styleSrc: [`'self'`, `'unsafe-inline'`, 'https://cdn.jsdelivr.net'],
            scriptSrc: [`'self'`, `'unsafe-inline'`, 'https://cdn.jsdelivr.net'],
            imgSrc: [`'self'`, 'data:'],
            connectSrc: [`'self'`],
            fontSrc: [`'self'`, 'https://cdn.jsdelivr.net'],
          },
        },
      }),
    );
    app.enableCors({
      origin: ['https://apps.tvxlabs.com', 'http://localhost:3000', 'http://localhost:8080', '*'],
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      credentials: true,
      allowedHeaders: 'Content-Type,Accept,Authorization',
    });

    // Set global prefix for API routes
    app.setGlobalPrefix('api', { exclude: ['reset-password'] });


    // Swagger documentation
    const config = new DocumentBuilder()
      .setTitle('Doctopus API')
      .setDescription('Modern NestJS API with comprehensive features')
      .setVersion('1.0')
      .addServer('http://localhost:3000', 'Local Development')
      .addServer('https://tree2u.kobotogether.com', 'Production')
      .addBearerAuth({
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Enter JWT token',
        in: 'header',
      })
      .addTag('auth', 'Authentication endpoints')
      .addTag('users', 'User management endpoints')
      .addTag('files', 'File management endpoints')
      .addTag('websockets', 'WebSocket communication')
      .build();

    const document = SwaggerModule.createDocument(app, config);

    // Write the OpenAPI JSON to file for SDK generation
    const fs = require('fs');
    const path = require('path');
    const openapiDir = path.resolve(process.cwd(), 'openapi');
    if (!fs.existsSync(openapiDir)) {
      fs.mkdirSync(openapiDir, { recursive: true });
      console.log(`Created directory: ${openapiDir}`);
    }
    const outputPath = path.resolve(openapiDir, 'swagger.json');
    fs.writeFileSync(outputPath, JSON.stringify(document, null, 2));
    console.log(`Wrote Swagger JSON to: ${outputPath}`);

    SwaggerModule.setup('api', app, document);

    // Start server
    const port = configService.get<number>('PORT', 3000);
    console.log(`Attempting to start server on port ${port}...`);
    await app.listen(port);
    console.log(`Application is running on: http://localhost:${port}`);
    console.log(`API documentation available at: http://localhost:${port}/api`);
  } catch (error) {
    console.error('Application failed to start:', error);
    process.exit(1);
  }
}

bootstrap();
