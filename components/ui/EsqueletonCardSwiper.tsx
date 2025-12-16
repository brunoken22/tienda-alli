export function ProductCardSkeleton() {
  return (
    <div className='bg-primary/10 border border-primary/50 rounded-2xl overflow-hidden shadow-sm animate-pulse'>
      {/* Image skeleton */}
      <div className='relative h-[200px] bg-gray-400' />

      <div className='p-5 space-y-4'>
        {/* Categories skeleton */}
        <div className='flex gap-2'>
          <div className='h-6 w-16  bg-gray-400 rounded-full' />
          <div className='h-6 w-20  bg-gray-400 rounded-full' />
        </div>

        {/* Title skeleton */}
        <div className='space-y-2'>
          <div className='h-5  bg-gray-400 rounded w-3/4' />
        </div>

        {/* Price and button skeleton */}
        <div className='space-y-3 pt-2 border-t border-primary/20'>
          <div className='h-8  bg-gray-400 rounded w-32' />
          <div className='h-11  bg-gray-400 rounded-lg w-full' />
        </div>
      </div>
    </div>
  );
}

export function ProductCardSkeletonGrid({ count = 8 }: { count?: number }) {
  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
