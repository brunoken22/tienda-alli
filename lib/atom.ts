import {atom} from 'recoil';
// import {TypePropsProduct} from '../types';
type typeCompra = {
  cantidad: number;
  id: string;
  title: string;
  price: number;
};
export const shoppingCart = atom({
  key: 'shoppingCart',
  default: [] as typeCompra[],
});

export const openShoppingCart = atom({
  key: 'openShoppingCart',
  default: false,
});
