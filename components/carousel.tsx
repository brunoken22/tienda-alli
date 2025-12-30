"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import Image from "next/image";

export function CarouselHeader({ data }: { data: string[] }) {
  return (
    <div className='relative w-full h-full'>
      <Swiper
        effect='fade'
        spaceBetween={0}
        centeredSlides={true}
        autoplay={{
          delay: 1000,
          disableOnInteraction: true,
        }}
        pagination={{
          clickable: true,
          bulletClass: "swiper-pagination-bullet !bg-white/70 !w-3 !h-3",
          bulletActiveClass: "swiper-pagination-bullet-active !bg-white !scale-125",
        }}
        modules={[Autoplay, Pagination, EffectFade]}
        className='w-full h-full rounded-2xl overflow-hidden'
      >
        {data?.map((product, index) => (
          <SwiperSlide key={product || index}>
            {/* Overlay con gradiente para mejor legibilidad */}
            <div className=' absolute  inset-0 bg-gradient-to-t from-black/90  to-primary/60 group-hover:opacity-90 transition-opacity z-10' />

            <Image
              src={product || "/tienda-alli.webp"}
              alt={"Banner"}
              fill
              className='object-cover object-top relative z-20'
              priority={index === 0}
            />
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
          bulletClass: "swiper-pagination-bullet !bg-white/70",
          bulletActiveClass: "swiper-pagination-bullet-active !bg-white",
        }}
        modules={[Pagination]}
        className='w-full h-full'
      >
        {imgs.map((item, index) => (
          <SwiperSlide key={index} className='w-full h-full '>
            <Image
              src={item || "/tienda-alli.webp"}
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
