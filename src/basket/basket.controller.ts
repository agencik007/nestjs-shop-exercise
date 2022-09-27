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
  GetTotalPriceOfBasketResponse,
  ListProductsInBasketResponse,
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

  @Delete('/all')
  removeAllProductsFromBasket() {
    this.basketService.clearBasket();
  } 

  @Delete('/:id')
  removeProductFromBasket(
    @Param('id') id: string,
  ): Promise<RemoveProductFromBasketResponse> {
    return this.basketService.remove(id);
  }

  @Get('/')
  listProductsInBasket(): Promise<ListProductsInBasketResponse> {
    return this.basketService.getAll();
  }

  @Get('/total-price')
  getTotalPriceOfBasket(): Promise<GetTotalPriceOfBasketResponse> {
    return this.basketService.getTotalPrice();
  }
}
