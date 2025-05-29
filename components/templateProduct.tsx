import { openShoppingCart, shoppingCart } from '@/lib/atom';
import { InputNumber } from '@/components/ui/input';
import { useEffect, useState } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import Image from 'next/image';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Eye, ShoppingCart } from 'lucide-react';

interface TemplateProductProps {
  openImg: (data: string[]) => void;
  Name: string;
  Images: string[];
  priceOfert?: number;
  price: number;
  oferta?: boolean;
  id: string;
  inicio?: boolean;
  type: string[];
  size?: string[];
  addItem: () => void;
  setShoppingCartUserData: React.Dispatch<React.SetStateAction<any[]>>;
}

export function TemplateProduct({
  openImg,
  Name,
  Images,
  priceOfert,
  price,
  oferta,
  id,
  inicio,
  type,
  size,
  addItem,
  setShoppingCartUserData,
}: TemplateProductProps) {
  const handleImageClick = () => {
    openImg(Images);
  };
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const windowWidth = window.innerWidth;
    addItem();

    if (windowWidth > 1024) {
      // setOpenShoppingCartValue(true);
    }
    setShoppingCartUserData((prev) => {
      let newShoppingCart = [];
      if (prev.length) {
        if (prev.find((item) => item.id === e.currentTarget.id)) {
          if (size?.length) {
            if (prev.find((item) => item.id === e.currentTarget.id && item.size == size)) {
              return prev;
            } else {
              newShoppingCart = [
                {
                  size,
                  cantidad: 1,
                  id: id,
                  title: Name,
                  img: Images[0],
                  price: priceOfert || price,
                },
                ...prev,
              ];
              localStorage.setItem('category', JSON.stringify(newShoppingCart));

              return newShoppingCart;
            }
          } else {
            return prev;
          }
        } else {
          newShoppingCart = [
            {
              size,
              cantidad: 1,
              id: id,
              title: Name,
              img: Images[0],
              price: priceOfert || price,
            },
            ...prev,
          ];
          localStorage.setItem('category', JSON.stringify(newShoppingCart));

          return newShoppingCart;
        }
      } else {
        newShoppingCart.push({
          size,
          cantidad: 1,
          id: id,
          title: Name,
          img: Images[0],
          price: priceOfert || price,
        });
      }

      localStorage.setItem('category', JSON.stringify(newShoppingCart));
      return newShoppingCart as any[];
    });
  };

  return (
    <div className='bg-card border rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group'>
      <div className='relative aspect-square overflow-hidden'>
        {oferta && (
          <Badge className='absolute top-2 left-2 z-10 bg-red-500 hover:bg-red-600'>Oferta</Badge>
        )}
        <Image
          src={Images[0] || '/placeholder.svg'}
          alt={Name}
          fill
          className='object-cover group-hover:scale-105 transition-transform duration-300'
        />
        <div className='absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300' />
        <div className='absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
          <Button
            size='icon'
            variant='secondary'
            onClick={handleImageClick}
            className='rounded-full'>
            <Eye className='w-4 h-4' />
          </Button>
        </div>
      </div>

      <div className='p-4 space-y-3'>
        <div>
          <h3 className='font-semibold text-sm line-clamp-2 mb-1'>{Name}</h3>
          <p className='text-sm text-muted-foreground '>
            {type.map((s, i) => (
              <span key={i} className='capitalize'>
                {' '}
                {s + (type.length - 1 === i ? '' : ', ')}
              </span>
            ))}
          </p>
          {size?.length && (
            <p className='text-sm text-muted-foreground'>
              size: {size.map((s, i) => s + (size.length - 1 === i ? '' : ', '))}
            </p>
          )}
        </div>

        <div className='flex items-center justify-between'>
          <div className='space-y-1'>
            {oferta && priceOfert ? (
              <div className='flex items-center gap-2'>
                <span className='font-bold text-green-600'>${priceOfert.toLocaleString()}</span>
                <span className='text-sm text-muted-foreground line-through'>
                  ${price.toLocaleString()}
                </span>
              </div>
            ) : (
              <span className='font-bold'>${price.toLocaleString()}</span>
            )}
          </div>

          <Button size='sm' onClick={handleClick} className='bg-purple-600 hover:bg-purple-700'>
            <ShoppingCart className='w-4 h-4 mr-1' />
            Agregar
          </Button>
        </div>
      </div>
    </div>
  );
}

