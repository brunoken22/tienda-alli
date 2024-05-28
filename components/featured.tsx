'use client';
import {TemplateProduct} from '@/components/template';
import {useState} from 'react';
import {EsqueletonProduct} from './esqueleton';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {CarouselProduct} from './carousel';
export function ProductsFeatured({featured}: {featured: any}) {
  const [openLinkProduct, setOpenLinkProduct] = useState<string[]>([]);
  return (
    <>
      {featured
        ? featured.map((item: any) => {
            return (
              <TemplateProduct
                key={item.objectID}
                openImg={(data: string[]) => setOpenLinkProduct(data)}
                Name={item.Name}
                Images={item.Images.map(
                  (itemImages: any) => itemImages.thumbnails.full.url
                )}
                priceOfert={item.priceOfert}
                price={item['Unit cost']}
                oferta={item.oferta}
                id={item.objectID}
                inicio={true}
                type={item.type}
                size={item.talla}
                addItem={() => toast.success('Se agregó al carrito!')}
              />
            );
          })
        : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item: number) => (
            <EsqueletonProduct key={item} />
          ))}
      {openLinkProduct.length ? (
        <>
          <div className='flex flex-col fixed inset-0 backdrop-brightness-50	justify-center items-center z-10'>
            <div className='fixed top-8 right-8 z-10 max-sm:top-[0.5rem] max-sm:right-[0.5rem] '>
              <button
                onClick={() => {
                  setOpenLinkProduct([]);
                  document.body.style.overflow = 'auto';
                }}>
                {' '}
                <img src='/closeWhite.svg' width={30} height={30} alt='close' />
              </button>
            </div>
            <div className='h-3/4'>
              <CarouselProduct imgs={openLinkProduct} />
            </div>
          </div>
        </>
      ) : null}
      <ToastContainer />
    </>
  );
}
{
  /* <div className='flex flex-col fixed inset-0 backdrop-brightness-50	justify-center items-center z-10'>
            <div className='fixed top-8 right-8 z-10 max-sm:top-[0.5rem] max-sm:right-[0.5rem] '>
              <button
                onClick={() => {
                  setOpenLinkProduct('');
                  document.body.style.overflow = 'auto';
                }}>
                {' '}
                <img src='/closeWhite.svg' width={30} height={30} alt='close' />
              </button>
            </div>
            <img
              src={openLinkProduct}
              width={600}
              height={600}
              alt='product'
              className='w-[60%] max-md:w-[80%] h-[90%] object-contain'
            />
   */
}
