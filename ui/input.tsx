import {shoppingCart} from '@/lib/atom';
import {useEffect, useState} from 'react';
import {useRecoilState} from 'recoil';

export function InputNumber({cantidad, id}: {cantidad: number; id: string}) {
  const [cantidadState, setCantidadState] = useState(cantidad || 1);
  const [shoppingCartValue, setShoppingCartValue] =
    useRecoilState(shoppingCart);
  useEffect(() => {
    setCantidadState(cantidad);
  }, [cantidad]);
  useEffect(() => {
    setShoppingCartValue((prev) => {
      return prev.map((item) => {
        if (item.id == id) {
          return {...item, cantidad: cantidadState};
        }
        return item;
      });
    });
  }, [cantidadState]);
  useEffect(() => {
    if (shoppingCartValue.length) {
      localStorage.setItem('category', JSON.stringify(shoppingCartValue));
    }
  }, [shoppingCartValue]);
  const handleCantidadChange = (e: React.ChangeEvent) => {
    e.preventDefault();
    const target = e.target as HTMLInputElement;
    if (Number(target.value) <= 0 || Number(target.value) >= 15) return;
    setCantidadState(Number(target.value));
    setShoppingCartValue((prev) => {
      return prev.map((item) => {
        if (item.id == id) {
          return {...item, cantidad: Number(target.value)};
        }
        return item;
      });
    });
  };
  const handleCountCantidad = (e: React.MouseEvent) => {
    e.preventDefault();
    if (cantidadState < 1) {
      return;
    }
    if (e.currentTarget.id == 'min') {
      setCantidadState(cantidadState - 1);
      return;
    }
    setCantidadState(cantidadState + 1);
  };
  return (
    <div className='flex gap-2  bg-white w-fit'>
      {cantidadState >= 2 && (
        <button
          className='font-bold text-2xl pr-2 pl-2'
          id='min'
          onClick={handleCountCantidad}>
          -
        </button>
      )}
      <input
        type='number'
        name=''
        id={id}
        value={cantidadState}
        min={1}
        max={15}
        maxLength={2}
        onChange={handleCantidadChange}
        className='w-[40px] focus-visible:outline-none text-center'
      />
      {cantidadState <= 15 && (
        <button
          className='font-bold text-2xl pr-2 pl-2'
          id='max'
          onClick={handleCountCantidad}>
          +
        </button>
      )}
    </div>
  );
}
