"use client";

import { useEffect, useState } from "react";
import Modal from "./modal";
import { Button } from "@/components/ui/button";
import { X, ShoppingBag } from "lucide-react";
import { useShoppingCart, useShoppingCartActions } from "@/contexts/product-context";
import TemplateShopppingCart from "./TemplateShopppingCart";

export default function ShoppingCart() {
  const { closeCart } = useShoppingCartActions();
  const {
    state: { cart },
  } = useShoppingCart();
  const [openIsCompraLink, setOpenIsCompraLink] = useState(false);

  useEffect(() => {
    if (!cart.length) return;

    let buysMod = "Hola, quisiera pedirte estas cosas";
    cart.map((item) => {
      buysMod += `
      🛒*${item.title}* id:${item.id} precio:${item.price} cantidad:${item.quantity}
      `;
      return {
        id: item.id,
        quantity: item.quantity,
        precio: item.price,
        nombre: item.title,
      };
    });
  }, [cart]);

  const total = cart.reduce(
    (acumulador, objeto) =>
      acumulador +
      (objeto.priceOffer > 0 ? objeto.priceOffer : objeto.price) * (objeto.quantity || 1),
    0,
  );

  console.log("MI CARRITO: ", cart);

  console.log("TOTAL DE CARRITO: ", total);

  return (
    <>
      <div className='fixed right-0 top-0 bottom-0 z-50 bg-white w-full max-w-md shadow-2xl transform transition-transform duration-300 ease-in-out'>
        <div className='flex flex-col h-full shadow-lg shadow-black'>
          {/* Header */}
          <div className='flex items-center justify-between p-6 border-b bg-gradient-to-r from-primary to-primary/90 text-white'>
            <div className='flex items-center space-x-2'>
              <ShoppingBag className='w-6 h-6' />
              <h2 className='text-xl font-bold'>Carrito</h2>
            </div>
            <Button
              variant='ghost'
              size='icon'
              onClick={() => closeCart()}
              className='text-white hover:bg-white/20'
            >
              <X className='w-5 h-5' />
            </Button>
          </div>

          {/* Contenido */}
          <div className='flex-1 overflow-y-auto p-4'>
            {cart.length > 0 ? (
              <div className='space-y-4'>
                {cart.map((cart, position) => (
                  <TemplateShopppingCart
                    key={`${cart.id}-${position}`}
                    id={cart.id}
                    title={cart.title}
                    price={cart.price}
                    priceOffer={cart.priceOffer}
                    quantity={cart.quantity}
                    images={cart.images}
                    variantId={cart.variantId}
                    variantColorName={cart.variantColorName}
                    variantColorHex={cart.variantColorHex}
                    variantSize={cart.variantSize}
                  />
                ))}
              </div>
            ) : (
              <div className='flex flex-col items-center justify-center h-full text-center'>
                <ShoppingBag className='w-16 h-16 text-gray-300 mb-4' />
                <h3 className='text-lg font-medium text-gray-900 mb-2'>Tu carrito está vacío</h3>
                <p className='text-gray-500 mb-6'>Agrega algunos productos para comenzar</p>
                <Button onClick={() => closeCart()} variant='outline'>
                  Continuar comprando
                </Button>
              </div>
            )}
          </div>

          {/* Footer */}
          {cart.length > 0 && (
            <div className='border-t bg-gray-50 p-6 space-y-4'>
              <div className='flex items-center justify-between'>
                <span className='text-lg font-medium text-gray-900'>Total:</span>
                <span className='text-2xl font-bold text-purple-600'>
                  {total.toLocaleString("es-AR", {
                    style: "currency",
                    currency: "ARS",
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })}
                </span>
              </div>
              <Button
                onClick={() => setOpenIsCompraLink(true)}
                className='w-full bg-purple-600 hover:bg-purple-700'
                size='lg'
              >
                Iniciar Compra
              </Button>
            </div>
          )}
        </div>
      </div>
      {openIsCompraLink && <Modal closeModal={() => setOpenIsCompraLink(false)} />}
    </>
  );
}
