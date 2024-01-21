import {useRouter, useSearchParams} from 'next/navigation';
import {useEffect, useRef} from 'react';
import {useDebouncedCallback} from 'use-debounce';

export function FormSearch({
  value,
  modValue,
}: {
  value: string;
  modValue: (data: string) => any;
}) {
  const searchParams = useSearchParams();
  const {replace} = useRouter();
  const inputSearch: any = useRef();

  const debounced = useDebouncedCallback((e: React.ChangeEvent) => {
    const target = e.target as HTMLInputElement;
    const params = new URLSearchParams(searchParams);
    if (target.value) {
      params.set('q', target.value);
    } else {
      params.delete('q');
    }
    modValue(target.value);
    replace(`?${params.toString()}`);
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
            // replace('/');
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
