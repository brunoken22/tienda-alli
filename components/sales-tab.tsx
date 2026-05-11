"use client";

import { useState } from "react";
import { ProductType, VariantType } from "@/types/product";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Minus, Plus, ImageOff } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

interface SalesTabProps {
  products: ProductType[];
  onUpdateStock: (productId: string, variantId: string | null, newStock: number) => void;
}

export function SalesTab({ products, onUpdateStock }: SalesTabProps) {
  const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      currencyDisplay: "symbol",
    }).format(price);
  };

  const handleProductClick = (product: ProductType) => {
    if (product.variants.length > 0) {
      setSelectedProduct(product);
      setDialogOpen(true);
    }
  };

  const handleDirectSale = (product: ProductType, delta: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const newStock = product.stock + delta;

    if (newStock < 0) {
      toast.error("Sin stock");
      return;
    }

    onUpdateStock(product.id, null, newStock);

    if (delta < 0) {
      toast.success(`-1 ${product.title}`);
    } else {
      toast.info(`+1 ${product.title}`);
    }
  };

  const handleVariantSale = (variant: VariantType, delta: number) => {
    if (!selectedProduct) return;

    const newStock = variant.stock + delta;

    if (newStock < 0) {
      toast.error("Sin stock");
      return;
    }

    onUpdateStock(selectedProduct.id, variant.id, newStock);

    // Actualizar el producto seleccionado con el nuevo stock
    setSelectedProduct({
      ...selectedProduct,
      variants: selectedProduct.variants.map((v) =>
        v.id === variant.id ? { ...v, stock: newStock } : v,
      ),
    });

    if (delta < 0) {
      toast.success(`-1 ${variant.size} ${variant.colorName}`);
    } else {
      toast.info(`+1 ${variant.size} ${variant.colorName}`);
    }
  };

  const activeProducts = products.filter((p) => p.isActive);

  return (
    <div className='space-y-4'>
      {/* Grid de productos - tarjetas grandes tipo POS */}
      <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3'>
        {activeProducts.map((product) => {
          const hasVariants = product.variants.length > 0;
          const totalStock = hasVariants
            ? product.variants.reduce((acc, v) => acc + v.stock, 0)
            : product.stock;
          const isOutOfStock = totalStock === 0;

          return (
            <div
              key={product.id}
              onClick={() => hasVariants && handleProductClick(product)}
              className={`
                relative rounded-xl overflow-hidden bg-card border-2 
                transition-all duration-150
                ${hasVariants ? "cursor-pointer hover:scale-[1.02]   hover:shadow-lg active:scale-[0.98]" : ""}
                ${isOutOfStock ? "opacity-50 grayscale" : ""}
              `}
            >
              {/* Imagen grande */}
              <div className='relative aspect-square w-full bg-muted'>
                {product.images && product.images.length > 0 ? (
                  <Image
                    src={product.images[0]}
                    alt={product.title}
                    fill
                    className='object-cover'
                    sizes='(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw'
                  />
                ) : (
                  <div className='absolute inset-0 flex items-center justify-center bg-muted'>
                    <ImageOff className='h-16 w-16 text-muted-foreground/30' />
                  </div>
                )}

                {/* Badge de stock */}
                <Badge
                  variant={isOutOfStock ? "destructive" : "success"}
                  className='absolute top-2 right-2 text-xs font-bold'
                >
                  {totalStock}
                </Badge>

                {/* Indicador de variantes */}
                {hasVariants && (
                  <Badge
                    variant='secondary'
                    className='absolute top-2 left-2 text-xs bg-background/80 backdrop-blur-sm'
                  >
                    {product.variants.length} var
                  </Badge>
                )}
              </div>

              {/* Info del producto */}
              <div className='p-3 space-y-2'>
                <h3 className='font-semibold text-sm leading-tight line-clamp-2 min-h-[2.5rem]'>
                  {product.title}
                </h3>

                <div className='text-lg font-bold text-primary'>
                  {formatPrice(product.priceOffer || product.price)}
                </div>

                {/* Botones directos para productos sin variantes */}
                {!hasVariants && (
                  <div className='flex items-center justify-between gap-2 pt-1'>
                    <Button
                      variant='default'
                      size='lg'
                      className='flex-1 h-12 text-lg font-bold'
                      onClick={(e) => handleDirectSale(product, -1, e)}
                      disabled={isOutOfStock}
                    >
                      <Minus className='h-6 w-6' />
                    </Button>
                    <Button
                      variant='outline'
                      size='lg'
                      className='flex-1 h-12 text-lg font-bold'
                      onClick={(e) => handleDirectSale(product, 1, e)}
                    >
                      <Plus className='h-6 w-6' />
                    </Button>
                  </div>
                )}

                {/* Indicador para productos con variantes */}
                {hasVariants && (
                  <div className='text-center bg-primary/20 border-primary/80 rounded-md border py-2 text-xs text-muted-foreground font-medium'>
                    Toca para seleccionar
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {activeProducts.length === 0 && (
        <div className='text-center py-16 text-muted-foreground'>No hay productos activos</div>
      )}

      {/* Dialog para variantes - estilo POS */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className='bg-secondary max-w-lg max-h-[90vh] overflow-hidden flex flex-col'>
          <DialogHeader className='shrink-0'>
            <div className='flex items-center gap-4'>
              <div className='relative h-20 w-20 shrink-0 rounded-xl overflow-hidden bg-muted'>
                {selectedProduct?.images && selectedProduct.images.length > 0 ? (
                  <Image
                    src={selectedProduct.images[0]}
                    alt={selectedProduct.title}
                    fill
                    className='object-cover'
                  />
                ) : (
                  <div className='absolute inset-0 flex items-center justify-center'>
                    <ImageOff className='h-8 w-8 text-muted-foreground/50' />
                  </div>
                )}
              </div>
              <div className='min-w-0'>
                <DialogTitle className='text-lg leading-tight line-clamp-2'>
                  {selectedProduct?.title}
                </DialogTitle>
                <p className='text-sm text-muted-foreground mt-1'>Selecciona una variante</p>
              </div>
            </div>
          </DialogHeader>

          {/* Lista de variantes con botones directos */}
          <div className='flex-1 overflow-y-auto -mx-6 px-6 py-4 space-y-2'>
            {selectedProduct?.variants.map((variant) => {
              const isOutOfStock = variant.stock === 0;

              return (
                <div
                  key={variant.id}
                  className={`
                    flex items-center gap-3 p-3 rounded-xl border-2 bg-card
                    ${isOutOfStock ? "opacity-50" : ""}
                  `}
                >
                  {/* Color indicator */}
                  <div
                    className='h-10 w-10 rounded-lg border-2 shrink-0'
                    style={{ backgroundColor: variant.colorHex }}
                  />

                  {/* Info de la variante */}
                  <div className='flex-1 min-w-0'>
                    <div className='font-semibold text-sm'>
                      {variant.size} - {variant.colorName}
                    </div>
                    <div className='text-xs text-muted-foreground'>
                      {formatPrice(variant.priceOffer || variant.price)}
                    </div>
                  </div>

                  {/* Stock y botones */}
                  <div className='flex items-center gap-2'>
                    <Button
                      variant='default'
                      size='icon'
                      className='h-11 w-11'
                      onClick={() => handleVariantSale(variant, -1)}
                      disabled={isOutOfStock}
                    >
                      <Minus className='h-5 w-5' />
                    </Button>

                    <span className='w-10 text-center text-lg font-bold tabular-nums'>
                      {variant.stock}
                    </span>

                    <Button
                      variant='outline'
                      size='icon'
                      className='h-11 w-11'
                      onClick={() => handleVariantSale(variant, 1)}
                    >
                      <Plus className='h-5 w-5' />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer con instrucciones */}
          <div className='shrink-0 pt-3 border-t text-center'>
            <p className='text-xs text-muted-foreground'>
              <strong>-</strong> vender &nbsp;|&nbsp; <strong>+</strong> corregir
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
