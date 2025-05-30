'use client';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import Link from 'next/link';
import Image from 'next/image';
import { ProductFrontPage } from '@/lib/hook';
import { ArrowRight } from 'lucide-react';

export function CarouselHeader({ data }: { data: ProductFrontPage[] }) {
  return (
    <div className='relative w-full h-full'>
      <Swiper
        effect='fade'
        spaceBetween={0}
        centeredSlides={true}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
          bulletClass: 'swiper-pagination-bullet !bg-white/70 !w-3 !h-3',
          bulletActiveClass: 'swiper-pagination-bullet-active !bg-white !scale-125',
        }}
        modules={[Autoplay, Pagination, EffectFade]}
        className='w-full h-full rounded-2xl overflow-hidden'>
        {data?.map((product, index) => (
          <SwiperSlide key={product.objectID || index}>
            <Link
              href={`/productos?q=${product.Name}`}
              className='block relative w-full h-full group'>
              {/* Overlay con gradiente para mejor legibilidad */}
              <div className=' absolute  inset-0 bg-gradient-to-t from-black/90 via-black/90 to-black/90 group-hover:opacity-80 transition-opacity z-10' />

              <Image
                src={product.Images[1]?.url || '/tienda-alli.webp'}
                alt={product.Name}
                fill
                className='object-contain relative z-20'
                priority={index === 0}
              />

              {/* Contenedor del título para desktop */}
              <div className='hidden md:block absolute bottom-8 left-8 z-20 max-w-xs bg-black/60 p-4 rounded-lg backdrop-blur-sm'>
                <h3 className='text-2xl font-bold text-white mb-2'>{product.Name}</h3>
                <p className='text-white/90 flex items-center'>
                  Descubrí más <ArrowRight className='w-4 h-4 ml-1' />
                </p>
              </div>

              {/* Contenedor del título para móviles */}
              <div className='md:hidden absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/90 to-black/0 pt-12 pb-4 px-4'>
                <h3 className='text-lg font-bold text-white text-center line-clamp-2'>
                  {product.Name}
                </h3>
                <div className='flex justify-center mt-2'>
                  <span className='text-white/80 text-sm flex items-center bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm'>
                    Ver producto <ArrowRight className='w-3 h-3 ml-1' />
                  </span>
                </div>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export function CarouselProduct({ imgs }: { imgs: string[] }) {
  return (
    <div className='w-full h-full mx-auto'>
      <Swiper
        effect='coverflow'
        centeredSlides={true}
        slidesPerView='auto'
        coverflowEffect={{
          rotate: 50,
          stretch: 0,
          depth: 100,
          modifier: 1,
          slideShadows: true,
        }}
        pagination={{
          clickable: true,
          bulletClass: 'swiper-pagination-bullet !bg-white/70',
          bulletActiveClass: 'swiper-pagination-bullet-active !bg-white',
        }}
        modules={[Pagination]}
        className='w-full h-full'>
        {imgs.map((item, index) => (
          <SwiperSlide key={index} className='w-full h-full '>
            <Image
              src={item || '/tienda-alli.webp'}
              alt={`Product image ${index + 1}`}
              fill
              className='object-contain rounded-lg'
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
