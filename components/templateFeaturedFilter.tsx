import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react"; // Opcional: usar iconos

interface TemplateFeaturedFilterProps {
  name: string;
  img: string;
  url: string;
  alt: string;
  description?: string; // Nueva prop opcional
  featured?: boolean; // Para destacar algunos elementos
}

export default function TemplateFeaturedFilter({
  name,
  img,
  url,
  alt,
  description,
  featured = false,
}: TemplateFeaturedFilterProps) {
  return (
    <Link
      href={url}
      className='group block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-xl'
    >
      <div
        className={`
        relative overflow-hidden rounded-xl 
        bg-white dark:bg-gray-900 
        border border-gray-200 dark:border-gray-800 
        shadow-md hover:shadow-xl 
        transition-all duration-500 ease-out
        group-hover:-translate-y-1
        ${featured ? "ring-2 ring-primary ring-offset-2" : ""}
      `}
      >
        {/* Contenedor de imagen con overlay */}
        <div className='relative h-60 w-full overflow-hidden'>
          <Image
            src={img || "/placeholder-category.jpg"}
            alt={alt}
            fill
            // sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
            className='
              object-cover 
              transition-all duration-700 
              group-hover:scale-110 
              group-hover:brightness-110
              brightness-90
            '
            priority={featured}
          />

          {/* Overlay gradient */}
          <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent' />

          {/* Badge para featured */}
          {featured && (
            <div className='absolute top-4 left-4'>
              <span className='inline-flex items-center rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white'>
                Destacado
              </span>
            </div>
          )}

          {/* Efecto hover overlay */}
          <div className='absolute inset-0 bg-primary/0 transition-all duration-500 group-hover:bg-primary/10' />
        </div>

        {/* Contenido */}
        <div className='absolute inset-0 flex flex-col justify-end p-6'>
          <div className='transform transition-all duration-500 group-hover:-translate-y-2'>
            {/* Nombre con animación */}
            <h3
              className='
              text-2xl font-bold text-white 
              mb-2
              transition-all duration-500
              group-hover:text-primary-light
            '
            >
              {name}
            </h3>

            {/* Descripción (opcional) */}
            {description && (
              <p
                className='
                text-gray-200 text-sm 
                opacity-0 transform translate-y-4 
                transition-all duration-500 delay-100
                group-hover:opacity-100 group-hover:translate-y-0
                line-clamp-2
              '
              >
                {description}
              </p>
            )}

            {/* Indicador de acción */}
            <div
              className='
              flex items-center gap-2 mt-4
              opacity-0 transform translate-y-4
              transition-all duration-500 delay-200
              group-hover:opacity-100 group-hover:translate-y-0
            '
            >
              <span className='text-secondary font-medium text-sm'>Ver productos</span>
              <ArrowRight className='w-4 h-4 text-secondary transition-transform duration-300 group-hover:translate-x-1' />
            </div>
          </div>
        </div>

        {/* Efecto de brillo en hover */}
        <div
          className='
          absolute inset-0 
          bg-gradient-to-tr from-transparent via-white/0 to-transparent 
          opacity-0 group-hover:opacity-100 
          transition-opacity duration-700
          pointer-events-none
        '
        />
      </div>
    </Link>
  );
}
