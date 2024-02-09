import {useRouter, useSearchParams} from 'next/navigation';
import {useEffect, useRef, useState} from 'react';
import {useDebouncedCallback} from 'use-debounce';

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
  const {replace, push} = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('q') || '');
  const inputSearch: any = useRef();
  return (
    <form
      className='flex justify-center items-center gap-2 bg-gray-200 p-2'
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
      <input
        type='text'
        name='search'
        id='search'
        placeholder='Mochila'
        className='bg-transparent focus-visible:outline-none placeholder:white-500 w-[80%]'
        defaultValue={search}
        ref={inputSearch}
      />
      {search ? (
        <button
          type='button'
          className='mr-2 ml-2'
          onClick={() => {
            setSearch('');
            inputSearch.current.value = '';
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
