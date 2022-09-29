import { BasketController } from './basket.controller';
import { BasketService } from './basket.service';
import { forwardRef, Module } from '@nestjs/common';
import { ShopModule } from '../shop/shop.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    forwardRef(() => ShopModule),
    forwardRef(() => UserModule)
  ],
  controllers: [BasketController],
  providers: [BasketService],
  exports: [BasketService],
})
export class BasketModule {}
