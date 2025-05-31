"use client"

import * as React from "react"
import { ChevronDown } from "lucide-react"

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  placeholder?: string
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className = "", children, placeholder, ...props }, ref) => {
    return (
      <div className="relative">
        <select
          className={`flex h-10 w-full items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none ${className}`}
          ref={ref}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {children}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 opacity-50 pointer-events-none" />
      </div>
    )
  },
)
Select.displayName = "Select"

const SelectTrigger = ({ children, className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={`flex h-10 w-full items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    {...props}
  >
    {children}
  </div>
)

const SelectContent = ({ children, className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={`relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border border-slate-200 bg-white text-slate-950 shadow-md ${className}`}
    {...props}
  >
    {children}
  </div>
)

const SelectItem = ({ children, value, className = "", ...props }: React.OptionHTMLAttributes<HTMLOptionElement>) => (
  <option
    value={value}
    className={`relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-slate-100 focus:text-slate-900 ${className}`}
    {...props}
  >
    {children}
  </option>
)

const SelectValue = ({ placeholder }: { placeholder?: string }) => <span className="text-slate-500">{placeholder}</span>

const SelectGroup = ({ children, className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={`p-1 ${className}`} {...props}>
    {children}
  </div>
)

const SelectLabel = ({ children, className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={`px-2 py-1.5 text-sm font-semibold ${className}`} {...props}>
    {children}
  </div>
)

const SelectSeparator = ({ className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={`h-px w-full bg-slate-100 ${className}`} {...props} />
)

const SelectScrollUpButton = ({ className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={`flex items-center justify-center h-6 w-full cursor-default rounded-t-md bg-white text-slate-950 ${className}`}
    {...props}
  >
    <ChevronDown className="h-4 w-4 opacity-50" />
  </div>
)

const SelectScrollDownButton = ({ className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={`flex items-center justify-center h-6 w-full cursor-default rounded-b-md bg-white text-slate-950 ${className}`}
    {...props}
  >
    <ChevronDown className="h-4 w-4 opacity-50 rotate-180" />
  </div>
)

export {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
  SelectGroup,
  SelectLabel,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
}
