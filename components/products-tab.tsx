"use client";

import { ProductType } from "@/types/product";
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package } from "lucide-react";

interface ProductsTabProps {
  products: ProductType[];
}

export function ProductsTab({ products }: ProductsTabProps) {
  const getTotalStock = (product: ProductType) => {
    if (product.variants.length > 0) {
      return product.variants.reduce((acc, v) => acc + v.stock, 0);
    }
    return product.stock;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      currencyDisplay: "symbol",
    }).format(price);
  };

  return (
    <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
      {products.map((product) => (
        <div
          key={product.id}
          className='overflow-hidden rounded-lg shadow-md hover:shadow-xl hover:scale-[1.02] hover:border-primary/30 transition-all duration-500  !bg-secondary'
        >
          <CardHeader className='pb-3'>
            <div className='flex items-start justify-between'>
              <div className='flex items-center gap-2'>
                <Package className='h-5 w-5 text-muted-foreground' />
                <CardTitle className='text-lg'>{product.title}</CardTitle>
              </div>
              <Badge variant={product.isActive ? "default" : "secondary"}>
                {product.isActive ? "Activo" : "Inactivo"}
              </Badge>
            </div>
            <CardDescription className='line-clamp-2'>{product.description}</CardDescription>
          </CardHeader>
          <CardContent className='space-y-3'>
            <div className='flex items-center justify-between text-sm'>
              <span className='text-muted-foreground'>Precio:</span>
              <div className='flex items-center gap-2'>
                {product.priceOffer < product.price && (
                  <span className='text-muted-foreground line-through'>
                    {formatPrice(product.price)}
                  </span>
                )}
                <span className='font-semibold text-primary'>
                  {formatPrice(product.priceOffer || product.price)}
                </span>
              </div>
            </div>

            <div className='flex items-center justify-between text-sm'>
              <span className='text-muted-foreground'>Stock total:</span>
              <Badge variant={getTotalStock(product) > 0 ? "outline" : "destructive"}>
                {getTotalStock(product)} unidades
              </Badge>
            </div>

            {product.variants.length > 0 && (
              <div className='space-y-2'>
                <span className='text-sm text-muted-foreground'>Variantes:</span>
                <div className='grid gap-1.5'>
                  {product.variants.map((variant) => (
                    <div
                      key={variant.id}
                      className='flex items-center justify-between rounded-md bg-muted/50 px-3 py-1.5 text-xs'
                    >
                      <div className='flex items-center gap-2'>
                        <span
                          className='h-3 w-3 rounded-full border'
                          style={{ backgroundColor: variant.colorHex }}
                        />
                        <span>
                          {variant.size} - {variant.colorName}
                        </span>
                      </div>
                      <span className={variant.stock === 0 ? "text-destructive" : ""}>
                        {variant.stock} uds
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {product.categories.length > 0 && (
              <div className='flex flex-wrap gap-1 pt-2'>
                {product.categories.map((cat) => (
                  <Badge key={cat.id} variant='secondary' className='text-xs'>
                    {cat.title}
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </div>
      ))}
    </div>
  );
}
