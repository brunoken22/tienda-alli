"use client";
import { CategoryType } from "@/types/category";
import TemplateFeaturedFilter from "./templateFeaturedFilter";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function FeaturedFilter({ categories }: { categories: CategoryType[] }) {
  return (
    <Swiper
      spaceBetween={16}
      slidesPerView={1.2}
      centeredSlides={false}
      loop={true}
      autoplay={{
        delay: 3000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true, // Pausa al pasar el mouse
      }}
      breakpoints={{
        640: {
          slidesPerView: 2.3,
          spaceBetween: 20,
        },
        768: {
          slidesPerView: 2.5,
          spaceBetween: 20,
        },
        1024: {
          slidesPerView: 3.3,
          spaceBetween: 24,
        },
        1280: {
          slidesPerView: 4,
          spaceBetween: 24,
          centeredSlides: false,
        },
      }}
      navigation={{
        nextEl: ".custom-next",
        prevEl: ".custom-prev",
      }}
      pagination={false}
      modules={[Autoplay, Navigation]}
      className='!overflow-y-visible'
    >
      {categories.map((item) => (
        <SwiperSlide key={item.id}>
          <TemplateFeaturedFilter
            name={item.title}
            img={item.image}
            url={"/productos?category=" + item.title.toLowerCase()}
            alt={item.title}
          />
        </SwiperSlide>
      ))}
      <div className='custom-navigation'>
        <button className='custom-prev absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-primary/80 text-secondary hover:text-primary hover:bg-white  w-10 h-10 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110'>
          <ArrowLeftIcon />
        </button>
        <button className='custom-next absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-primary/80 text-secondary hover:text-primary hover:bg-white  w-10 h-10 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110'>
          <ArrowRightIcon />
        </button>
      </div>
    </Swiper>
  );
}
