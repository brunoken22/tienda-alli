"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon, ArrowRightIcon, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import { ProductType } from "@/types/product";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Badge } from "./ui/badge";
import Link from "next/link";
import Image from "next/image";

export default function ProductCarousel({
  products,
  className,
}: {
  products: ProductType[];
  className?: string;
}) {
  const discountPercentage = (price: number, priceOffer: number) =>
    priceOffer ? Math.round(((price - priceOffer) / price) * 100) : 0;

  return (
    <div className={`relative z-10 ${className}`}>
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
        wrapperClass='pb-4'
      >
        {products.map((product) => (
          <SwiperSlide key={product.id}>
            <Card className='bg-secondary/90 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1'>
              <CardContent className='p-0'>
                <div className='h-56 overflow-hidden rounded-lg bg-muted pt-2'>
                  {product.priceOffer ? (
                    <div className='absolute top-3 left-3 z-10 flex flex-col gap-1'>
                      <Badge className='bg-red-600 hover:bg-red-700 text-white font-semibold shadow-lg'>
                        Oferta
                      </Badge>
                      {discountPercentage(product.price, product.priceOffer) > 0 && (
                        <Badge className='bg-green-600 hover:bg-green-700 text-white font-semibold shadow-lg'>
                          -{discountPercentage(product.price, product.priceOffer)}%
                        </Badge>
                      )}
                    </div>
                  ) : null}

                  <Image
                    src={product.images[0] || "/tienda.svg"}
                    alt={product.title}
                    title={product.title}
                    width={200}
                    height={200}
                    className='h-full w-full object-cover transition-transform duration-500 hover:scale-110'
                  />
                </div>
                <div className='space-2 p-3'>
                  <h3 className='font-semibold truncate' title={product.title}>
                    {product.title}
                  </h3>
                  <div className='flex items-center justify-between pt-2'>
                    <div className='flex items-baseline gap-2'>
                      {product.priceOffer ? (
                        <>
                          <span className='text-2xl font-bold text-green-700'>
                            ${product.priceOffer.toLocaleString()}
                          </span>
                          <span className='text-sm text-muted-foreground line-through'>
                            ${product.price.toLocaleString()}
                          </span>
                        </>
                      ) : (
                        <span className='text-2xl font-bold text-foreground'>
                          ${product.price.toLocaleString()}
                        </span>
                      )}
                    </div>
                    <Button size='sm'>
                      <Link href={`/productos/${product.id}`} className='flex gap-2 flex-row'>
                        Ver producto
                        <ChevronRight className='h-4 w-4' />
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </SwiperSlide>
        ))}

        <div className='custom-navigation'>
          <button
            aria-label='Ir a la Izquierda'
            name='Ir a la Izquierda'
            className='custom-prev absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-primary/80 text-secondary hover:text-primary hover:bg-white  w-10 h-10 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110'
          >
            <ArrowLeftIcon />
          </button>
          <button
            aria-label='Ir a la Derecha'
            name='Ir a la Derecha'
            className='custom-next absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-primary/80 text-secondary hover:text-primary hover:bg-white  w-10 h-10 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110'
          >
            <ArrowRightIcon />
          </button>
        </div>
      </Swiper>
    </div>
  );
}
