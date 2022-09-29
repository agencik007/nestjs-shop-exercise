import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
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
  getBasketForAdmin(): Promise<OneItemInBasket[]> {
    return this.basketService.getAllForAdmin();
  }

  @Get('/stats')
  getStats(): Promise<GetBasketStatsResponse> {
    return this.basketService.getStats();
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
