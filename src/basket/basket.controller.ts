import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AddProductDto } from './dto/add-product.dto';
import { BasketService } from './basket.service';
import {
  AddProductToBasketResponse,
  GetBasketStatsResponse,
  GetTotalPriceOfBasketResponse,
  OneItemInBasket,
  RemoveProductFromBasketResponse,
} from '../interfaces/basket';
import { PasswordProtectGuard } from 'src/guards/password-protect.guard';
import { UsePassword } from 'src/decorators/use-password.decorator';
import { MyTimeoutInterceptor } from 'src/interceptors/my-timeout.interceptor';
import { MyCacheInterceptor } from 'src/interceptors/my-chace.interceptor';
import { UseCacheTime } from 'src/decorators/use-cache-time.decorator.ts';

@Controller('basket')
export class BasketController {
  constructor(@Inject(BasketService) private basketService: BasketService) {}

  @Post('/')
  addProductToBasket(
    @Body() item: AddProductDto): Promise<AddProductToBasketResponse> {
    return this.basketService.add(item);
  }

  @Delete('/all/:userId')
  removeAllProductsFromBasket(
    @Param('userId') userId: string,
  ) {
    this.basketService.clearBasket(userId);
  } 

  @Delete('/:itemInBasketId/:userId')
  removeProductFromBasket(
    @Param('itemInBasketId') itemInBasketId: string,
    @Param('userId') userId: string,
  ): Promise<RemoveProductFromBasketResponse> {
    return this.basketService.remove(itemInBasketId, userId);
  }
  
  @Get('/admin')
  @UseGuards(PasswordProtectGuard)
  @UsePassword('admin')
  getBasketForAdmin(): Promise<OneItemInBasket[]> {
    return this.basketService.getAllForAdmin();
  }

  @Get('/stats')
  @UseGuards(PasswordProtectGuard)
  @UsePassword('stats')
  @UseInterceptors(MyTimeoutInterceptor, MyCacheInterceptor)
  @UseCacheTime(60)
  getStats(): Promise<GetBasketStatsResponse> {
    return this.basketService.getStats() 
    // return new Promise(resolve => {});
  }

  @Get('/:userId')
  getBasket(
    @Param('userId') userId: string,
  ): Promise<OneItemInBasket[]> {
    return this.basketService.getAllForUser(userId);
  }

  @Get('/total-price/:userId')
  getTotalPriceOfBasket(
    @Param('userId') userId: string,
  ): Promise<GetTotalPriceOfBasketResponse> {
    return this.basketService.getTotalPrice(userId);
  }
}
