import { useState } from "react";

export default function HoverImage({ imageUrls, title }: { imageUrls: string[]; title: string }) {
  const [isHovered, setIsHovered] = useState(false);

  // Solo usamos las dos primeras imágenes del array
  const mainImage = imageUrls[0];
  const hoverImage = imageUrls[1] || imageUrls[0]; // Si no hay segunda, usa la primera

  return (
    <div
      className='relative z-[1] w-full h-full overflow-hidden rounded-lg cursor-pointer group'
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Imagen principal (siempre visible cuando no hay hover) */}
      <img
        src={mainImage}
        alt={title}
        title={title}
        className={`absolute inset-0 w-full h-full object-contain transition-all duration-500 ${
          isHovered ? "opacity-0 " : "opacity-100 "
        }`}
      />

      {/* Imagen hover (solo la segunda del array) */}
      <img
        src={hoverImage}
        alt={`${title} - vista alternativa`}
        title={title}
        className={`absolute inset-0 w-full h-full object-contain transition-all duration-500 ${
          isHovered ? "opacity-100 " : "opacity-0"
        }`}
      />
    </div>
  );
}
