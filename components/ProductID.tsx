"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import { ProductType, VariantType } from "@/types/product";

// Import Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs, Zoom, FreeMode } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import "swiper/css/zoom";
import "swiper/css/free-mode";

export default function ProductTemplate({ product }: { product: ProductType }) {
  const [selectedVariant, setSelectedVariant] = useState<VariantType | null>(
    product.variant.length > 0 ? product.variant[0] : null
  );
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [quantity, setQuantity] = useState(1);

  // Estado para el control de thumbs de Swiper
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
  const [mainSwiper, setMainSwiper] = useState<SwiperType | null>(null);

  const hasVariants = product.variant.length > 0;
  const hasSizes = selectedVariant ? selectedVariant.sizes.length > 0 : product.sizes.length > 0;
  const availableSizes = selectedVariant ? selectedVariant.sizes : product.sizes;
  const currentPrice = selectedVariant
    ? selectedVariant.priceOffer || selectedVariant.price
    : product.priceOffer || product.price;
  const originalPrice = selectedVariant ? selectedVariant.price : product.price;
  const hasDiscount = currentPrice < originalPrice;
  const discountPercentage = hasDiscount
    ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    if (hasSizes && !selectedSize) {
      return;
    }
    console.log("[v0] Adding to cart:", {
      product: product.title,
      variant: selectedVariant?.color,
      size: selectedSize,
      quantity,
    });
  };

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= 99) {
      setQuantity(newQuantity);
    }
  };

  return (
    <div className=''>
      <div className='mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8'>
        <div className='grid gap-8 lg:grid-cols-2 lg:gap-12'>
          {/* Image Gallery con Swiper */}
          <div className='space-y-4'>
            {/* Swiper Principal con Zoom */}
            <div className='relative aspect-square overflow-hidden rounded-2xl bg-muted'>
              {hasDiscount && (
                <Badge className='absolute left-4 top-4 z-10 bg-destructive text-destructive-foreground shadow-lg'>
                  -{discountPercentage}%
                </Badge>
              )}

              <Swiper
                modules={[Navigation, Thumbs, Zoom, FreeMode]}
                navigation
                zoom={{
                  maxRatio: 3,
                  minRatio: 1,
                }}
                thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                onSwiper={setMainSwiper}
                className='h-full rounded-2xl'
              >
                {product.images.map((image, index) => (
                  <SwiperSlide key={index}>
                    <div className='swiper-zoom-container'>
                      <Image
                        src={image || "/placeholder.svg?height=600&width=600"}
                        alt={`${product.title} - ${index + 1}`}
                        fill
                        className='object-cover'
                        priority={index === 0}
                        sizes='(max-width: 768px) 100vw, 50vw'
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>

              {/* Botón de pantalla completa personalizado */}
              <button
                onClick={() => mainSwiper?.zoom.in()}
                className='absolute right-4 top-4 z-10 rounded-full bg-black/50 p-2 text-white backdrop-blur-sm transition-all hover:bg-black/70'
                aria-label='Zoom'
              >
                <svg className='h-5 w-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7'
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Product Info (esta parte se mantiene igual) */}
          <div className='space-y-6'>
            {/* Categories */}
            {product?.categories && product?.categories?.length > 0 && (
              <div className='flex flex-wrap gap-2'>
                {product.categories?.map((category) => (
                  <Badge
                    key={category.id}
                    variant='outline'
                    className='text-sm !bg-primary/50 !text-secondary'
                  >
                    {category.title}
                  </Badge>
                ))}
              </div>
            )}

            {/* Title */}
            <h1 className='text-balance text-4xl font-bold tracking-tight text-foreground lg:text-5xl'>
              {product.title}
            </h1>

            {/* Price */}
            <div className='flex items-baseline gap-3'>
              <span className='text-4xl font-bold text-foreground'>${currentPrice.toFixed(2)}</span>
              {hasDiscount && (
                <span className='text-2xl text-muted-foreground line-through'>
                  ${originalPrice.toFixed(2)}
                </span>
              )}
            </div>

            {/* Description */}
            <p className='text-pretty text-base leading-relaxed text-muted-foreground'>
              {product.description}
            </p>

            {/* Color Variants */}
            {hasVariants && (
              <div className='space-y-3'>
                <label className='text-sm font-semibold text-foreground'>
                  Color: {selectedVariant?.color}
                </label>
                <div className='flex gap-3'>
                  {product.variant.map((variant) => (
                    <button
                      key={variant.id}
                      onClick={() => {
                        setSelectedVariant(variant);
                        setSelectedSize("");
                      }}
                      className={`h-12 w-12 rounded-full border-2 transition-all ${
                        selectedVariant?.id === variant.id
                          ? "scale-110 border-primary ring-2 ring-primary ring-offset-2"
                          : "border-border hover:scale-105"
                      }`}
                      style={{ backgroundColor: variant.color }}
                      aria-label={`Select ${variant.color} color`}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection */}
            {hasSizes && (
              <div className='space-y-3'>
                <label className='text-sm font-semibold text-foreground'>
                  Talla: {selectedSize || "Select a size"}
                </label>
                <div className='grid grid-cols-4 gap-3'>
                  {availableSizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`rounded-lg border-2 py-3 text-sm font-semibold transition-all ${
                        selectedSize === size
                          ? "border-primary bg-primary text-secondary shadow-md scale-105"
                          : "border-primary/50 bg-background hover:border-primary/90 hover:bg-accent"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className='space-y-3'>
              <label className='text-sm font-semibold text-foreground'>Cantidad</label>
              <div className='flex items-center gap-3'>
                <Button
                  variant='outline'
                  size='icon'
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                  className='h-12 w-12'
                >
                  <Minus className='h-4 w-4' />
                </Button>
                <span className='w-12 text-center text-lg font-semibold'>{quantity}</span>
                <Button
                  variant='outline'
                  size='icon'
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= 99}
                  className='h-12 w-12'
                >
                  <Plus className='h-4 w-4' />
                </Button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <Button
              onClick={handleAddToCart}
              disabled={hasSizes && !selectedSize}
              size='lg'
              className='w-full text-lg font-semibold shadow-lg transition-all hover:scale-[1.02] disabled:scale-100'
            >
              <ShoppingCart className='mr-2 h-5 w-5' />
              {hasSizes && !selectedSize ? "Seleccionar tallla" : "Agregar al carrito"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
