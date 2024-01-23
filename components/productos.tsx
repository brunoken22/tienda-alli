'use client';
import Link from 'next/link';
import {GetDataCartShopping, GetDataProduct} from '@/lib/hook';
import {EsqueletonProduct} from './esqueleton';
import React, {useEffect, useState} from 'react';
import {useRouter, useSearchParams} from 'next/navigation';
import {TemplateProduct} from './template';
import {FiltroSearch} from './filtro';
import {FormSearch} from '@/ui/form';
import {ShoppingCart} from './shoppingCart';
import {useRecoilState} from 'recoil';
import {openShoppingCart, shoppingCart} from '@/lib/atom';

export function ProductosComponent() {
  const {replace} = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('q') || '');
  const [typeSearch, setTypeSearch] = useState<string[]>(
    JSON.parse(searchParams.get('type')!) || []
  );
  const [typePrice, setTypePrice] = useState<number[]>(
    JSON.parse(searchParams.get('price')!) || [0, 60000]
  );
  const [isOpenFilter, setIsOpenFilter] = useState(false);
  const [openLinkProduct, setOpenLinkProduct] = useState('');
  const [offset, setOffset] = useState(Number(searchParams.get('offset')) || 0);
  const [dataModi, setDataModi] = useState<any>();
  const [openShoppingCartValue, setOpenShoppingCartValue] =
    useRecoilState(openShoppingCart);
  const [shoppingCartUserData, setShoppingCartUserData] =
    useRecoilState(shoppingCart);
  const {data, isLoading} = GetDataProduct(
    search,
    typeSearch,
    typePrice,
    15,
    offset
  );
  const {dataCartShopping} = GetDataCartShopping(
    typeof window !== 'undefined' ? localStorage.getItem('category') : null
  );

  useEffect(() => {
    if (data?.results?.length) {
      const ordenados = data.results.sort((a: any, b: any) => {
        return a.oferta === b.oferta ? 0 : a.oferta ? -1 : 1;
      });
      setDataModi(ordenados);
      return;
    }
    setDataModi([]);
  }, [data]);
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
  useEffect(() => {
    if (typeSearch) {
      setOffset(0);
    }
  }, [typeSearch]);
  useEffect(() => {
    if (dataCartShopping) {
      setShoppingCartUserData(dataCartShopping);
    }
  }, [dataCartShopping]);

  const handleTypeCategoryPrice = (category: string[], price: number[]) => {
    setTypePrice(price);
    setTypeSearch(category);
  };
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
      <div className='bg-[#272727] pt-4 pb-4 flex flex-col gap-4 fixed top-0 left-0 right-0 z-10'>
        <div className='relative'>
          <h2 className='text-center font-bold text-2xl text-white '>
            Tienda de ALLI
          </h2>
          <div className='absolute left-[90%] top-[20%]'>
            <button
              className='relative '
              onClick={() => setOpenShoppingCartValue(true)}>
              <img src='/cart-shopping.svg' alt='cart-shopping' width={23} />
              {shoppingCartUserData.length ? (
                <span className='absolute bottom-[60%] left-[60%] bg-[#ffefa9] text-[0.8rem] pr-[0.4rem] pl-[0.4rem] rounded-full'>
                  {shoppingCartUserData.length}
                </span>
              ) : null}
            </button>
          </div>
        </div>
        <div className=' hidden justify-center max-sm:justify-between max-lg:flex mr-4 ml-4'>
          <FormSearch value={search} modValue={handleModValueFormSearch} />
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
        </div>
      </div>
      <div className='grid grid-cols-[repeat(1,230px_1fr);] gap-6 max-lg:grid-cols-none m-8 max-sm:m-0 mt-[10rem] max-sm:mt-[10rem]'>
        <div className='w-full flex flex-col gap-8 max-lg:hidden '>
          <FiltroSearch
            valueDefault={handleDefaultParams}
            typeCategoriaPrice={handleTypeCategoryPrice}
            closeFilter={() => setIsOpenFilter(false)}
            search={search}
            isMobile={false}>
            <FormSearch value={search} modValue={handleModValueFormSearch} />
          </FiltroSearch>
        </div>
        <div>
          {data?.results.length ? (
            <p className='flex justify-center mb-8 font-medium'>
              {data.results.length + data.pagination.offset} de{' '}
              {data.pagination.total}
            </p>
          ) : null}
          <div className='flex justify-center flex-wrap gap-8  max-md:m-2   '>
            {dataModi?.length
              ? dataModi.map((item: any) => (
                  <TemplateProduct
                    key={item.objectID}
                    openImg={(data: string) => setOpenLinkProduct(data)}
                    Name={item.Name}
                    Images={item.Images[0].thumbnails.full.url}
                    priceOfert={item.priceOfert}
                    price={item['Unit cost']}
                    oferta={item.oferta}
                    id={item.objectID}
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
                className='bg-[#ffefa9] p-4 pt-2 pb-2 text-black rounded-lg font-semibold'
                onClick={() => setOffset(Number(offset) - 15)}>
                Volver
              </button>
            ) : null}
            {data?.results.length &&
            data.results.length + data.pagination.offset <
              data.pagination.total ? (
              <button
                className='bg-[#ffefa9] p-4 pt-2 pb-2 text-black rounded-lg font-semibold'
                onClick={() => setOffset(Number(offset) + 15)}>
                Ver más
              </button>
            ) : null}
          </div>
        </div>
      </div>
      <div className='fixed bottom-5 right-5 z-9 bg-[#40ea41] rounded-full p-2 shadow-[0_0_10px_0.5px] hover:opacity-80'>
        <Link href='https://api.whatsapp.com/send?phone=+541159102865&text=Hola%20te%20hablo%20desde%20la%20p%C3%A1gina'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 480 512'
            width='30px'
            height='30px'
            fill='#fff'>
            <path d='M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z' />
          </svg>
        </Link>
      </div>
      {openLinkProduct ? (
        <>
          <div className='flex flex-col fixed inset-0 backdrop-brightness-50	justify-center items-center z-10'>
            <div className='fixed top-8 right-8 z-10 max-sm:top-[0.5rem] max-sm:right-[0.5rem] '>
              {' '}
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
          </div>
        </>
      ) : null}
      {isOpenFilter ? (
        <FiltroSearch
          search={search}
          valueDefault={handleDefaultParams}
          typeCategoriaPrice={handleTypeCategoryPrice}
          closeFilter={() => setIsOpenFilter(false)}
          isMobile={true}
        />
      ) : null}
      {openShoppingCartValue ? <ShoppingCart /> : null}
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
    </>
  );
}
