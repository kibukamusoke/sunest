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
import { MerchantManagementModule } from './modules/merchant-management/merchant-management.module';
import { ProductCatalogModule } from './modules/product-catalog/product-catalog.module';
import { InventoryManagementModule } from './modules/inventory-management/inventory-management.module';
import { SearchDiscoveryModule } from './modules/search-discovery/search-discovery.module';
import { RFQManagementModule } from './modules/rfq-management/rfq-management.module';
import { CartCheckoutModule } from './modules/cart-checkout/cart-checkout.module';
import { OrderFulfillmentModule } from './modules/order-fulfillment/order-fulfillment.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
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
    MerchantManagementModule,
    ProductCatalogModule,
    InventoryManagementModule,
    SearchDiscoveryModule,
    RFQManagementModule,
    CartCheckoutModule,
    OrderFulfillmentModule,
    AnalyticsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
