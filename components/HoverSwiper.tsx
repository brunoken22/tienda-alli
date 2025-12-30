import Image from "next/image";
import { useState } from "react";

export default function HoverImage({
  imageUrls,
  title,
  classNameImg,
}: {
  imageUrls: string[];
  title: string;
  classNameImg?: string;
}) {
  const [isHovered, setIsHovered] = useState(false);

  // Solo usamos las dos primeras imágenes del array
  const mainImage = imageUrls[0];
  const hoverImage = imageUrls[1] || imageUrls[0]; // Si no hay segunda, usa la primera

  return (
    <div
      className='relative z-[1] w-full h-full overflow-hidden cursor-pointer group'
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Imagen principal (siempre visible cuando no hay hover) */}
      <Image
        src={mainImage}
        alt={title}
        title={title}
        width={300}
        height={200}
        className={`absolute inset-0 w-full h-full object-contain transition-all duration-500 ${
          isHovered ? "opacity-0 " : "opacity-100 "
        } ${classNameImg ? classNameImg : ""}`}
      />

      {/* Imagen hover (solo la segunda del array) */}
      <Image
        src={hoverImage}
        alt={`${title} - vista alternativa`}
        title={title}
        width={300}
        height={200}
        className={`absolute inset-0 w-full h-full object-contain transition-all duration-500 ${
          isHovered ? "opacity-100 " : "opacity-0"
        } ${classNameImg ? classNameImg : ""}`}
      />
    </div>
  );
}
