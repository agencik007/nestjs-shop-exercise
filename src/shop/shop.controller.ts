import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Res,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { AddProductDto } from 'src/shop/dto/add-product.dto';
import { ShopItemInterface } from 'src/interfaces/shop';
import { CheckAgePipe } from 'src/pipes/check-age.pipe';
import { ShopService } from './shop.service';
import * as path from 'path';
import { multerStorage, storageDir } from 'src/utils/storage';
import { MulterDiskUploadedFiles } from 'src/interfaces/files';

@Controller('shop')
export class ShopController {
  constructor(@Inject(ShopService) private shopService: ShopService) {}

  @Get('/')
  getShopList(): Promise<ShopItemInterface[]> {
    return this.shopService.getItems();
  }

  @Get('/test/:age')
  test(
    @Param(
      'age',
      new CheckAgePipe({
        minAge: 21,
      }),
    )
    age: number,
  ) {
    console.log(typeof age, age);
    return '';
  }

  @Post('/')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        {
          name: 'photo',
          maxCount: 1,
        },
      ],
      {
        storage: multerStorage(path.join(storageDir(), 'product-photos')),
      },
    ),
  )
  addProduct(
    @Body() req: AddProductDto,
    @UploadedFiles() files: MulterDiskUploadedFiles,
  ): Promise<ShopItemInterface> {
    return this.shopService.addProduct(req, files);
  }

  @Get('/photo/:id')
  async getPhoto(@Param('id') id: string, @Res() res: any): Promise<any> {
    return this.shopService.getPhoto(id, res);
  }
}
