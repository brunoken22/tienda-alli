import { ProductType } from "@/types/product";
import { Badge } from "./ui/badge";
import Link from "next/link";
import SimpleHoverSwiper from "@/components/HoverSwiper";
import { Switch } from "./ui/switch";
import { Button } from "./ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";

export default function TemplateProductDashboard({
  product,
  handleActiveProduct,
  handleEditProduct,
  handleDeleteProduct,
}: {
  product: ProductType;
  handleActiveProduct: (
    active: boolean,
    id: string,
    setIsActive: Dispatch<SetStateAction<boolean>>
  ) => void;
  handleEditProduct: (product: ProductType) => void;
  handleDeleteProduct: (id: string) => void;
}) {
  const [isActive, setIsActive] = useState(product.isActive);
  return (
    <div
      className={`relative rounded-md overflow-hidden shadow-md  hover:shadow-lg hover:scale-[1.02] hover:border-primary/30 transition-all duration-500 group ${"flex flex-col"}`}
    >
      {!isActive && <div className='absolute z-20 inset-0 bg-black/10 backdrop-blur-[1px]' />}

      {!isActive && (
        <div className='absolute z-30 top-4 left-4'>
          <Badge
            variant='secondary'
            className='bg-gray-900/80 backdrop-blur-sm text-white border-0'
          >
            Desactivado
          </Badge>
        </div>
      )}
      <div
        className={`relative overflow-hidden bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 ${"w-full flex-shrink-0"} h-[200px]`}
      >
        <div className='absolute top-4 right-4 z-10 flex flex-col gap-2.5 items-end'>
          {product.priceOffer > 1 && (
            <Badge className='bg-gradient-to-r from-rose-500 via-pink-500 to-red-500 hover:from-rose-600 hover:via-pink-600 hover:to-red-600 border-0 shadow-2xl backdrop-blur-xl text-white text-xs font-bold px-3 py-1.5 rounded-full animate-in slide-in-from-right-5'>
              AHORRA {Math.round(((product.price - product.priceOffer) / product.price) * 100)}%
            </Badge>
          )}
          {product.variant.length > 0 && (
            <Badge className='backdrop-blur-xl bg-gradient-to-r from-violet-500/90 to-purple-500/90 border-0 shadow-xl text-white text-xs font-semibold px-3 py-1.5 rounded-full'>
              {product.variant.length} {product.variant.length === 1 ? "Modelo" : "Modelos"}
            </Badge>
          )}
        </div>

        <div className='h-full'>
          <Link href={`/productos/${product.id}`}>
            <SimpleHoverSwiper
              classNameImg='object-cover'
              imageUrls={product.images.filter((img) => typeof img === "string")}
              title={product.title}
            />
          </Link>
        </div>
        <div className='absolute inset-0 bg-gradient-to-t from-primary/10 via-transparent to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500' />
      </div>

      <div className={`p-2 flex flex-col ${"flex-1 justify-between"}`}>
        <div className='flex-1 space-y-4'>
          <div className='space-y-3'>
            <div className='flex items-start justify-between gap-3 mb-3'>
              <Link href={`/productos/${product.id}`} className='truncate hover:text-primary'>
                <h3 className='text-lg font-semibold  leading-tight flex-1 truncate'>
                  {product.title}
                </h3>
              </Link>

              <div className='flex items-center gap-2 shrink-0 '>
                <span
                  className={`text-xs font-medium", ${
                    isActive ? "text-green-600" : "text-gray-400  relative z-50"
                  }`}
                >
                  {isActive ? "Activo" : "Inactivo"}
                </span>
                <Switch
                  className={` ${isActive ? "" : "text-gray-400  relative z-50"}`}
                  checked={isActive}
                  onCheckedChange={(active) => handleActiveProduct(active, product.id, setIsActive)}
                />
              </div>
            </div>
            <div className='flex flex-row overflow-x-auto gap-2 scroll-personalizado pb-1'>
              {product.categories &&
                product.categories.map((cat, i) => (
                  <p
                    key={i}
                    className='text-xs font-semibold border-2 border-primary/20 bg-gradient-to-r from-primary/10 to-primary/5 text-primary hover:border-primary/40 hover:bg-primary/15 transition-all px-3 py-1 rounded-xl whitespace-nowrap'
                  >
                    {cat.title}
                  </p>
                ))}
            </div>
          </div>

          <div className='flex items-baseline gap-3 '>
            {product.priceOffer && product.priceOffer > 1 ? (
              <>
                <span className='text-lg text-green-600  font-black bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent drop-shadow-sm'>
                  ${product.priceOffer.toLocaleString()}
                </span>
                <span className='text-base text-primary line-through font-semibold'>
                  ${product.price.toLocaleString()}
                </span>
              </>
            ) : (
              <span className='text-lg font-black bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-primary'>
                ${product.price.toLocaleString()}
              </span>
            )}
          </div>
        </div>

        <div className='flex gap-3 pt-5 '>
          <Button
            variant='primary'
            className={`flex-1 gap-2 transition-all font-semibold border-2 w-full ${
              !isActive ? "!relative !z-30" : ""
            }`}
            size='md'
            onClick={() => handleEditProduct(product)}
          >
            <Pencil className='w-4 h-4' />
            <span className='max-sm:hidden'>Editar</span>
          </Button>
          <Button
            variant='outline'
            size='md'
            className={`flex-none w-1/4 gap-2 bg-secondary border-red-400 hover:bg-red-600 shadow-lg hover:shadow-xl transition-all font-semibold  border-2  ${
              !isActive ? "!relative !z-30" : ""
            }`}
            onClick={() => handleDeleteProduct(product.id)}
          >
            <Trash2 className='w-4 h-4' />
          </Button>
        </div>
      </div>
    </div>
  );
}
