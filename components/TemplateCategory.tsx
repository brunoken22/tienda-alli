import { CategoryType } from "@/types/category";
import { Badge } from "./ui/badge";
import { Pencil, Star, Trash2 } from "lucide-react";
import { CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Dispatch, SetStateAction, useState } from "react";
import { Switch } from "./ui/switch";
import Image from "next/image";

export default function TemplateCategory({
  category,
  handleOpenDialog,
  handleDeleteClick,
  handleActiveCategory,
}: {
  category: CategoryType;
  handleOpenDialog: (category: CategoryType) => void;
  handleDeleteClick: (category: CategoryType) => void;
  handleActiveCategory: (
    active: boolean,
    id: string,
    setIsActive: Dispatch<SetStateAction<boolean>>
  ) => void;
}) {
  const [isActive, setIsActive] = useState(category.isActive);

  return (
    <div className='relative p-2 rounded-md overflow-hidden shadow-md hover:shadow-lg transition-shadow'>
      <div className='relative h-48 bg-muted'>
        <Image
          src={category.image || "/tienda-alli-webp"}
          alt={category.title}
          title={category.title}
          width={200}
          height={400}
          className='w-full h-full object-cover'
        />
        {category.featured && (
          <Badge className='absolute top-2 right-2 bg-yellow-500 text-yellow-950'>
            <Star className='h-3 w-3 mr-1 fill-current' />
            Destacada
          </Badge>
        )}
      </div>

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

      <CardHeader>
        <div className='flex items-start justify-between'>
          <div className='w-full'>
            <div className='flex items-center w-fll gap-2 shrink-0 '>
              <CardTitle className='text-xl flex-1'>{category.title}</CardTitle>
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
                  onCheckedChange={(active) =>
                    handleActiveCategory(active, category.id, setIsActive)
                  }
                />
              </div>
            </div>
            <CardDescription className='mt-1 truncate w-full'>
              {category.description}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <div className='flex gap-2 pt-4 border-t'>
        <Button
          variant='primary'
          size='sm'
          onClick={() => handleOpenDialog(category)}
          className={`flex-1  ${!isActive ? "!relative !z-30" : ""}`}
        >
          <Pencil className='h-4 w-4 mr-2' />
          Editar
        </Button>
        <Button
          variant='danger'
          size='sm'
          onClick={() => handleDeleteClick(category)}
          className={`  ${!isActive ? "!relative !z-30" : ""}`}
        >
          <Trash2 className='h-4 w-4' />
        </Button>
      </div>
    </div>
  );
}
