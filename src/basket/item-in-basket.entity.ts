import { ShopItem } from 'src/shop/shop-item.entity';
import { User } from 'src/user/user.entity';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class ItemInBasket extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  count: number;

  @ManyToOne((type) => ShopItem, (entity) => entity.itemsInBasket)
  @JoinColumn()
  shopItem: ShopItem;

  @ManyToOne((type) => User, (entity) => entity.itemsInBasket)
  @JoinColumn()
  user: User;
}
