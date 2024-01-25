import {atom} from 'recoil';
// import {TypePropsProduct} from '../types';
export type TypeCompra = {
  cantidad: number;
  id: string;
  title: string;
  price: number;
  img: string;
};
export const shoppingCart = atom({
  key: 'shoppingCart',
  default: [] as TypeCompra[],
});

export const openShoppingCart = atom({
  key: 'openShoppingCart',
  default: false,
});
