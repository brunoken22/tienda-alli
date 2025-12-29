"use client";

import React from "react";
import { useState, useEffect, useMemo } from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Eye, ShoppingCartIcon, Palette, Ruler } from "lucide-react";
import type { VariantType } from "@/types/product";
import HoverSwiper from "@/components/HoverSwiper";
import Link from "next/link";
import { ShoppingCart } from "@/types/shopping-cart";
import { CategoryType } from "@/types/category";

interface TemplateProductProps {
  openImg: (data: string[]) => void;
  title: string;
  images: string[];
  priceOffer: number;
  price: number;
  id: string;
  categories: CategoryType[];
  size: string[];
  variants?: VariantType[];
  addToast: () => void;
  addItem: (cart: Omit<ShoppingCart, "variant">) => void;
  cart: Omit<ShoppingCart, "variant">[];
}

interface ColorOption {
  id: string;
  colorName: string;
  colorHex: string;
  price?: number;
  priceOffer?: number;
}

export default function TemplateProduct({
  openImg,
  title,
  images,
  priceOffer,
  price,
  id,
  size,
  variants = [],
  addToast,
  addItem,
  cart,
}: Omit<TemplateProductProps, "categories">) {
  const [selectedColorName, setSelectedColorName] = useState<string>("");
  const [selectedColorHex, setSelectedColorHex] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedVariantId, setSelectedVariantId] = useState<string>("");
  const [availableSizes, setAvailableSizes] = useState<string[]>([]);

  // Extraer colores únicos de las variantes
  const uniqueColors = useMemo(() => {
    if (!variants || variants.length === 0) return [];

    const colorsMap = new Map<string, ColorOption>();

    variants.forEach((variant) => {
      if (!colorsMap.has(variant.colorHex)) {
        colorsMap.set(variant.colorHex, {
          id: variant.id,
          colorName: variant.colorName,
          colorHex: variant.colorHex,
          price: variant.price,
          priceOffer: variant.priceOffer,
        });
      }
    });

    return Array.from(colorsMap.values());
  }, [variants]);

  // Encontrar variante por color y talla
  const findVariantByColorAndSize = (colorHex: string, size?: string) => {
    return variants.find((variant) => {
      const matchesColor = variant.colorHex === colorHex;
      if (size) {
        return matchesColor && variant.sizes?.includes(size);
      }
      return matchesColor;
    });
  };

  // Encontrar variante por ID
  const findVariantById = (variantId: string) => {
    return variants.find((variant) => variant.id === variantId);
  };

  // Inicializar estado
  useEffect(() => {
    if (variants.length > 0) {
      // Si hay colores disponibles, seleccionar el primero
      if (uniqueColors.length > 0 && !selectedColorHex) {
        const firstColor = uniqueColors[0];
        setSelectedColorName(firstColor.colorName);
        setSelectedColorHex(firstColor.colorHex);

        const firstVariant = findVariantByColorAndSize(firstColor.colorHex);
        if (firstVariant) {
          setAvailableSizes(firstVariant.sizes || []);
          setSelectedVariantId(firstVariant.id);
        }
      }
    } else {
      // Si no hay variantes, usar las tallas generales
      setAvailableSizes(size || []);
    }
  }, [variants, uniqueColors, selectedColorName, size]);

  // Actualizar tallas cuando cambia el color seleccionado
  useEffect(() => {
    if (selectedColorName && variants.length > 0) {
      const variantForColor = findVariantByColorAndSize(selectedColorHex);
      if (variantForColor) {
        setAvailableSizes(variantForColor.sizes || []);
        setSelectedVariantId(variantForColor.id);
        setSelectedSize(""); // Resetear talla al cambiar color
      }
    }
  }, [selectedColorName, variants]);

  // Manejar cambio de color
  const handleColorSelect = (colorHex: string, colorName: string) => {
    setSelectedColorHex(colorHex);
    setSelectedColorName(colorName);
  };

  // Manejar cambio de talla
  const handleSizeSelect = (size: string) => {
    setSelectedSize(size);
  };

  // Obtener precios actuales (considerando variante seleccionada)
  const { currentPrice, currentPriceOffer, discountPercentage } = useMemo(() => {
    let displayPrice = price;
    let displayPriceOffer = priceOffer;

    if (selectedVariantId) {
      const variant = findVariantById(selectedVariantId);
      if (variant) {
        displayPrice = variant.price ?? price;
        displayPriceOffer = variant.priceOffer ?? priceOffer;
      }
    }

    const discount =
      displayPriceOffer && displayPrice > 0
        ? Math.round(((displayPrice - displayPriceOffer) / displayPrice) * 100)
        : 0;

    return {
      currentPrice: displayPrice,
      currentPriceOffer: displayPriceOffer,
      discountPercentage: discount,
    };
  }, [selectedVariantId, price, priceOffer, variants]);

  // Determinar si el botón debe estar deshabilitado
  const isButtonDisabled = useMemo(() => {
    if (variants.length > 0) {
      return !selectedColorName || !selectedSize;
    }
    if (size?.length > 0) {
      return !selectedSize;
    }
    return false;
  }, [variants.length, selectedColorName, selectedSize, size?.length]);

  // Obtener texto para el botón
  const buttonText = useMemo(() => {
    if (variants.length > 0) {
      if (!selectedColorName) return "Selecciona un color";
      if (!selectedSize) return "Selecciona una talla";
      return "Agregar al carrito";
    }
    if (size?.length > 0) {
      if (!selectedSize) return "Selecciona una talla";
      return "Agregar al carrito";
    }
    return "Agregar al carrito";
  }, [variants.length, selectedColorName, selectedSize, size?.length]);

  // Verificar si ya existe en el carrito
  const isItemInCart = useMemo(() => {
    return cart.some(
      (item) =>
        item.id === id &&
        item.variantColorName === selectedColorName &&
        item.variantSize === selectedSize
    );
  }, [cart, id, selectedColorName, selectedSize]);

  const handleImageClick = () => openImg(images);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();

    if (isButtonDisabled || isItemInCart) return;

    const newAddItem: Omit<ShoppingCart, "variant"> = {
      id,
      title,
      price: currentPrice,
      priceOffer: currentPriceOffer,
      quantity: 1,
      images,
      variantColorName: selectedColorName,
      variantColorHex: selectedColorHex,
      variantSize: selectedSize,
      variantId: selectedVariantId || "",
    };

    addItem(newAddItem);
    addToast();
  };

  const sizesToShow = availableSizes.length > 0 ? availableSizes : size || [];
  const hasColors = variants.length > 0 && uniqueColors.length > 0;
  const hasSizes = sizesToShow.length > 0;

  return (
    <div className=' rounded-md overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group hover:-translate-y-1 flex flex-col h-full'>
      <div className='relative aspect-square overflow-hidden bg-muted flex-shrink-0'>
        {/* Badges de oferta y descuento */}
        {currentPriceOffer ? (
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
        ) : null}

        {/* Imagen del producto */}
        <Link href={`/productos/${id}`} className='block h-full'>
          <HoverSwiper imageUrls={images} title={title} classNameImg='object-cover w-full h-full' />
        </Link>

        {/* Overlay de hover */}
        <div className='absolute inset-0 bg-gradient-to-t from-black/40 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none' />

        {/* Botón para ver imagen */}
        <div className='absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-110 z-10'>
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

      {/* Contenido de la card */}
      <div className='p-5 space-y-4 flex-grow flex flex-col'>
        {/* Título del producto */}
        <div className='space-y-2 flex-grow'>
          <Link href={`/productos/${id}`}>
            <h3 className='font-semibold text-base line-clamp-2 leading-tight text-foreground group-hover:text-primary transition-colors min-h-[2.5rem]'>
              {title}
            </h3>
          </Link>

          {/* Selector de colores */}

          {hasColors && (
            <div className='mt-3'>
              <div className='flex items-center gap-2 mb-2'>
                <Palette className='w-4 h-4 text-foreground' />
                <label className='text-sm font-medium text-foreground'>Color</label>
              </div>
              <div className='flex flex-wrap gap-2'>
                {uniqueColors.map((color) => (
                  <button
                    key={color.id}
                    type='button'
                    onClick={() => handleColorSelect(color.colorHex, color.colorName)}
                    className={`
                      relative flex flex-col items-center justify-center p-2 rounded-lg border-2 transition-all duration-200
                      ${
                        selectedColorHex === color.colorHex
                          ? "border-primary bg-primary/10 shadow-md scale-105"
                          : "border-primary/50 bg-background hover:border-primary/90 hover:bg-accent"
                      }
                      focus:outline-none focus:ring-2 focus:ring-primary/50
                    `}
                    title={`${color.colorName} - ${color.colorHex}`}
                    aria-label={`Seleccionar color ${color.colorName}`}
                  >
                    <div
                      className='w-5 h-5 rounded-full border border-border'
                      style={{ backgroundColor: color.colorHex }}
                      aria-hidden='true'
                    />
                    <span className='mt-1 text-xs font-medium truncate max-w-[60px]'>
                      {color.colorName}
                    </span>
                    {selectedColorHex === color.colorHex && (
                      <div className='absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center'>
                        <div className='w-2 h-2 bg-white rounded-full' />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Selector de tallas */}
          {hasSizes && (
            <div className='mt-3'>
              <div className='flex items-center gap-2 mb-2'>
                <Ruler className='w-4 h-4 text-foreground' />
                <label className='text-sm font-medium text-foreground'>Talla</label>
              </div>
              <div className='grid grid-cols-4 gap-2'>
                {sizesToShow.map((s) => (
                  <button
                    key={s}
                    type='button'
                    onClick={() => handleSizeSelect(s)}
                    disabled={hasColors && !selectedColorHex && !selectedColorName}
                    className={`
                      px-3 py-2 text-sm font-medium rounded-lg border-2 transition-all duration-200
                      ${
                        selectedSize === s
                          ? "border-primary bg-primary text-secondary shadow-md scale-105"
                          : "border-primary/50 bg-background hover:border-primary/90 hover:bg-accent"
                      }
                      ${
                        hasColors && !selectedColorHex && !selectedColorName
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }
                      focus:outline-none focus:ring-2 focus:ring-primary/50
                    `}
                    aria-label={`Seleccionar talla ${s}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Precio y botón */}
        <div className='space-y-3 pt-2 border-t border-border mt-auto'>
          <div className='flex items-baseline gap-2 min-h-[2rem]'>
            {currentPriceOffer ? (
              <>
                <span className='text-2xl font-bold text-green-600'>
                  ${currentPriceOffer.toLocaleString("es-ES")}
                </span>
                <span className='text-sm text-muted-foreground line-through'>
                  ${currentPrice.toLocaleString("es-ES")}
                </span>
              </>
            ) : (
              <span className='text-2xl font-bold text-foreground'>
                ${currentPrice.toLocaleString("es-ES")}
              </span>
            )}
          </div>

          <Button
            size='lg'
            aria-label='Agregar al carrito'
            onClick={handleAddToCart}
            disabled={isButtonDisabled || isItemInCart}
            className='w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
          >
            <ShoppingCartIcon className='w-4 h-4 mr-2' />
            {isItemInCart ? "Ya está en el carrito" : buttonText}
          </Button>
        </div>
      </div>
    </div>
  );
}
