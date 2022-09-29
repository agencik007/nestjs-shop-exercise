import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { AddProductDto } from './dto/add-product.dto';
import {
  AddProductToBasketResponse,
  GetBasketStatsResponse,
  GetTotalPriceOfBasketResponse,
  RemoveProductFromBasketResponse,
} from '../interfaces/basket';
import { ShopService } from '../shop/shop.service';
import { ItemInBasket } from './item-in-basket.entity';
import { UserService } from 'src/user/user.service';
import { DataSource } from 'typeorm';

@Injectable()
export class BasketService {
  constructor(
    private dataSource: DataSource,
    @Inject(forwardRef(() => ShopService)) private shopService: ShopService,
    @Inject(forwardRef(() => UserService)) private userService: UserService,
  ) {}

  async add(product: AddProductDto): Promise<AddProductToBasketResponse> {
  
    const {count, productId, userId} = product;

    const user = await this.userService.getOneUser(userId);

    const shopItem = await this.shopService.getOneItem(productId)

    if (
      typeof userId !== 'string' ||
      typeof productId !== 'string' ||
      typeof count !== 'number' ||
      count < 1 ||
      userId === '' ||
      productId === '' ||
      !shopItem ||
      !user
    ) {
      return {
        isSuccess: false,
      };
    }

    const item = new ItemInBasket();
    item.count = count;

    await item.save();

    item.shopItem = shopItem;
    item.user = user;

    await item.save();

    return {
      isSuccess: true,
      id: item.id,
    };
  }

  async remove(itemInBasketId: string, userId: string): Promise<RemoveProductFromBasketResponse> {
    
    const user = await this.userService.getOneUser(userId)
    
    if (!user) {
      throw new HttpException(
        'User not found',
        HttpStatus.NOT_FOUND)
    }

    const item = await ItemInBasket.findOne({where: {
      id: itemInBasketId,
      user: user.valueOf(),
    }});

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

  async getAllForUser(userId: string): Promise<ItemInBasket[]> {
    const user = await this.userService.getOneUser(userId)

    if (!user) {
      throw new Error('User not found')
    }

    return ItemInBasket.find({
      where: { 
        user: user.valueOf(),
      },
      relations: ['shopItem'],
    });
  }

  async getAllForAdmin(): Promise<ItemInBasket[]> {
    return ItemInBasket.find({
      relations: ['shopItem', 'user'],
    });
  }

  async clearBasket(userId: string) {
    const user = await this.userService.getOneUser(userId)

    if (!user) {
      throw new Error('User not found')
    }

    await ItemInBasket.delete({
      user: user.valueOf(),
    });
  }

  async getTotalPrice(userId: string): Promise<GetTotalPriceOfBasketResponse> {
    const items = await this.getAllForUser(userId);

    return (await Promise.all(items
      .map(async item => item.shopItem.price * item.count * 1.23)))
      .reduce((prev, curr) => prev + Number(curr.toFixed(2)), 0)
  }

  async getStats(): Promise<GetBasketStatsResponse> {
    
    const {itemInBasketAvgPrice} = await this.dataSource 
      .createQueryBuilder()
      .select('AVG(shopItem.price)', 'itemInBasketAvgPrice')
      .from(ItemInBasket, 'itemInBasket')
      .leftJoinAndSelect('itemInBasket.shopItem', 'shopItem')
      .getRawOne();

      const allItemsInBasket = await this.getAllForAdmin();

      const baskets: {
        [userId: string]: number;
      } = {}

      for (const oneItemInBasket of allItemsInBasket) {
        baskets[oneItemInBasket.user.id] = baskets[oneItemInBasket.user.id] || 0;

        baskets[oneItemInBasket.user.id] += oneItemInBasket.shopItem.price * oneItemInBasket.count * 1.23;
      }

      console.log(baskets);
      

      const basketValues = Object.values(baskets)

      const basketAvgTotalPrice = Number((basketValues.reduce((prev, curr) => prev + curr, 0) / basketValues.length).toFixed(2));

      return {
        itemInBasketAvgPrice,
        basketAvgTotalPrice,
      }
  }
}
