import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './config/config.module';
import { DatabaseModule } from './config/database.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { HealthModule } from './modules/health/health.module';
import { StorageModule } from './modules/storage/storage.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { JobsModule } from './modules/jobs/jobs.module';
import { PgNotifyModule } from './modules/pg-notify/pg-notify.module';
import { WebSocketModule } from './modules/websockets/websocket.module';
import { SubscriptionsModule } from './modules/subscriptions/subscriptions.module';
import { AppManagementModule } from './modules/app-management/app-management.module';
import { PrivacyPoliciesModule } from './modules/privacy-policies/privacy-policies.module';
import { LoggerModule } from 'nestjs-pino';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        transport: {
          target: 'pino-pretty',
          options: {
            singleLine: false,
          },
        },
        serializers: {
          req: (req) => {
            return {
              id: req.id,
              method: req.method,
              url: req.url,
              query: req.query,
              params: req.params,
              //headers: req.headers,
              body: req.raw.body, // Log request body
              remoteAddress: req.remoteAddress,
              remotePort: req.remotePort
            };
          },
          res: (res) => {
            return {
              statusCode: res.statusCode,
              //headers: res.headers,
              body: res.raw.locals?.body, // Log response body
            };
          }
        },
      },
    }),
    ConfigModule,
    DatabaseModule,
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,
          limit: 100,
        },
      ],
    }),
    UsersModule,
    AuthModule,
    HealthModule,
    StorageModule,
    NotificationsModule,
    JobsModule,
    PgNotifyModule,
    WebSocketModule,
    SubscriptionsModule,
    AppManagementModule,
    PrivacyPoliciesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
