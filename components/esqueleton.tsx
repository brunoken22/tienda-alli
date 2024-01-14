export function EsqueletonProduct() {
  return (
    <div className='flex justify-between w-[300px] gap-4 animate-pulse'>
      <div className='bg-gray-400 w-[40%]'></div>
      <div className='w-full flex gap-4 flex-col'>
        <div className='h-[30px] bg-gray-400 w-full'></div>
        <div className='h-[30px] bg-gray-400 w-full'></div>
      </div>
    </div>
  );
}
