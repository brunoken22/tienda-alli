import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';

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
      className='flex justify-center items-center  bg-gray-200 p-2'
      onSubmit={(e: any) => {
        e.preventDefault();
        modValue(e.target.search.value);
      }}>
      <input
        type='text'
        name='search'
        id='search'
        onChange={debounced}
        placeholder='Mochila'
        className='bg-transparent focus-visible:outline-none placeholder:white-500 w-[80%]'
        defaultValue={value || ''}
        ref={inputSearch}
      />
      {value ? (
        <button
          type='button'
          className='mr-2 ml-2'
          onClick={() => {
            inputSearch.current.value = '';
            modValue('');
          }}>
          <img src='/close.svg' alt='clear' width={12} height={8} />
        </button>
      ) : null}
      <button type='submit'>
        <img src='/search.svg' alt='search' width={20} height={20} />
      </button>
    </form>
  );
}

export function FormSearchHome() {
  const { push } = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('q') || '');
  const inputSearch: any = useRef();

  return (
    <form
      className='flex items-center bg-white/10 backdrop-blur-sm rounded-lg overflow-hidden border border-white/20 focus-within:bg-white/20 transition-colors'
      onSubmit={(e: any) => {
        e.preventDefault();
        const params = new URLSearchParams(searchParams);
        params.set('q', JSON.stringify(e.target.search.value));
        params.set('price', JSON.stringify([0, 70000]));
        params.set('type', JSON.stringify([]));
        params.set('limit', JSON.stringify(15));
        params.set('offset', JSON.stringify(0));
        push(`/productos?${params.toString()}`);
      }}>
      <div className='flex-1 flex items-center px-3 py-2'>
        <Search className='w-4 h-4 text-white/70 mr-2' />
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
          size='icon'
          className='text-white/70 hover:text-white hover:bg-white/10 h-8 w-8'
          onClick={() => {
            setSearch('');
            inputSearch.current.value = '';
          }}>
          <X className='w-4 h-4' />
        </Button>
      )}
      <Button
        type='submit'
        variant='ghost'
        size='icon'
        className='text-white/70 hover:text-white hover:bg-white/10 h-8 w-8'>
        <Search className='w-4 h-4' />
      </Button>
    </form>
  );
}
