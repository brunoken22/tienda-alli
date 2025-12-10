import { shoppingCart } from "@/lib/atom";
import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";

function InputNumber({ cantidad, id, talla }: { cantidad: number; id: string; talla?: string }) {
  const [cantidadState, setCantidadState] = useState(cantidad || 1);
  const [shoppingCartValue, setShoppingCartValue] = useRecoilState(shoppingCart);
  useEffect(() => {
    setCantidadState(cantidad);
  }, [cantidad]);

  useEffect(() => {
    setShoppingCartValue((prev) => {
      return prev.map((item) => {
        if (item.id == id) {
          if (talla && item.size !== talla) {
            return item;
          }
          return { ...item, cantidad: cantidadState };
        }

        return item;
      });
    });
  }, [cantidadState]);
  useEffect(() => {
    if (shoppingCartValue.length) {
      return localStorage.setItem("category", JSON.stringify(shoppingCartValue));
    }
  }, [shoppingCartValue]);
  const handleCantidadChange = (e: React.ChangeEvent) => {
    e.preventDefault();
    const target = e.target as HTMLInputElement;
    if (Number(target.value) <= 0 || Number(target.value) >= 15) return;
    setCantidadState(Number(target.value));
  };
  const handleCountCantidad = (e: React.MouseEvent) => {
    e.preventDefault();
    if (cantidadState < 1) {
      return;
    }
    if (e.currentTarget.id == "min") {
      setCantidadState(cantidadState - 1);
      return;
    }
    setCantidadState(cantidadState + 1);
  };
  return (
    <div className='flex gap-2 text-primary  bg-white w-fit'>
      {cantidadState >= 2 && (
        <button className='font-bold text-2xl pr-2 pl-2' id='min' onClick={handleCountCantidad}>
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
        <button className='font-bold text-2xl pr-2 pl-2' id='max' onClick={handleCountCantidad}>
          +
        </button>
      )}
    </div>
  );
}

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={`flex h-10 w-full rounded-md border border-black px-3 py-2 text-sm  file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:border-0 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input, InputNumber };
