import { ProductType, VariantType } from "@/types/product";
import { Badge } from "./ui/badge";
import Link from "next/link";
import SimpleHoverSwiper from "@/components/HoverSwiper";
import { Switch } from "./ui/switch";
import { Button } from "./ui/button";
import { Pencil, Trash2, Package, Ruler, Palette, Layers } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";

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

  // Calcular stock total sumando todas las variantes
  const totalStock =
    product.variant.length > 0
      ? product.variant.reduce((sum, variant) => sum + variant.stock, 0)
      : product.stock;

  // Obtener colores únicos de las variantes
  const uniqueColors =
    product.variant.length > 0
      ? Array.from(new Map(product.variant.map((v) => [v.colorName, v.colorHex])).entries())
      : [];

  // Obtener talles únicos de las variantes
  const uniqueSizes =
    product.variant.length > 0
      ? Array.from(new Set(product.variant.flatMap((v) => v.sizes))).sort()
      : product.sizes || [];

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
          {product.priceOffer > 1 && (
            <Badge className='bg-gradient-to-r from-rose-500 via-pink-500 to-red-500 hover:from-rose-600 hover:via-pink-600 hover:to-red-600 border-0 shadow-2xl backdrop-blur-xl text-white text-xs font-bold px-3 py-1.5 rounded-full animate-in slide-in-from-right-5'>
              🔥 AHORRA {Math.round(((product.price - product.priceOffer) / product.price) * 100)}%
            </Badge>
          )}
          {product.variant.length > 0 && (
            <Badge className='backdrop-blur-xl bg-gradient-to-r from-violet-500/90 to-purple-500/90 border-0 shadow-xl text-white text-xs font-semibold px-3 py-1.5 rounded-full'>
              <Layers className='w-3 h-3 mr-1' />
              {product.variant.length} {product.variant.length === 1 ? "Variante" : "Variantes"}
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
              {product.categories.map((cat, i) => (
                <p
                  key={i}
                  className='text-xs font-semibold border border-primary/20 bg-gradient-to-r from-primary/10 to-primary/5 text-primary hover:border-primary/40 hover:bg-primary/15 transition-all px-3 py-1 rounded-full whitespace-nowrap'
                >
                  {cat.title}
                </p>
              ))}
            </div>
          )}

          {/* Stock total */}
          <div className='flex items-center gap-4 text-sm bg-gray-50 p-2 rounded-lg'>
            <div className='flex items-center gap-1.5'>
              <Package className='w-4 h-4 text-primary' />
              <span className='text-muted-foreground'>Stock total:</span>
              <span
                className={`font-bold ${totalStock <= 5 ? "text-red-500" : totalStock <= 20 ? "text-orange-500" : "text-green-600"}`}
              >
                {totalStock} unidades
              </span>
            </div>
          </div>

          {/* Variantes - Colores y Talles */}
          {product.variant.length > 0 ? (
            <div className='space-y-3'>
              {/* Colores disponibles */}
              {uniqueColors.length > 0 && (
                <div className='space-y-1.5'>
                  <div className='flex items-center gap-1.5 text-xs font-medium text-muted-foreground'>
                    <Palette className='w-3.5 h-3.5' />
                    <span>Colores disponibles:</span>
                  </div>
                  <div className='flex flex-wrap gap-2'>
                    {uniqueColors.map(([colorName, colorHex]) => (
                      <div key={colorName} className='flex items-center gap-1.5'>
                        <div
                          className='w-5 h-5 rounded-full border border-gray-300 shadow-sm'
                          style={{ backgroundColor: colorHex }}
                          title={colorName}
                        />
                        <span className='text-xs capitalize'>{colorName}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Talles disponibles */}
              {uniqueSizes.length > 0 && (
                <div className='space-y-1.5'>
                  <div className='flex items-center gap-1.5 text-xs font-medium text-muted-foreground'>
                    <Ruler className='w-3.5 h-3.5' />
                    <span>Talles disponibles:</span>
                  </div>
                  <div className='flex flex-wrap gap-1.5'>
                    {uniqueSizes.map((size) => (
                      <Badge key={size} variant='outline' className='text-xs font-mono px-2 py-0.5'>
                        {size}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Detalle por variante */}
              <details className='text-xs'>
                <summary className='cursor-pointer text-primary hover:text-primary/80 font-medium mb-2'>
                  Ver detalle por variante
                </summary>
                <div className='space-y-2 mt-2 max-h-40 overflow-y-auto'>
                  {product.variant.map((variant: VariantType) => (
                    <div key={variant.id} className='bg-gray-50 p-2 rounded-lg space-y-1'>
                      <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-2'>
                          <div
                            className='w-3 h-3 rounded-full'
                            style={{ backgroundColor: variant.colorHex }}
                          />
                          <span className='font-medium capitalize text-xs'>
                            {variant.colorName}
                          </span>
                        </div>
                        <Badge
                          variant={variant.stock > 0 ? "default" : "destructive"}
                          className='text-xs'
                        >
                          Stock: {variant.stock}
                        </Badge>
                      </div>
                      {variant.sizes.length > 0 && (
                        <div className='flex flex-wrap gap-1 pl-5'>
                          {variant.sizes.map((size) => (
                            <span key={size} className='text-xs bg-gray-200 px-1.5 py-0.5 rounded'>
                              {size}
                            </span>
                          ))}
                        </div>
                      )}
                      {(variant.priceOffer > 1 ? variant.priceOffer : variant.price) > 0 && (
                        <div className='pl-5 text-xs'>
                          {variant.priceOffer > 1 ? (
                            <>
                              <span className='text-green-600 font-bold'>
                                ${variant.priceOffer.toLocaleString("es-AR")}
                              </span>
                              <span className='text-gray-400 line-through ml-2'>
                                ${variant.price.toLocaleString("es-AR")}
                              </span>
                            </>
                          ) : (
                            <span className='font-medium'>
                              ${variant.price.toLocaleString("es-AR")}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </details>
            </div>
          ) : (
            // Producto sin variantes (stock simple)
            <div className='space-y-2'>
              <div className='flex items-center justify-between text-sm'>
                <span className='text-muted-foreground'>Stock:</span>
                <span
                  className={`font-bold ${product.stock <= 5 ? "text-red-500" : "text-primary"}`}
                >
                  {product.stock} unidades
                </span>
              </div>
              {product.sizes && product.sizes.length > 0 && (
                <div className='flex items-center gap-2 text-sm flex-wrap'>
                  <span className='text-muted-foreground'>Talles:</span>
                  <div className='flex gap-1.5 flex-wrap'>
                    {product.sizes.map((size) => (
                      <Badge key={size} variant='outline' className='text-xs'>
                        {size}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Precios */}
          <div className='pt-2 border-t border-gray-100 '>
            {product.priceOffer && product.priceOffer > 1 ? (
              <div className='flex items-baseline gap-3 flex-wrap'>
                <span className='text-2xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent'>
                  $
                  {product.priceOffer.toLocaleString("es-AR", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
                <span className='text-base text-gray-400 line-through'>
                  $
                  {product.price.toLocaleString("es-AR", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>
            ) : (
              <span className='text-2xl font-black bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent'>
                $
                {product.price.toLocaleString("es-AR", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
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
