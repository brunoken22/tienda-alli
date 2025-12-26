import { ProductType } from "./product";

export type ShoppingCart = Omit<
  ProductType,
  "description" | "categories" | "imagesId" | "isActive" | "sizes"
> & {
  quantity: number;
  variantId: string;
  variantColorName: string;
  variantColorHex: string;
  variantSize: string;
};

export type ShoppingCartState = {
  cart: Omit<ShoppingCart, "variant">[];
  isOpen: boolean;
};
