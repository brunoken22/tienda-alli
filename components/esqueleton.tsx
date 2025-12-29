export function EsqueletonProduct() {
  return (
    <div className='bg-card border rounded-md overflow-hidden shadow-md animate-pulse'>
      {/* Imagen del producto */}
      <div className='aspect-square bg-zinc-200	' />

      {/* Contenido */}
      <div className='p-4 space-y-4'>
        {/* Título */}
        <div className='h-5 bg-zinc-200 rounded w-4/5' />

        {/* Subtítulo / Descripción corta */}
        <div className='h-4 bg-zinc-200 rounded w-3/5' />

        {/* Precio y botón */}
        <div className='flex items-center justify-between mt-4'>
          <div className='h-6 bg-zinc-200 rounded w-1/4' />
          <div className='h-9 bg-zinc-200 rounded w-24' />
        </div>
      </div>
    </div>
  );
}
