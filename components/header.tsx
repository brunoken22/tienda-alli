'use client';

import { openShoppingCart, shoppingCart } from '@/lib/atom';
import { FormSearchHome } from '@/components/ui/form';
import Link from 'next/link';
import { useRecoilState } from 'recoil';
import ShoppingCart from './shoppingCart';
import { usePathname } from 'next/navigation';
import { getDataCartShopping } from '@/lib/hook';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, ShoppingCartIcon as CartIcon, Menu, X, MessageCircle } from 'lucide-react';

export function Header() {
  const [openInput, setOpenInput] = useState(false);
  const [openMobileMenu, setOpenMobileMenu] = useState(false);
  const [openShoppingCartValue, setOpenShoppingCartValue] = useRecoilState(openShoppingCart);
  const pathname = usePathname();
  const [shoppingCartUserData, setShoppingCartUserData] = useRecoilState(shoppingCart);

  useEffect(() => {
    (async () => {
      const data = await getDataCartShopping(
        typeof window !== 'undefined' ? localStorage.getItem('category') : null
      );
      if (data) {
        setShoppingCartUserData(data);
      }
    })();
  }, [setShoppingCartUserData]);

  const navigationItems = [
    { href: '/', label: 'Inicio' },
    { href: '/nosotros', label: 'Nosotros' },
    { href: '/productos', label: 'Productos' },
  ];

  const isActivePath = (path: string) => pathname === path;

  return (
    <>
      {/* Header Principal */}
      <header className='bg-gradient-to-r from-purple-600 to-purple-700 shadow-lg fixed top-0 left-0 right-0 z-50 backdrop-blur-sm'>
        <div className='container mx-auto px-4'>
          <div className='flex items-center justify-between h-16 md:h-20'>
            {/* Logo */}
            <Link href='/' className='flex items-center space-x-2 group'>
              <div className='w-8 h-8 bg-white rounded-full flex items-center justify-center group-hover:scale-110 transition-transform'>
                <span className='text-purple-600 font-bold text-lg'>A</span>
              </div>
              <span className='text-white font-bold text-xl md:text-2xl group-hover:text-purple-200 transition-colors'>
                Tienda de ALLI
              </span>
            </Link>

            {/* Búsqueda Desktop */}
            {pathname !== '/productos' && (
              <div className='hidden md:flex flex-1 max-w-md mx-8'>
                <FormSearchHome />
              </div>
            )}

            {/* Navegación Desktop */}
            <nav className='hidden md:flex items-center space-x-6'>
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative px-3 py-2 text-sm font-medium transition-colors ${
                    isActivePath(item.href) ? 'text-yellow-300' : 'text-white hover:text-purple-200'
                  }`}>
                  {item.label}
                  {isActivePath(item.href) && (
                    <div className='absolute bottom-0 left-0 right-0 h-0.5 bg-yellow-300 rounded-full' />
                  )}
                </Link>
              ))}
            </nav>

            {/* Acciones Desktop */}
            <div className='flex items-center space-x-4'>
              {/* Búsqueda Mobile */}
              {!openInput && pathname !== '/productos' && (
                <Button
                  variant='ghost'
                  size='icon'
                  onClick={() => setOpenInput(true)}
                  className='md:hidden text-white hover:bg-white/20'>
                  <Search className='w-5 h-5' />
                </Button>
              )}

              {/* Carrito */}
              <Button
                variant='ghost'
                size='icon'
                onClick={() => setOpenShoppingCartValue(true)}
                className='relative text-white hover:bg-white/20'>
                <CartIcon className='w-5 h-5' />
                {shoppingCartUserData.length > 0 && (
                  <Badge
                    variant='destructive'
                    size='sm'
                    className='absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-sm'>
                    {shoppingCartUserData.length}
                  </Badge>
                )}
              </Button>

              {/* Menu Mobile */}
              <Button
                variant='ghost'
                size='icon'
                onClick={() => setOpenMobileMenu(!openMobileMenu)}
                className='md:hidden text-white hover:bg-white/20'>
                {openMobileMenu ? <X className='w-5 h-5' /> : <Menu className='w-5 h-5' />}
              </Button>
            </div>
          </div>

          {/* Navegación Mobile */}
          {openMobileMenu && (
            <div className='md:hidden border-t border-purple-500/30 py-4'>
              <nav className='flex flex-col space-y-2'>
                {navigationItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpenMobileMenu(false)}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                      isActivePath(item.href)
                        ? 'bg-white/20 text-yellow-300'
                        : 'text-white hover:bg-white/10'
                    }`}>
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Overlay de búsqueda mobile */}
      {openInput && pathname !== '/productos' && (
        <div className='fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden'>
          <div className='bg-white m-4 mt-20 rounded-lg p-4 shadow-xl'>
            <div className='flex items-center space-x-2'>
              <div className='flex-1'>
                <FormSearchHome />
              </div>
              <Button variant='ghost' size='icon' onClick={() => setOpenInput(false)}>
                <X className='w-5 h-5' />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Carrito lateral */}
      {openShoppingCartValue && <ShoppingCart />}

      {/* Botón WhatsApp flotante con tooltip horizontal a la izquierda */}
      <div className='fixed bottom-6 right-6 z-40 group'>
        <Link
          href='https://api.whatsapp.com/send?phone=+541159102865&text=Hola%20te%20hablo%20desde%20la%20p%C3%A1gina'
          aria-label='Contactar por WhatsApp'
          className='relative flex items-center'>
          {/* Tooltip en línea a la izquierda */}
          <div className='absolute right-14 hidden group-hover:flex items-center space-x-1'>
            <div className='bg-primary text-white  px-3 py-1 rounded-lg shadow-md whitespace-nowrap'>
              Enviar un mensaje
            </div>
            <div className='w-2 h-2 bg-primary rotate-45'></div>
          </div>

          {/* Botón */}
          <div className='bg-green-500 hover:bg-green-600 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-110'>
            <MessageCircle className='w-6 h-6' />
          </div>
        </Link>
      </div>
    </>
  );
}
