import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { AddProductDto } from './dto/add-product.dto';
import {
  AddProductToBasketResponse,
  GetTotalPriceOfBasketResponse,
  RemoveProductFromBasketResponse,
} from '../interfaces/basket';
import { ShopService } from '../shop/shop.service';
import { ItemInBasket } from './item-in-basket.entity';

@Injectable()
export class BasketService {
  constructor(
    @Inject(forwardRef(() => ShopService)) private shopService: ShopService,
  ) {}

  async add(product: AddProductDto): Promise<AddProductToBasketResponse> {
  
    const {count, id} = product;

    const shopItem = await this.shopService.getOneItem(id)

    if (
      typeof id !== 'string' ||
      typeof count !== 'number' ||
      count < 1 ||
      id === '' ||
      !shopItem
    ) {
      return {
        isSuccess: false,
      };
    }

    const item = new ItemInBasket();
    item.count = count;

    await item.save();

    item.shopItem = shopItem;

    return {
      isSuccess: true,
      id: item.id,
    };
  }

  async remove(id: string): Promise<RemoveProductFromBasketResponse> {
    const item = await ItemInBasket.findOne({where: {id: id}});

    if (item) {
      await item.remove();

      return {
        isSuccess: true,
      }
    }

    return {
      isSuccess: false,
    }
  }

  async getAll(): Promise<ItemInBasket[]> {
    return ItemInBasket.find({
      relations: ['shopItem'],
    });
  }

  async clearBasket() {
    await ItemInBasket.delete({});
  }

  async getTotalPrice(): Promise<GetTotalPriceOfBasketResponse> {
    const items = await this.getAll();

    return (await Promise.all(items
      .map(async item => item.shopItem.price * item.count * 1.23)))
      .reduce((prev, curr) => prev + Number(curr.toFixed(2)), 0)
  }
}
