"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon, ArrowRightIcon, ShoppingCart, Star } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const products = [
  {
    id: 1,
    name: "Wireless Headphones",
    price: 129.99,
    rating: 4.5,
    image: "/banner1.webp",
    description: "Premium sound quality with active noise cancellation",
  },
  {
    id: 2,
    name: "Smart Watch",
    price: 299.99,
    rating: 4.8,
    image: "/banner2.webp",
    description: "Track your fitness and stay connected",
  },
  {
    id: 3,
    name: "Laptop Stand",
    price: 49.99,
    rating: 4.3,
    image: "/banner3.webp",
    description: "Ergonomic design for better posture",
  },
  {
    id: 4,
    name: "Mechanical Keyboard",
    price: 159.99,
    rating: 4.7,
    image: "/mujer.webp",
    description: "Tactile typing experience with RGB lighting",
  },
  {
    id: 5,
    name: "Wireless Mouse",
    price: 79.99,
    rating: 4.6,
    image: "/hombre.webp",
    description: "Precision tracking and ergonomic design",
  },
  {
    id: 6,
    name: "USB-C Hub",
    price: 89.99,
    rating: 4.4,
    image: "/mochilas.webp",
    description: "Expand your connectivity with multiple ports",
  },
];

export default function ProductCarousel({ className }: { className?: string }) {
  return (
    <div className={`relative px-4 max-md:px-2 z-10 ${className}`}>
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
        className='overflow-visible'
      >
        {products.map((product) => (
          <SwiperSlide key={product.id}>
            <Card className='bg-secondary p-2 hover:shadow-xl transition-all duration-300 hover:-translate-y-1'>
              <CardContent className='p-4'>
                <div className='h-48 mb-4 overflow-hidden rounded-lg bg-muted'>
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className='h-full w-full object-cover transition-transform duration-500 hover:scale-110'
                  />
                </div>
                <div className='space-y-2'>
                  <h3 className='font-semibold text-lg'>{product.name}</h3>
                  <p className='text-sm text-muted-foreground line-clamp-2'>
                    {product.description}
                  </p>
                  <div className='flex items-center gap-1'>
                    <Star className='h-4 w-4 fill-yellow-400 text-yellow-400' />
                    <span className='text-sm font-medium'>{product.rating}</span>
                  </div>
                  <div className='flex items-center justify-between pt-2'>
                    <span className='text-2xl font-bold'>${product.price}</span>
                    <Button size='sm' className='gap-2'>
                      <ShoppingCart className='h-4 w-4' />
                      Agregar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
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
    </div>
  );
}
