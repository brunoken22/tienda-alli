export const dynamic = "force-dynamic";

import dynamicLoader from "next/dynamic";
import { CarouselHeader } from "@/components/carousel";
import FeaturedFilter from "@/components/featuredFilter";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getCategories } from "@/lib/category";
import { ProductCardSkeletonGrid } from "@/components/ui/EsqueletonCardSwiper";
import { getFrontPage, getOfferPage, getProductsCategory } from "@/lib/products";
import { getBanners } from "@/lib/banner";
import { BannerType } from "@/types/banner";

const ProductCarousel = dynamicLoader(() => import("@/components/carouselProduct"), {
  ssr: true,
  loading: () => <ProductCardSkeletonGrid />,
});

const items = [
  "INDUMENTARIA",
  "DISENO EXCLUSIVO",
  "MODA CONTEMPORANEA",
  "ESTILO UNICO",
  "HECHO CON PASION",
  "BUENOS AIRES",
];

export default async function Home() {
  const [banners, data, offer, categories, productsCategory] = await Promise.all([
    getBanners(),
    getFrontPage(),
    getOfferPage(),
    getCategories(),
    getProductsCategory(),
  ]);
  return (
    <div className='flex flex-col gap-12 max-sm:gap-8 pb-8 px-2'>
      {/* Hero Section */}
      <h1 className='hidden'>RADDIAN INDUMENTARIA</h1>
      <section className='relative overflow-hidden '>
        <div className='relative rounded-2xl overflow-hidden shadow-2xl '>
          <div className='h-[300px] md:h-[800px]'>
            <CarouselHeader data={banners.data.map((banner: BannerType) => banner.imageUrl)} />
          </div>
        </div>
      </section>

      {/* Solo mostrar secciones si hay datos (excepto en build) */}
      {data.length > 0 && (
        <section className='-mt-28 max-md:mt-0'>
          <ProductCarousel products={data} />
        </section>
      )}

      <div className='border-y border-border py-5 overflow-hidden'>
        <div className='flex animate-marquee whitespace-nowrap'>
          {[...items, ...items, ...items, ...items].map((item, i) => (
            <span
              key={i}
              className='font-serif text-sm lg:text-base font-light tracking-[0.3em] text-muted-foreground mx-10 flex items-center gap-10'
            >
              {item}
              <span className='inline-block w-1.5 h-1.5 rounded-full bg-primary' />
            </span>
          ))}
        </div>
      </div>

      {/* Categorías - siempre mostrar pero puede estar vacío */}
      <section id='categorias'>
        <div className='mb-4'>
          <div className='flex items-center gap-3'>
            <h2 className='text-3xl text-primary md:text-3xl font-bold'>Categorías </h2>
          </div>

          <p className='text-muted-foreground text-lg'>Encuentra exactamente lo que buscas</p>
        </div>
        <FeaturedFilter categories={categories} />
      </section>

      {/* Productos se paradas con sus categorias  */}
      {productsCategory.success && productsCategory.data.length > 0
        ? productsCategory.data.map((category) => (
            <section key={category.id} id={`categoria-${category.id}`}>
              <div className='mb-4'>
                <div className='flex items-center gap-3'>
                  <h2 className='text-3xl text-primary md:text-3xl font-bold'>{category.title}</h2>
                </div>
                <p className='text-muted-foreground text-lg'>{category.description}</p>
              </div>
              <ProductCarousel className='px-0' products={category.products} />
            </section>
          ))
        : null}

      {offer.length > 0 && (
        <section id='ofertas'>
          <div className='mb-16 flex flex-col items-center gap-4 text-center'>
            <div className='flex items-center gap-3'>
              <span className='h-px w-8 bg-secondary' />
              <p className='text-xs font-semibold uppercase tracking-[0.3em] text-accent'>
                Seleccion de ofertas
              </p>
              <span className='h-px w-8 bg-secondary' />
            </div>
            <h2 className='font-serif text-4xl font-bold text-primary md:text-5xl text-balance'>
              Ofertas imparables
            </h2>
            <p className='max-w-md text-sm leading-relaxed '>
              Piezas esenciales con cortes premium y materiales de alta calidad, disenadas para un
              estilo que perdura.
            </p>
          </div>
          <ProductCarousel className='px-0' products={offer} />
        </section>
      )}

      {/* CTA Section */}
      <section className='relative overflow-hidden rounded-3xl my-5'>
        {/* Fondo degradado elegante */}
        <div className='absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-primary/70' />

        {/* Glow decorativo */}
        <div className='absolute -top-20 -right-20 w-72 h-72 bg-white/10 rounded-full blur-3xl' />
        <div className='absolute -bottom-20 -left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl' />

        <div className='relative container mx-auto max-w-6xl px-6 py-20 text-center text-white'>
          <h2 className='text-3xl md:text-5xl font-bold leading-tight tracking-tight'>
            Hacé tu pedido y coordiná
            <span className='block mt-2 text-white/90'>tu retiro fácilmente</span>
          </h2>

          <p className='mt-6 text-base md:text-lg max-w-2xl mx-auto text-white leading-relaxed'>
            Explorá nuestra selección de productos exclusivos, importados y originales. Coordinamos
            con vos el punto de encuentro para que recibas tu compra de forma rápida y segura.
          </p>

          <div className='mt-10 flex justify-center'>
            <Link
              href='/productos'
              className='group inline-flex items-center gap-2 bg-white text-primary px-8 py-4 rounded-2xl font-semibold shadow-xl hover:scale-105 hover:shadow-2xl transition-all duration-300'
            >
              Explorar Productos
              <ArrowRight size={18} className='transition-transform group-hover:translate-x-1' />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
