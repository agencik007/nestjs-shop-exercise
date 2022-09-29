export type AddProductToBasketResponse =
  | {
      isSuccess: true;
      id: string;
    }
  | {
      isSuccess: false;
    };

export interface RemoveProductFromBasketResponse {
  isSuccess: boolean;
}

export interface OneItemInBasket {
  id: string;
  count: number;
}

export type ListProductsInBasketResponse = OneItemInBasket[];

export type GetTotalPriceOfBasketResponse = number;

export interface GetBasketStatsResponse {
  itemInBasketAvgPrice: number;
  basketAvgTotalPrice: number;
}
