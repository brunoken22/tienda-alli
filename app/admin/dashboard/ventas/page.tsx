"use client";

import { useEffect, useState } from "react";
import { SalesTab } from "@/components/sales-tab";
import { getProducts } from "@/lib/products";
import { ProductType } from "@/types/product";
import { Toaster } from "@/components/ui/sonner";

export default function Home() {
  const [products, setProducts] = useState<ProductType[]>([]);

  useEffect(() => {
    (async () => {
      const data = await getProducts();
      setProducts(data.data);
    })();
  }, []);

  const handleUpdateStock = (productId: string, variantId: string | null, newStock: number) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) => {
        if (product.id !== productId) return product;

        if (variantId) {
          return {
            ...product,
            variants: product.variants.map((variant) =>
              variant.id === variantId ? { ...variant, stock: newStock } : variant,
            ),
          };
        }

        return { ...product, stock: newStock };
      }),
    );
  };

  return (
    <main className='p-6  max-sm:p-2 space-y-8'>
      <div className='border-l-4 p-2 max-sm:border-0 max-sm:p-0 border-primary'>
        <h1 className='text-2xl font-bold text-primary mb-2'>Registro de Ventas</h1>
        <p className='text-muted-foreground mt-1'>
          {" "}
          Usa los botones - y + para registrar ventas o corregir errores
        </p>
      </div>

      <SalesTab products={products} onUpdateStock={handleUpdateStock} />
      <Toaster position='bottom-right' />
    </main>
  );
}
