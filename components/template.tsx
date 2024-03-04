import {openShoppingCart, shoppingCart} from '@/lib/atom';
import {InputNumber} from '@/ui/input';
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
  inicio,
}: {
  id: string;
  Images: any;
  Name: string;
  oferta: string;
  price: number;
  priceOfert: number;
  openImg: (data: any) => any;
  inicio: boolean;
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
    const windowWidth = window.innerWidth;

    if (windowWidth > 1024) {
      setOpenShoppingCartValue(true);
    }
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
          const newShoppingCart = [
            {
              cantidad: 1,
              id: id,
              title: Name,
              img: Images,
              price: priceOfert || price,
            },
            ...prev,
          ];
          localStorage.setItem('category', JSON.stringify(newShoppingCart));

          return newShoppingCart;
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

      localStorage.setItem('category', JSON.stringify(newShoppingCart));
      return newShoppingCart as any[];
    });
  };
  return (
    <div
      className={` grid-cols-[repeat(1,120px_1fr)] gap-4  items-center   rounded-lg 
      flex flex-col h-auto w-[200px] p-2 text-center shadow-[0_0_15px_5px_#ddd] max-lg:shadow-[0_0_10px_2px_#ddd] max-lg:p-[0.3rem]`}>
      <button
        onClick={handleClickOpenImg}
        className='w-full h-[200px] relative '>
        <img
          src={Images}
          alt={Name}
          width={120}
          height={100}
          className=' w-full h-full object-cover rounded-b-lg rounded-l-lg'
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
      <div
        className={`flex flex-col gap-2 ${
          inicio && 'items-center text-center'
        }`}>
        <div className='flex flex-col gap-4'>
          <div className='relative'>
            <h2
              className='h-[48px] overflow-hidden font-medium	'
              onMouseEnter={() => setOpenFocusName(true)}
              onMouseLeave={() => setOpenFocusName(false)}>
              {Name}{' '}
            </h2>
            {openFocusName ? (
              <span className='w-full max-md:w-auto absolute botton-0 left-[20%] bg-gray-900 text-white p-[2px] pr-4 pl-4 text-[0.7rem] z-10 '>
                {Name}
              </span>
            ) : null}
          </div>
          {oferta ? (
            <div
              className={`flex justify-center gap-4  ${
                inicio && 'items-center justify-center'
              }`}>
              <p className='text-gray-500 line-through	'>
                {price.toLocaleString('es-AR', {
                  style: 'currency',
                  currency: 'ARS',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })}
              </p>
              <p className='font-bold text-[1.2rem]'>
                {priceOfert.toLocaleString('es-AR', {
                  style: 'currency',
                  currency: 'ARS',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })}
              </p>
            </div>
          ) : (
            <p className='font-bold text-[1.2rem]'>
              {price.toLocaleString('es-AR', {
                style: 'currency',
                currency: 'ARS',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })}
            </p>
          )}
        </div>
        <div>
          <button
            id={id}
            onClick={handleClick}
            className=' bg-primary p-4 pt-2 pb-2 text-white rounded-lg hover:opacity-80'>
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
          (item) =>
            categoriaAllUser.includes(item.type as string) &&
            setIsOpenCategoryAll(true)
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
      className={`ml-4 flex items-center gap-[0.2rem] hover:opacity-60 transition-[border] duration-100 ease-linear text-black  ${
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
}: {
  id: string;
  title: string;
  price: number;
  cantidad: number;
  img: string;
}) {
  const [openFocusName, setOpenFocusName] = useState(false);
  const [shoppingCartValue, setShoppingCartValue] =
    useRecoilState(shoppingCart);
  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();

    const newShoppingCart = shoppingCartValue.filter(
      (item: any) => item.id !== e.currentTarget.id
    );
    if (window !== undefined) {
      localStorage.setItem('category', JSON.stringify(newShoppingCart));
    }
    setShoppingCartValue(newShoppingCart);
  };
  return (
    <div className='flex justify-between border-b-2 border-b-white  pb-6 last:border-none pr-2 pl-2 h-[106px]'>
      <div className='flex gap-4'>
        <img
          src={img}
          alt={title}
          loading='lazy'
          className='h-full w-[80px] object-cover'
        />
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
          <InputNumber cantidad={cantidad || 1} id={id} />
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
