import Image from "next/image";

export default function LoadingComponent() {
  return (
    <div
      className='
      fixed inset-0 bg-secondary flex items-center justify-center z-50
      opacity-100 transition-all duration-1000 delay-1000
      hover:opacity-0 focus:opacity-0
      group
    '
    >
      <div className='flex flex-col items-center gap-4 group-hover:scale-95 transition-transform duration-700'>
        <Image
          src='/tienda-alli.webp'
          height={400}
          width={400}
          alt='TIENDA ALLI'
          title='TIENDA ALLI'
          className='transition-all duration-500 delay-300 group-hover:opacity-0'
        />
      </div>
    </div>
  );
}
