import {openShoppingCart, shoppingCart} from '@/lib/atom';
import {InputNumber} from '@/ui/input';
import {useEffect, useState} from 'react';
import {useRecoilState, useSetRecoilState} from 'recoil';

export function TemplateProduct({
  Images,
  Name,
  oferta,
  priceOfert,
  openImg,
  price,
  id,
  inicio,
  type,
  size,
  addItem,
}: {
  id: string;
  Images: string[];
  Name: string;
  oferta: string;
  price: number;
  priceOfert: number;
  openImg: (data: any) => any;
  inicio: boolean;
  type: string[];
  size: string[];
  addItem: (data: boolean) => void;
}) {
  const [openFocusName, setOpenFocusName] = useState(false);
  const [talla, setTalla] = useState(type?.includes('camperas') ? size[0] : '');
  const setShoppingCartUserData = useSetRecoilState(shoppingCart);
  const setOpenShoppingCartValue = useSetRecoilState(openShoppingCart);
  const handleClickOpenImg = (e: React.MouseEvent) => {
    e.preventDefault();
    openImg(Images);
    document.body.style.overflow = 'hidden';
  };
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const windowWidth = window.innerWidth;
    addItem(true);

    if (windowWidth > 1024) {
      setOpenShoppingCartValue(true);
    }
    setShoppingCartUserData((prev) => {
      let newShoppingCart = [];
      if (prev.length) {
        if (prev.find((item) => item.id === e.currentTarget.id)) {
          if (talla) {
            if (
              prev.find(
                (item) => item.id === e.currentTarget.id && item.talla == talla
              )
            ) {
              return prev;
            } else {
              newShoppingCart = [
                {
                  talla,
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
              talla,
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
          talla,
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
    <div
      className={` grid-cols-[repeat(1,120px_1fr)] gap-4  items-center h-max  rounded-lg 
      flex flex-col  w-[250px] max-sm:w-full text-center shadow-[0_0_15px_5px_#ddd] max-lg:shadow-[0_0_10px_2px_#ddd]  bg-secundary`}>
      <button
        onClick={handleClickOpenImg}
        className='w-full h-[300px] relative '>
        <img
          src={Images[0]}
          alt={Name}
          width={120}
          height={100}
          className=' w-full h-full object-cover hover:opacity-70'
          loading='lazy'
        />
        {oferta ? (
          <div className='absolute top-0 left-0 m-1 text-xs  bg-primary text-white p-1 pr-2 pl-2'>
            <h2 className='font-bold'>OFERTA</h2>
          </div>
        ) : (
          ''
        )}
      </button>
      <div
        className={`flex flex-col gap-2 max-md:gap-2 w-full h-full justify-between p-2 max-lg:p-[0.3rem]  ${
          inicio && 'items-center text-center'
        }`}>
        <div className='flex flex-col gap-4 w-full relative'>
          <div className=' overflow-hidden w-full flex items-center justify-center'>
            <p
              className='w-[250px] font-medium	truncate'
              onMouseOver={() => setOpenFocusName(true)}
              onMouseOut={() => setOpenFocusName(false)}>
              {Name}
            </p>
            {openFocusName ? (
              <span className='w-full max-md:w-auto absolute botton-0 top-[25%] left-[20%] bg-gray-900 text-white p-[2px] pr-4 pl-4 text-[0.7rem]   '>
                {Name}
              </span>
            ) : null}
          </div>
          {type?.includes('camperas') ? (
            <div className='flex gap-2 items-center'>
              <label htmlFor={`talla-${id}`} className='text-gray-800'>
                Talla:
              </label>
              <select
                id={`talla-${id}`}
                name='talla'
                value={talla}
                onChange={(e) => setTalla(e.target.value)}
                className='w-full bg-white border text-center border-gray-300 p-1 rounded-md focus:outline-none focus:border-[#3c006c]'>
                {size?.length &&
                  size.map((item) => (
                    <option key={item} value={item} id={item}>
                      {item}
                    </option>
                  ))}
              </select>
            </div>
          ) : null}
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
        <div className='w-full'>
          <button
            id={id}
            onClick={handleClick}
            className=' bg-primary p-4 pt-2 pb-2 text-white rounded-lg hover:opacity-80 w-full'>
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
  talla,
}: {
  id: string;
  title: string;
  price: number;
  cantidad: number;
  img: string;
  talla: string;
}) {
  const [openFocusName, setOpenFocusName] = useState(false);
  const [shoppingCartValue, setShoppingCartValue] =
    useRecoilState(shoppingCart);
  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();

    const newShoppingCart = shoppingCartValue.filter(
      (item: any) => item.id !== e.currentTarget.id || item.talla !== talla
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
          <div className='flex justify-between items-center'>
            <InputNumber cantidad={cantidad || 1} id={id} talla={talla} />
            {talla ? <p className='font-semibold'>Talle: {talla}</p> : null}
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
