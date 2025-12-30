"use client";

import type React from "react";
import { useState, useEffect, type Dispatch, type SetStateAction } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { X, Plus, TriangleAlert, Upload, Palette, Check, AlertCircle } from "lucide-react";
import convertUrlsToFiles from "@/utils/convertFilesImg";
import type { CategoryType } from "@/types/category";
import { ProductType, VariantType } from "@/types/product";
import Image from "next/image";

interface ProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: ProductType | null;
  alert: { success: boolean; message: string };
  setAlert: Dispatch<
    SetStateAction<{
      success: boolean;
      message: string;
    }>
  >;
  onSave: (
    product: Omit<ProductType, "id" | "categories" | "imagesId">,
    images: File[]
  ) => Promise<boolean>;
  categories: CategoryType[];
}

// Colores predefinidos con nombres
const PREDEFINED_COLORS = [
  { name: "Rojo", hex: "#FF0000" },
  { name: "Verde", hex: "#00FF00" },
  { name: "Azul", hex: "#0000FF" },
  { name: "Negro", hex: "#000000" },
  { name: "Blanco", hex: "#FFFFFF" },
  { name: "Gris", hex: "#808080" },
  { name: "Amarillo", hex: "#FFFF00" },
  { name: "Naranja", hex: "#FFA500" },
  { name: "Rosa", hex: "#FFC0CB" },
  { name: "Morado", hex: "#800080" },
  { name: "Marrón", hex: "#A52A2A" },
  { name: "Turquesa", hex: "#40E0D0" },
];

// Función para validar si es un color hexadecimal válido
const isValidHex = (color: string): boolean => {
  const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  return hexRegex.test(color);
};

