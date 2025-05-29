import Link from 'next/link';
import Image from 'next/image';

interface TemplateFeaturedFilterProps {
  name: string;
  img: string;
  url: string;
}

export default function TemplateFeaturedFilter({ name, img, url }: TemplateFeaturedFilterProps) {
  return (
    <Link href={url} className='group '>
      <div className='relative overflow-hidden rounded-xl bg-card border shadow-sm hover:shadow-lg transition-all duration-300 group-hover:scale-105'>
        <div className='aspect-square relative '>
          <Image
            src={img || '/placeholder.svg'}
            alt={name}
            fill
            className='object-cover group brightness-50 hover:brightness-100 hover:scale-110 transition-transform duration-300  '
          />
          <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent' />
        </div>
        <div className='absolute bottom-0 left-0 right-0 p-4'>
          <h3 className='text-white font-semibold text-lg text-center'>{name}</h3>
        </div>
      </div>
    </Link>
  );
}
