import Link from 'next/link';

export default function Error() {
  return (
    <div className='flex flex-col justify-center items-center gap-8'>
      <svg
        xmlns='http://www.w3.org/2000/svg'
        className='dark:stroke-white stroke-black'
        width='300'
        height='300'
        viewBox='0 0 24 24'
        strokeWidth='1.5'
        fill='none'
        strokeLinecap='round'
        strokeLinejoin='round'>
        <path stroke='none' d='M0 0h24v24H0z' fill='none' />
        <path d='M4 8v-2a2 2 0 0 1 2 -2h2' />
        <path d='M4 16v2a2 2 0 0 0 2 2h2' />
        <path d='M16 4h2a2 2 0 0 1 2 2v2' />
        <path d='M16 20h2a2 2 0 0 0 2 -2v-2' />
        <path d='M9 10h.01' />
        <path d='M15 10h.01' />
        <path d='M9.5 15.05a3.5 3.5 0 0 1 5 0' />
      </svg>
      <div className='text-center'>
        <h2 className='text-7xl font-extrabold'>404</h2>
        <p className='font-semibold text-xl'>PÁGINA NO ENCONTRADA</p>
      </div>
      <div className='text-center flex flex-col gap-4'>
        <Link
          href='/inicio'
          className='hover:opacity-60 bg-secundary text-primary dark:text-secundary dark:bg-primary p-4 pb-2 pt-2'>
          Ir a casa
        </Link>
        <Link
          href='/iniciarSesion'
          className='hover:opacity-60 bg-secundary text-primary dark:text-secundary dark:bg-primary p-4 pb-2 pt-2'>
          Inicia sesión
        </Link>
      </div>
    </div>
  );
}
