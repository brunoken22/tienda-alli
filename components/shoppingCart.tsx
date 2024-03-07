'use client';
import {openShoppingCart, shoppingCart} from '@/lib/atom';
import {useRecoilState, useRecoilValue} from 'recoil';
import React, {useEffect, useState} from 'react';
import {Modal} from './modal';
import {TemplateShopppingCartProduct} from './template';

export function ShoppingCart() {
  const [openShoppingCartValue, setOpenShoppingCartValue] =
    useRecoilState(openShoppingCart);
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

  return (
    <>
      <div className='fixed right-0  top-[8.5rem] bottom-0 z-[11] bg-primary w-[400px]  text-secundary  max-md:inset-0 max-md:w-auto rounded-tl-lg max-md:rounded-none transition-all ease-linear duration-1000	'>
        <div className='p-4 h-full flex justify-between flex-col'>
          <div className='flex justify-between'>
            <h2 className='font-bold text-2xl'>Carrito de compras</h2>
            <button onClick={() => setOpenShoppingCartValue(false)}>
              <img src='/closeWhite.svg' alt='close' width={20} />
            </button>
          </div>
          <div className='flex flex-col gap-6 overflow-auto h-[75%] mt-8 '>
            {shoppingCartValue.length ? (
              shoppingCartValue.map((item) => (
                <TemplateShopppingCartProduct
                  key={item.id}
                  id={item.id}
                  price={item.price}
                  title={item.title}
                  cantidad={item.cantidad}
                  img={item.img}></TemplateShopppingCartProduct>
              ))
            ) : (
              <div className='text-center'>
                El carrito de compras está vacío
              </div>
            )}
          </div>
          <div className=''>
            <div className='flex justify-between'>
              <h2 className='font-bold text-2xl'>Total:</h2>
              <div>
                <h2 className='font-bold text-2xl'>
                  {(shoppingCartValue.length &&
                    shoppingCartValue
                      .reduce(
                        (acumalador, objeto) =>
                          acumalador + objeto.price * (objeto.cantidad || 1),
                        0
                      )
                      .toLocaleString('es-AR', {
                        style: 'currency',
                        currency: 'ARS',
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      })) ||
                    '$' + 0}
                </h2>
              </div>
            </div>
            <div className='flex justify-center mt-4 mb-4'>
              <button
                disabled={shoppingCartValue.length ? false : true}
                onClick={() => setOpenIsCompraLink(true)}
                className={`p-4 pt-2 text-primary  pb-2 rounded-lg ${
                  shoppingCartValue.length
                    ? 'bg-secundary font-semibold hover:opacity-80'
                    : 'bg-gray-400'
                }`}>
                INICIAR COMPRA
              </button>
            </div>
          </div>
        </div>

        {openIsCompraLink ? (
          <Modal closeModal={(data) => setOpenIsCompraLink(data)} />
        ) : null}
      </div>
    </>
  );
}
