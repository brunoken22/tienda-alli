'use client';

import { openShoppingCart, shoppingCart } from '@/lib/atom';
import { useRecoilState, useRecoilValue } from 'recoil';
import { useEffect, useState } from 'react';
import { Modal } from './modal';
import { TemplateShopppingCartProduct } from './templateProduct';
import { Button } from '@/components/ui/button';
import { X, ShoppingBag } from 'lucide-react';

export function ShoppingCart() {
  const [openShoppingCartValue, setOpenShoppingCartValue] = useRecoilState(openShoppingCart);
  const shoppingCartValue = useRecoilValue(shoppingCart);
  const [buysAll, setBuysAll] = useState<any>([]);
  const [openIsCompraLink, setOpenIsCompraLink] = useState(false);

  useEffect(() => {
    if (!shoppingCartValue.length) return;

    let buysMod = 'Hola, quisiera pedirte estas cosas';
    shoppingCartValue.map((item) => {
      buysMod += `
      🛒*${item.title}* id:${item.id} precio:${item.price} cantidad:${item.cantidad}
      `;
      return {
        id: item.id,
        cantidad: item.cantidad,
        precio: item.price,
        nombre: item.title,
      };
    });
    setBuysAll(buysMod);
  }, [shoppingCartValue]);
  const total = shoppingCartValue.reduce(
    (acumulador, objeto) => acumulador + objeto.price * (objeto.cantidad || 1),
    0
  );

  return (
    <>
      {/* Carrito */}
      <div className='fixed right-0 top-0 bottom-0 z-50 bg-white w-full max-w-md shadow-2xl transform transition-transform duration-300 ease-in-out'>
        <div className='flex flex-col h-full'>
          {/* Header */}
          <div className='flex items-center justify-between p-6 border-b bg-gradient-to-r from-purple-600 to-purple-700 text-white'>
            <div className='flex items-center space-x-2'>
              <ShoppingBag className='w-6 h-6' />
              <h2 className='text-xl font-bold'>Carrito</h2>
            </div>
            <Button
              variant='ghost'
              size='icon'
              onClick={() => setOpenShoppingCartValue(false)}
              className='text-white hover:bg-white/20'>
              <X className='w-5 h-5' />
            </Button>
          </div>

          {/* Contenido */}
          <div className='flex-1 overflow-y-auto p-4'>
            {shoppingCartValue.length > 0 ? (
              <div className='space-y-4'>
                {shoppingCartValue.map((item, position) => (
                  <TemplateShopppingCartProduct
                    key={`${item.id}-${item.talla}-${position}`}
                    id={item.id}
                    price={item.price}
                    title={item.title}
                    cantidad={item.cantidad}
                    img={item.img}
                    size={item.talla}
                  />
                ))}
              </div>
            ) : (
              <div className='flex flex-col items-center justify-center h-full text-center'>
                <ShoppingBag className='w-16 h-16 text-gray-300 mb-4' />
                <h3 className='text-lg font-medium text-gray-900 mb-2'>Tu carrito está vacío</h3>
                <p className='text-gray-500 mb-6'>Agrega algunos productos para comenzar</p>
                <Button onClick={() => setOpenShoppingCartValue(false)} variant='outline'>
                  Continuar comprando
                </Button>
              </div>
            )}
          </div>

          {/* Footer */}
          {shoppingCartValue.length > 0 && (
            <div className='border-t bg-gray-50 p-6 space-y-4'>
              <div className='flex items-center justify-between'>
                <span className='text-lg font-medium text-gray-900'>Total:</span>
                <span className='text-2xl font-bold text-purple-600'>
                  {total.toLocaleString('es-AR', {
                    style: 'currency',
                    currency: 'ARS',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })}
                </span>
              </div>
              <Button
                onClick={() => setOpenIsCompraLink(true)}
                className='w-full bg-purple-600 hover:bg-purple-700'
                size='lg'>
                Iniciar Compra
              </Button>
            </div>
          )}
        </div>
      </div>
      {openIsCompraLink && <Modal closeModal={(data) => setOpenIsCompraLink(data)} />}
    </>
  );
}
