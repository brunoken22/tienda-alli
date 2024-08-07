import {useEffect, useState} from 'react';
import {TemplateCategory} from './templateProduct';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

const categoriesAll: any[] = [
  {
    id: 'Moda',
    type: [
      {id: 'Todas las Camperas', type: 'camperas'},
      {id: 'Camperas Hombre', type: 'camperas_hombre'},
      {id: 'Camperas Mujer', type: 'camperas_mujer'},
      {id: 'Camperas Niños', type: 'camperas_niños'},
    ],
  },
  {
    id: 'Mochilas ',
    type: [
      {id: 'Todas las mochilas', type: 'mochilas'},
      {id: 'Mochilas de Nene', type: 'mochilas_nene'},
      {id: 'Mochilas de Nena', type: 'mochilas_nena'},
      {id: 'Mochilas juveniles', type: 'mochilas_juveniles'},
    ],
  },
  {id: 'Carteras/Bandoleras ', type: 'carteras'},
  {id: 'Riñoneras ', type: 'riñoneras'},
  {id: 'Billeteras', type: 'billeteras'},
  ,
];
export function FiltroSearch({
  children,
  closeFilter,
  isMobile,
  search,
  valueDefault,
  typeCategoriaPrice,
}: {
  valueDefault: {typeSearch: string[]; typePrice: number[]};
  search: string;
  children?: React.ReactNode;
  closeFilter: (data: boolean) => any;
  typeCategoriaPrice: (category: string[], price: number[]) => any;

  isMobile: boolean;
}) {
  const [minPrice, setMinPrice] = useState(valueDefault.typePrice[0]);
  const [maxPrice, setMaxPrice] = useState(valueDefault.typePrice[1]);
  const [categoria, setCategoria] = useState<string[]>(valueDefault.typeSearch);

  useEffect(() => {
    typeCategoriaPrice(categoria, [minPrice, maxPrice]);
  }, [categoria, maxPrice, minPrice]);
  useEffect(() => {
    if (search) return setCategoria([]);
  }, [search]);
  useEffect(() => {
    if (!search) {
      setCategoria(valueDefault.typeSearch);
    }
  }, [valueDefault.typeSearch]);

  const handleIsCategoria = (data: string) => {
    if (categoria.length) {
      if (!categoria.includes(data)) {
        setCategoria((prev: string[]) => [...prev, data]);
        return;
      } else {
        const newCategoria = categoria.filter((item: string) => item !== data);
        setCategoria(newCategoria);
      }
      return;
    }
    setCategoria([data]);
  };

  return (
    <div
      className={
        isMobile
          ? ' fixed inset-0 bg-primary z-10	p-8 flex flex-col gap-8 text-white'
          : 'flex flex-col gap-8 max-md:hidden fixed w-[230px]'
      }>
      <div className='flex flex-col gap-6'>
        <div className='flex justify-end'>
          {isMobile ? (
            <button
              onClick={() => {
                document.body.style.overflow = 'auto';
                closeFilter(true);
              }}>
              <img
                src='/closeWhite.svg'
                color={'white'}
                width='25px'
                height='25px'
              />
            </button>
          ) : (
            children
          )}
        </div>
        <div>
          <h2 className='font-bold text-[1.5rem]'>Categorías</h2>
          <div className='flex flex-col gap-2 text-start mt-5 items-start'>
            {categoriesAll.map((item) => (
              <TemplateCategory
                valueDefault={
                  !Array.isArray(item.type)
                    ? categoria.includes(item.type as string)
                    : false
                }
                categoriaAllUser={categoria}
                key={item.id}
                type={item.type}
                isCategoria={handleIsCategoria}
                name={item.id}
              />
            ))}
          </div>
        </div>
        <div>
          <h2 className='font-bold text-[1.5rem] mb-5'>Precio</h2>
          <Slider
            min={0}
            max={70000}
            range
            value={[minPrice, maxPrice]}
            onChange={(e: any) => {
              setMinPrice(e[0]);
              setMaxPrice(e[1]);
            }}
          />
          <div className='flex justify-between'>
            <p>
              {minPrice.toLocaleString('es-AR', {
                style: 'currency',
                currency: 'ARS', // Cambiado a pesos argentinos
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })}
            </p>
            <p>
              {maxPrice.toLocaleString('es-AR', {
                style: 'currency',
                currency: 'ARS', // Cambiado a pesos argentinos
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
