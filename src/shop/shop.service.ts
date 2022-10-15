import { Injectable } from '@nestjs/common';
import { AddProductDto } from 'src/shop/dto/add-product.dto';
import { ShopItemInterface } from 'src/interfaces/shop';
import { ShopItem } from './shop-item.entity';
import { MulterDiskUploadedFiles } from 'src/interfaces/files';
import { storageDir } from 'src/utils/storage';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ShopService {
    filter(shopItem: ShopItem): ShopItemInterface {
        const { id, description, price, name } = shopItem;

        return { id, description, price, name };
    }

    async getItems(): Promise<ShopItemInterface[]> {
        return (await ShopItem.find()).map(this.filter);
    }

    async hasItem(name: string): Promise<boolean> {
        return (await this.getItems()).some((item) => item.name === name);
    }

    async getPrice(name: string): Promise<number> {
        return (await this.getItems()).find((item) => item.name === name).price;
    }

    async getOneItem(id: string): Promise<ShopItem> {
        return await ShopItem.findOne({ where: { id: id } });
    }

    async addProduct(
        req: AddProductDto,
        files: MulterDiskUploadedFiles,
    ): Promise<ShopItemInterface> {
        const photo = files?.photo?.[0] ?? null;

        try {
            const shopItem = new ShopItem();
            shopItem.name = req.name;
            shopItem.description = req.description;
            shopItem.price = req.price;

            if (photo) {
                shopItem.photoFn = photo.filename;
            }

            await shopItem.save();

            return this.filter(shopItem);
        } catch (error1) {
            try {
                if (photo) {
                    fs.unlinkSync(
                        path.join(storageDir(), 'products-photos', photo.filename),
                    );
                }
            } catch (error2) { }

            throw error1;
        }
    }

    async getPhoto(id: string, res: any) {
        try {
            const one = await ShopItem.findOne({ where: { id } });
            if (!one) {
                throw new Error('No object found.');
            }

            if (!one.photoFn) {
                throw new Error('No photo in this entry.');
            }

            res.sendFile(one.photoFn, {
                root: path.join(storageDir(), 'product-photos'),
            });
        } catch (err) {
            res.json({
                error: err.message,
            });
        }
    }
}
