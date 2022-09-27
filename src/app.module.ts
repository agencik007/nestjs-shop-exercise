import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BasketController } from './basket/basket.controller';
import { BasketService } from './basket/basket.service';
import { DatabaseModule } from './database/database.module';
import { ShopController } from './shop/shop.controller';
import { ShopService } from './shop/shop.service';
import { UserController } from './user/user.controller';
import { UserModule } from './user/user.module';
import { UserService } from './user/user.service';

@Module({
  imports: [DatabaseModule, UserModule],
  controllers: [AppController, BasketController, ShopController, UserController],
  providers: [AppService, BasketService, ShopService, UserService],
})
export class AppModule {}
