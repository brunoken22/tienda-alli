'use client';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ProductFrontPage } from '@/lib/hook';

export function CarouselHeader({ data }: { data: ProductFrontPage[] }) {
  const progressCircle: any = useRef(null);
  const progressContent: any = useRef(null);

  const onAutoplayTimeLeft = (s: any, time: any, progress: any) => {
    if (progressCircle.current) {
      progressCircle.current.style.setProperty('--progress', 1 - progress);
    }
    if (progressContent.current) {
      progressContent.current.textContent = `${Math.ceil(time / 1000)}s`;
    }
  };

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
        onAutoplayTimeLeft={onAutoplayTimeLeft}
        className='w-full h-full rounded-2xl overflow-hidden'>
        {data &&
          data.map((product: any, index: number) => (
            <SwiperSlide key={product.objectID || index}>
              <Link
                href={`/productos?q=${product.Name}`}
                className='block relative w-full h-full group'>
                <div className='absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors z-10' />
                <Image
                  src={product.Images[1]?.url || '/placeholder.svg'}
                  alt={product.Name}
                  fill
                  className='object-cover'
                  priority={index === 0}
                />
                <div className='absolute bottom-8 left-8 z-20 text-white'>
                  <h3 className='text-2xl font-bold mb-2'>{product.Name}</h3>
                  <p className='text-white/90'>Descubre más →</p>
                </div>
              </Link>
            </SwiperSlide>
          ))}

        <div className='absolute bottom-4 right-4 z-30 flex items-center gap-2 bg-black/50 rounded-full px-3 py-2'>
          <svg
            viewBox='0 0 48 48'
            ref={progressCircle}
            className='w-6 h-6 text-white'
            style={
              {
                '--progress': 0,
              } as any
            }>
            <circle
              cx='24'
              cy='24'
              r='20'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeDasharray='125.6'
              strokeDashoffset='calc(125.6 * var(--progress))'
              transform='rotate(-90 24 24)'
            />
          </svg>
          <span ref={progressContent} className='text-white text-sm font-medium'>
            4s
          </span>
        </div>
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
              src={item || '/placeholder.svg'}
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
