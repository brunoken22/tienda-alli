export const dynamic = 'force-dynamic';

import {CarouselHeader} from '@/components/carousel';
import {ProductsFeatured} from '@/components/featured';
import FeaturedFilter from '@/components/featuredFilter';
import {getFrontPage, getProductFeatured} from '@/lib/hook';
import Link from 'next/link';

export default async function Home() {
  const data = await getFrontPage();
  const featured = await getProductFeatured();
  return (
    <div className='m-auto max-md:mt-[6.5rem] mt-[4rem] max-w-[1200px] shadow-[0_0_100px_10px_#3c006c]'>
      <div className={`h-[400px]`}>
        <CarouselHeader data={data} />
      </div>
      <div>
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
        <div className='m-16 max-md:m-4'>
          <FeaturedFilter />
        </div>
        <div className=' '>
          <div className='relative top-0 right-0 w-full overflow-hidden rotate-180'>
            <svg
              className='relative block w-[calc(100%+1.3px)] h-[143px] max-md:h-[100px] max-sm:h-[50px]'
              data-name='Layer 1'
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 1200 120'
              preserveAspectRatio='none'>
              <path
                d='M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z'
                className='fill-[rgb(60_0_108/44%)]'></path>
            </svg>
          </div>
          <div className='p-2 bg-[rgb(60_0_108/44%)] pt-16'>
            <div className='mb-20 flex items-center justify-center relative '>
              <h2 className='text-center text-3xl font-bold '>Destacados</h2>
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
              className={`flex justify-center items-center gap-x-[0.4rem]  gap-y-4 flex-wrap	 pb-6`}>
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
    </div>
  );
}
