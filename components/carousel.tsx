'use client';
import {Swiper, SwiperSlide} from 'swiper/react';
import {Autoplay, Pagination, EffectCoverflow} from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import './style.css';
import {useRef} from 'react';
import Link from 'next/link';

export function CarouselHeader({data}: {data: any}) {
  const progressCircle: any = useRef(null);
  const progressContent: any = useRef(null);

  const onAutoplayTimeLeft = (s: any, time: any, progress: any) => {
    progressCircle.current.style.setProperty('--progress', 1 - progress);
    progressContent.current.textContent = `${Math.ceil(time / 1000)}s`;
  };
  return (
    <>
      <Swiper
        effect='fade'
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        modules={[Autoplay, Pagination]}
        onAutoplayTimeLeft={onAutoplayTimeLeft}
        className='mySwiper '>
        {data &&
          data.map((product: any) => {
            return (
              <SwiperSlide key={product.objectID}>
                <Link href={`/productos?q=` + product.Name}>
                  {' '}
                  <img
                    src={product.Images[1].url}
                    alt={product.Name}
                    className='w-full'
                  />
                </Link>
              </SwiperSlide>
            );
          })}

        <div className='autoplay-progress' slot='container-end'>
          <svg viewBox='0 0 48 48' ref={progressCircle}>
            <circle cx='24' cy='24' r='20'></circle>
          </svg>
          <span ref={progressContent}></span>
        </div>
      </Swiper>
    </>
  );
}

export function CarouselProduct({imgs}: {imgs: string[]}) {
  return (
    <Swiper
      effect={'coverflow'}
      grabCursor={true}
      centeredSlides={true}
      slidesPerView={'auto'}
      coverflowEffect={{
        rotate: 50,
        stretch: 0,
        depth: 100,
        modifier: 1,
        slideShadows: true,
      }}
      pagination={true}
      modules={[EffectCoverflow, Pagination]}
      className='mySwiper'>
      {imgs.map((item) => (
        <SwiperSlide key={item}>
          <img src={item} className='itemProduct' />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
