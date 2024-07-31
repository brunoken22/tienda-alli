import Link from 'next/link';

export default function TemplateFeaturedFilter({
  name,
  img,
  url,
}: {
  name: string;
  img: string;
  url: string;
}) {
  return (
    <div className='h-[300px] w-[300px] max-sm:h-[150px] max-sm:w-[150px] relative'>
      <img src={img} alt={name} className='object-cover h-full w-full' />
      <Link
        href={url}
        className='absolute inset-0 flex items-center justify-center backdrop-brightness-[0.3] hover:backdrop-brightness-50'>
        <p className='text-2xl text-secundary font-bold max-sm:text-base'>
          {name}
        </p>
      </Link>
    </div>
  );
}
