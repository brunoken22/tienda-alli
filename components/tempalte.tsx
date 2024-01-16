import {useState} from 'react';

export function TemplateProduct({
  Images,
  Name,
  oferta,
  priceOfert,
  openImg,
  price,
}: {
  Images: any;
  Name: string;
  oferta: string;
  price: number;
  priceOfert: number;
  openImg: (data: any) => any;
}) {
  const [openFocusName, setOpenFocusName] = useState(false);
  const handleClickOpenImg = (e: React.MouseEvent) => {
    e.preventDefault();
    openImg(Images);
    document.body.style.overflow = 'hidden';
  };
  return (
    <div className='flex gap-4 w-[350px] items-center  bg-[#ffefa9] rounded-lg h-[130px]'>
      <button onClick={handleClickOpenImg} className='h-full relative'>
        <img
          src={Images}
          alt={Name}
          width={100}
          height={100}
          className=' w-[100px] h-full object-cover rounded-b-lg rounded-l-lg'
          loading='lazy'
        />
        {oferta ? (
          <div className='absolute top-[-0.5rem] left-[-2rem] rotate-[-40deg]  bg-red-500 text-white p-1 pr-4 pl-4'>
            <h2 className='font-bold'>OFERTA</h2>
          </div>
        ) : (
          ''
        )}
      </button>
      <div className='flex flex-col gap-4'>
        <div className='relative'>
          <h2
            className='max-h-[48px] overflow-hidden '
            onMouseEnter={() => setOpenFocusName(true)}
            onMouseLeave={() => setOpenFocusName(false)}>
            {Name}{' '}
          </h2>
          {openFocusName ? (
            <span className=' absolute botton-0 left-[50%] bg-gray-900 text-white p-[2px] pr-4 pl-4 text-[0.7rem] z-10 '>
              {Name}
            </span>
          ) : null}
        </div>
        {oferta ? (
          <div className='flex justify-evenly'>
            <p className='text-gray-500 line-through	'>${price}</p>
            <p className='font-bold'>${priceOfert}</p>
          </div>
        ) : (
          <p className='font-bold'>${price}</p>
        )}
      </div>
    </div>
  );
}
