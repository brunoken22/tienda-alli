"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Minus, Plus, ShoppingCart, Maximize2, Check, X } from "lucide-react";
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
      {/* Overlay con backdrop blur */}
      <div className='absolute inset-0 bg-black/60 backdrop-blur-sm' onClick={onClose} />

      {/* Modal */}
      <div className='relative z-10 w-full max-w-2xl max-h-[80vh] overflow-hidden rounded-xl bg-secondary shadow-2xl'>
        {/* Header */}
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

        {/* Contenido con scroll */}
        <div className='overflow-y-auto p-6' style={{ maxHeight: "calc(80vh - 120px)" }}>
          <h3 className='mb-4 text-lg font-semibold'>{title}</h3>
          <div className='whitespace-pre-wrap text-base leading-relaxed text-foreground'>
            {description}
          </div>
        </div>

        {/* Footer */}
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
  const [selectedVariant, setSelectedVariant] = useState<VariantType | null>(
    product.variant.length > 0 ? product.variant[0] : null
  );
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  const [isSizeSelected, setIsSizeSelected] = useState(false);
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

  // Controlar el scroll del body cuando el modal está abierto
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

  const hasVariants = product.variant.length > 0;
  const hasSizes = selectedVariant ? selectedVariant.sizes.length > 0 : product.sizes.length > 0;
  const availableSizes = selectedVariant ? selectedVariant.sizes : product.sizes;
  const currentPrice = selectedVariant
    ? selectedVariant.priceOffer || selectedVariant.price
    : Number(product.priceOffer) || Number(product.price);
  const originalPrice = selectedVariant ? Number(selectedVariant.price) : Number(product.price);
  const hasDiscount = currentPrice < originalPrice;
  const discountPercentage = hasDiscount
    ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    console.log(hasSizes, selectedSize);
    if (hasSizes && !selectedSize) {
      setIsSizeSelected(false);
      // Scroll a las tallas si no hay selección
      document.getElementById("size-section")?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });

      return;
    }
    let newAddItem: Omit<ShoppingCartType, "variant">;
    newAddItem = {
      id: product.id,
      title: product.title,
      price: currentPrice,
      priceOffer: product.priceOffer,
      quantity: quantity,
      images: product.images,
      variantColorName: selectedVariant?.colorName || "",
      variantColorHex: selectedVariant?.colorHex || "",
      variantSize: selectedSize || "",
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
    setIsSizeSelected(true);
  };

  // Swiper configuration para mobile/desktop
  const swiperConfig = {
    modules: isMobile ? [Pagination, Zoom] : [Navigation, Thumbs, Zoom, FreeMode],
    navigation: !isMobile,
    pagination: isMobile ? { clickable: true } : false,
    zoom: {
      maxRatio: 3,
      minRatio: 1,
      toggle: true,
    },
    thumbs: !isMobile
      ? {
          swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
        }
      : undefined,
    spaceBetween: isMobile ? 0 : 10,
    className: "h-full rounded-2xl md:rounded-3xl",
    breakpoints: {
      320: {
        slidesPerView: 1,
      },
      768: {
        slidesPerView: 1,
      },
    },
  };

  return (
    <>
      <div className='mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 md:py-8'>
        <div className='flex flex-col gap-6 lg:grid lg:grid-cols-2 lg:gap-10 xl:gap-12'>
          {/* Image Gallery con Swiper - Optimizado para mobile */}
          <div className='space-y-3 md:space-y-4'>
            {/* Swiper Principal */}
            <div className='relative w-full overflow-hidden rounded-xl bg-muted md:rounded-2xl'>
              {hasDiscount && (
                <Badge className='absolute left-3 top-3 z-10 bg-destructive px-2 py-1 text-xs font-bold text-destructive-foreground shadow-lg md:left-4 md:top-4 md:px-3 md:text-sm'>
                  -{discountPercentage}%
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
                        priority={index === 0}
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>

              {/* Botón de zoom - Solo desktop */}
              {!isMobile && (
                <button
                  onClick={() => mainSwiper?.zoom.toggle()}
                  className='absolute right-3 top-3 z-10 rounded-full bg-black/60 p-2 text-white backdrop-blur-sm transition-all hover:bg-black/80 md:right-4 md:top-4'
                  aria-label='Ampliar imagen'
                >
                  <Maximize2 className='h-4 w-4 md:h-5 md:w-5' />
                </button>
              )}

              {/* Indicador de imagen en mobile */}
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

          {/* Product Info - Optimizado para mobile */}
          <div className='space-y-5 md:space-y-6 lg:pt-4'>
            {/* Categories - Mejor espaciado en mobile */}
            {product?.categories && product?.categories?.length > 0 && (
              <div className='-mx-2 flex flex-wrap gap-1 overflow-x-auto px-2 py-1 md:gap-2'>
                {product.categories?.map((category) => (
                  <Badge
                    key={category.id}
                    variant='outline'
                    className='whitespace-nowrap text-xs !bg-primary/40 !text-secondary md:text-sm'
                  >
                    {category.title}
                  </Badge>
                ))}
              </div>
            )}

            {/* Title - Ajuste de tamaño para mobile */}
            <h1 className='text-pretty text-3xl font-bold tracking-tight'>{product.title}</h1>

            {/* Price - Ajuste de tamaño */}
            <div className='flex flex-wrap items-baseline gap-2 md:gap-3'>
              <span className='text-3xl font-black text-primary md:text-4xl'>
                ${currentPrice.toFixed(2)}
              </span>
              {hasDiscount && (
                <span className='text-xl text-muted-foreground line-through md:text-2xl'>
                  ${originalPrice.toFixed(2)}
                </span>
              )}
            </div>

            {/* Description - Con botón para abrir modal */}
            <div className='space-y-3'>
              {/* <div className='flex items-center justify-between'>
                <h2 className='text-lg font-semibold md:text-xl'>Descripción</h2>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={() => setShowDescriptionModal(true)}
                  className='flex items-center gap-1 text-sm text-primary hover:text-primary/80'
                >
                  <Eye className='h-4 w-4' />
                  Ver completa
                </Button>
              </div> */}

              {/* Vista previa de la descripción (limitada a 3 líneas) */}
              <div className='relative'>
                <p className='line-clamp-3 text-sm leading-relaxed text-muted-foreground md:text-base'>
                  {product.description}
                </p>

                {/* Si el texto es muy largo, mostrar gradiente */}
                {product.description.length > 200 && (
                  <div className='absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-background to-transparent' />
                )}
              </div>

              {/* Botón para abrir modal (alternativo) */}
              <Button
                variant='outline'
                size='sm'
                onClick={() => setShowDescriptionModal(true)}
                className='w-full'
              >
                Ver descripción completa
              </Button>
            </div>

            {/* Color Variants - Scroll horizontal en mobile */}
            {hasVariants && (
              <div className='space-y-2 md:space-y-3'>
                <label className='flex items-center justify-between text-sm font-semibold text-foreground md:text-base'>
                  <span>Color</span>
                  {selectedVariant && (
                    <span className='font-medium text-muted-foreground'>
                      {selectedVariant.colorName}
                    </span>
                  )}
                </label>
                <div className='-mx-2 flex gap-2 overflow-x-auto p-2 pb-2'>
                  {product.variant.map((variant) => (
                    <button
                      key={variant.id}
                      onClick={() => {
                        setSelectedVariant(variant);
                        setSelectedSize("");
                        setIsSizeSelected(false);
                      }}
                      className={`relative flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl border-2 transition-all md:h-16 md:w-16 ${
                        selectedVariant?.id === variant.id
                          ? "scale-105 border-primary ring-2 ring-primary ring-offset-1"
                          : "border-border hover:scale-105"
                      }`}
                      style={{ backgroundColor: variant.colorHex }}
                      aria-label={`Seleccionar color ${variant.colorName}`}
                    >
                      {selectedVariant?.id === variant.id && (
                        <Check className='absolute right-1 top-1 h-3 w-3 text-white drop-shadow-md' />
                      )}
                      <span className='sr-only'>{variant.colorName}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection - Mejor grid para mobile */}
            {hasSizes && (
              <div id='size-section' className='scroll-mt-20 space-y-2 md:space-y-3'>
                <label className='flex items-center justify-between text-sm font-semibold text-foreground md:text-base'>
                  <span>Talla</span>
                  {selectedSize && (
                    <span className='font-medium text-muted-foreground'>
                      Seleccionada: {selectedSize}
                    </span>
                  )}
                </label>

                {!isSizeSelected && selectedSize === "" && (
                  <div className='rounded-lg bg-amber-100 p-2 text-sm text-amber-800 md:p-3'>
                    ⚠️ Por favor, selecciona una talla antes de agregar al carrito
                  </div>
                )}

                <div className='grid grid-cols-4 gap-2 sm:grid-cols-5 md:grid-cols-4 md:gap-3 lg:grid-cols-5'>
                  {availableSizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => handleSizeSelect(size)}
                      className={`relative rounded-lg border-2 py-3 text-sm font-semibold transition-all md:py-3 md:text-base  ${
                        selectedSize === size
                          ? " border-primary bg-primary text-secondary shadow-md"
                          : "border-primary/30 bg-background hover:border-primary/80 hover:bg-accent"
                      }`}
                    >
                      {size}
                      {selectedSize === size && (
                        <Check className='absolute right-1 top-1 h-3 w-3' />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector - Más táctil para mobile */}
            <div className='space-y-2 md:space-y-3'>
              <label className='text-sm font-semibold text-foreground md:text-base'>Cantidad</label>
              <div className='flex items-center justify-between rounded-lg border p-3 md:p-4'>
                <div className='flex items-center gap-3 md:gap-4'>
                  <Button
                    variant='outline'
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className='h-10 w-10 md:h-12 md:w-12'
                    aria-label='Reducir cantidad'
                  >
                    <Minus className='h-4 w-4' />
                  </Button>
                  <span className='min-w-[40px] text-center text-lg font-bold md:text-xl'>
                    {quantity}
                  </span>
                  <Button
                    variant='outline'
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= 99}
                    className='h-10 w-10 md:h-12 md:w-12'
                    aria-label='Aumentar cantidad'
                  >
                    <Plus className='h-4 w-4' />
                  </Button>
                </div>
                <div className='text-right'>
                  <div className='text-sm text-muted-foreground md:text-base'>Total:</div>
                  <div className='text-lg font-bold md:text-2xl'>
                    ${(currentPrice * quantity).toFixed(2)}
                  </div>
                </div>
              </div>
            </div>

            {/* Add to Cart Button - Sticky en mobile */}
            <div
              className={`${
                isMobile ? "sticky bottom-0 left-0 right-0 z-50 bg-background pt-4 pb-6" : ""
              }`}
            >
              <Button
                onClick={handleAddToCart}
                disabled={hasSizes && !selectedSize}
                size={isMobile ? "lg" : "lg"}
                className={`w-full text-lg font-semibold shadow-lg transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 ${
                  isMobile ? "py-6 text-base" : ""
                }`}
              >
                <ShoppingCart className={`mr-2 ${isMobile ? "h-5 w-5" : "h-5 w-5"}`} />
                {hasSizes && !selectedSize
                  ? "SELECCIONAR TALLA"
                  : `AGREGAR AL CARRITO - $${(currentPrice * quantity).toFixed(2)}`}
              </Button>

              {/* Mensaje de ayuda en mobile */}
              {isMobile && hasSizes && !selectedSize && (
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
      {/* Modal para descripción completa */}
      <DescriptionModal
        isOpen={showDescriptionModal}
        onClose={() => setShowDescriptionModal(false)}
        title={product.title}
        description={product.description}
      />
    </>
  );
}
