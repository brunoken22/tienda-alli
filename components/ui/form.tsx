"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";

export function FormSearch({
  value,
  modValue,
}: {
  value: string;
  modValue: (data: string) => any;
}) {
  const inputSearch: any = useRef();
  const debounced = useDebouncedCallback((e: React.ChangeEvent) => {
    const target = e.target as HTMLInputElement;
    modValue(target.value);
  }, 300);
  useEffect(() => {
    inputSearch.current.value = value;
  }, [value]);
  return (
    <form
      className='flex justify-center items-center bg-secondary  gap-3 rounded-md'
      onSubmit={(e: any) => {
        e.preventDefault();
        modValue(e.target?.search.value);
      }}
    >
      <input
        type='text'
        name='search'
        id='search'
        onChange={debounced}
        placeholder='Mochila'
        className='bg-secondary text-black focus-visible:outline-none placeholder-white-500 w-[80%] py-3 px-4 text-base rounded-md'
        defaultValue={value || ""}
        ref={inputSearch}
      />

      {value && (
        <button
          type='button'
          className='p-3 min-w-[48px] min-h-[48px] flex items-center justify-center'
          onClick={() => {
            inputSearch.current.value = "";
            modValue("");
          }}
          aria-label='Limpiar búsqueda'
        >
          <X width={16} height={16} />
        </button>
      )}

      <button
        type='submit'
        className='p-3 min-w-[48px] min-h-[48px] flex items-center justify-center bg-secondary'
        aria-label='Buscar'
      >
        <Search width={24} height={24} />
      </button>
    </form>
  );
}

export function FormSearchHome() {
  const { push } = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("q") || "");
  const inputSearch: any = useRef();

  return (
    <form
      className='flex items-center bg-white/10 backdrop-blur-sm rounded-lg overflow-hidden border border-white/20 focus-within:bg-white/20 transition-colors'
      onSubmit={(e: any) => {
        e.preventDefault();
        const params = new URLSearchParams(searchParams);
        params.set("search", e.target.search.value);
        params.set("price", JSON.stringify([0, 70000]));
        params.set("type", JSON.stringify([]));
        params.set("limit", JSON.stringify(15));
        params.set("offset", JSON.stringify(0));
        push(`/productos?${params.toString()}`);
      }}
    >
      <div className='flex-1 flex items-center px-3 py-2'>
        <input
          type='text'
          name='search'
          id='search'
          placeholder='Buscar productos...'
          className='bg-transparent text-white placeholder-white/70 focus:outline-none flex-1 text-sm'
          defaultValue={search}
          ref={inputSearch}
        />
      </div>
      {search && (
        <Button
          type='button'
          variant='ghost'
          aria-label='Elminar producto'
          size='icon'
          className='text-white/70 hover:text-white hover:bg-white/10 h-8 w-8'
          onClick={() => {
            setSearch("");
            inputSearch.current.value = "";
          }}
        >
          <X className='w-4 h-4' />
        </Button>
      )}
      <Button
        aria-label='Buscar producto'
        type='submit'
        variant='ghost'
        size='icon'
        className='text-white/70 hover:text-white hover:bg-white/10 h-8 w-8'
      >
        <Search className='w-4 h-4' />
      </Button>
    </form>
  );
}
