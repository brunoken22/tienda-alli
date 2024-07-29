export const dynamic = 'force-dynamic';
import {CarouselHeader} from '@/components/carousel';
import {ProductsFeatured} from '@/components/featured';
import {getFrontPage, getProductFeatured} from '@/lib/hook';
import Link from 'next/link';
export default async function Home() {
  const data = await getFrontPage();
  const featured = await getProductFeatured();
  return (
    <div className='m-auto max-md:mt-[6.5rem] mt-[4rem] max-w-[1200px] shadow-[0_0_100px_10px_#3c006c]'>
      <div className={`h-[400px]   `}>
        <CarouselHeader data={data} />
      </div>
      <div className=''>
        <div className={`text-center p-2 pt-[3rem] mb-[3rem]  `}>
          <h2 className={`font-bold	text-2xl	`}>
            HACÉ TU PEDIDO Y RECIBILO RÁPIDAMENTE EN NUESTRO PUNTO DE ENCUENTRO
          </h2>
          <span>
            Explora nuestra selección de productos exclusivos, importados,
            originales y de excelente calidad. Sumérgete en la experiencia de un
            servicio rápido y eficiente, diseñado para brindarte la mejor
            satisfacción en cada compra.
          </span>
        </div>
        <div className=' '>
          <div className='mb-8 flex items-center justify-center relative'>
            <h2 className='text-center text-[1.5rem] font-bold '>Destacados</h2>
            <div className='block max-md:hidden'>
              <Link
                href='/productos'
                className='absolute right-[10%] text-primary top-[20%] hover:opacity-70 flex items-center '>
                Ver más
                <img
                  src='/arrow.svg'
                  height={17}
                  width={20}
                  alt='arrow'
                  className='flex animate-arrow'
                  loading='lazy'
                />
              </Link>
            </div>
          </div>
          <div
            className={`flex justify-evenly items-center gap-x-[0.4rem]  gap-y-4 flex-wrap	 pb-6`}>
            <ProductsFeatured featured={featured} />
          </div>
          <div className='max-md:flex hidden justify-center items-center p-4'>
            <Link
              href='/productos'
              className=' text-primary hover:opacity-70 flex items-center '>
              Ver más
              <img
                src='/arrow.svg'
                height={17}
                width={20}
                alt='arrow'
                className='flex animate-arrow'
                loading='lazy'
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
