"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Minus, Plus, ShoppingCart, Maximize2, Check, X, Palette, Ruler } from "lucide-react";
import { ProductType, VariantType } from "@/types/product";

// Import Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs, Zoom, FreeMode, Pagination } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import "swiper/css/zoom";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import { ShoppingCart as ShoppingCartType } from "@/types/shopping-cart";
import { useShoppingCartActions } from "@/contexts/product-context";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Componente Modal simplificado
function DescriptionModal({
  isOpen,
  onClose,
  title,
  description,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
}) {
  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
      <div className='absolute inset-0 bg-black/60 backdrop-blur-sm' onClick={onClose} />
      <div className='relative z-10 w-full max-w-2xl max-h-[80vh] overflow-hidden rounded-xl bg-secondary shadow-2xl'>
        <div className='flex items-center justify-between border-b p-4'>
          <h2 className='text-xl font-bold'>Descripción completa</h2>
          <button
            onClick={onClose}
            className='rounded-full p-1 hover:bg-muted transition-colors'
            aria-label='Cerrar'
          >
            <X className='h-5 w-5' />
          </button>
        </div>
        <div className='overflow-y-auto p-6' style={{ maxHeight: "calc(80vh - 120px)" }}>
          <h3 className='mb-4 text-lg font-semibold'>{title}</h3>
          <div className='whitespace-pre-wrap text-base leading-relaxed '>{description}</div>
        </div>
        <div className='border-t p-4'>
          <Button onClick={onClose} className='w-full'>
            Cerrar
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function ProductTemplate({ product }: { product: ProductType }) {
  const { addItem } = useShoppingCartActions();

  // Estados para selección de variantes
  const [selectedColorHex, setSelectedColorHex] = useState<string>("");
  const [selectedColorName, setSelectedColorName] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedVariant, setSelectedVariant] = useState<VariantType | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  const [showDescriptionModal, setShowDescriptionModal] = useState(false);

  // Estado para el control de thumbs de Swiper
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
  const [mainSwiper, setMainSwiper] = useState<SwiperType | null>(null);

  // Detectar si es móvil
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Controlar scroll del modal
  useEffect(() => {
    if (showDescriptionModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showDescriptionModal]);

  // Extraer colores únicos de las variantes (nueva estructura)
  const uniqueColors = useMemo(() => {
    if (!product.variants.length) return [];

    const colorsMap = new Map<string, { colorName: string; colorHex: string }>();
    product.variants.forEach((variant) => {
      if (!colorsMap.has(variant.colorHex)) {
        colorsMap.set(variant.colorHex, {
          colorName: variant.colorName,
          colorHex: variant.colorHex,
        });
      }
    });
    return Array.from(colorsMap.values());
  }, [product.variants]);

  // Extraer talles únicos de las variantes
  const uniqueSizes = useMemo(() => {
    if (!product.variants.length) return [];
    return [...new Set(product.variants.map((v) => v.size))].sort();
  }, [product.variants]);

  // Obtener talles disponibles para el color seleccionado
  const availableSizesForSelectedColor = useMemo(() => {
    if (!selectedColorHex) return [];

    const sizesForColor = product.variants
      .filter((v) => v.colorHex === selectedColorHex)
      .map((v) => v.size)
      .sort();

    return [...new Set(sizesForColor)];
  }, [product.variants, selectedColorHex]);

  // Obtener stock del talle seleccionado para el color actual
  const getStockForSize = (size: string): number => {
    if (!selectedColorHex) return 0;
    const variant = product.variants.find(
      (v) => v.colorHex === selectedColorHex && v.size === size,
    );
    return variant?.stock || 0;
  };

  // Encontrar variante por color y talla
  const findVariantByColorAndSize = (colorHex: string, size: string): VariantType | null => {
    return product.variants.find((v) => v.colorHex === colorHex && v.size === size) || null;
  };

  // Inicializar: seleccionar primer color disponible
  useEffect(() => {
    if (product.variants.length > 0 && !selectedColorHex) {
      const firstColor = uniqueColors[0];
      if (firstColor) {
        setSelectedColorHex(firstColor.colorHex);
        setSelectedColorName(firstColor.colorName);
        setSelectedSize("");
        setSelectedVariant(null);
      }
    }
  }, [product.variants, uniqueColors, selectedColorHex]);

  // Cuando cambia el color, resetear talla y variante
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
  }, [selectedColorHex, selectedSize, product.variants]);

  // Calcular precios basados en la variante seleccionada
  const { currentPrice, originalPrice, hasDiscount, discountPercentage, hasStock } = useMemo(() => {
    if (selectedVariant) {
      const price = selectedVariant.price;
      const priceOffer = selectedVariant.priceOffer || 0;
      const discount = priceOffer > 0 ? Math.round(((price - priceOffer) / price) * 100) : 0;

      return {
        currentPrice: priceOffer > 0 ? priceOffer : price,
        originalPrice: price,
        hasDiscount: priceOffer > 0,
        discountPercentage: discount,
        hasStock: selectedVariant.stock > 0,
      };
    }

    // Si no hay variante seleccionada, usar la primera disponible
    const firstVariant = product.variants[0];
    if (firstVariant) {
      const price = firstVariant.price;
      const priceOffer = firstVariant.priceOffer || 0;
      return {
        currentPrice: priceOffer > 0 ? priceOffer : price,
        originalPrice: price,
        hasDiscount: priceOffer > 0,
        discountPercentage: priceOffer > 0 ? Math.round(((price - priceOffer) / price) * 100) : 0,
        hasStock: firstVariant.stock > 0,
      };
    }

    return {
      currentPrice: 0,
      originalPrice: 0,
      hasDiscount: false,
      discountPercentage: 0,
      hasStock: false,
    };
  }, [selectedVariant, product.variants]);

  // Verificar si se puede agregar al carrito
  const canAddToCart = useMemo(() => {
    if (!product.variants.length) return false;
    if (!selectedColorHex) return false;
    if (uniqueSizes.length > 0 && !selectedSize) return false;
    if (!hasStock) return false;
    return true;
  }, [product.variants.length, selectedColorHex, uniqueSizes.length, selectedSize, hasStock]);

  // Obtener texto del botón
  const buttonText = useMemo(() => {
    if (!product.variants.length) return "No disponible";
    if (!selectedColorHex) return "Selecciona un color";
    if (uniqueSizes.length > 0 && !selectedSize) return "Selecciona una talla";
    if (!hasStock) return "Sin stock";
    return `AGREGAR AL CARRITO - $${(currentPrice * quantity).toFixed(2)}`;
  }, [
    product.variants.length,
    selectedColorHex,
    uniqueSizes.length,
    selectedSize,
    hasStock,
    currentPrice,
    quantity,
  ]);

  const handleAddToCart = () => {
    if (!canAddToCart) {
      if (uniqueSizes.length > 0 && !selectedSize) {
        document.getElementById("size-section")?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
      return;
    }

    const newAddItem: Omit<ShoppingCartType, "variants"> = {
      id: product.id,
      title: product.title,
      price: currentPrice,
      priceOffer: selectedVariant?.priceOffer || 0,
      quantity: quantity,
      stock: selectedVariant?.stock || 0,
      images: product.images,
      variantColorName: selectedColorName,
      variantColorHex: selectedColorHex,
      variantSize: selectedSize,
      variantId: selectedVariant?.id || "",
    };

    addItem(newAddItem);
    toast.success("¡Producto agregado al carrito!", {
      position: "bottom-right",
      autoClose: 3000,
    });
  };

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= 99) {
      setQuantity(newQuantity);
    }
  };

  const handleSizeSelect = (size: string) => {
    setSelectedSize(size);
  };

  // Swiper configuration
  const swiperConfig = {
    modules: isMobile ? [Pagination, Zoom] : [Navigation, Thumbs, Zoom, FreeMode],
    navigation: !isMobile,
    pagination: isMobile ? { clickable: true } : false,
    zoom: { maxRatio: 3, minRatio: 1, toggle: true },
    thumbs: !isMobile
      ? { swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }
      : undefined,
    spaceBetween: isMobile ? 0 : 10,
    className: "h-full rounded-2xl md:rounded-3xl",
    breakpoints: {
      320: { slidesPerView: 1 },
      768: { slidesPerView: 1 },
    },
  };

  const hasVariants = product.variants.length > 0;
  const hasColors = uniqueColors.length > 0;
  const hasSizes = uniqueSizes.length > 0;

  return (
    <>
      <div className='mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 md:py-8'>
        <div className='flex flex-col gap-6 lg:grid lg:grid-cols-2 lg:gap-10 xl:gap-12'>
          {/* Image Gallery */}
          <div className='space-y-3 md:space-y-4'>
            <div className='relative w-full overflow-hidden rounded-xl bg-muted md:rounded-2xl'>
              {hasDiscount && (
                <Badge className='absolute left-3 top-3 z-10 bg-destructive px-2 py-1 text-xs font-bold text-destructive-foreground shadow-lg md:left-4 md:top-4 md:px-3 md:text-sm'>
                  -{discountPercentage}% OFERTA
                </Badge>
              )}

              <Swiper {...swiperConfig} onSwiper={setMainSwiper}>
                {product.images.map((image, index) => (
                  <SwiperSlide key={index}>
                    <div className='aspect-square w-full'>
                      <Image
                        src={image || "/tienda-alli-webp"}
                        width={600}
                        height={600}
                        alt={`${product.title} - Vista ${index + 1}`}
                        className='h-full w-full object-cover'
                        fetchPriority={index === 0 ? "high" : "low"}
                        priority={index === 0}
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>

              {!isMobile && (
                <button
                  onClick={() => mainSwiper?.zoom.toggle()}
                  className='absolute right-3 top-3 z-10 rounded-full bg-black/60 p-2 text-white backdrop-blur-sm transition-all hover:bg-black/80 md:right-4 md:top-4'
                  aria-label='Ampliar imagen'
                >
                  <Maximize2 className='h-4 w-4 md:h-5 md:w-5' />
                </button>
              )}

              {isMobile && product.images.length > 1 && (
                <div className='absolute bottom-3 right-3 z-10 rounded-full bg-black/60 px-2 py-1 text-xs font-medium text-white'>
                  {product.images.length} fotos
                </div>
              )}
            </div>

            {/* Thumbnails - Solo desktop */}
            {!isMobile && product.images.length > 1 && (
              <Swiper
                onSwiper={setThumbsSwiper}
                modules={[FreeMode, Thumbs]}
                watchSlidesProgress
                freeMode={true}
                spaceBetween={8}
                slidesPerView={4}
                className='mt-3 h-20 md:h-24'
              >
                {product.images.map((image, index) => (
                  <SwiperSlide key={index}>
                    <div className='relative h-full w-full cursor-pointer overflow-hidden rounded-lg border-2 border-transparent transition-all hover:border-primary'>
                      <Image
                        src={image || "/tienda-alli-webp"}
                        alt={`Miniatura ${index + 1}`}
                        fill
                        className='object-cover'
                        sizes='(max-width: 1024px) 25vw, 20vw'
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            )}
          </div>

          {/* Product Info */}
          <div className='space-y-5 md:space-y-6 lg:pt-4'>
            {/* Categories */}
            {product.categories && product.categories.length > 0 && (
              <div className='-mx-2 flex flex-wrap gap-1 overflow-x-auto px-2 py-1 md:gap-2'>
                {product.categories.map((category) => (
                  <Badge
                    key={category.id}
                    variant='outline'
                    className='whitespace-nowrap text-xs !bg-primary/80 !text-secondary md:text-sm'
                  >
                    {category.title}
                  </Badge>
                ))}
              </div>
            )}

            {/* Title */}
            <h1 className='text-pretty text-3xl font-bold tracking-tight'>{product.title}</h1>

            {/* Price */}
            <div className='flex flex-wrap items-baseline gap-2 md:gap-3'>
              <span className='text-3xl font-black text-primary md:text-4xl'>
                ${currentPrice.toLocaleString("es-AR")}
              </span>
              {hasDiscount && (
                <span className='text-xl text-muted-foreground line-through md:text-2xl'>
                  ${originalPrice.toLocaleString("es-AR")}
                </span>
              )}
            </div>

            {/* Description */}
            <div className='space-y-3'>
              <div className='relative'>
                <p className='line-clamp-3 text-sm leading-relaxed text-muted-foreground md:text-base'>
                  {product.description}
                </p>
                {product.description.length > 200 && (
                  <div className='absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-background to-transparent' />
                )}
              </div>
              <Button
                variant='outline'
                size='sm'
                onClick={() => setShowDescriptionModal(true)}
                className='w-full'
              >
                Ver descripción completa
              </Button>
            </div>

            {/* Color Variants - Nueva estructura */}
            {hasVariants && hasColors && (
              <div className='space-y-2 md:space-y-3'>
                <div className='flex items-center justify-between'>
                  <label className='flex items-center gap-2 text-sm font-semibold  md:text-base'>
                    <Palette className='h-4 w-4' />
                    Color
                  </label>
                  {selectedColorName && (
                    <span className='text-sm font-medium bg-primary/20 py-1 px-2 rounded-lg'>
                      {selectedColorName}
                    </span>
                  )}
                </div>
                <div className='-mx-2 flex gap-2 overflow-x-auto p-2 pb-2'>
                  {uniqueColors.map((color) => (
                    <button
                      key={color.colorHex}
                      onClick={() => {
                        setSelectedColorHex(color.colorHex);
                        setSelectedColorName(color.colorName);
                        setSelectedSize("");
                        setSelectedVariant(null);
                      }}
                      className={`relative flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl border-2 transition-all md:h-16 md:w-16 ${
                        selectedColorHex === color.colorHex
                          ? "scale-105 border-primary ring-2 ring-primary ring-offset-1"
                          : "border-border hover:scale-105"
                      }`}
                      style={{ backgroundColor: color.colorHex }}
                      aria-label={`Seleccionar color ${color.colorName}`}
                    >
                      {selectedColorHex === color.colorHex && (
                        <Check className='absolute right-1 top-1 h-3 w-3 text-white drop-shadow-md' />
                      )}
                      <span className='sr-only'>{color.colorName}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection - Nueva estructura */}
            {hasVariants && hasSizes && selectedColorHex && (
              <div id='size-section' className='scroll-mt-20 space-y-2 md:space-y-3'>
                <div className='flex items-center justify-between'>
                  <label className='flex items-center gap-2 text-sm font-semibold md:text-base'>
                    <Ruler className='h-4 w-4' />
                    Talla
                  </label>
                  {selectedSize && (
                    <span className='text-sm font-medium text-muted-foreground'>
                      Seleccionada: {selectedSize}
                    </span>
                  )}
                </div>

                {!selectedSize && (
                  <div className='rounded-lg bg-amber-100 p-2 text-sm text-amber-800 md:p-3'>
                    ⚠️ Por favor, selecciona una talla antes de agregar al carrito
                  </div>
                )}

                <div className='grid grid-cols-4 gap-2 sm:grid-cols-5 md:grid-cols-4 md:gap-3 lg:grid-cols-5'>
                  {uniqueSizes.map((size) => {
                    const stockForSize = getStockForSize(size);
                    const isAvailable = stockForSize > 0;
                    const isSelected = selectedSize === size;

                    return (
                      <button
                        key={size}
                        onClick={() => isAvailable && handleSizeSelect(size)}
                        disabled={!isAvailable}
                        className={`relative rounded-lg border-2 py-3 text-sm font-semibold transition-all md:py-3 md:text-base ${
                          isSelected
                            ? "border-primary bg-primary text-secondary shadow-md"
                            : isAvailable
                              ? "border-primary/30 bg-background hover:border-primary/80 hover:bg-accent cursor-pointer"
                              : "border-border bg-gray-100 text-gray-400 cursor-not-allowed opacity-50"
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Mensaje cuando no hay color seleccionado */}
            {hasVariants && hasColors && !selectedColorHex && (
              <div className='rounded-lg bg-blue-100 p-3 text-center text-sm text-blue-800'>
                🎨 Selecciona un color para ver las tallas disponibles
              </div>
            )}

            {/* Quantity Selector */}
            {canAddToCart && (
              <div className='space-y-2 md:space-y-3'>
                <label className='text-sm font-semibold  md:text-base'>Cantidad</label>
                <div className='flex items-center justify-between rounded-lg border p-3 md:p-4'>
                  <div className='flex items-center gap-3 md:gap-4'>
                    <Button
                      variant='outline'
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                      className='h-10 w-10 md:h-12 md:w-12 !p-1'
                      aria-label='Reducir cantidad'
                    >
                      <Minus className='h-6 w-6' />
                    </Button>
                    <span className='min-w-[40px] text-center text-lg font-bold md:text-xl'>
                      {quantity}
                    </span>
                    <Button
                      variant='outline'
                      onClick={() => handleQuantityChange(1)}
                      disabled={quantity >= (selectedVariant?.stock || 99)}
                      className='h-10 w-10 md:h-12 md:w-12 !p-1'
                      aria-label='Aumentar cantidad'
                    >
                      <Plus className='h-6 w-6' />
                    </Button>
                  </div>
                  <div className='text-right'>
                    <div className='text-sm text-muted-foreground md:text-base'>Total:</div>
                    <div className='text-lg font-bold md:text-2xl'>
                      ${(currentPrice * quantity).toLocaleString("es-AR")}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Add to Cart Button */}
            <div
              className={`${isMobile ? "sticky bottom-0 left-0 right-0 z-40 bg-background pt-4 pb-6" : ""}`}
            >
              <Button
                onClick={handleAddToCart}
                disabled={!canAddToCart}
                size={isMobile ? "lg" : "lg"}
                className={`w-full text-lg font-semibold shadow-lg transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 ${
                  isMobile ? "py-6 text-base" : ""
                }`}
              >
                <ShoppingCart className={`mr-2 ${isMobile ? "h-5 w-5" : "h-5 w-5"}`} />
                {buttonText}
              </Button>

              {isMobile && hasSizes && !selectedSize && selectedColorHex && (
                <p className='mt-2 text-center text-sm text-muted-foreground'>
                  ↑ Desplázate para seleccionar talla ↑
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <ToastContainer
        position='bottom-right'
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme='light'
      />

      <DescriptionModal
        isOpen={showDescriptionModal}
        onClose={() => setShowDescriptionModal(false)}
        title={product.title}
        description={product.description}
      />
    </>
  );
}
