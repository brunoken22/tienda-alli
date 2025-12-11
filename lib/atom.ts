import { atom } from "recoil";

export type TypeCompra = {
  cantidad: number;
  id: string;
  title: string;
  price: number;
  img: string;
  size: string;
};
export const shoppingCart = atom({
  key: "shoppingCart",
  default: [] as TypeCompra[],
});

export const openShoppingCart = atom({
  key: "openShoppingCart",
  default: false,
});
