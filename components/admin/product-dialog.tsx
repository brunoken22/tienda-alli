"use client";

import type React from "react";
import { useState, useEffect, Dispatch, SetStateAction } from "react";
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
import { X, Plus, TriangleAlert, Badge, Upload } from "lucide-react";
import type { Product, Variant } from "@/types/admin";
import convertUrlsToFiles from "@/utils/convertFilesImg";

interface ProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: Product | null;
  alert: { success: boolean; message: string };
  setAlert: Dispatch<
    SetStateAction<{
      success: boolean;
      message: string;
    }>
  >;
  onSave: (product: Omit<Product, "id">, images: File[]) => Promise<boolean>;
}

export function ProductDialog({
  open,
  onOpenChange,
  product,
  onSave,
  alert,
  setAlert,
}: ProductDialogProps) {
  const [formData, setFormData] = useState<Omit<Product, "id">>({
    title: "",
    description: "",
    price: 0,
    priceOffer: 0,
    category: [],
    sizes: [],
    images: [],
    imagesFormData: [],
    // stock: 0,
    variant: [],
  });
  const [categoryInput, setCategoryInput] = useState<string>("");
  const [sizeInput, setSizeInput] = useState("");
  const [sizeVariantInput, setSizeVariantInput] = useState("");
  const [imagesUrl, setImagesUrl] = useState<string[]>([]);

  useEffect(() => {
    if (product) {
      (async () => {
        const fileImages = await convertUrlsToFiles(product.images);
        setFormData({
          title: product.title,
          description: product.description,
          price: product.price,
          priceOffer: product.priceOffer,
          category: product.category,
          sizes: product.sizes,
          images: [],
          imagesFormData: fileImages,
          // stock: product.stock,
          variant: product.variant,
        });

        setImagesUrl(product.images);
      })();
    } else {
      setFormData({
        title: "",
        description: "",
        price: 0,
        priceOffer: 0,
        category: [],
        variant: [],
        sizes: [],
        images: [],
        // stock: 0,
      });
      setImagesUrl([]);
    }
  }, [product, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formDataTarget = new FormData(e.target as HTMLFormElement);
    const images = formData.imagesFormData;
    // const images = formDataTarget.getAll("imageFile");

    const repsonseOnSave = await onSave(formData, images as File[]);

    if (repsonseOnSave) {
      onOpenChange(false);
    }
  };

  const addCategory = () => {
    if (categoryInput.trim() && !formData.category.includes(categoryInput.trim() as never)) {
      setFormData({ ...formData, category: [...formData.category, categoryInput.trim()] });
      setCategoryInput("");
    }
  };

  const removeCategory = (index: number) => {
    setFormData({
      ...formData,
      category: formData.category.filter((_, i) => i !== index),
    });
  };

  const addSize = () => {
    if (sizeInput.trim() && !formData.sizes.includes(sizeInput.trim())) {
      setFormData({ ...formData, sizes: [...formData.sizes, sizeInput.trim()] });
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

    // Reset input para permitir seleccionar el mismo archivo nuevamente
    e.target.value = "";
  };

  const addVariant = () => {
    const newVariant: Variant = {
      id: crypto.randomUUID(),
      sizes: [],
      color: "",
      // stock: 0,
      price: formData.price,
      priceOffer: formData.priceOffer,
    };
    setFormData({ ...formData, variant: [...formData.variant, newVariant] });
  };

  const updateVariant = (index: number, field: keyof Variant, value: any) => {
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

  const addVariantSize = (variantIndex: number, size: string) => {
    if (size.trim()) {
      const updatedVariants = [...formData.variant];
      if (!updatedVariants[variantIndex].sizes.includes(size.trim())) {
        updatedVariants[variantIndex].sizes.push(size.trim());
        setFormData({ ...formData, variant: updatedVariants });
      }
    }
  };

  const removeVariantSize = (variantIndex: number, sizeIndex: number) => {
    const updatedVariants = [...formData.variant];
    updatedVariants[variantIndex].sizes = updatedVariants[variantIndex].sizes.filter(
      (_, i) => i !== sizeIndex
    );
    setFormData({ ...formData, variant: updatedVariants });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[700px] max-h-[90vh] overflow-y-auto bg-secondary border-border'>
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
            className='p-4 py-2  flex items-center flex-row bg-red-500 border-red-400 text-secondary gap-2'
          >
            <TriangleAlert size={28} className='flex items-start sm:items-center  text-secondary' />
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
                  value={formData.price}
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
                  value={formData.priceOffer}
                  onChange={(e) => setFormData({ ...formData, priceOffer: Number(e.target.value) })}
                  className='bg-background border-border text-foreground'
                />
              </div>
              {/* <div className='space-y-2'>
                <Label className='text-sm text-foreground'>
                  Stock <span className='text-red-500'>*</span>
                </Label>
                <Input
                  type='number'
                  value={formData.stock}
                  onChange={(e) =>
                    setFormData((data) => ({ ...data, stock: Number(e.target.value) }))
                  }
                  className='bg-background border-border text-foreground'
                />
              </div> */}
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
                <Input
                  value={categoryInput}
                  onChange={(e) => setCategoryInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCategory())}
                  placeholder='Ej: Ropa, Calzado, Accesorios...'
                  className='bg-background border-border text-foreground'
                />
                <Button type='button' onClick={addCategory} size='icon' variant='outline'>
                  <Plus className='h-4 w-4' />
                </Button>
              </div>
              {formData.category.length > 0 && (
                <div className='flex flex-wrap gap-2 mt-2'>
                  {formData.category.map((cat, index) => (
                    <span
                      key={index}
                      className='inline-flex items-center gap-1 px-3 py-2 bg-primary/90 text-secondary rounded-md text-sm'
                    >
                      {cat}
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
                      <img
                        src={img || "/placeholder.svg"}
                        alt={`Imagen ${index + 1}`}
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
                <Button type='button' onClick={addVariant} size='sm' variant='outline'>
                  <Plus className='h-4 w-4 mr-2' />
                  Agregar modelo
                </Button>
              </div>

              {formData.variant.length > 0 && (
                <div className='space-y-3'>
                  {formData.variant.map((variant, variantIndex) => (
                    <Card key={variant.id} className='p-4 bg-primary/20 border border-primary/50'>
                      <div className='flex items-center justify-between mb-3'>
                        <h4 className='text-sm font-medium text-foreground'>
                          Modelo {variantIndex + 1}
                        </h4>
                        <Button
                          type='button'
                          onClick={() => removeVariant(variantIndex)}
                          size='sm'
                          variant='ghost'
                          className='text-destructive hover:text-destructive'
                        >
                          <X className='h-4 w-4' />
                        </Button>
                      </div>

                      <div className='grid gap-3'>
                        <div className='grid gap-3'>
                          <div className='space-y-1'>
                            <Label className='text-sm text-foreground'>
                              Color <span className='text-red-500'>*</span>
                            </Label>
                            <Input
                              value={variant.color}
                              onChange={(e) => updateVariant(variantIndex, "color", e.target.value)}
                              placeholder='Ej: Rojo, Azul...'
                              className='bg-background border-border text-foreground h-9'
                            />
                          </div>
                          {/* <div className='space-y-1'>
                            <Label className='text-sm text-foreground'>Stock</Label>
                            <Input
                              type='number'
                              value={variant.stock}
                              onChange={(e) =>
                                updateVariant(variantIndex, "stock", Number(e.target.value))
                              }
                              className='bg-background border-border text-foreground h-9'
                            />
                          </div> */}
                        </div>

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
                        <div className='space-y-2'>
                          <Label className='text-foreground'>
                            Tallas Disponibles <span className='text-red-500'>*</span>
                          </Label>
                          <div className='flex gap-2'>
                            <Input
                              value={sizeVariantInput}
                              onChange={(e) => setSizeVariantInput(e.target.value)}
                              onKeyDown={(e) =>
                                e.key === "Enter" &&
                                (e.preventDefault(), addVariantSize(variantIndex, sizeVariantInput))
                              }
                              placeholder='Ej: S, M, L, XL...'
                              className='bg-background border-border text-foreground'
                            />
                            <Button
                              type='button'
                              onClick={() => addVariantSize(variantIndex, sizeVariantInput)}
                              size='icon'
                              variant='outline'
                            >
                              <Plus className='h-4 w-4' />
                            </Button>
                          </div>
                          {formData.variant[variantIndex]?.sizes?.length > 0 && (
                            <div className='flex flex-wrap gap-2 mt-2'>
                              {formData.variant[variantIndex].sizes.map((size, index) => (
                                <span
                                  key={index}
                                  className='inline-flex items-center gap-1 px-3 py-2 bg-primary/90 text-secondary rounded-md text-sm'
                                >
                                  {size}
                                  <button
                                    type='button'
                                    onClick={() => removeVariantSize(variantIndex, index)}
                                    className='hover:bg-red-500 bg-secondary text-red-500 hover:text-secondary rounded-full p-0.5'
                                  >
                                    <X className='h-3 w-3' />
                                  </button>
                                </span>
                              ))}
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
            <Button type='submit'>{product ? "Actualizar" : "Agregar"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
