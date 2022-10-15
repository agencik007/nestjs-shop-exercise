import { BasketController } from './basket.controller';
import { BasketService } from './basket.service';
import { forwardRef, Module } from '@nestjs/common';
import { ShopModule } from '../shop/shop.module';
import { UserModule } from 'src/user/user.module';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports: [
    forwardRef(() => ShopModule),
    forwardRef(() => UserModule),
    forwardRef(() => MailModule),
  ],
  controllers: [BasketController],
  providers: [BasketService],
  exports: [BasketService],
})
export class BasketModule {}