// Función para formatear un color hexadecimal
const formatHexColor = (value: string): string => {
  // Eliminar caracteres no permitidos
  let cleanValue = value.replace(/[^0-9a-fA-F#]/g, "");

  // Si no empieza con #, agregarlo
  if (!cleanValue.startsWith("#") && cleanValue.length > 0) {
    cleanValue = "#" + cleanValue;
  }

  // Limitar longitud máxima
  if (cleanValue.length > 7) {
    cleanValue = cleanValue.substring(0, 7);
  }

  // Convertir a mayúsculas
  cleanValue = cleanValue.toUpperCase();

  return cleanValue;
};

// Función para expandir color de 3 a 6 dígitos
const expandShortHex = (hex: string): string => {
  if (hex.length === 4 && hex.startsWith("#")) {
    return "#" + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3];
  }
  return hex;
};

// Función para obtener nombre de color por hex
const getColorNameFromHex = (hex: string): string => {
  const color = PREDEFINED_COLORS.find((c) => expandShortHex(c.hex) === expandShortHex(hex));
  return color ? color.name : `Color ${hex}`;
};

export function ProductDialog({
  open,
  onOpenChange,
  product,
  onSave,
  alert,
  setAlert,
  categories,
}: ProductDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<Omit<ProductType, "id" | "imagesId">>({
    title: "",
    description: "",
    price: 0,
    priceOffer: 0,
    categories: [],
    categoryFormData: [],
    images: [],
    imagesFormData: [],
    sizes: [],
    variant: [],
    isActive: false,
  });
  const [sizeInput, setSizeInput] = useState("");
  const [imagesUrl, setImagesUrl] = useState<string[]>([]);
  const [showColorPicker, setShowColorPicker] = useState<number | null>(null);
  const [customColorInput, setCustomColorInput] = useState<string>("#000000");
  const [colorHexInput, setColorHexInput] = useState<string>("#000000");
  const [colorNameInput, setColorNameInput] = useState<string>("Negro");

  useEffect(() => {
    setAlert({ message: "", success: false });
    if (product) {
      (async () => {
        const filterImages = product.images.filter((img) => typeof img === "string");
        const imagesConvert = await convertUrlsToFiles(filterImages);
        setFormData({
          title: product.title,
          description: product.description,
          price: product.price,
          priceOffer: product.priceOffer,
          categoryFormData: product.categories.map((category) => category.id),
          sizes: product.sizes,
          images: [],
          categories: product.categories,
          imagesFormData: imagesConvert,
          variant: product.variant.map((v) => ({
            ...v,
            colorHex: v.colorHex ? expandShortHex(v.colorHex) : "#000000",
          })),
          isActive: product.isActive,
        });

        setImagesUrl(filterImages);
      })();
    } else {
      setFormData({
        title: "",
        description: "",
        price: 0,
        priceOffer: 0,
        categories: [],
        categoryFormData: [],
        variant: [],
        sizes: [],
        images: [],
        isActive: false,
      });
      setImagesUrl([]);
    }
  }, [product, open]);

  // Efecto para sincronizar inputs con el variant actual cuando se abre el color picker
  useEffect(() => {
    if (showColorPicker !== null) {
      const variant = formData.variant[showColorPicker];
      if (variant) {
        setCustomColorInput(variant.colorHex);
        setColorHexInput(variant.colorHex);
        setColorNameInput(variant.colorName);
      }
    }
  }, [showColorPicker, formData.variant]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const images = formData.imagesFormData;
    try {
      // if(formData.sizes.length===0){
      // document.getElementById("error-alert-form")?.scrollIntoView({ behavior: "smooth" });
      // setIsLoading(false);
      // return
      // }
      const repsonseOnSave = await onSave(formData, images as File[]);
      setIsLoading(false);
      if (repsonseOnSave) {
        onOpenChange(false);
      }
    } catch (e) {
      document.getElementById("error-alert-form")?.scrollIntoView({ behavior: "smooth" });
      setIsLoading(false);
    }
  };

  const addCategory = (categoryId: string) => {
    if (categoryId && !formData?.categoryFormData?.find((category) => category === categoryId)) {
      const categoriesTransform = formData.categoryFormData ? formData.categoryFormData : [];
      const categoryFind = categories.find((category) => category.id === categoryId)!;
      setFormData({
        ...formData,
        categoryFormData: [...categoriesTransform, categoryId],
        categories: [...formData.categories, categoryFind],
      });
    }
  };

  const removeCategory = (index: number) => {
    setFormData({
      ...formData,
      categoryFormData: formData.categoryFormData
        ? formData.categoryFormData.filter((_, i) => i !== index)
        : [],
    });
  };

  const addSize = () => {
    if (sizeInput.trim() && !formData.sizes.includes(sizeInput.trim())) {
      setFormData({ ...formData, sizes: [...formData.sizes, sizeInput.trim().toUpperCase()] });
      setSizeInput("");
    }
  };

  const removeSize = (index: number) => {
    setFormData({
      ...formData,
      sizes: formData.sizes.filter((_, i) => i !== index),
    });
  };

  const removeImage = (index: number) => {
    setFormData({
      ...formData,
      imagesFormData: formData.imagesFormData?.filter((_, i) => i !== index),
    });
    setImagesUrl((imgUrl) => imgUrl.filter((_, i) => i !== index));
  };

  const handleImageFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const filesArray = Array.from(files);
    const maxImages = 5;
    const currentImgs = imagesUrl.length + filesArray.length;
    if (currentImgs > maxImages) {
      setAlert({
        message: `Selecciona solo ${
          maxImages - imagesUrl.length === 1
            ? ` 1 imagen.`
            : ` ${maxImages - imagesUrl.length} imagenes.`
        }  `,
        success: false,
      });

      setTimeout(() => {
        document.getElementById("error-alert-form")?.scrollIntoView({ behavior: "smooth" });
      }, 500);
      return;
    }
    setAlert({
      message: "",
      success: false,
    });
    setFormData((prev) => ({
      ...prev,
      imagesFormData: [...files],
    }));
    const objectUrl: string[] = [];
    filesArray.map((file) => objectUrl.push(URL.createObjectURL(file)));

    setImagesUrl((prev) => [...prev, ...objectUrl]);

    e.target.value = "";
  };

  const addVariant = () => {
    const newVariant: VariantType = {
      id: crypto.randomUUID(),
      sizes: [],
      colorName: "Negro",
      colorHex: "#000000",
      price: formData.price,
      priceOffer: formData.priceOffer,
    };
    setFormData({ ...formData, variant: [...formData.variant, newVariant] });
  };

  const updateVariant = (index: number, field: keyof VariantType, value: any) => {
    const updatedVariants = [...formData.variant];
    updatedVariants[index] = { ...updatedVariants[index], [field]: value };
    setFormData({ ...formData, variant: updatedVariants });
  };

  const removeVariant = (index: number) => {
    setFormData({
      ...formData,
      variant: formData.variant.filter((_, i) => i !== index),
    });
  };

  const getCategoryTitle = (categoryId: string) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category?.title || categoryId;
  };

  // Función para abrir/cerrar el selector de color
  const toggleColorPicker = (variantIndex: number) => {
    if (showColorPicker === variantIndex) {
      setShowColorPicker(null);
    } else {
      setShowColorPicker(variantIndex);
    }
  };

  // Función para seleccionar un color predefinido
  const selectPredefinedColor = (variantIndex: number, color: { name: string; hex: string }) => {
    const fullHex = expandShortHex(color.hex);
    updateVariant(variantIndex, "colorName", color.name);
    updateVariant(variantIndex, "colorHex", fullHex);
    setCustomColorInput(fullHex);
    setColorHexInput(fullHex);
    setColorNameInput(color.name);
  };

  // Función para manejar cambio del input color
  const handleColorPickerChange = (variantIndex: number, color: string) => {
    const fullHex = expandShortHex(color);
    setCustomColorInput(fullHex);
    setColorHexInput(fullHex);
    // Generar un nombre automático basado en el hex
    const autoName = getColorNameFromHex(fullHex);
    setColorNameInput(autoName);
  };

  // Función para manejar cambio del input hexadecimal
  const handleHexInputChange = (variantIndex: number, value: string) => {
    const formattedValue = formatHexColor(value);
    setColorHexInput(formattedValue);

    // Actualizar cuando sea un color válido
    if (isValidHex(formattedValue)) {
      const fullHex = expandShortHex(formattedValue);
      setCustomColorInput(fullHex);
      // Generar nombre automático
      const autoName = getColorNameFromHex(fullHex);
      setColorNameInput(autoName);
    }
  };

  // Aplicar color personalizado
  const applyCustomColor = (variantIndex: number) => {
    if (isValidHex(colorHexInput)) {
      const fullHex = expandShortHex(colorHexInput);
      updateVariant(variantIndex, "colorHex", fullHex);
      setCustomColorInput(fullHex);
    }
  };

  // Cerrar y aplicar color
  const closeColorPicker = (variantIndex: number) => {
    if (!colorNameInput.trim()) {
      setAlert({ message: "El nombre del color no puede estar vacío.", success: false });
      document.getElementById("error-alert-form")?.scrollIntoView({ behavior: "smooth" });
      return;
    }
    setAlert({ message: "", success: false });
    updateVariant(variantIndex, "colorName", colorNameInput.trim());
    if (isValidHex(colorHexInput)) {
      applyCustomColor(variantIndex);
    }
    setShowColorPicker(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[700px] max-h-[90vh] overflow-y-auto bg-secondary border-primary'>
        <DialogHeader>
          <DialogTitle className='text-foreground'>
            {product ? "Editar Producto" : "Agregar Producto"}
          </DialogTitle>
          <DialogDescription className='text-muted-foreground'>
            {product
              ? "Actualiza la información del producto"
              : "Completa los datos del nuevo producto"}
          </DialogDescription>
        </DialogHeader>
        {alert.message ? (
          <div
            id='error-alert-form'
            className='p-4 py-2 flex items-center flex-row bg-red-500 border-red-400 text-secondary gap-2'
          >
            <TriangleAlert size={28} className='flex items-start sm:items-center text-secondary' />
            <p>{alert.message}</p>
          </div>
        ) : null}
        <form onSubmit={handleSubmit}>
          <div className='grid gap-6 py-4'>
            {/* Información básica */}
            <div className='space-y-2'>
              <Label htmlFor='name' className='text-foreground'>
                Nombre <span className='text-red-500'>*</span>
              </Label>
              <Input
                id='name'
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className='bg-background border-border text-foreground'
                required
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='description' className='text-foreground'>
                Descripción <span className='text-red-500'>*</span>
              </Label>
              <Textarea
                id='description'
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className='bg-background border-border text-foreground resize-none'
                rows={3}
                required
              />
            </div>

            {/* Precios y stock */}
            <div className='grid grid-cols-2 max-sm:flex max-sm:flex-col gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='price' className='text-foreground'>
                  Precio <span className='text-red-500'>*</span>
                </Label>
                <Input
                  id='price'
                  type='number'
                  step='0.01'
                  value={formData.price ?? 0}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  className='bg-background border-border text-foreground'
                  required
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='priceOffer' className='text-foreground'>
                  Precio Oferta
                </Label>
                <Input
                  id='priceOffer'
                  type='number'
                  step='0.01'
                  value={formData.priceOffer ?? 0}
                  onChange={(e) => setFormData({ ...formData, priceOffer: Number(e.target.value) })}
                  className='bg-background border-border text-foreground'
                />
              </div>
            </div>

            {/* Tallas */}
            <div className='space-y-2'>
              <Label className='text-foreground'>Tallas Disponibles</Label>
              <div className='flex gap-2'>
                <Input
                  value={sizeInput}
                  onChange={(e) => setSizeInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSize())}
                  placeholder='Ej: S, M, L, XL...'
                  className='bg-background border-border text-foreground'
                />
                <Button type='button' onClick={addSize} size='icon' variant='outline'>
                  <Plus className='h-4 w-4' />
                </Button>
              </div>
              {formData.sizes.length > 0 && (
                <div className='flex flex-wrap gap-2 mt-2'>
                  {formData.sizes.map((size, index) => (
                    <span
                      key={index}
                      className='inline-flex items-center gap-1 px-3 py-2 bg-primary/90 text-secondary rounded-md text-sm'
                    >
                      {size}
                      <button
                        type='button'
                        onClick={() => removeSize(index)}
                        className='hover:bg-red-500 bg-secondary text-red-500 hover:text-secondary rounded-full p-0.5 a'
                      >
                        <X className='h-3 w-3' />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Categorías */}
            <div className='space-y-2'>
              <Label className='text-foreground'>
                Categorías <span className='text-red-500'>*</span>
              </Label>
              <div className='flex gap-2'>
                <select
                  onChange={(e) => {
                    if (e.target.value) {
                      addCategory(e.target.value);
                      e.target.value = "";
                    }
                  }}
                  className='flex h-10 w-full rounded-md px-3 py-2 text-sm border border-black disabled:cursor-not-allowed disabled:opacity-50'
                >
                  <option value=''>Selecciona una categoría...</option>
                  {categories.length &&
                    categories
                      .filter(
                        (cat) =>
                          cat.isActive &&
                          !formData.categories.find((category) => category.id === cat.id)
                      )
                      .map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.title}
                        </option>
                      ))}
                </select>
              </div>
              {formData.categories && formData.categories.length > 0 && (
                <div className='flex flex-wrap gap-2 mt-2'>
                  {formData.categories.map((categoryId, index) => (
                    <span
                      key={index}
                      className='inline-flex items-center gap-1 px-3 py-2 bg-primary/90 text-secondary rounded-md text-sm'
                    >
                      {getCategoryTitle(categoryId.title)}
                      <button
                        type='button'
                        onClick={() => removeCategory(index)}
                        className='hover:bg-red-500 bg-secondary text-red-500 hover:text-secondary rounded-full p-0.5 a'
                      >
                        <X className='h-3 w-3' />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Imágenes */}
            <div className='space-y-4'>
              <div className='flex items-center justify-between'>
                <div>
                  <Label className='text-lg font-semibold'>Imágenes del producto</Label>
                  <p className='text-sm text-muted-foreground'>
                    Sube hasta 5 imágenes. La primera será la principal.
                  </p>
                </div>
                {imagesUrl.length}/5
              </div>

              {/* Área de subida */}
              {imagesUrl.length >= 5 ? null : (
                <div
                  className='border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors border-primary/50 hover:border-primary'
                  onClick={() =>
                    imagesUrl.length < 5 && document.getElementById("imageFile")?.click()
                  }
                >
                  <input
                    id='imageFile'
                    type='file'
                    accept='image/*'
                    multiple
                    onChange={handleImageFiles}
                    className='hidden'
                    disabled={imagesUrl.length >= 5}
                  />

                  <div className='space-y-3'>
                    <Upload className='h-12 w-12 mx-auto text-muted-foreground' />
                    <div>
                      <p className='font-medium'>Arrastra y suelta imágenes aquí</p>
                      <p className='text-sm text-muted-foreground mt-1'>
                        o haz clic para seleccionar archivos
                      </p>
                    </div>
                    <p className='text-xs text-muted-foreground'>
                      JPG, PNG, WebP hasta 5MB cada una
                    </p>
                  </div>
                </div>
              )}

              <div className='space-y-2'>
                <Label className='text-sm font-medium'>Miniaturas</Label>
                <div className='grid grid-cols-5 gap-2'>
                  {imagesUrl.map((img, index) => (
                    <div
                      key={index}
                      className={`relative aspect-square overflow-hidden rounded-lg border-2 cursor-pointer transition-all ${"border-border hover:border-primary/50"}`}
                    >
                      <Image
                        src={img || "/tienda-alli-webp"}
                        alt={`Imagen ${index + 1}`}
                        title={`Imagen ${index + 1}`}
                        width={200}
                        height={200}
                        className='w-full h-full object-cover transition-transform hover:scale-105'
                      />

                      {/* Botón eliminar */}
                      <Button
                        type='button'
                        size='icon'
                        variant='danger'
                        className='absolute top-1 right-1 h-6 w-6 opacity-0 hover:opacity-100 transition-opacity'
                        onClick={(e) => {
                          e.stopPropagation();
                          removeImage(index);
                        }}
                      >
                        <X className='h-3 w-3' />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Variantes */}
            <div className='space-y-3'>
              <div className='flex items-center justify-between'>
                <Label className='text-foreground'>Modelos del Producto</Label>
                <Button
                  type='button'
                  onClick={addVariant}
                  size='sm'
                  variant='outline'
                  className={`${formData.sizes.length ? "" : "bg-slate-200"}`}
                  disabled={formData.sizes.length ? false : true}
                >
                  <Plus className='h-4 w-4 mr-2' />
                  Agregar modelo
                </Button>
              </div>

              {formData.variant.length > 0 && (
                <div className='space-y-3'>
                  {formData.variant.map((variant, variantIndex) => (
                    <Card
                      key={variant.id}
                      className={`relative p-4 bg-primary/20 border border-primary/50`}
                    >
                      <div
                        className={`${
                          formData.sizes.length
                            ? "hidden"
                            : "absolute inset-0 backdrop-blur-lg flex justify-center items-center z-10"
                        }`}
                      >
                        <p className='text-2xl text-primary'>
                          Tienes que añadir tallas para desbloquear
                        </p>
                      </div>

                      <div className='flex items-center justify-between mb-3 '>
                        <h4 className='text-sm font-medium text-foreground'>
                          Modelo {variantIndex + 1}
                        </h4>
                        <Button
                          type='button'
                          onClick={() => removeVariant(variantIndex)}
                          size='sm'
                          variant='ghost'
                          className='backdrop-blur-3xl bg-white/50  hover:bg-white'
                        >
                          <X className='h-4 w-4' />
                        </Button>
                      </div>

                      <div className='grid gap-3'>
                        {/* Input para nombre del color */}
                        <div className='space-y-2'>
                          <Label className='text-sm text-foreground'>
                            Nombre del Color <span className='text-red-500'>*</span>
                          </Label>
                          <div className='flex items-center gap-2'>
                            <Input
                              value={variant.colorName || ""}
                              onChange={(e) =>
                                updateVariant(variantIndex, "colorName", e.target.value)
                              }
                              placeholder='Ej: Rojo, Negro, Azul Marino...'
                              className='bg-background border-border text-foreground h-9'
                            />
                            <Button
                              type='button'
                              onClick={() => toggleColorPicker(variantIndex)}
                              size='icon'
                              variant='outline'
                              className='h-9 w-9'
                            >
                              <Palette className='h-4 w-4' />
                            </Button>
                          </div>
                        </div>

                        {/* Display del color actual */}
                        <div className='flex items-center gap-3 p-2 bg-background/50 rounded-md'>
                          <div
                            className='w-8 h-8 rounded border border-border shadow-sm'
                            style={{ backgroundColor: variant.colorHex }}
                            title={variant.colorHex}
                          />
                          <div className='flex-1'>
                            <div className='flex items-center gap-2'>
                              <span className='font-medium text-sm'>{variant.colorName}</span>
                              <span className='font-mono text-xs bg-primary/10 px-2 py-1 rounded'>
                                {variant.colorHex}
                              </span>
                            </div>
                            <p className='text-xs text-muted-foreground'>
                              Clic en la paleta para cambiar color
                            </p>
                          </div>
                        </div>

                        {/* Paleta de colores (dropdown) */}
                        {showColorPicker === variantIndex && (
                          <div className='mt-2 p-4 border rounded-lg bg-background shadow-lg animate-in slide-in-from-top-2'>
                            <div className='flex items-center justify-between mb-3'>
                              <Label className='text-sm font-medium'>Seleccionar Color</Label>
                              <Button
                                type='button'
                                onClick={() => closeColorPicker(variantIndex)}
                                size='sm'
                                variant='primary'
                                className='h-7 px-2'
                              >
                                <Check className='h-3 w-3 mr-1' />
                                Aplicar
                              </Button>
                            </div>

                            <div className='mb-4'>
                              <Label className='text-sm font-medium mb-2 block'>
                                Colores predefinidos
                              </Label>
                              <div className='grid grid-cols-6 gap-2'>
                                {PREDEFINED_COLORS.map((color, idx) => (
                                  <button
                                    key={idx}
                                    type='button'
                                    onClick={() => selectPredefinedColor(variantIndex, color)}
                                    className={`group relative w-8 h-8 rounded border hover:scale-110 transition-transform ${
                                      variant.colorHex === expandShortHex(color.hex)
                                        ? "ring-2 ring-primary ring-offset-1"
                                        : "hover:ring-2 hover:ring-primary/50"
                                    }`}
                                    style={{ backgroundColor: color.hex }}
                                    title={`${color.name} (${color.hex})`}
                                  >
                                    {variant.colorHex === expandShortHex(color.hex) && (
                                      <div className='absolute inset-0 flex items-center justify-center'>
                                        <Check className='h-4 w-4 text-white drop-shadow-md' />
                                      </div>
                                    )}
                                  </button>
                                ))}
                              </div>
                            </div>

                            <div className='space-y-4 pt-3 border-t'>
                              <div>
                                <Label className='text-sm font-medium block mb-2'>
                                  Personalizar Color
                                </Label>
                                <div className='flex items-center gap-2'>
                                  <div className='relative flex-1'>
                                    <Input
                                      type='color'
                                      value={customColorInput}
                                      onChange={(e) =>
                                        handleColorPickerChange(variantIndex, e.target.value)
                                      }
                                      className='h-10 w-full cursor-pointer'
                                    />
                                    <div className='absolute inset-0 pointer-events-none rounded border' />
                                  </div>

                                  <div className='flex-1'>
                                    <div className='flex items-center gap-2'>
                                      <div className='relative flex-1'>
                                        <span className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground font-mono'>
                                          #
                                        </span>
                                        <Input
                                          value={colorHexInput.replace("#", "")}
                                          onChange={(e) =>
                                            handleHexInputChange(variantIndex, e.target.value)
                                          }
                                          className='h-10 font-mono text-sm pl-8 pr-10'
                                          placeholder='000000'
                                          maxLength={6}
                                        />
                                        <div
                                          className='absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 rounded border'
                                          style={{
                                            backgroundColor: isValidHex(colorHexInput)
                                              ? colorHexInput
                                              : "#ef4444",
                                          }}
                                        />
                                      </div>
                                    </div>
                                    {!isValidHex(colorHexInput) && colorHexInput !== "#" && (
                                      <p className='text-xs text-red-500 mt-1'>
                                        Formato inválido. Usa 6 caracteres hexadecimales (0-9, A-F)
                                      </p>
                                    )}
                                  </div>
                                </div>

                                <div className='flex items-center justify-between text-xs text-muted-foreground mt-2'>
                                  <span>Valor: {colorHexInput}</span>
                                  <span>Formato: #RRGGBB</span>
                                </div>
                              </div>

                              <div className='flex items-center justify-end gap-2 pt-2'>
                                <Button
                                  type='button'
                                  onClick={() => setShowColorPicker(null)}
                                  size='sm'
                                  variant='ghost'
                                >
                                  Cancelar
                                </Button>
                                <Button
                                  type='button'
                                  onClick={() => applyCustomColor(variantIndex)}
                                  size='sm'
                                  disabled={!isValidHex(colorHexInput)}
                                >
                                  Aplicar Color
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}

                        <div className='grid grid-cols-2 gap-3'>
                          <div className='space-y-1'>
                            <Label className='text-sm text-foreground'>
                              Precio<span className='text-red-500'>*</span>
                            </Label>
                            <Input
                              type='number'
                              step='0.01'
                              value={variant.price}
                              onChange={(e) =>
                                updateVariant(variantIndex, "price", Number(e.target.value))
                              }
                              className='bg-background border-border text-foreground h-9'
                            />
                          </div>
                          <div className='space-y-1'>
                            <Label className='text-sm text-foreground'>Precio Oferta</Label>
                            <Input
                              type='number'
                              step='0.01'
                              value={variant.priceOffer}
                              onChange={(e) =>
                                updateVariant(variantIndex, "priceOffer", Number(e.target.value))
                              }
                              className='bg-background border-border text-foreground h-9'
                            />
                          </div>
                        </div>

                        {/* Tallas */}
                        <div className='space-y-3'>
                          <div className='space-y-2'>
                            <div className='flex items-center justify-between'>
                              <Label className='text-foreground'>
                                Tallas Disponibles <span className='text-red-500'>*</span>
                              </Label>
                              <div className='flex items-center gap-2'>
                                <button
                                  type='button'
                                  onClick={() => {
                                    // Seleccionar todas las tallas
                                    updateVariant(variantIndex, "sizes", [...formData.sizes]);
                                  }}
                                  className='text-xs hover:text-primary transition-colors px-2 py-1 hover:bg-primary/10 rounded'
                                >
                                  Seleccionar todas
                                </button>
                                <span className='text-muted-foreground'>|</span>
                                <button
                                  type='button'
                                  onClick={() => updateVariant(variantIndex, "sizes", [])}
                                  className='text-xs hover:text-destructive transition-colors px-2 py-1 hover:bg-destructive/10 rounded'
                                >
                                  Limpiar
                                </button>
                              </div>
                            </div>

                            <p className='text-sm text-muted-foreground'>
                              Haz clic en cada talla para seleccionarla/deseleccionarla
                            </p>
                          </div>

                          {/* Grid de tallas seleccionables */}
                          <div className='flex flex-wrap gap-2 p-3 border border-primary rounded-md bg-background min-h-[60px]'>
                            {formData.sizes.map((size) => {
                              const isSelected =
                                formData.variant[variantIndex]?.sizes?.includes(size);
                              return (
                                <button
                                  key={size}
                                  type='button'
                                  onClick={() => {
                                    const currentSizes =
                                      formData.variant[variantIndex]?.sizes || [];
                                    let newSizes;

                                    if (isSelected) {
                                      // Quitar la talla
                                      newSizes = currentSizes.filter((s) => s !== size);
                                    } else {
                                      // Agregar la talla
                                      newSizes = [...currentSizes, size];
                                    }

                                    updateVariant(variantIndex, "sizes", newSizes);
                                  }}
                                  className={`
            relative px-3 py-2 rounded-md text-sm font-medium transition-all duration-200
            flex items-center justify-center min-w-[44px]
            ${
              isSelected
                ? "bg-primary text-secondary shadow-sm ring-2 ring-primary ring-offset-1"
                : "bg-muted hover:bg-muted/80 text-foreground border border-primary/30 hover:border-primary hover:bg-secondary "
            }
          `}
                                >
                                  {size}
                                  {isSelected && (
                                    <div className='absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full border border-background flex items-center justify-center'>
                                      <Check className='h-2.5 w-2.5 text-primary-foreground' />
                                    </div>
                                  )}
                                </button>
                              );
                            })}
                          </div>

                          {/* Validación */}
                          {!formData.variant[variantIndex]?.sizes?.length && (
                            <div className='flex items-start gap-2 text-destructive text-sm bg-yellow-100 p-3 rounded-md'>
                              <AlertCircle className='h-4 w-4 mt-0.5 flex-shrink-0' />
                              <div>
                                <p className='font-medium'>Atención</p>
                                <p>
                                  Debes seleccionar al menos una talla disponible para este modelo.
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>

          <DialogFooter className='gap-2'>
            <Button type='button' variant='outline' onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type='submit' disabled={isLoading}>
              {isLoading ? "Guardando..." : product ? "Actualizar" : "Agregar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
