export const dynamic = "force-dynamic";

import dynamicLoader from "next/dynamic";
import { CarouselHeader } from "@/components/carousel";
import FeaturedFilter from "@/components/featuredFilter";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getCategories } from "@/lib/category";
import { ProductCardSkeletonGrid } from "@/components/ui/EsqueletonCardSwiper";
import { getFrontPage, getOfferPage } from "@/lib/products";

const ProductCarousel = dynamicLoader(() => import("@/components/carouselProduct"), {
  ssr: true,
  loading: () => <ProductCardSkeletonGrid />,
});
const banner = ["/banner1.webp", "/banner2.webp", "/banner3.webp", "/banner4.webp"];

export default async function Home() {
  const [data, offer, categories] = await Promise.all([
    getFrontPage(),
    getOfferPage(),
    getCategories(),
  ]);
  return (
    <div className='flex flex-col gap-12 max-sm:gap-8 pb-8 px-2'>
      {/* Hero Section */}
      <section className='relative overflow-hidden '>
        <div className='relative rounded-2xl overflow-hidden shadow-2xl '>
          <div className='h-[300px] md:h-[800px]'>
            <CarouselHeader data={banner} />
          </div>
        </div>
      </section>

      {/* Solo mostrar secciones si hay datos (excepto en build) */}
      {data.length > 0 && (
        <section className='-mt-44 max-md:mt-0'>
          <ProductCarousel products={data} />
        </section>
      )}

      {/* Categorías - siempre mostrar pero puede estar vacío */}
      <section className='bg-background'>
        <div className='mb-4'>
          <h2 className='text-3xl md:text-3xl font-bold'>Categorías Populares</h2>
          <p className='text-muted-foreground text-lg'>Encuentra exactamente lo que buscas</p>
        </div>
        <FeaturedFilter categories={categories} />
      </section>

      {offer.length > 0 && (
        <section>
          <div className='mb-4'>
            <h2 className='text-3xl md:text-3xl font-bold'>Ofertas imparables</h2>
            <p className='text-muted-foreground text-lg'>Encuentra nuestras ofertas</p>
          </div>
          <ProductCarousel className='px-0' products={offer} />
        </section>
      )}

      {/* {hasFeaturedProducts && (
        <section className=''>
          <div className='container mx-auto px-4 max-w-7xl'>
            <div className='flex items-center justify-between mb-12'>
              <div>
                <h2 className='text-3xl md:text-4xl font-bold mb-2'>Productos Destacados</h2>
                <p className='text-muted-foreground'>Los favoritos de nuestros clientes</p>
              </div>
              <div className='hidden md:block'>
                <Link href='/productos'>
                  <Button variant='outline' className='group'>
                    Ver todos
                    <ArrowRight className='w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform' />
                  </Button>
                </Link>
              </div>
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
              <ProductsFeatured featured={featured} />
            </div>

            <div className='md:hidden text-center mt-8'>
              <Link href='/productos'>
                <Button variant='outline' className='group'>
                  Ver todos los productos
                  <ArrowRight className='w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform' />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )} */}

      {/* CTA Section - siempre visible */}
      <section className='p-12 max-md:p-4 rounded-md bg-gradient-to-r from-primary/80 to-primary text-white'>
        <div className='container mx-auto px-4 max-w-7xl text-center'>
          <h2 className='text-3xl md:text-5xl font-bold mb-6'>
            HACÉ TU PEDIDO Y COORDINÁ TU RETIRO FÁCILMENTE
          </h2>
          <p className='text-lg md:text-xl mb-8 max-w-4xl mx-auto opacity-90'>
            Explorá nuestra selección de productos exclusivos, importados, originales y de excelente
            calidad. Coordinamos con vos el punto de encuentro para que tengas tu compra de forma
            rápida y segura.
          </p>
          <Link
            href={"/productos"}
            className='flex items-center m-auto w-max bg-secondary p-3 text-nowrap rounded-md text-primary hover:bg-primary hover:text-white transition-colors '
          >
            Explorar Productos
            <ArrowRight className='ml-2 text-inherit' size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
