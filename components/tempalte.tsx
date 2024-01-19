import {openShoppingCart, shoppingCart} from '@/lib/atom';
import {useEffect, useState} from 'react';
import {useRecoilState} from 'recoil';

export function TemplateProduct({
  Images,
  Name,
  oferta,
  priceOfert,
  openImg,
  price,
  id,
}: {
  id: string;
  Images: any;
  Name: string;
  oferta: string;
  price: number;
  priceOfert: number;
  openImg: (data: any) => any;
}) {
  const [openFocusName, setOpenFocusName] = useState(false);
  const [shoppingCartUserData, setShoppingCartUserData] =
    useRecoilState(shoppingCart);
  const [openShoppingCartValue, setOpenShoppingCartValue] =
    useRecoilState(openShoppingCart);
  const handleClickOpenImg = (e: React.MouseEvent) => {
    e.preventDefault();
    openImg(Images);
    document.body.style.overflow = 'hidden';
  };
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setOpenShoppingCartValue(true);
    setShoppingCartUserData((prev) => {
      let newShoppingCart = [];
      if (prev.length) {
        if (prev.find((item) => item.id === e.currentTarget.id)) {
          newShoppingCart = prev.map((item) => {
            if (item.id == e.currentTarget.id) {
              let count = item.cantidad || 1;
              count += 1;
              return {...item, cantidad: count};
            }
            return item;
          });
        } else {
          return [
            {
              cantidad: 1,
              id: id,
              title: Name,
              img: Images,
              price: priceOfert || price,
            },
            ...prev,
          ];
        }
      } else {
        newShoppingCart.push({
          cantidad: 1,
          id: id,
          title: Name,
          img: Images,
          price: priceOfert || price,
        });
      }
      return newShoppingCart as any[];
    });
  };
  return (
    <div className='grid grid-cols-[repeat(1,120px_1fr)] gap-4 w-[370px] items-center  bg-[#ffefa9] rounded-lg h-[150px]'>
      <button onClick={handleClickOpenImg} className='h-[150px] relative'>
        <img
          src={Images}
          alt={Name}
          width={120}
          height={100}
          className=' w-[120px] h-full object-cover rounded-b-lg rounded-l-lg'
          loading='lazy'
        />
        {oferta ? (
          <div className='absolute top-[-0.5rem] left-[-2rem] rotate-[-40deg]  bg-red-500 text-white p-1 pr-4 pl-4'>
            <h2 className='font-bold'>OFERTA</h2>
          </div>
        ) : (
          ''
        )}
      </button>
      <div className='flex flex-col gap-2'>
        <div className='flex flex-col gap-4'>
          <div className='relative'>
            <h2
              className='max-h-[48px] overflow-hidden font-semibold	'
              onMouseEnter={() => setOpenFocusName(true)}
              onMouseLeave={() => setOpenFocusName(false)}>
              {Name}{' '}
            </h2>
            {openFocusName ? (
              <span className=' absolute botton-0 left-[50%] bg-gray-900 text-white p-[2px] pr-4 pl-4 text-[0.7rem] z-10 '>
                {Name}
              </span>
            ) : null}
          </div>
          {oferta ? (
            <div className='flex justify-start gap-4'>
              <p className='text-gray-500 line-through	'>${price}</p>
              <p className='font-bold'>${priceOfert}</p>
            </div>
          ) : (
            <p className='font-bold'>${price}</p>
          )}
        </div>
        <div>
          <button
            id={id}
            onClick={handleClick}
            className=' bg-black p-4 pt-2 pb-2 text-[#ffefa9] rounded-lg'>
            Añadir al carrito
          </button>
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
      className={`hover:opacity-60 transition-[border] duration-100 ease-linear ${
        isActiveClick
          ? 'text-[#ffefa9] font-bold border-b-2 border-b-[#ffefa9]'
          : 'font-normal border-none text-black max-md:text-white'
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
