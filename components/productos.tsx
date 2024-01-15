'use client';
import Link from 'next/link';
import Image from 'next/image';
import {GetDataProduct} from '@/lib/hook';
import {EsqueletonProduct} from './esqueleton';
import React, {useState} from 'react';

export function ProductosComponent() {
  const [search, setSearch] = useState('');
  const {data, isLoading} = GetDataProduct(search);
  const handleChange = (e: React.ChangeEvent) => {
    e.preventDefault();
    const target = e.target as HTMLInputElement;
    setSearch(target.value);
  };
  console.log(data?.length);
  return (
    <>
      <h2 className='text-center font-bold text-2xl mt-4'>
        Útiles escolares y mochilas
      </h2>
      <div className='flex justify-center  mt-4'>
        <div className='flex justify-center bg-gray-200 p-2'>
          <input
            type='text'
            name='search'
            id=''
            onChange={handleChange}
            placeholder='Mochila'
            className='bg-transparent focus-visible:outline-none placeholder:white-500'
          />
          <button>
            <Image src='/search.svg' alt='search' width={20} height={20} />
          </button>
        </div>
      </div>
      <div className='flex justify-center flex-wrap gap-8 m-8 max-md:m-2 mt-16 max-md:mt-10'>
        {data?.length
          ? data.map((item: any) => (
              <div
                key={item.objectID}
                className='flex gap-4 w-[350px] items-center  bg-[#ffefa9] rounded-lg h-[130px]'>
                <Image
                  src={item.Images[0].url}
                  alt={item.Name}
                  width={100}
                  height={100}
                  quality={100}
                  className=' h-full object-cover rounded-b-lg rounded-l-lg'
                  loading='lazy'
                />
                <div className='flex flex-col gap-4'>
                  <h2 className='h-[48px] overflow-hidden'>
                    {item.Name || 'prueba'}{' '}
                  </h2>
                  <p className='font-bold'>${item['Unit cost']}</p>
                </div>
              </div>
            ))
          : data?.length == 0
          ? 'No hay producto'
          : ''}
        {isLoading
          ? [
              1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
              20,
            ].map((item: number) => <EsqueletonProduct key={item} />)
          : ''}
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
      </div>
      <Link
        href={'https://www.facebook.com/marketplace/profile/100025099413594/'}
        className='flex justify-center gap-4 items-center mt-12 flex-wrap mb-8'>
        <Image src={'/facebook.svg'} width={100} height={100} alt='facebook' />
        <h2 className='text-3xl font-bold max-md:text-center'>
          VISÍTANOS <br></br>EN NUESTRO<br></br> MARKETPLACE
        </h2>
      </Link>
    </>
  );
}
