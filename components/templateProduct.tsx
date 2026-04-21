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

interface TemplateProductProps {
  openImg: (data: string[]) => void;
  title: string;
  images: string[];
  id: string;
  // categories: CategoryType[];
  variants: VariantType[]; // ← Nueva estructura: array de variantes independientes
  addToast: () => void;
  addItem: (cart: Omit<ShoppingCart, "variants" | "stock">) => void;
  cart: Omit<ShoppingCart, "variants" | "stock">[];
}

export default function TemplateProduct({
  openImg,
  title,
  images,
  id,
  variants = [],
  addToast,
  addItem,
  cart,
}: TemplateProductProps) {
  const [selectedColorHex, setSelectedColorHex] = useState<string>("");
  const [selectedColorName, setSelectedColorName] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedVariant, setSelectedVariant] = useState<VariantType | null>(null);

  // Extraer colores únicos de las variantes (sin duplicados)
  const uniqueColors = useMemo(() => {
    if (!variants.length) return [];

    const colorsMap = new Map<string, { colorName: string; colorHex: string }>();

    variants.forEach((variant) => {
      if (!colorsMap.has(variant.colorHex)) {
        colorsMap.set(variant.colorHex, {
          colorName: variant.colorName,
          colorHex: variant.colorHex,
        });
      }
    });

    return Array.from(colorsMap.values());
  }, [variants]);

  // Extraer talles únicos de las variantes
  const uniqueSizes = useMemo(() => {
    if (!variants.length) return [];
    return [...new Set(variants.map((v) => v.size))].sort();
  }, [variants]);

  // Obtener talles disponibles para el color seleccionado
  const availableSizesForSelectedColor = useMemo(() => {
    if (!selectedColorHex) return [];

    const sizesForColor = variants
      .filter((v) => v.colorHex === selectedColorHex)
      .map((v) => v.size)
      .sort();

    return [...new Set(sizesForColor)];
  }, [variants, selectedColorHex]);

  // Obtener la variante seleccionada (color + talle)
  const findVariantByColorAndSize = (colorHex: string, size: string): VariantType | null => {
    return variants.find((v) => v.colorHex === colorHex && v.size === size) || null;
  };

  // Obtener stock disponible de la variante seleccionada
  const selectedVariantStock = useMemo(() => {
    if (!selectedVariant) return 0;
    return selectedVariant.stock;
  }, [selectedVariant]);

  // Inicializar: seleccionar primer color disponible
  useEffect(() => {
    if (variants.length > 0 && !selectedColorHex) {
      const firstColor = uniqueColors[0];
      if (firstColor) {
        setSelectedColorHex(firstColor.colorHex);
        setSelectedColorName(firstColor.colorName);
        setSelectedSize("");
        setSelectedVariant(null);
      }
    }
  }, [variants, uniqueColors, selectedColorHex]);

  // Cuando cambia el color, resetear talla y variante seleccionada
  useEffect(() => {
    if (selectedColorHex) {
      setSelectedSize("");
      setSelectedVariant(null);
    }
  }, [selectedColorHex]);

  // Cuando cambia la talla, buscar la variante completa
  useEffect(() => {
    if (selectedColorHex && selectedSize) {
      const variant = findVariantByColorAndSize(selectedColorHex, selectedSize);
      setSelectedVariant(variant);
    } else {
      setSelectedVariant(null);
    }
  }, [selectedColorHex, selectedSize, variants]);

  // Precios basados en la variante seleccionada
  const { currentPrice, currentPriceOffer, discountPercentage, hasStock } = useMemo(() => {
    if (selectedVariant) {
      const price = selectedVariant.price;
      const priceOffer = selectedVariant.priceOffer || 0;
      const discount = priceOffer > 0 ? Math.round(((price - priceOffer) / price) * 100) : 0;
      const inStock = selectedVariant.stock > 0;

      return {
        currentPrice: price,
        currentPriceOffer: priceOffer,
        discountPercentage: discount,
        hasStock: inStock,
      };
    }

    // Si no hay variante seleccionada, mostrar precios por defecto (primer variante)
    const firstVariant = variants[0];
    if (firstVariant) {
      const price = firstVariant.price;
      const priceOffer = firstVariant.priceOffer || 0;
      const discount = priceOffer > 0 ? Math.round(((price - priceOffer) / price) * 100) : 0;

      return {
        currentPrice: price,
        currentPriceOffer: priceOffer,
        discountPercentage: discount,
        hasStock: firstVariant.stock > 0,
      };
    }

    return {
      currentPrice: 0,
      currentPriceOffer: 0,
      discountPercentage: 0,
      hasStock: false,
    };
  }, [selectedVariant, variants]);

  // Determinar si el botón debe estar deshabilitado
  const isButtonDisabled = useMemo(() => {
    if (!variants.length) return true;
    if (!selectedColorHex) return true;
    if (!selectedSize) return true;
    if (!hasStock) return true;
    return false;
  }, [variants.length, selectedColorHex, selectedSize, hasStock]);

  // Obtener texto para el botón
  const buttonText = useMemo(() => {
    if (!variants.length) return "No disponible";
    if (!selectedColorHex) return "Selecciona un color";
    if (!selectedSize) return "Selecciona una talla";
    if (!hasStock) return "Sin stock";
    return "Agregar al carrito";
  }, [variants.length, selectedColorHex, selectedSize, hasStock]);

  // Verificar si ya existe en el carrito
  const isItemInCart = useMemo(() => {
    return cart.some(
      (item) =>
        item.id === id &&
        item.variantColorHex === selectedColorHex &&
        item.variantSize === selectedSize,
    );
  }, [cart, id, selectedColorHex, selectedSize]);

  const handleImageClick = () => openImg(images);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isButtonDisabled || isItemInCart || !selectedVariant) return;

    const newAddItem: Omit<ShoppingCart, "variants" | "stock"> = {
      id,
      title,
      price: currentPrice,
      priceOffer: currentPriceOffer,
      quantity: 1,
      images,
      variantColorName: selectedColorName,
      variantColorHex: selectedColorHex,
      variantSize: selectedSize,
      variantId: selectedVariant.id,
    };

    addItem(newAddItem);
    addToast();
  };

  const hasColors = uniqueColors.length > 0;
  const hasSizes = uniqueSizes.length > 0;

  return (
    <div className='rounded-md overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group hover:-translate-y-1 flex flex-col h-full bg-background'>
      <div className='relative aspect-square overflow-hidden bg-muted flex-shrink-0'>
        {/* Badges de oferta */}
        {currentPriceOffer > 0 && (
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

        {/* Badge de sin stock */}
        {selectedVariant && selectedVariant.stock === 0 && (
          <div className='absolute inset-0 bg-black/50 flex items-center justify-center z-20'>
            <Badge className='bg-red-600 text-white px-4 py-2 text-sm font-bold'>AGOTADO</Badge>
          </div>
        )}

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
            <h3 className='font-semibold text-base line-clamp-2 leading-tight text-primary group-hover:text-primary transition-colors min-h-[2.5rem]'>
              {title}
            </h3>
          </Link>

          {/* Selector de colores */}
          {hasColors && (
            <div className='mt-3'>
              <div className='flex items-center gap-2 mb-2'>
                <Palette className='w-4 h-4 ' />
                <label className='text-sm font-medium '>Color</label>
              </div>
              <div className='flex flex-wrap gap-2'>
                {uniqueColors.map((color) => (
                  <button
                    key={color.colorHex}
                    type='button'
                    onClick={() => {
                      setSelectedColorHex(color.colorHex);
                      setSelectedColorName(color.colorName);
                      setSelectedSize("");
                      setSelectedVariant(null);
                    }}
                    className={`
                      relative flex flex-col items-center justify-center p-2 rounded-lg border-2 transition-all duration-200
                      ${
                        selectedColorHex === color.colorHex
                          ? "border-primary bg-primary/10 shadow-md scale-105"
                          : "border-border bg-background hover:border-primary/50 hover:bg-accent"
                      }
                      focus:outline-none focus:ring-2 focus:ring-primary/50
                    `}
                    title={color.colorName}
                    aria-label={`Seleccionar color ${color.colorName}`}
                  >
                    <div
                      className='w-6 h-6 rounded-full border border-border shadow-sm'
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
          {hasSizes && selectedColorHex && (
            <div className='mt-3'>
              <div className='flex items-center gap-2 mb-2'>
                <Ruler className='w-4 h-4 ' />
                <label className='text-sm font-medium '>Talla</label>
              </div>
              <div className='flex flex-wrap gap-2'>
                {uniqueSizes.map((size) => {
                  // Verificar si esta talla está disponible para el color seleccionado
                  const isAvailableForColor = availableSizesForSelectedColor.includes(size);
                  const variantForSelection = findVariantByColorAndSize(selectedColorHex, size);
                  const hasStockForSize = variantForSelection
                    ? variantForSelection.stock > 0
                    : false;
                  const isSelected = selectedSize === size;

                  return (
                    <button
                      key={size}
                      type='button'
                      onClick={() => {
                        if (isAvailableForColor && hasStockForSize) {
                          setSelectedSize(size);
                        }
                      }}
                      disabled={!isAvailableForColor || !hasStockForSize}
                      className={`
                        px-4 py-2 text-sm font-medium rounded-lg border-2 transition-all duration-200
                        ${
                          isSelected
                            ? "border-primary bg-primary text-secondary shadow-md scale-105"
                            : isAvailableForColor && hasStockForSize
                              ? "border-border bg-background hover:border-primary/50 hover:bg-accent cursor-pointer"
                              : "border-border bg-gray-100 text-gray-400 cursor-not-allowed opacity-50"
                        }
                        focus:outline-none focus:ring-2 focus:ring-primary/50
                      `}
                      aria-label={`Seleccionar talla ${size}`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Mensaje de selección */}
          {!selectedColorHex && hasColors && (
            <p className='text-sm text-muted-foreground mt-2'>
              Selecciona un color para ver talles
            </p>
          )}
        </div>

        {/* Precio y botón */}
        <div className='space-y-3 pt-2 border-t border-border mt-auto'>
          <div className='flex items-baseline gap-2 min-h-[2rem] flex-wrap'>
            {currentPriceOffer > 0 ? (
              <>
                <span className='text-2xl font-bold text-green-700'>
                  ${currentPriceOffer.toLocaleString("es-ES")}
                </span>
                <span className='text-sm  line-through'>
                  ${currentPrice.toLocaleString("es-ES")}
                </span>
              </>
            ) : (
              <span className='text-2xl font-bold text-primary'>
                ${currentPrice.toLocaleString("es-ES")}
              </span>
            )}

            {selectedVariant && selectedVariant.stock > 0 && selectedVariant.stock <= 5 && (
              <Badge variant='outline' className='text-orange-500 border-orange-500 text-xs'>
                ¡Últimas {selectedVariant.stock} unidades!
              </Badge>
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
            {isItemInCart ? "✓ Ya está en el carrito" : buttonText}
          </Button>
        </div>
      </div>
    </div>
  );
}
