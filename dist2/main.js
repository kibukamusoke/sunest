"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
console.log('Script started - outside any function');
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const swagger_1 = require("@nestjs/swagger");
const helmet_1 = require("helmet");
const config_1 = require("@nestjs/config");
const prisma_service_1 = require("./config/prisma.service");
const path_1 = require("path");
const custom_validation_pipe_1 = require("./pipes/custom-validation.pipe");
const all_exceptions_filter_1 = require("./filters/all-exceptions.filter");
const express = require("express");
async function bootstrap() {
    console.log('Starting application bootstrap...');
    try {
        console.log('Creating NestJS application instance...');
        const app = await core_1.NestFactory.create(app_module_1.AppModule, {
            logger: ['error', 'warn', 'log', 'debug', 'verbose', 'fatal'],
            rawBody: true,
        });
        console.log('Application instance created successfully.');
        app.disable('etag');
        app.use('/api', (_req, res, next) => {
            res.setHeader('Cache-Control', 'no-store');
            res.setHeader('Pragma', 'no-cache');
            res.setHeader('Expires', '0');
            next();
        });
        console.log('Getting ConfigService...');
        const configService = app.get(config_1.ConfigService);
        console.log('Getting PrismaService...');
        const prismaService = app.get(prisma_service_1.PrismaService);
        console.log('Services retrieved successfully.');
        app.use('/api/webhooks/stripe', express.raw({ type: 'application/json' }));
        app.useGlobalFilters(new all_exceptions_filter_1.AllExceptionsFilter());
        prismaService.enableShutdownHooks();
        app.setBaseViewsDir((0, path_1.join)(__dirname, '..', 'src/views'));
        app.setViewEngine('hbs');
        app.useGlobalPipes(new custom_validation_pipe_1.CustomValidationPipe());
        app.use((0, helmet_1.default)({
            contentSecurityPolicy: {
                directives: {
                    defaultSrc: [`'self'`],
                    styleSrc: [`'self'`, `'unsafe-inline'`, 'https://cdn.jsdelivr.net'],
                    scriptSrc: [
                        `'self'`,
                        `'unsafe-inline'`,
                        'https://cdn.jsdelivr.net',
                    ],
                    imgSrc: [`'self'`, 'data:'],
                    connectSrc: [`'self'`],
                    fontSrc: [`'self'`, 'https://cdn.jsdelivr.net'],
                },
            },
        }));
        app.enableCors({
            origin: [
                'https://hwadmin.tvxlabs.com',
                'https://hwadmin.intelibuy.my',
                'https://merchant.intelibuy.my',
                'https://www.intelibuy.my',
                'https://intelibuy.my',
                'http://localhost:3000',
                'http://localhost:8080',
                'http://localhost:8081',
                'http://localhost:8082',
                'http://localhost:8083',
                'http://localhost:3000',
                'http://localhost:3001',
                'http://localhost:3005',
            ],
            methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
            credentials: true,
            allowedHeaders: 'Content-Type,Accept,Authorization,x-session-id',
        });
        app.setGlobalPrefix('api', { exclude: ['reset-password'] });
        const config = new swagger_1.DocumentBuilder()
            .setTitle('HardwareWorld API')
            .setDescription('Modern NestJS API with comprehensive features')
            .setVersion('1.0')
            .addServer('http://localhost:3000', 'Local Development')
            .addServer('https://hardwareworld.tvxlabs.com', 'Production')
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
        const document = swagger_1.SwaggerModule.createDocument(app, config);
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
        swagger_1.SwaggerModule.setup('api', app, document);
        const port = configService.get('PORT', 3000);
        console.log(`Attempting to start server on port ${port}...`);
        await app.listen(port);
        console.log(`Application is running on: http://localhost:${port}`);
        console.log(`API documentation available at: http://localhost:${port}/api`);
    }
    catch (error) {
        console.error('Application failed to start:', error);
        process.exit(1);
    }
}
bootstrap();
//# sourceMappingURL=main.js.map