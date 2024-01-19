'use client';
import {openShoppingCart, shoppingCart} from '@/lib/atom';
import {useRecoilState} from 'recoil';
import React, {useEffect, useState} from 'react';
import {InputNumber} from '@/ui/input';
import Link from 'next/link';
import {Modal} from './modal';
export function ShoppingCart() {
  const [shoppingCartUserData, setShoppingCartUserData] =
    useRecoilState(shoppingCart);
  const [openShoppingCartValue, setOpenShoppingCartValue] =
    useRecoilState(openShoppingCart);
  const [shoppingCartValue, setShoppingCartValue] =
    useRecoilState(shoppingCart);
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
  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    const newShoppingCart = shoppingCartValue.filter(
      (item: any) => item.id !== e.currentTarget.id
    );
    setShoppingCartValue(newShoppingCart);
  };
  return (
    <div className='fixed right-0 z-10 top-[8.5rem] bottom-0 z-1 bg-[#ffefa9] w-[400px]    max-md:inset-0 max-md:w-auto rounded-tl-lg max-md:rounded-none transition-all ease-linear duration-1000	'>
      <div className='p-4 h-full flex justify-between flex-col'>
        <div className='flex justify-between'>
          <h2 className='font-bold text-2xl'>Carrito de compras</h2>
          <button onClick={() => setOpenShoppingCartValue(false)}>
            <img src='/closeBlack.svg' alt='close' width={20} />
          </button>
        </div>
        <div className='flex flex-col gap-6 overflow-auto h-[75%] mt-8 '>
          {shoppingCartValue.length ? (
            shoppingCartValue.map((item: any, index) => (
              <div
                key={`${item.id}${index}`}
                className='flex justify-between border-b-2 border-b-white  pb-6 last:border-none pr-2 pl-2 h-[106px]'>
                <div className='flex gap-4'>
                  <img
                    src={item.img}
                    alt={item.title}
                    loading='lazy'
                    className='h-full w-[80px] object-cover'
                  />
                  <div>
                    <p className='h-[24px] overflow-hidden max-w-[220px]'>
                      {item.title}
                    </p>
                    <h3 className='font-bold'>$ {item.price}</h3>
                    <InputNumber cantidad={item.cantidad || 1} id={item.id} />
                  </div>
                </div>
                <button
                  onClick={handleDelete}
                  id={item.id}
                  className='fill-white hover:fill-red-400'>
                  <img src='/delete.svg' alt='delete' width={14} />
                </button>
              </div>
            ))
          ) : (
            <div className='text-center'>El carrito de compras está vacío</div>
          )}
        </div>
        <div className=''>
          <div className='flex justify-between'>
            <h2 className='font-bold text-2xl'>Total:</h2>
            <div>
              <h2 className='font-bold text-2xl'>
                $
                {shoppingCartValue.reduce(
                  (acumalador, objeto) =>
                    acumalador + objeto.price * (objeto.cantidad || 1),
                  0
                ) || 0}
              </h2>
            </div>
          </div>
          <div className='flex justify-center mt-4 mb-4'>
            <button
              onClick={() => setOpenIsCompraLink(true)}
              className='bg-black p-4 pt-2 pb-2 text-[#ffefa9] rounded-lg'>
              INICIAR COMPRA
            </button>
          </div>
        </div>
      </div>
      {openIsCompraLink ? (
        <Modal closeModal={(data) => setOpenIsCompraLink(data)} />
      ) : null}
    </div>
  );
}
