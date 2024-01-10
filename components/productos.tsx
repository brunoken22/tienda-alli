import Link from 'next/link';

export async function ProductosComponent() {
  try {
    const response = await fetch(
      process.env.API || 'http://localhost:3000/api/products',
      {
        cache: 'no-cache',
      }
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();

    return (
      <div className='flex justify-center flex-wrap gap-8 m-8 max-md:m-2'>
        {data.map((item: any) => (
          <div
            key={item.id}
            className='flex gap-4 w-[350px] items-center  bg-[#ffefa9] rounded-lg'>
            <img
              src={item.img}
              alt={item.Name}
              className='w-[100px] h-full object-cover'
              loading='lazy'
            />
            <div className='flex flex-col gap-4'>
              <h2>{item.Name || 'prueba'} </h2>
              <p className='font-bold'>${item.price}</p>
            </div>
          </div>
        ))}
        <div className='fixed bottom-5 right-5 z-9 bg-[#40ea41] rounded-full p-2 shadow-[0_0_10px_0.5px] hover:opacity-80'>
          <Link href='https://api.whatsapp.com/send?phone=+541159102865&text=Hola%20te%20hablo%20desde%20la%20p%C3%A1gina'>
            <a>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 480 512'
                width='30px'
                height='30px'
                fill='#fff'>
                {/* ...tu contenido SVG */}
              </svg>
            </a>
          </Link>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error en la solicitud:', error);
    return null;
  }
}