export function TemplateCategory({
  name,
  isCategoria,
  valueDefault,
  type,
  categoriaAllUser,
}: {
  valueDefault: boolean;
  type: string;
  name: string;
  categoriaAllUser: string[];
  isCategoria: (categoria: string) => void;
}) {
  const [isActiveClick, setIsActiveClick] = useState(valueDefault);
  const [isOpenCategoryAll, setIsOpenCategoryAll] = useState(false);

  useEffect(() => {
    return setIsActiveClick(valueDefault);
  }, [valueDefault]);

  useEffect(() => {
    Array.isArray(type)
      ? type.map(
          (item) => categoriaAllUser.includes(item.type as string) && setIsOpenCategoryAll(true)
        )
      : null;
  }, []);
  return (
    <>
      <button
        key={name}
        className={`flex items-center gap-[0.2rem] hover:opacity-60 transition-[border] duration-100 ease-linear ${
          isActiveClick && !Array.isArray(type)
            ? 'font-bold border-b-2 border-b-[#3c006c] max-md:border-b-white text-[#3c006c] max-md:text-white'
            : 'font-light border-none  max-md:text-white'
        }	`}
        id={type}
        onClick={(e: React.MouseEvent) => {
          if (Array.isArray(type)) {
            setIsOpenCategoryAll(!isOpenCategoryAll);
            return;
          }
          isCategoria(e.currentTarget.id);
          setIsActiveClick(!isActiveClick);
        }}>
        {Array.isArray(type) ? (
          <img
            src='/addition.svg'
            width={'12px'}
            className='border border-solid border-[#8e8e8e]'
          />
        ) : null}
        {name}
      </button>
      {Array.isArray(type) && isOpenCategoryAll
        ? type.map((item) => (
            <TemplateCategorySecond
              name={item.id}
              isCategoria={isCategoria}
              valueDefault={categoriaAllUser.includes(item.type as string)}
              type={item.type}
              key={item.type}
            />
          ))
        : null}
    </>
  );
}
export function TemplateCategorySecond({
  name,
  isCategoria,
  valueDefault,
  type,
}: {
  valueDefault: boolean;
  type: string;
  name: string;
  isCategoria: (categoria: string) => void;
}) {
  const [isActiveClick, setIsActiveClick] = useState(valueDefault);

  useEffect(() => {
    return setIsActiveClick(valueDefault);
  }, [valueDefault]);

  return (
    <button
      key={name}
      className={`ml-4 flex items-center gap-[0.2rem] hover:opacity-60 transition-[border] duration-100 ease-linear  ${
        isActiveClick
          ? 'font-bold border-b-2 border-b-[#3c006c] max-md:border-b-white text-[#3c006c] max-md:text-white'
          : 'font-light border-none  max-md:text-white'
      }	`}
      id={type}
      onClick={(e: React.MouseEvent) => {
        isCategoria(e.currentTarget.id);
        setIsActiveClick(!isActiveClick);
      }}>
      {name}
    </button>
  );
}
export function TemplateShopppingCartProduct({
  id,
  title,
  price,
  cantidad,
  img,
  size,
}: {
  id: string;
  title: string;
  price: number;
  cantidad: number;
  img: string;
  size: string;
}) {
  const [openFocusName, setOpenFocusName] = useState(false);
  const [shoppingCartValue, setShoppingCartValue] = useRecoilState(shoppingCart);
  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();

    const newShoppingCart = shoppingCartValue.filter(
      (item: any) => item.id !== e.currentTarget.id || item.size !== size
    );
    if (window !== undefined) {
      localStorage.setItem('category', JSON.stringify(newShoppingCart));
    }
    setShoppingCartValue(newShoppingCart);
  };
  return (
    <div className='flex justify-between border-b-2 border-b-white  pb-6 last:border-none pr-2 pl-2 h-[106px]'>
      <div className='flex gap-4'>
        <img src={img} alt={title} loading='lazy' className='h-full w-[80px] object-cover' />
        <div>
          <p
            onMouseEnter={() => setOpenFocusName(true)}
            onMouseLeave={() => setOpenFocusName(false)}
            className='h-[24px] overflow-hidden max-w-[220px]'>
            {title}
            {openFocusName ? (
              <span className=' absolute botton-0 left-[20%] bg-gray-900 text-white p-[2px] pr-4 pl-4 text-[0.7rem] z-10 '>
                {title}
              </span>
            ) : null}
          </p>
          <h3 className='font-bold'>
            {' '}
            {price.toLocaleString('es-AR', {
              style: 'currency',
              currency: 'ARS',
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            })}
          </h3>
          <div className='flex justify-between items-center'>
            <InputNumber cantidad={cantidad || 1} id={id} talla={size} />
            {size ? <p className='font-semibold'>Talle: {size}</p> : null}
          </div>
        </div>
      </div>
      <button
        onClick={handleDelete}
        id={id}
        className='fill-white hover:fill-red-400 hover:scale-125'>
        <img src='/delete.svg' alt='delete' width={14} className='' />
      </button>
    </div>
  );
}
