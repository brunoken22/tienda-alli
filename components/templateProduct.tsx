import { useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Eye, ShoppingCart as ShoppingCartIcon, Trash } from 'lucide-react';
import Image from 'next/image';
import { useRecoilState } from 'recoil';
import { shoppingCart } from '@/lib/atom';
import { InputNumber } from './ui/input';

interface TemplateProductProps {
  openImg: (data: string[]) => void;
  Name: string;
  Images: string[];
  priceOfert?: number;
  price: number;
  oferta?: boolean;
  id: string;
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
  type,
  size,
  addItem,
  setShoppingCartUserData,
}: TemplateProductProps) {
  const [selectedSize, setSelectedSize] = useState<string>('');

  const handleImageClick = () => openImg(Images);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();

    if (!selectedSize && size) return;

    const newItem = {
      size: selectedSize,
      cantidad: 1,
      id,
      title: Name,
      img: Images[0],
      price: priceOfert || price,
    };

    setShoppingCartUserData((prev) => {
      const exists = prev.find((item) => item.id === id && item.size === selectedSize);
      if (exists) return prev;

      const updated = [newItem, ...prev];
      localStorage.setItem('category', JSON.stringify(updated));
      return updated;
    });

    addItem();
  };

  return (
    <div className='bg-card border rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group'>
      <div className='relative aspect-square overflow-hidden'>
        {oferta && (
          <Badge className='absolute top-2 left-2 z-10 bg-red-500 hover:bg-red-600'>Oferta</Badge>
        )}
        <Image
          src={Images[0] || '/tienda-alli.webp'}
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
          <p className='text-sm text-muted-foreground'>
            {type.map((s, i) => (
              <span key={i} className='capitalize'>
                {s}
                {i !== type.length - 1 ? ', ' : ''}
              </span>
            ))}
          </p>

          {size && (
            <select
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
              className='mt-2 block w-full border px-2 py-1 rounded-md text-sm'>
              <option value=''>Seleccionar talla</option>
              {size.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
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
          <Button
            size='sm'
            onClick={handleClick}
            disabled={!selectedSize && size ? true : false}
            className='bg-purple-600 hover:bg-purple-700'>
            <ShoppingCartIcon className='w-4 h-4 mr-1' />
            Agregar
          </Button>
        </div>
      </div>
    </div>
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
      (item: any) => item.id !== e.currentTarget.id || item.talla !== size
    );
    if (typeof window !== 'undefined') {
      localStorage.setItem('category', JSON.stringify(newShoppingCart));
    }
    setShoppingCartValue(newShoppingCart);
  };

  return (
    <div className='flex justify-between items-center gap-4 border-b border-gray-200 py-4 px-3 hover:bg-gray-50 transition-colors rounded-lg w-full'>
      <div className='flex gap-4 items-center w-full'>
        <img
          src={img}
          alt={title}
          loading='lazy'
          className='h-24 w-24 object-cover rounded-md shadow-sm'
        />
        <div className='relative truncate'>
          <p
            onMouseEnter={() => setOpenFocusName(true)}
            onMouseLeave={() => setOpenFocusName(false)}
            className='text-sm font-medium text-gray-800 truncate cursor-default'>
            {title}
          </p>
          {/* {openFocusName && (
            <h3 className=' z-20 left-1/2 transform -translate-x-1/2 top-full mt-1 bg-gray-900 text-white text-xs rounded px-3 py-1 shadow-lg '>
              {title}
            </h3>
          )} */}
          {size && <span className='text-sm font-medium text-gray-600'>Talle: {size}</span>}
          <h3 className='text-base font-semibold text-gray-900 mt-1'>
            {price.toLocaleString('es-AR', {
              style: 'currency',
              currency: 'ARS',
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            })}
          </h3>
          <div className='flex flex-row items-center gap-2 justify-between mt-2'>
            <div className='flex items-center gap-4 '>
              <InputNumber cantidad={cantidad || 1} id={id} talla={size} />
            </div>
            <button
              onClick={handleDelete}
              id={id}
              className='p-2 rounded  text-red-400 hover:text-red-600  transition-colors cursor-pointer'
              aria-label='Eliminar producto'>
              <Trash size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
