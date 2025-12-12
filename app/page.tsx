import { CarouselHeader } from "@/components/carousel";
import { ProductsFeatured } from "@/components/featured";
import FeaturedFilter from "@/components/featuredFilter";
import Link from "next/link";
import { ArrowRight, Truck, Shield, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import baseURL from "@/utils/baseUrl";
import ProductCarousel from "@/components/carouselProduct";

async function getFrontPage() {
  try {
    const response = await fetch(`${baseURL}/api/product/frontPage`);
    const data = await response.json();
    return [baseURL + "/banner1.webp", baseURL + "/banner2.webp", baseURL + "/banner3.webp"];
  } catch (e) {
    return [baseURL + "/banner1.webp", baseURL + "/banner2.webp", baseURL + "/banner3.webp"];
  }
}

async function getProductFeatured() {
  try {
    const response = await fetch(`${baseURL}/api/product/featured`);
    const data = await response.json();
    return data;
  } catch (e) {
    return [];
  }
}

export default async function Home() {
  const data = await getFrontPage();
  const featured = await getProductFeatured();
  return (
    <div className='mb-8'>
      {/* Hero Section */}
      <section className='relative overflow-hidden '>
        <div className='relative rounded-2xl overflow-hidden shadow-2xl px-2'>
          <div className='h-[300px] md:h-[800px]'>
            <CarouselHeader data={data} />
          </div>
        </div>
      </section>

      {/* Agregado recientemente */}
      <div className='-mt-44 max-md:mt-4'>
        <ProductCarousel />
      </div>

      {/* Categorias */}
      <section className='py-16 bg-background'>
        <div className='container mx-auto px-4 max-w-7xl'>
          <div className='text-center mb-12'>
            <h2 className='text-3xl md:text-4xl font-bold mb-4'>Categorías Populares</h2>
            <p className='text-muted-foreground text-lg'>Encuentra exactamente lo que buscas</p>
          </div>
          <FeaturedFilter />
        </div>
      </section>

      {/* Ofertas */}
      <div className='my-8'>
        <h2 className='font-bold text-3xl mb-4'>Ofertas imparables</h2>
        <ProductCarousel className='px-0' />
      </div>

      {/* Productos Destacados */}
      {featured?.lenght ? (
        <section className='py-16 bg-muted/30'>
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
      ) : null}

      {/* CTA Section */}
      <section className='py-20 bg-gradient-to-r from-purple-600 to-pink-600 text-white'>
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
            <ArrowRight className='ml-2  text-inherit' size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
