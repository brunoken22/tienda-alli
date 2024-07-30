'use client';
import Link from 'next/link';
import {GetDataProduct} from '@/lib/hook';
import {EsqueletonProduct} from './esqueleton';
import React, {useEffect, useRef, useState} from 'react';
import {usePathname, useRouter, useSearchParams} from 'next/navigation';
import {TemplateProduct} from './template';
import {FiltroSearch} from './filtro';
import {FormSearch} from '@/ui/form';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {CarouselProduct} from './carousel';
import {useDebouncedCallback} from 'use-debounce';

export default function ProductosComponent() {
  const {replace} = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [openInput, setOpenInput] = useState(false);
  const [search, setSearch] = useState(searchParams.get('q') || '');
  const [typeSearch, setTypeSearch] = useState<string[]>(
    JSON.parse(searchParams.get('type')!) || []
  );
  const [typePrice, setTypePrice] = useState<number[]>(
    JSON.parse(searchParams.get('price')!) || [0, 70000]
  );
  const [isOpenFilter, setIsOpenFilter] = useState(false);
  const [openLinkProduct, setOpenLinkProduct] = useState<string[]>([]);
  const [offset, setOffset] = useState(Number(searchParams.get('offset')) || 0);
  const [dataModi, setDataModi] = useState<any>();
  const useDebouncePrice = useDebouncedCallback(
    (category: string[], price: number[]) => {
      setTypePrice(price);
      setTypeSearch(category);
    },
    1000
  );

  const {data, isLoading} = GetDataProduct(
    search,
    typeSearch,
    typePrice,
    15,
    offset
  );

  const seccionDestinoRef: any = useRef(null);

  useEffect(() => {
    if (data?.results?.length) {
      seccionDestinoRef.current.scrollIntoView({
        behavior: 'smooth',
      });
      const ordenados = data.results.sort((a: any, b: any) => {
        return a.oferta === b.oferta ? 0 : a.oferta ? -1 : 1;
      });
      setDataModi(ordenados);
      return;
    }
    setDataModi([]);
  }, [data]);
  useEffect(() => {
    if (typeSearch) {
      setOffset(0);
    }
  }, [typeSearch]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (!typeSearch.length) {
      params.set('q', search);
    } else {
      params.delete('q');
      setSearch('');
    }
    params.set('price', JSON.stringify(typePrice));
    params.set('type', JSON.stringify(typeSearch));
    params.set('limit', JSON.stringify(15));
    params.set('offset', JSON.stringify(offset));

    replace(`?${params.toString()}`);
  }, [typeSearch, typePrice, search, offset]);

  const handleModValueFormSearch = (inputSearchFrom: string) => {
    setSearch(inputSearchFrom);
    setTypeSearch([]);
  };
  const handleDefaultParams = {
    typeSearch,
    typePrice,
  };
  return (
    <>
      {openInput ? (
        <div className='fixed inset-0 z-10 backdrop-blur-[2px]'>
          <div className='max-md:block hidden  bg-primary fixed top-[3rem] right-0 left-0 z-[9] '>
            {pathname == '/productos' ? (
              <div className='  justify-center gap-4 flex mr-4 ml-4 p-2'>
                <div className='flex bg-gray-200 pr-2'>
                  <FormSearch
                    value={search}
                    modValue={handleModValueFormSearch}
                  />
                  <button onClick={() => setOpenInput(false)}>
                    <img
                      src='/closeBlack.svg'
                      alt='close'
                      className='w-[20px]'
                    />
                  </button>
                </div>
                {pathname == '/productos' ? (
                  <button
                    onClick={() => {
                      document.body.style.overflow = 'hidden';
                      setIsOpenFilter(true);
                    }}
                    className='hidden gap-[0.5rem] items-center text-white ml-4 max-lg:flex '>
                    Filtrar
                    <div className='flex flex-col gap-[0.2rem] items-center'>
                      <div className='w-[20px] h-[2px]  bg-white'></div>
                      <div className='w-[16px] h-[2px] bg-white'></div>
                      <div className='w-[10px] h-[2px] bg-white'></div>
                    </div>
                  </button>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      ) : (
        <div className='hidden max-md:block fixed top-16 z-10 right-[12%]'>
          <button onClick={() => setOpenInput(true)}>
            <img src='/searchWhite.svg' alt='search' width={20} height={20} />
          </button>
        </div>
      )}
      <div className='grid grid-cols-[repeat(1,230px_1fr);] gap-6 max-md:grid-cols-none   mt-[5rem] max-w-[1450px] mr-auto ml-auto p-2 max-md:mt-[7rem] max-md:p-0'>
        <div className='w-full flex flex-col gap-8 max-md:hidden mt-16'>
          <FiltroSearch
            valueDefault={handleDefaultParams}
            typeCategoriaPrice={useDebouncePrice}
            closeFilter={() => setIsOpenFilter(false)}
            search={search}
            isMobile={false}>
            <FormSearch value={search} modValue={handleModValueFormSearch} />
          </FiltroSearch>
        </div>
        <div ref={seccionDestinoRef} className=''>
          {data?.results?.length ? (
            <p className='flex justify-center mb-8 font-medium'>
              {data?.results?.length + data.pagination.offset} de{' '}
              {data?.pagination?.total}
            </p>
          ) : null}
          <div className='flex justify-center flex-wrap gap-4 max-lg:m-0 p-2'>
            {dataModi?.length
              ? dataModi.map((item: any) => (
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
                    inicio={false}
                    type={item.type}
                    size={item.talla}
                    addItem={() => toast.success('Se agregó al carrito!')}
                  />
                ))
              : dataModi?.length == 0 && !isLoading
              ? 'No hay producto'
              : ''}
            {isLoading
              ? [
                  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
                  19, 20,
                ].map((item: number) => <EsqueletonProduct key={item} />)
              : ''}
          </div>
          <div
            className={`flex  mt-8 mr-4 ml-4 ${
              data &&
              data.pagination.total > 16 &&
              data.pagination.offset > 0 &&
              data.results.length + data.pagination.offset <=
                data.pagination.total
                ? 'justify-between'
                : 'justify-end'
            }`}>
            {data &&
            data.pagination.total > 16 &&
            data.pagination.offset > 0 &&
            data.results.length + data.pagination.offset <=
              data.pagination.total ? (
              <button
                className='bg-primary p-4 pt-2 pb-2 text-secundary rounded-lg font-semibold'
                onClick={() => setOffset(Number(offset) - 15)}>
                Volver
              </button>
            ) : null}
            {data?.results.length &&
            data.results.length + data.pagination.offset <
              data.pagination.total ? (
              <button
                className='bg-primary p-4 pt-2 pb-2 text-secundary rounded-lg font-semibold'
                onClick={() => setOffset(Number(offset) + 15)}>
                Ver más
              </button>
            ) : null}
          </div>
        </div>
      </div>
      {openLinkProduct.length ? (
        <>
          <div className='flex flex-col fixed inset-0 backdrop-brightness-[0.2]	justify-center items-center z-10'>
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
            <div className='h-[90%] w-[95%]'>
              <CarouselProduct imgs={openLinkProduct} />
            </div>
          </div>
        </>
      ) : null}
      {isOpenFilter ? (
        <FiltroSearch
          search={search}
          valueDefault={handleDefaultParams}
          typeCategoriaPrice={useDebouncePrice}
          closeFilter={() => {
            setIsOpenFilter(false), setOpenInput(false);
          }}
          isMobile={true}
        />
      ) : null}
      <Link
        href={'https://www.facebook.com/marketplace/profile/100025099413594/'}
        className={`flex justify-center gap-4 items-center ${
          data?.results?.length ? 'mt-12' : 'mt-[10rem]'
        }  flex-wrap mb-8`}
        target='_blank'>
        <img src={'/facebook.svg'} width={100} height={100} alt='facebook' />
        <h2 className='text-3xl font-bold max-md:text-center max-md:text-2xl'>
          VISÍTANOS <br></br>EN NUESTRO<br></br> MARKETPLACE
        </h2>
      </Link>
      <ToastContainer />
    </>
  );
}
