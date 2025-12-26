"use client";

import type React from "react";
import { Trash } from "lucide-react";
import { InputNumber } from "./ui/input";
import { useShoppingCart, useShoppingCartActions } from "@/contexts/product-context";
import Link from "next/link";
import { ShoppingCart } from "@/types/shopping-cart";

export default function TemplateShopppingCart({
  id,
  title,
  price,
  priceOffer,
  quantity,
  images,
  variantColorName,
  variantColorHex,
  variantSize,
  variantId,
}: Omit<ShoppingCart, "variant">) {
  const {
    state: { cart },
  } = useShoppingCart();
  const { removeItem } = useShoppingCartActions();

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    const newShoppingCart: Omit<ShoppingCart, "variant">[] = cart.filter(
      (item) => item.id !== e.currentTarget.id
    );
    if (typeof window !== "undefined") {
      localStorage.setItem("shoppingCart", JSON.stringify(newShoppingCart));
    }
    removeItem(id, variantId, variantSize, variantColorName, variantColorHex);
  };

  return (
    <div className='flex justify-between items-center gap-4 border-b border-border py-4 px-3 hover:bg-accent/50 transition-colors rounded-lg w-full'>
      <div className='flex gap-4 items-center w-full'>
        <Link href={`/productos/${id}`} className='hover:opacity-90'>
          <img
            src={images?.[0] || "/tienda-alli-webp"}
            alt={title}
            loading='lazy'
            className='h-full w-24 object-cover rounded-lg shadow-sm border border-border'
          />
        </Link>

        <div className='flex-1 overflow-hidden'>
          <Link href={`/productos/${id}`} className='hover:opacity-70 text-sm font-medium truncate'>
            {title}
          </Link>

          <div className='flex gap-2'>
            {variantSize ? (
              <span className='inline-block mt-1 px-2 py-0.5 text-xs font-medium bg-primary/20 text-primary rounded'>
                Talla: {variantSize}
              </span>
            ) : null}

            {variantColorName ? (
              <span className='inline-block mt-1 px-2 py-0.5 text-xs font-medium bg-primary/20 text-primary rounded'>
                Color: {variantColorName}
              </span>
            ) : null}
          </div>

          <h3 className=' font-semibold text-foreground mt-2'>
            {priceOffer ? (
              <>
                <span className=' font-bold text-green-600 mr-4'>
                  ${priceOffer.toLocaleString()}
                </span>
                <span className='text-sm text-muted-foreground line-through'>
                  ${price.toLocaleString()}
                </span>
              </>
            ) : (
              <span className=' font-bold text-foreground'>${price.toLocaleString()}</span>
            )}
          </h3>

          <div className='flex flex-row items-center gap-3 justify-between mt-2'>
            <InputNumber
              id={id}
              quantity={quantity || 1}
              variantId={variantId}
              variantColorName={variantColorName}
              variantColorHex={variantColorHex}
              variantSize={variantSize}
            />
            <button
              onClick={handleDelete}
              id={id}
              className='p-2 rounded-lg text-red-500 hover:text-red-100 hover:bg-red-500 transition-colors cursor-pointer'
              aria-label='Eliminar producto'
            >
              <Trash size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
