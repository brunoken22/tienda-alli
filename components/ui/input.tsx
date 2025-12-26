import { useShoppingCartActions } from "@/contexts/product-context";
import React, { useEffect, useState } from "react";

function InputNumber({
  id,
  quantity,
  variantId,
  variantColorName,
  variantColorHex,
  variantSize,
}: {
  id: string;
  quantity: number;
  variantId: string;
  variantColorName: string;
  variantColorHex: string;
  variantSize: string;
}) {
  const [quantityState, setQuantityState] = useState(quantity || 1);
  const { updateQuantity } = useShoppingCartActions();

  useEffect(() => {
    setQuantityState(quantity);
  }, [quantity]);

  useEffect(() => {
    updateQuantity(id, variantId, variantSize, variantColorHex, variantColorName, quantityState);
  }, [quantityState]);

  const handleCantidadChange = (e: React.ChangeEvent) => {
    e.preventDefault();
    const target = e.target as HTMLInputElement;
    if (Number(target.value) <= 0 || Number(target.value) >= 15) return;
    setQuantityState(Number(target.value));
  };

  const handleCountCantidad = (e: React.MouseEvent) => {
    e.preventDefault();
    if (quantityState < 1) {
      return;
    }
    if (e.currentTarget.id == "min") {
      setQuantityState(quantityState - 1);
      return;
    }
    setQuantityState(quantityState + 1);
  };

  return (
    <div className='flex gap-2 text-primary  bg-white w-fit'>
      {quantityState >= 2 && (
        <button
          className='font-bold hover:bg-primary hover:text-secondary  border border-primary/30 rounded-md text-2xl pr-2 pl-2'
          id='min'
          onClick={handleCountCantidad}
        >
          -
        </button>
      )}
      <input
        type='number'
        name=''
        id={id}
        value={quantityState}
        min={1}
        max={15}
        maxLength={2}
        onChange={handleCantidadChange}
        className='w-[40px] focus-visible:outline-none text-center'
      />
      {quantityState <= 15 && (
        <button
          className='font-bold hover:bg-primary hover:text-secondary  border border-primary/30 rounded-md text-2xl pr-2 pl-2'
          id='max'
          onClick={handleCountCantidad}
        >
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
