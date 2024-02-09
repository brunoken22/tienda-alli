'use client';
import {openShoppingCart, shoppingCart} from '@/lib/atom';
import {FormSearchHome} from '@/ui/form';
import Link from 'next/link';
import {useRecoilState} from 'recoil';
import {ShoppingCart} from './shoppingCart';
import {usePathname} from 'next/navigation';
import {GetDataCartShopping} from '@/lib/hook';
import {useEffect} from 'react';

export function Header() {
  const [openShoppingCartValue, setOpenShoppingCartValue] =
    useRecoilState(openShoppingCart);
  const pathname = usePathname();
  const {dataCartShopping} = GetDataCartShopping(
    typeof window !== 'undefined' ? localStorage.getItem('category') : null
  );
  const [shoppingCartUserData, setShoppingCartUserData] =
    useRecoilState(shoppingCart);
  useEffect(() => {
    if (dataCartShopping) {
      setShoppingCartUserData(dataCartShopping);
    }
  }, [dataCartShopping]);
  return (
    <>
      <div className='bg-[#272727] pt-4 pb-4 flex flex-col gap-4 fixed top-0 left-0 right-0 z-10'>
        <div className='relative flex justify-between pl-4 pr-4 max-md:flex-col max-md:gap-4'>
          <Link
            href={'/'}
            className='text-center font-bold text-2xl text-white '>
            Tienda de ALLI
          </Link>
          {pathname !== '/productos' ? (
            <div className=' flex justify-center gap-4 max-md:hidden mr-4 ml-4'>
              <FormSearchHome />
            </div>
          ) : null}
          <div className='flex justify-between gap-6 items-center max-md:justify-center'>
            <div className=' flex gap-4'>
              <Link
                href={'/'}
                className={`${
                  pathname == '/' ? 'text-[#ffefa9]' : 'text-white'
                }`}>
                Inicio
              </Link>
              <Link
                href={'/nosotros'}
                className={`${
                  pathname == '/nosotros' ? 'text-[#ffefa9]' : 'text-white'
                }`}>
                Nosotros
              </Link>
              <Link
                href={'/productos'}
                className={`${
                  pathname == '/productos' ? 'text-[#ffefa9]' : 'text-white'
                }`}>
                Productos
              </Link>
            </div>
            <div className='max-md:absolute max-md:left-[85%] max-md:top-[10%]'>
              <button
                className='relative '
                onClick={() => setOpenShoppingCartValue(true)}>
                <img src='/cart-shopping.svg' alt='cart-shopping' width={20} />
                {shoppingCartUserData.length ? (
                  <span className='absolute bottom-[60%] left-[60%] bg-[#ffefa9] text-[0.8rem] pr-[0.4rem] pl-[0.4rem] rounded-full'>
                    {shoppingCartUserData.length}
                  </span>
                ) : null}
              </button>
            </div>
          </div>
        </div>
        {pathname !== '/productos' ? (
          <div className=' hidden justify-center gap-4 max-md:flex mr-4 ml-4'>
            <FormSearchHome />
          </div>
        ) : null}
        {openShoppingCartValue ? <ShoppingCart /> : null}
      </div>
      <div className='fixed bottom-5 right-5 z-[9] bg-[#40ea41] rounded-full p-2 shadow-[0_0_10px_0.5px] hover:opacity-80'>
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
    </>
  );
}
