import { ProductType, VariantType } from "@/types/product";
import { Badge } from "./ui/badge";
import Link from "next/link";
import SimpleHoverSwiper from "@/components/HoverSwiper";
import { Switch } from "./ui/switch";
import { Button } from "./ui/button";
import { Pencil, Trash2, Package, Ruler, Palette, Layers } from "lucide-react";
import { Dispatch, SetStateAction, useState, useMemo } from "react";

export default function TemplateProductDashboard({
  product,
  handleActiveProduct,
  handleEditProduct,
  handleDeleteProduct,
}: {
  product: ProductType;
  handleActiveProduct: (
    active: boolean,
    id: string,
    setIsActive: Dispatch<SetStateAction<boolean>>,
  ) => void;
  handleEditProduct: (product: ProductType) => void;
  handleDeleteProduct: (id: string) => void;
}) {
  const [isActive, setIsActive] = useState(product.isActive);
  const [expandedSize, setExpandedSize] = useState<string | null>(null);

  // Calcular stock total sumando todas las variantes
  const totalStock = useMemo(() => {
    if (product.variants && product.variants.length > 0) {
      return product.variants.reduce((sum, variant) => sum + (variant.stock || 0), 0);
    }
    return 0;
  }, [product.variants]);

  // Agrupar variantes por TALLE (nueva estructura: un talle con múltiples colores)
  const variantsBySize = useMemo((): Map<string, VariantType[]> => {
    if (!product.variants || product.variants.length === 0) {
      return new Map<string, VariantType[]>();
    }

    const sizeMap = new Map<string, VariantType[]>();

    product.variants.forEach((variant: VariantType) => {
      const size = variant.size;
      if (!size) return;

      const existing = sizeMap.get(size);
      if (existing) {
        existing.push(variant);
      } else {
        sizeMap.set(size, [variant]);
      }
    });

    return sizeMap;
  }, [product.variants]);

  // Obtener colores únicos de todas las variantes (para vista general)
  const uniqueColors = useMemo(() => {
    if (!product.variants || product.variants.length === 0) return [];

    const colorMap = new Map<string, string>();
    product.variants.forEach((variant) => {
      if (!colorMap.has(variant.colorName)) {
        colorMap.set(variant.colorName, variant.colorHex);
      }
    });
    return Array.from(colorMap.entries()).map(([name, hex]) => ({ name, hex }));
  }, [product.variants]);

  // Calcular precio mínimo y máximo
  const { minPrice, maxPrice, hasDiscount, discountPercentage } = useMemo(() => {
    if (!product.variants || product.variants.length === 0) {
      return { minPrice: 0, maxPrice: 0, hasDiscount: false, discountPercentage: 0 };
    }

    const prices = product.variants.map((v) => (v.priceOffer > 0 ? v.priceOffer : v.price));
    const min = Math.min(...prices);
    const max = Math.max(...prices);

    const hasAnyOffer = product.variants.some((v) => v.priceOffer > 0);
    const bestDiscount = hasAnyOffer
      ? Math.max(
          ...product.variants.map((v) => {
            if (v.priceOffer > 0) {
              return Math.round(((v.price - v.priceOffer) / v.price) * 100);
            }
            return 0;
          }),
        )
      : 0;

    return {
      minPrice: min,
      maxPrice: max,
      hasDiscount: hasAnyOffer,
      discountPercentage: bestDiscount,
    };
  }, [product.variants]);

  const hasVariants = product.variants && product.variants.length > 0;
  const priceDisplay =
    minPrice === maxPrice
      ? `$${minPrice.toLocaleString("es-AR")}`
      : `$${minPrice.toLocaleString("es-AR")} - $${maxPrice.toLocaleString("es-AR")}`;

  // Calcular stock por talle
  const getStockBySize = (size: string) => {
    const variants = variantsBySize.get(size) || [];
    return variants.reduce((sum, v) => sum + (v.stock || 0), 0);
  };

  // Obtener precio de un color específico en un talle
  const getPriceForSizeAndColor = (size: string, colorHex: string) => {
    const variants = variantsBySize.get(size) || [];
    const variant = variants.find((v) => v.colorHex === colorHex);
    if (variant) {
      return {
        price: variant.price,
        priceOffer: variant.priceOffer,
        hasOffer: variant.priceOffer > 0,
      };
    }
    return { price: 0, priceOffer: 0, hasOffer: false };
  };

  const toggleSizeExpand = (size: string) => {
    if (expandedSize === size) {
      setExpandedSize(null);
    } else {
      setExpandedSize(size);
    }
  };

  return (
    <div
      className={`relative rounded-xl overflow-hidden shadow-md hover:shadow-xl hover:scale-[1.02] hover:border-primary/30 transition-all duration-500 group ${
        !isActive ? "opacity-75" : ""
      } flex flex-col bg-white `}
    >
      {!isActive && <div className='absolute z-20 inset-0 bg-black/20 backdrop-blur-[1px]' />}

      {!isActive && (
        <div className='absolute z-30 top-4 left-4'>
          <Badge
            variant='secondary'
            className='bg-gray-900/80 backdrop-blur-sm text-white border-0'
          >
            Desactivado
          </Badge>
        </div>
      )}

      {/* Sección de imagen */}
      <div
        className={`relative overflow-hidden bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 w-full flex-shrink-0 h-[200px]`}
      >
        <div className='absolute top-4 right-4 z-10 flex flex-col gap-2.5 items-end'>
          {hasDiscount && discountPercentage > 0 && (
            <Badge className='bg-gradient-to-r from-rose-500 via-pink-500 to-red-500 hover:from-rose-600 hover:via-pink-600 hover:to-red-600 border-0 shadow-2xl backdrop-blur-xl text-white text-xs font-bold px-3 py-1.5 rounded-full animate-in slide-in-from-right-5'>
              🔥 HASTA -{discountPercentage}%
            </Badge>
          )}
          {hasVariants && (
            <Badge className='backdrop-blur-xl bg-gradient-to-r from-violet-500/90 to-purple-500/90 border-0 shadow-xl text-white text-xs font-semibold px-3 py-1.5 rounded-full'>
              <Layers className='w-3 h-3 mr-1' />
              {product.variants.length} {product.variants.length === 1 ? "Variante" : "Variantes"}
            </Badge>
          )}
        </div>

        <div className='h-full'>
          <Link href={`/productos/${product.id}`}>
            <SimpleHoverSwiper
              classNameImg='object-cover'
              imageUrls={product.images.filter((img) => typeof img === "string")}
              title={product.title}
            />
          </Link>
        </div>
        <div className='absolute inset-0 bg-gradient-to-t from-primary/10 via-transparent to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500' />
      </div>

      {/* Contenido */}
      <div className='p-4 flex flex-col flex-1'>
        <div className='flex-1 space-y-4'>
          {/* Título y estado */}
          <div className='flex items-start justify-between gap-3'>
            <Link href={`/productos/${product.id}`} className='truncate hover:text-primary flex-1'>
              <h3 className='text-lg font-semibold leading-tight line-clamp-2'>{product.title}</h3>
            </Link>

            <div className='flex items-center gap-2 shrink-0'>
              <span
                className={`text-xs font-medium ${isActive ? "text-green-600" : "text-gray-400"}`}
              >
                {isActive ? "Activo" : "Inactivo"}
              </span>
              <Switch
                checked={isActive}
                onCheckedChange={(active) => handleActiveProduct(active, product.id, setIsActive)}
              />
            </div>
          </div>

          {/* Categorías */}
          {product.categories && product.categories.length > 0 && (
            <div className='flex flex-row overflow-x-auto gap-2 scroll-personalizado pb-1'>
              {product.categories.map((cat) => (
                <p
                  key={cat.id}
                  className='text-xs font-semibold border border-primary/20 bg-gradient-to-r from-primary/10 to-primary/5 text-primary hover:border-primary/40 hover:bg-primary/15 transition-all px-3 py-1 rounded-full whitespace-nowrap'
                >
                  {cat.title}
                </p>
              ))}
            </div>
          )}

          {/* Stock total */}
          <div className='flex items-center gap-4 text-sm bg-gray-50 /50 p-2 rounded-lg'>
            <div className='flex items-center gap-1.5'>
              <Package className='w-4 h-4 text-primary' />
              <span className='text-muted-foreground'>Stock total:</span>
              <span
                className={`font-bold ${
                  totalStock <= 5
                    ? "text-red-500"
                    : totalStock <= 10
                      ? "text-orange-500"
                      : "text-green-600"
                }`}
              >
                {totalStock} unidades
              </span>
            </div>
          </div>

          {/* Variantes - AGRUPADAS POR TALLE */}
          {hasVariants && (
            <div className='space-y-3'>
              {/* Resumen rápido de colores */}
              {uniqueColors.length > 0 && (
                <div className='space-y-1.5'>
                  <div className='flex items-center gap-1.5 text-xs font-medium text-muted-foreground'>
                    <Palette className='w-3.5 h-3.5' />
                    <span>Colores disponibles:</span>
                  </div>
                  <div className='flex flex-wrap gap-2'>
                    {uniqueColors.map((color) => (
                      <div key={color.name} className='flex items-center gap-1.5'>
                        <div
                          className='w-5 h-5 rounded-full border border-gray-300 shadow-sm'
                          style={{ backgroundColor: color.hex }}
                          title={color.name}
                        />
                        <span className='text-xs capitalize'>{color.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Talles con sus colores - VISTA PRINCIPAL */}
              <div className='space-y-2'>
                <div className='flex items-center gap-1.5 text-xs font-medium text-muted-foreground'>
                  <Ruler className='w-3.5 h-3.5' />
                  <span>Talles disponibles ({variantsBySize.size})</span>
                </div>

                <div className='space-y-2'>
                  {Array.from(variantsBySize.entries()).map(([size, variants]) => {
                    const stockForSize = getStockBySize(size);
                    const isExpanded = expandedSize === size;

                    return (
                      <div key={size} className='border rounded-lg overflow-hidden'>
                        {/* Cabecera del talle */}
                        <button
                          onClick={() => toggleSizeExpand(size)}
                          className='w-full flex items-center justify-between p-3 bg-gray-50 /30 hover:bg-gray-100 -800/50 transition-colors'
                        >
                          <div className='flex items-center gap-3'>
                            <span className='font-bold text-md'>{size}</span>
                            <Badge
                              variant={stockForSize > 0 ? "default" : "destructive"}
                              className='text-xs'
                            >
                              {stockForSize > 0 ? `${stockForSize} unidades` : "Sin stock"}
                            </Badge>
                          </div>
                          <div className='flex items-center gap-2'>
                            <div className='flex -space-x-1'>
                              {variants.slice(0, 3).map((v) => (
                                <div
                                  key={v.colorHex}
                                  className='w-5 h-5 rounded-full border-2 border-white shadow-sm'
                                  style={{ backgroundColor: v.colorHex }}
                                  title={v.colorName}
                                />
                              ))}
                              {variants.length > 3 && (
                                <span className='text-xs text-muted-foreground ml-1'>
                                  +{variants.length - 3}
                                </span>
                              )}
                            </div>
                            <svg
                              className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                              fill='none'
                              stroke='currentColor'
                              viewBox='0 0 24 24'
                            >
                              <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                strokeWidth={2}
                                d='M19 9l-7 7-7-7'
                              />
                            </svg>
                          </div>
                        </button>

                        {/* Detalle de colores para este talle (expandible) */}
                        {isExpanded && (
                          <div className='p-3 border-t space-y-2'>
                            <div className='text-xs font-medium text-muted-foreground mb-2'>
                              Colores disponibles para talle {size}:
                            </div>
                            <div className='grid grid-cols-1 gap-2'>
                              {variants.map((variant) => {
                                const priceInfo = getPriceForSizeAndColor(size, variant.colorHex);
                                const hasStockColor = variant.stock > 0;

                                return (
                                  <div
                                    key={variant.id}
                                    className={`flex items-center justify-between p-2 rounded-lg ${
                                      hasStockColor ? "bg-gray-50 /20" : "bg-red-50 /10 opacity-60"
                                    }`}
                                  >
                                    <div className='flex items-center gap-3'>
                                      <div
                                        className='w-6 h-6 rounded-full border shadow-sm'
                                        style={{ backgroundColor: variant.colorHex }}
                                      />
                                      <div>
                                        <span className='text-sm font-medium capitalize'>
                                          {variant.colorName}
                                        </span>
                                        {!hasStockColor && (
                                          <Badge variant='destructive' className='ml-2 text-xs'>
                                            Agotado
                                          </Badge>
                                        )}
                                      </div>
                                    </div>
                                    <div className='flex items-center gap-3'>
                                      <div className='text-right'>
                                        {priceInfo.hasOffer ? (
                                          <>
                                            <span className='text-sm font-bold text-green-600'>
                                              ${priceInfo.priceOffer.toLocaleString("es-AR")}
                                            </span>
                                            <span className='text-xs text-gray-400 line-through ml-1'>
                                              ${priceInfo.price.toLocaleString("es-AR")}
                                            </span>
                                          </>
                                        ) : (
                                          <span className='text-sm font-medium'>
                                            ${priceInfo.price.toLocaleString("es-AR")}
                                          </span>
                                        )}
                                      </div>
                                      <Badge
                                        variant={hasStockColor ? "secondary" : "outline"}
                                        className='text-xs min-w-[70px] justify-center'
                                      >
                                        {hasStockColor ? `Stock: ${variant.stock}` : "Sin stock"}
                                      </Badge>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Resumen compacto (vista colapsada) */}
              {/* <details className='text-xs'>
                <summary className='cursor-pointer text-primary hover:text-primary/80 font-medium mb-2'>
                  Ver resumen completo por talle y color
                </summary>
                <div className='space-y-3 mt-2 max-h-60 overflow-y-auto'>
                  {Array.from(variantsBySize.entries()).map(([size, variants]) => (
                    <div key={size} className='bg-gray-50 /30 p-2 rounded-lg'>
                      <div className='font-bold text-sm mb-2 flex items-center gap-2'>
                        <Ruler className='w-3 h-3' />
                        Talle {size}
                        <Badge variant='outline' className='text-xs'>
                          {variants.length} {variants.length === 1 ? "color" : "colores"}
                        </Badge>
                      </div>
                      <div className='space-y-1.5'>
                        {variants.map((variant) => (
                          <div key={variant.id} className='flex items-center justify-between pl-2'>
                            <div className='flex items-center gap-2'>
                              <div
                                className='w-3 h-3 rounded-full'
                                style={{ backgroundColor: variant.colorHex }}
                              />
                              <span className='text-xs capitalize'>{variant.colorName}</span>
                            </div>
                            <div className='flex items-center gap-3'>
                              <span className='text-xs'>
                                {variant.priceOffer > 0 ? (
                                  <>
                                    <span className='text-green-600 font-bold'>
                                      ${variant.priceOffer.toLocaleString("es-AR")}
                                    </span>
                                    <span className='text-gray-400 line-through ml-1 text-[10px]'>
                                      ${variant.price.toLocaleString("es-AR")}
                                    </span>
                                  </>
                                ) : (
                                  `$${variant.price.toLocaleString("es-AR")}`
                                )}
                              </span>
                              <Badge
                                variant={variant.stock > 0 ? "default" : "destructive"}
                                className='text-[10px] px-1.5'
                              >
                                {variant.stock > 0 ? `${variant.stock}u` : "agotado"}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </details> */}
            </div>
          )}
        </div>

        {/* Precios */}
        <div className='pt-2 border-t border-gray-100  mt-2'>
          <div className='flex items-baseline gap-2 flex-wrap'>
            <span className='text-xl font-bold text-primary'>{priceDisplay}</span>
            {hasDiscount && discountPercentage > 0 && (
              <Badge variant='secondary' className='text-xs bg-green-100 text-green-700'>
                Ahorra hasta {discountPercentage}%
              </Badge>
            )}
          </div>
        </div>

        {/* Botones de acción */}
        <div className='flex gap-3 pt-4 mt-2'>
          <Button
            variant='primary'
            className={`flex-1 gap-2 transition-all font-semibold ${!isActive ? "relative z-30" : ""}`}
            size='md'
            onClick={() => handleEditProduct(product)}
          >
            <Pencil className='w-4 h-4' />
            <span>Editar</span>
          </Button>
          <Button
            variant='outline'
            size='md'
            className='flex-none w-1/4 gap-2 border-red-400 hover:bg-red-600 hover:text-white hover:border-red-600 transition-all font-semibold'
            onClick={() => handleDeleteProduct(product.id)}
          >
            <Trash2 className='w-4 h-4' />
          </Button>
        </div>
      </div>
    </div>
  );
}
