"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Eye, ShoppingCartIcon, Trash } from "lucide-react";
import { InputNumber } from "./ui/input";
import { useShoppingCart, useShoppingCartActions } from "@/contexts/product-context";
import type { TypeCompra } from "@/lib/atom";
import type { CategoryType } from "@/types/category";
import HoverSwiper from "@/components/HoverSwiper";
import Link from "next/link";

interface TemplateProductProps {
  openImg: (data: string[]) => void;
  Name: string;
  Images: string[];
  priceOfert?: number;
  price: number;
  oferta?: boolean;
  id: string;
  categories?: CategoryType[];
  size?: string[];
  addToast: () => void;
  addItem: (cart: TypeCompra) => void;
  cart: TypeCompra[];
}

export function TemplateProduct({
  openImg,
  Name,
  Images,
  priceOfert,
  price,
  oferta,
  id,
  categories,
  size,
  addToast,
  addItem,
  cart,
}: TemplateProductProps) {
  const [selectedSize, setSelectedSize] = useState<string>("");

  const handleImageClick = () => openImg(Images);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();

    const newItem: TypeCompra = {
      size: selectedSize,
      cantidad: 1,
      id,
      title: Name,
      img: Images[0],
      price: priceOfert || price,
    };

    const exists = cart.find((item) => item.id === id && item.size === selectedSize);
    if (exists) return cart;

    const updated = [newItem, ...cart];
    localStorage.setItem("category", JSON.stringify(updated));

    addItem(newItem);

    addToast();
  };

  const discountPercentage =
    oferta && priceOfert ? Math.round(((price - priceOfert) / price) * 100) : 0;

  return (
    <Link
      href={`/productos/${id}`}
      className='bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group hover:-translate-y-1'
    >
      <div className='relative aspect-square overflow-hidden bg-muted'>
        {oferta && (
          <div className='absolute top-3 left-3 z-10 flex flex-col gap-1'>
            <Badge className='bg-red-600 hover:bg-red-700 text-white font-semibold shadow-lg'>
              Oferta
            </Badge>
            {discountPercentage > 0 && (
              <Badge className='bg-green-600 hover:bg-green-700 text-white font-semibold shadow-lg'>
                -{discountPercentage}%
              </Badge>
            )}
          </div>
        )}

        <HoverSwiper imageUrls={Images} title={Name} classNameImg='object-cover' />

        <div className='absolute inset-0 bg-gradient-to-t from-black/40 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300' />

        <div className='absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-110'>
          <Button
            aria-label='Ver imagen'
            size='icon'
            variant='secondary'
            onClick={handleImageClick}
            className='rounded-full shadow-lg hover:shadow-xl backdrop-blur-sm bg-white/90 hover:bg-white'
          >
            <Eye className='w-4 h-4' />
          </Button>
        </div>
      </div>

      <div className='p-5 space-y-4'>
        <div className='space-y-2'>
          <h3 className='font-semibold text-base line-clamp-2 leading-tight text-foreground group-hover:text-primary transition-colors'>
            {Name}
          </h3>

          {/* <div className='flex flex-wrap gap-1.5'>
            {categories.map((category) => (
              <span
                key={category.id}
                className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/20 text-primary capitalize'
              >
                {category.title}
              </span>
            ))}
          </div> */}

          {size?.length ? (
            <div className='mt-3'>
              <label
                htmlFor='size-select'
                className='block text-sm font-medium text-foreground mb-2'
              >
                Talla
              </label>
              <div className='grid grid-cols-4 gap-2'>
                {size.map((s) => (
                  <button
                    key={s}
                    type='button'
                    onClick={() => setSelectedSize(s)}
                    className={`
                      px-3 py-2 text-sm font-medium rounded-lg border-2 transition-all duration-200
                      ${
                        selectedSize === s
                          ? "border-primary bg-primary text-secondary shadow-md scale-105"
                          : "border-primary/50 bg-background hover:border-primary/90 hover:bg-accent"
                      }
                    `}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        <div className='space-y-3 pt-2 border-t border-border'>
          <div className='flex items-baseline gap-2'>
            {oferta && priceOfert ? (
              <>
                <span className='text-2xl font-bold text-green-600'>
                  ${priceOfert.toLocaleString()}
                </span>
                <span className='text-sm text-muted-foreground line-through'>
                  ${price.toLocaleString()}
                </span>
              </>
            ) : (
              <span className='text-2xl font-bold text-foreground'>${price.toLocaleString()}</span>
            )}
          </div>

          <Button
            size='lg'
            aria-label='Agregar al carrito'
            onClick={handleClick}
            disabled={!selectedSize && !!size?.length}
            className='w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
          >
            <ShoppingCartIcon className='w-4 h-4 mr-2' />
            {!selectedSize && size?.length ? "Selecciona una talla" : "Agregar al carrito"}
          </Button>
        </div>
      </div>
    </Link>
  );
}

export function TemplateShopppingCartProduct({
  id,
  title,
  price,
  cantidad,
  img,
  size,
}: {
  id: string;
  title: string;
  price: number;
  cantidad: number;
  img: string;
  size: string;
}) {
  const [openFocusName, setOpenFocusName] = useState(false);
  const {
    state: { cart },
  } = useShoppingCart();
  const { setCart } = useShoppingCartActions();

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    const newShoppingCart = cart.filter(
      (item: any) => item.id !== e.currentTarget.id || item.talla !== size
    );
    if (typeof window !== "undefined") {
      localStorage.setItem("category", JSON.stringify(newShoppingCart));
    }
    setCart(newShoppingCart);
  };

  return (
    <div className='flex justify-between items-center gap-4 border-b border-border py-4 px-3 hover:bg-accent/50 transition-colors rounded-lg w-full'>
      <div className='flex gap-4 items-center w-full'>
        <img
          src={img || "/placeholder.svg"}
          alt={title}
          loading='lazy'
          className='h-24 w-24 object-cover rounded-lg shadow-sm border border-border'
        />
        <div className='flex-1 min-w-0'>
          <p
            onMouseEnter={() => setOpenFocusName(true)}
            onMouseLeave={() => setOpenFocusName(false)}
            className='text-sm font-medium text-foreground truncate cursor-default'
          >
            {title}
          </p>
          {size && (
            <span className='inline-block mt-1 px-2 py-0.5 text-xs font-medium bg-primary/10 text-primary rounded'>
              Talla: {size}
            </span>
          )}
          <h3 className='text-lg font-semibold text-foreground mt-2'>
            {price.toLocaleString("es-AR", {
              style: "currency",
              currency: "ARS",
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            })}
          </h3>
          <div className='flex flex-row items-center gap-3 justify-between mt-3'>
            <InputNumber cantidad={cantidad || 1} id={id} talla={size} />
            <button
              onClick={handleDelete}
              id={id}
              className='p-2 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors cursor-pointer'
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
