import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BasketController } from './basket/basket.controller';
import { BasketService } from './basket/basket.service';
import { DatabaseModule } from './database/database.module';
import { ShopController } from './shop/shop.controller';
import { ShopService } from './shop/shop.service';

@Module({
  imports: [DatabaseModule],
  controllers: [AppController, BasketController, ShopController],
  providers: [AppService, BasketService, ShopService],
})
export class AppModule {}
