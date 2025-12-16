"use client";

import * as React from "react";

interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ className = "", checked, onCheckedChange, onChange, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onCheckedChange?.(e.target.checked);
      onChange?.(e);
    };

    return (
      <label
        className={`inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-primary transition-colors focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 ${
          checked ? "bg-primary/40" : "bg-slate-200"
        } ${className}`}
      >
        <input
          type='checkbox'
          className='sr-only'
          checked={checked}
          onChange={handleChange}
          ref={ref}
          {...props}
        />
        <span
          className={`pointer-events-none block h-5 w-5 rounded-full bg-primary shadow-lg ring-0 transition-transform ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </label>
    );
  }
);
Switch.displayName = "Switch";

export { Switch };
