import {CarouselHeader} from '@/components/carousel';
import {ProductsFeatured} from '@/components/featured';

export default function Home() {
  return (
    <div className='m-auto max-md:mt-[10rem] mt-[4rem] max-w-[1000px]'>
      <div className={`h-[300px]  `}>
        <CarouselHeader />
      </div>
      <div className=''>
        <div className={`text-center pt-[8vw] mb-[8vw]  `}>
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
          <h2 className='text-center text-[1.5rem] font-bold  mb-8'>
            Destacados
          </h2>
          <div
            className={`flex justify-evenly items-center gap-x-[0.4rem]  gap-y-4 flex-wrap	 pb-6`}>
            <ProductsFeatured />
          </div>
        </div>
      </div>
    </div>
  );
}
