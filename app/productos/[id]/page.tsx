import ProductTemplate from "@/components/ProductID";
import { Button } from "@/components/ui/button";
import { getProductID } from "@/lib/products";
import { ArrowLeft, Package } from "lucide-react";
import Link from "next/link";

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProductID(id);
  console.log("ESTE ES EL PRODUCTO: ", product);
  if (!product || !product.isActive) {
    return (
      <div className='min-h-screen bg-background'>
        <div className='mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8'>
          <div className='flex flex-col items-center space-y-8 text-center'>
            {/* Icon */}
            <div className='relative'>
              <div className='absolute inset-0 animate-pulse rounded-full bg-muted blur-2xl' />
              <div className='relative rounded-full bg-muted p-8'>
                <Package className='h-24 w-24 text-muted-foreground' strokeWidth={1.5} />
              </div>
            </div>

            {/* Title and Message */}
            <div className='space-y-3'>
              <h1 className='text-balance text-4xl font-bold tracking-tight text-foreground'>
                Producto no encontrado
              </h1>
              <p className='text-pretty text-lg text-muted-foreground'>
                Lo sentimos, el producto que buscas no existe o ya no está disponible.
              </p>
            </div>

            {/* Product ID */}
            <div className='rounded-lg border bg-card px-4 py-2'>
              <p className='text-sm text-muted-foreground'>
                ID del producto:{" "}
                <span className='font-mono font-semibold text-card-foreground'>{id}</span>
              </p>
            </div>

            {/* Action Buttons */}
            <div className='flex flex-col gap-3 sm:flex-row'>
              <Button size='lg' className='gap-2 shadow-lg'>
                <Link href='/productos' className='flex items-center gap-2'>
                  <ArrowLeft className='h-6 w-6' />
                  Volver al inicio
                </Link>
              </Button>
            </div>

            {/* Suggestions */}
            <div className='w-full space-y-3 rounded-xl border bg-card p-6'>
              <h3 className='font-semibold text-card-foreground'>Sugerencias:</h3>
              <ul className='space-y-2 text-left text-sm text-muted-foreground'>
                <li className='flex items-start gap-2'>
                  <span className='mt-1 text-primary'>•</span>
                  <span>Verifica que el enlace sea correcto</span>
                </li>
                <li className='flex items-start gap-2'>
                  <span className='mt-1 text-primary'>•</span>
                  <span>
                    El producto puede haber sido eliminado o estar temporalmente no disponible
                  </span>
                </li>
                <li className='flex items-start gap-2'>
                  <span className='mt-1 text-primary'>•</span>
                  <span>Explora nuestra categoría de productos para encontrar alternativas</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return <ProductTemplate product={product} />;
}
