import { CarouselHeader } from "@/components/carousel";
import { ProductsFeatured } from "@/components/featured";
import FeaturedFilter from "@/components/featuredFilter";
import { ProductFrontPage } from "@/lib/hook";
import Link from "next/link";
import { ArrowRight, Truck, Shield, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import baseURL from "@/utils/baseUrl";

async function getFrontPage() {
  try {
    const response = await fetch(`${baseURL}/api/product/frontPage`);
    const data = await response.json();
    return [
      baseURL + "/billeteras.webp",
      baseURL + "/hombre.webp",
      baseURL + "/mochilas.webp",
      baseURL + "mujer./webp",
    ];
  } catch (e) {
    return [
      baseURL + "/billeteras.webp",
      baseURL + "/hombre.webp",
      baseURL + "/mochilas.webp",
      baseURL + "mujer./webp",
    ];
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
    <div className=''>
      {/* Hero Section */}
      <section className='relative overflow-hidden '>
        <div className='relative rounded-2xl overflow-hidden shadow-2xl  mt-9 mb-9'>
          <div className='h-[300px] md:h-[500px]'>
            <CarouselHeader data={data} />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className='py-16 bg-background/50 backdrop-blur-sm'>
        <div className='container mx-auto px-4 max-w-7xl'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            <div className='text-center p-6 rounded-xl bg-card border shadow-sm hover:shadow-md transition-shadow'>
              <div className='w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                <Truck className='w-6 h-6 text-purple-600' />
              </div>
              <h3 className='font-semibold text-lg mb-2'>Puntos de Encuentro</h3>
              <p className='text-muted-foreground'>
                Retirá tu compra de manera cómoda en nuestros puntos de encuentro acordados
              </p>
            </div>

            <div className='text-center p-6 rounded-xl bg-card border shadow-sm hover:shadow-md transition-shadow'>
              <div className='w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                <Shield className='w-6 h-6 text-green-600' />
              </div>
              <h3 className='font-semibold text-lg mb-2'>Calidad Garantizada</h3>
              <p className='text-muted-foreground '>
                Productos originales e importados de la mejor calidad
              </p>
            </div>

            <div className='text-center p-6 rounded-xl bg-card border shadow-sm hover:shadow-md transition-shadow'>
              <div className='w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                <Clock className='w-6 h-6 text-blue-600' />
              </div>
              <h3 className='font-semibold text-lg mb-2'>Atención Eficiente</h3>
              <p className='text-muted-foreground '>
                Coordinamos rápido y de forma clara para que tengas tu compra sin demoras
              </p>
            </div>
          </div>
        </div>
      </section>

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

      {/* Categories Section */}
      <section className='py-16 bg-background'>
        <div className='container mx-auto px-4 max-w-7xl'>
          <div className='text-center mb-12'>
            <h2 className='text-3xl md:text-4xl font-bold mb-4'>Categorías Populares</h2>
            <p className='text-muted-foreground text-lg'>Encuentra exactamente lo que buscas</p>
          </div>
          <FeaturedFilter />
        </div>
      </section>

      {/* Featured Products Section */}
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

      {/* Newsletter Section */}
      <section className='py-16 bg-card border-t'>
        <div className='container mx-auto px-4 max-w-7xl'>
          <div className='max-w-2xl mx-auto text-center'>
            <h2 className='text-2xl md:text-3xl font-bold mb-4'>
              Mantente al día con nuestras ofertas
            </h2>
            <p className='text-muted-foreground mb-6'>
              Suscríbete para recibir las mejores ofertas y novedades directamente en tu email
            </p>
            <div className='flex flex-col sm:flex-row gap-4 max-w-md mx-auto'>
              <input
                type='email'
                placeholder='Tu email'
                className='flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500'
              />
              <Button className='bg-purple-600 hover:bg-purple-700'>Suscribirse</Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
