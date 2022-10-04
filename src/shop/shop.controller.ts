import { Controller, Get, Inject, Param, ParseIntPipe } from '@nestjs/common';
import { ShopItemInterface } from 'src/interfaces/shop';
import { CheckAgePipe } from 'src/pipes/check-age.pipe';
import { ShopService } from './shop.service';

@Controller('shop')
export class ShopController {
    constructor(
        @Inject(ShopService) private shopService: ShopService,
    ){

    }

    @Get('/')
    getShopList(): Promise<ShopItemInterface[]> {
        return this.shopService.getItems();
    }

    @Get('/test/:age')
    test(
        @Param('age', new CheckAgePipe({
            minAge: 21,
        })) age: number,
    ) {
        console.log(typeof age, age);
        return '';
    }
}
