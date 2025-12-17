import { Module } from '@nestjs/common';
import { CartCheckoutController } from './cart-checkout.controller';
import { CartCheckoutService } from './cart-checkout.service';
import { CheckoutService } from './checkout.service';
import { SavedItemsService } from './saved-items.service';
import { PrismaService } from '../../config/prisma.service';
import { NotificationsModule } from '../notifications/notifications.module';
import { UsersModule } from '../users/users.module';
import { OrderFulfillmentModule } from '../order-fulfillment/order-fulfillment.module';

@Module({
  imports: [NotificationsModule, UsersModule, OrderFulfillmentModule],
  controllers: [CartCheckoutController],
  providers: [
    CartCheckoutService,
    CheckoutService,
    SavedItemsService,
    PrismaService,
  ],
  exports: [CartCheckoutService, CheckoutService, SavedItemsService],
})
export class CartCheckoutModule {}
