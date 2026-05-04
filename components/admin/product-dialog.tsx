"use client";

import type React from "react";
import { useState, useEffect, type Dispatch, type SetStateAction, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import {
  X,
  Plus,
  TriangleAlert,
  Upload,
  Palette,
  Copy,
  Save,
  Trash2,
  Eye,
  EyeOff,
  Layers,
  Zap,
  Grid3x3,
  Tag,
  PlusCircle,
} from "lucide-react";
import convertUrlsToFiles from "@/utils/convertFilesImg";
import type { CategoryType } from "@/types/category";
import { ProductType, VariantType } from "@/types/product";
import Image from "next/image";
import { Badge } from "../ui/badge";

// Colores predefinidos
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

// Talles predefinidos comunes (se pueden expandir con custom)
const DEFAULT_PREDEFINED_SIZES = [
  "XS",
  "S",
  "M",
  "L",
  "XL",
  "XXL",
  "28",
  "30",
  "32",
  "34",
  "36",
  "38",
  "40",
  "42",
  "44",
];

const isValidHex = (color: string): boolean => /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
const expandShortHex = (hex: string): string => {
  if (hex.length === 4 && hex.startsWith("#")) {
    return "#" + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3];
  }
  return hex;
};

const defaultProduct = {
  title: "",
  description: "",
  categories: [],
  categoryFormData: [],
  images: [],
  imagesFormData: [],
  variants: [],
  isActive: true,
  price: 0,
  priceOffer: 0,
  stock: 0,
  sizes: [],
};

interface ProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: ProductType | null;
  alert: { success: boolean; message: string };
  setAlert: Dispatch<SetStateAction<{ success: boolean; message: string }>>;
  onSave: (
    product: Omit<ProductType, "id" | "categories" | "imagesId">,
    images: File[],
  ) => Promise<boolean>;
  categories: CategoryType[];
}

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
  const [activeTab, setActiveTab] = useState<"basic" | "variants" | "images">("basic");
  const [showColorPicker, setShowColorPicker] = useState<number | null>(null);
  const [customColorInput, setCustomColorInput] = useState<string>("#000000");
  const [colorHexInput, setColorHexInput] = useState<string>("#000000");
  const [colorNameInput, setColorNameInput] = useState<string>("Negro");
  const [imagesUrl, setImagesUrl] = useState<string[]>([]);

  // Estado para talles personalizados
  const [customSizeInput, setCustomSizeInput] = useState<string>("");
  const [predefinedSizes, setPredefinedSizes] = useState<string[]>([...DEFAULT_PREDEFINED_SIZES]);

  // Formulario principal
  const [formData, setFormData] = useState<Omit<ProductType, "id" | "imagesId">>(defaultProduct);

  // Estado para vista de variantes agrupadas
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [selectedColors, setSelectedColors] = useState<{ name: string; hex: string }[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);

  useEffect(() => {
    setAlert({ message: "", success: false });
    if (product) {
      (async () => {
        const filterImages = product.images.filter((img) => typeof img === "string");
        const imagesConvert = await convertUrlsToFiles(filterImages);
        setFormData({
          title: product.title,
          description: product.description,
          categoryFormData: product.categories.map((category) => category.id),
          categories: product.categories,
          images: [],
          price: product.price,
          priceOffer: product.priceOffer,
          stock: product.stock,
          imagesFormData: imagesConvert,
          variants: product.variants.map((v) => ({
            ...v,
            colorHex: v.colorHex ? expandShortHex(v.colorHex) : "#000000",
          })),
          isActive: product.isActive,
          sizes: product.sizes || [],
        });
        setImagesUrl(filterImages);

        // Extraer colores y talles únicos
        const colors = new Map<string, string>();
        const sizes = new Set<string>();
        product.variants.forEach((v) => {
          if (!colors.has(v.colorName)) colors.set(v.colorName, v.colorHex);
          if (v.size) sizes.add(v.size);
        });
        setSelectedColors(Array.from(colors.entries()).map(([name, hex]) => ({ name, hex })));
        setSelectedSizes(Array.from(sizes));

        // Agregar talles personalizados a la lista predefinida
        const customSizes = Array.from(sizes).filter((s) => !DEFAULT_PREDEFINED_SIZES.includes(s));
        if (customSizes.length > 0) {
          setPredefinedSizes([...DEFAULT_PREDEFINED_SIZES, ...customSizes]);
        }
      })();
    } else {
      resetForm();
    }
  }, [product, open, setAlert]);

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      categories: [],
      categoryFormData: [],
      variants: [],
      images: [],
      imagesFormData: [],
      isActive: true,
      price: 0,
      priceOffer: 0,
      stock: 0,
      sizes: [],
    });
    setImagesUrl([]);
    setSelectedColors([]);
    setSelectedSizes([]);
    setActiveTab("basic");
    setPredefinedSizes([...DEFAULT_PREDEFINED_SIZES]);
  };

  // ============ FUNCIONES PARA TALLES PERSONALIZADOS ============

  const addCustomSize = () => {
    const newSize = customSizeInput.trim().toUpperCase();
    if (!newSize) {
      setAlert({ message: "Ingresa un talle válido", success: false });
      return;
    }

    if (predefinedSizes.includes(newSize)) {
      setAlert({ message: `El talle "${newSize}" ya existe`, success: false });
      return;
    }

    setPredefinedSizes([...predefinedSizes, newSize]);
    setCustomSizeInput("");
    setAlert({ message: `✅ Talle "${newSize}" agregado`, success: true });
    setTimeout(() => setAlert({ message: "", success: false }), 2000);
  };

  const removeCustomSize = (sizeToRemove: string) => {
    // No permitir eliminar talles que ya están en uso
    if (selectedSizes.includes(sizeToRemove)) {
      setAlert({
        message: `No puedes eliminar "${sizeToRemove}" porque está en uso`,
        success: false,
      });
      return;
    }

    // No eliminar talles predefinidos por defecto
    if (DEFAULT_PREDEFINED_SIZES.includes(sizeToRemove)) {
      setAlert({ message: `No puedes eliminar talles predefinidos`, success: false });
      return;
    }

    setPredefinedSizes(predefinedSizes.filter((s) => s !== sizeToRemove));
    setAlert({ message: `🗑️ Talle "${sizeToRemove}" eliminado`, success: true });
    setTimeout(() => setAlert({ message: "", success: false }), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.variants.length === 0) {
      setAlert({ message: "Debes agregar al menos una variante (color + talle)", success: false });
      setActiveTab("variants");
      return;
    }

    const invalidVariants = formData.variants.filter((v) => !v.size);
    if (invalidVariants.length > 0) {
      setAlert({
        message: "Todas las variantes deben tener una talla seleccionada",
        success: false,
      });
      setActiveTab("variants");
      return;
    }

    setIsLoading(true);
    const images = formData.imagesFormData || [];
    try {
      const responseOnSave = await onSave(formData, images as File[]);
      setIsLoading(false);
      if (responseOnSave) onOpenChange(false);
    } catch (e) {
      document.getElementById("error-alert-form")?.scrollIntoView({ behavior: "smooth" });
      setIsLoading(false);
    }
  };

  // ============ GESTIÓN DE VARIANTES ============

  const addVariant = () => {
    const newVariant: VariantType = {
      id: crypto.randomUUID(),
      size: "",
      colorName: "Negro",
      colorHex: "#000000",
      price: 0,
      stock: 0,
      priceOffer: 0,
    };
    setFormData({ ...formData, variants: [...formData.variants, newVariant] });
  };

  const removeVariant = (index: number) => {
    setFormData({
      ...formData,
      variants: formData.variants.filter((_, i) => i !== index),
    });
  };

  const updateVariant = (index: number, field: keyof VariantType, value: any) => {
    const updatedVariants = [...formData.variants];
    updatedVariants[index] = { ...updatedVariants[index], [field]: value };
    setFormData({ ...formData, variants: updatedVariants });
  };

  // ============ GENERADOR POR MATRIZ ============

  const generateMatrixVariants = () => {
    if (selectedColors.length === 0) {
      setAlert({ message: "Selecciona al menos un color", success: false });
      return;
    }
    if (selectedSizes.length === 0) {
      setAlert({ message: "Selecciona al menos un talle", success: false });
      return;
    }

    const newVariants: VariantType[] = [];
    for (const color of selectedColors) {
      for (const size of selectedSizes) {
        const exists = formData.variants.some((v) => v.colorName === color.name && v.size === size);
        if (!exists) {
          newVariants.push({
            id: crypto.randomUUID(),
            size,
            colorName: color.name,
            colorHex: color.hex,
            price: 0,
            stock: 0,
            priceOffer: 0,
          });
        }
      }
    }

    if (newVariants.length > 0) {
      setFormData({ ...formData, variants: [...formData.variants, ...newVariants] });
      setAlert({ message: `✅ Se agregaron ${newVariants.length} variantes`, success: true });
      setTimeout(() => setAlert({ message: "", success: false }), 3000);
    }
  };

  const addColorToMatrix = (color: { name: string; hex: string }) => {
    if (!selectedColors.find((c) => c.name === color.name)) {
      setSelectedColors([...selectedColors, color]);
    }
  };

  const removeColorFromMatrix = (colorName: string) => {
    setSelectedColors(selectedColors.filter((c) => c.name !== colorName));
    setFormData({
      ...formData,
      variants: formData.variants.filter((v) => v.colorName !== colorName),
    });
  };

  const addSizeToMatrix = (size: string) => {
    if (!selectedSizes.includes(size)) {
      setSelectedSizes([...selectedSizes, size]);
    }
  };

  const removeSizeFromMatrix = (size: string) => {
    setSelectedSizes(selectedSizes.filter((s) => s !== size));
    setFormData({
      ...formData,
      variants: formData.variants.filter((v) => v.size !== size),
    });
  };

  // ============ BULK UPDATE ============

  const bulkUpdatePrice = (price: number) => {
    const updatedVariants = formData.variants.map((v) => ({ ...v, price }));
    setFormData({ ...formData, price, variants: updatedVariants });
  };

  const bulkUpdateStock = (stock: number) => {
    const updatedVariants = formData.variants.map((v) => ({ ...v, stock }));
    setFormData({ ...formData, variants: updatedVariants });
  };

  // ============ FUNCIONES AUXILIARES ============

  const getUniqueColors = () => {
    const colorMap = new Map<string, string>();
    formData.variants.forEach((v) => {
      if (!colorMap.has(v.colorName)) colorMap.set(v.colorName, v.colorHex);
    });
    return Array.from(colorMap.entries()).map(([name, hex]) => ({ name, hex }));
  };

  const getUniqueSizes = () => {
    return [...new Set(formData.variants.map((v) => v.size).filter((s) => s))].sort();
  };

  const totalStock = formData.variants.reduce((sum, v) => sum + (v.stock || 0), 0);

  // ============ CATEGORÍAS ============

  const addCategory = (categoryId: string) => {
    if (categoryId && !formData.categoryFormData?.find((c) => c === categoryId)) {
      const categoryFind = categories.find((c) => c.id === categoryId)!;
      setFormData({
        ...formData,
        categoryFormData: [...(formData.categoryFormData || []), categoryId],
        categories: [...formData.categories, categoryFind],
      });
    }
  };

  const removeCategory = (index: number) => {
    setFormData({
      ...formData,
      categoryFormData: formData.categoryFormData?.filter((_, i) => i !== index),
      categories: formData.categories.filter((_, i) => i !== index),
    });
  };

  // ============ IMÁGENES ============

  const removeImage = (index: number) => {
    setFormData({
      ...formData,
      imagesFormData: formData.imagesFormData?.filter((_, i) => i !== index),
    });
    setImagesUrl((prev) => prev.filter((_, i) => i !== index));
  };

  const handleImageFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const filesArray = Array.from(files);
    const maxImages = 5;
    const currentImgs = imagesUrl.length + filesArray.length;
    if (currentImgs > maxImages) {
      setAlert({ message: `Máximo ${maxImages} imágenes`, success: false });
      return;
    }
    setAlert({ message: "", success: false });
    setFormData((prev) => ({ ...prev, imagesFormData: filesArray }));
    const objectUrl = filesArray.map((file) => URL.createObjectURL(file));
    setImagesUrl((prev) => [...prev, ...objectUrl]);
    e.target.value = "";
  };

  // ============ COLOR PICKER ============

  const toggleColorPicker = (variantIndex: number) => {
    if (showColorPicker === variantIndex) {
      setShowColorPicker(null);
    } else {
      setShowColorPicker(variantIndex);
      const variant = formData.variants[variantIndex];
      if (variant) {
        setCustomColorInput(variant.colorHex);
        setColorHexInput(variant.colorHex);
        setColorNameInput(variant.colorName);
      }
    }
  };

  const selectPredefinedColor = (variantIndex: number, color: { name: string; hex: string }) => {
    updateVariant(variantIndex, "colorName", color.name);
    updateVariant(variantIndex, "colorHex", expandShortHex(color.hex));
  };

  const applyCustomColor = (variantIndex: number) => {
    if (isValidHex(colorHexInput)) {
      updateVariant(variantIndex, "colorHex", expandShortHex(colorHexInput));
      updateVariant(variantIndex, "colorName", colorNameInput);
      setShowColorPicker(null);
    }
  };

  const formatHexColor = (value: string): string => {
    let cleanValue = value.replace(/[^0-9a-fA-F#]/g, "");
    if (!cleanValue.startsWith("#") && cleanValue.length > 0) cleanValue = "#" + cleanValue;
    if (cleanValue.length > 7) cleanValue = cleanValue.substring(0, 7);
    return cleanValue.toUpperCase();
  };

  const handleHexInputChange = (value: string) => {
    const formattedValue = formatHexColor(value);
    setColorHexInput(formattedValue);
    if (isValidHex(formattedValue)) setCustomColorInput(expandShortHex(formattedValue));
  };

  // useEffect(() => {
  //   const handleBeforeUnload = (e: BeforeUnloadEvent) => {
  //     if (formData.title) {
  //       e.preventDefault();
  //       e.returnValue = "Tienes cambios sin guardar. ¿Estás seguro de que quieres salir?";
  //     }
  //   };

  //   // Para eventos de cierre de pestaña/navegador
  //   window.addEventListener("beforeunload", handleBeforeUnload);

  //   // Para navegación dentro de Next.js (más complejo)
  //   const handleRouteChange = () => {
  //     if (formData.title) {
  //       const confirmLeave = window.confirm(
  //         "Tienes cambios sin guardar. ¿Seguro que quieres salir?",
  //       );
  //       if (!confirmLeave) {
  //         throw "cancelRouteChange"; // Cancelar navegación
  //       }
  //     }
  //   };

  //   // Interceptar navegación (funciona con router de Next.js)
  //   window.addEventListener("popstate", handleRouteChange);

  //   return () => {
  //     window.removeEventListener("beforeunload", handleBeforeUnload);
  //     window.removeEventListener("popstate", handleRouteChange);
  //   };
  // }, [formData]);

  const handleClickOutside = (event: any) => {
    if (
      !product &&
      (formData.title ||
        formData.description ||
        formData.variants.length > 0 ||
        formData.imagesFormData?.length)
    ) {
      const confirmLeave = window.confirm(
        "⚠️ Tienes cambios sin guardar en el formulario.\n\n¿Estás seguro de que quieres salir? Los datos no guardados se perderán.",
      );

      if (!confirmLeave) {
        event.preventDefault();
        event.stopPropagation();
        return false;
      } else {
        setFormData(defaultProduct);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        onInteractOutside={handleClickOutside}
        onEscapeKeyDown={handleClickOutside}
        className='sm:max-w-[1000px] max-h-[90vh] overflow-auto flex flex-col bg-secondary border-primary p-0'
      >
        <DialogHeader className='p-2 pb-0'>
          <DialogTitle className='text-primary'>
            {product ? "✏️ Editar Producto" : "✨ Crear Nuevo Producto"}
          </DialogTitle>
          <DialogDescription className='text-muted-foreground'>
            {product
              ? "Actualiza la información del producto"
              : "Completa los datos del nuevo producto"}
          </DialogDescription>
        </DialogHeader>

        {/* Tabs de navegación */}
        <div className='flex border-b  gap-1'>
          <button
            type='button'
            onClick={() => setActiveTab("basic")}
            className={`px-2 py-2 text-sm font-medium transition-all rounded-t-lg ${
              activeTab === "basic"
                ? "bg-primary text-secondary"
                : "text-muted-foreground hover:text-primary"
            }`}
          >
            📋 Información Básica
          </button>
          <button
            type='button'
            onClick={() => setActiveTab("variants")}
            className={`px-2 py-2 text-sm font-medium transition-all rounded-t-lg ${
              activeTab === "variants"
                ? "bg-primary text-secondary"
                : "text-muted-foreground hover:text-primary"
            }`}
          >
            🎨 Variantes ({formData.variants.length})
          </button>
          <button
            type='button'
            onClick={() => setActiveTab("images")}
            className={`px-2 py-2 text-sm font-medium transition-all rounded-t-lg ${
              activeTab === "images"
                ? "bg-primary text-secondary"
                : "text-muted-foreground hover:text-primary"
            }`}
          >
            🖼️ Imágenes ({imagesUrl.length}/5)
          </button>
        </div>

        {alert.message && (
          <div
            id='error-alert-form'
            className={`mx-6 p-3 flex items-center gap-2 rounded-md ${
              alert.success ? "bg-green-500" : "bg-red-500"
            } text-white`}
          >
            <TriangleAlert size={20} />
            <p className='text-sm'>{alert.message}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className='flex-1 '>
          <div className=' space-y-6'>
            {/* TAB 1: INFORMACIÓN BÁSICA */}
            {activeTab === "basic" && (
              <div className='space-y-5'>
                <div className='space-y-2'>
                  <Label className=''>Nombre del producto *</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder='Ej: Remera Básica Algodón'
                    className='bg-background'
                    required
                  />
                </div>

                <div className='space-y-2'>
                  <Label className=''>Descripción *</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder='Descripción detallada del producto...'
                    className='bg-background resize-none'
                    rows={4}
                    required
                  />
                </div>

                <div className='space-y-2'>
                  <Label className=''>Categorías</Label>
                  <div className='flex gap-2'>
                    <select
                      onChange={(e) => {
                        if (e.target.value) {
                          addCategory(e.target.value);
                          e.target.value = "";
                        }
                      }}
                      className='flex-1 h-10 rounded-md px-3 py-2 text-sm border bg-background'
                      value=''
                    >
                      <option value=''>Selecciona una categoría...</option>
                      {categories
                        .filter(
                          (cat) =>
                            cat.isActive && !formData.categories.find((c) => c.id === cat.id),
                        )
                        .map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.title}
                          </option>
                        ))}
                    </select>
                  </div>
                  {formData.categories.length > 0 && (
                    <div className='flex flex-wrap gap-2 mt-2'>
                      {formData.categories.map((category, index) => (
                        <span
                          key={category.id}
                          className='inline-flex items-center gap-1 px-3 py-1.5 bg-primary/20 text-primary rounded-full text-sm'
                        >
                          {category.title}
                          <button
                            type='button'
                            onClick={() => removeCategory(index)}
                            className='hover:bg-red-500 rounded-full p-0.5 transition-colors'
                          >
                            <X className='h-3 w-3' />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className='flex items-center justify-between p-3 bg-primary/5 rounded-lg'>
                  <span className='text-sm font-medium'>Producto activo</span>
                  <div className='flex items-center gap-2'>
                    <span className='text-xs text-muted-foreground'>
                      {formData.isActive ? "Visible en tienda" : "Oculto"}
                    </span>
                    <button
                      type='button'
                      onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
                      className={`p-1.5 rounded-md transition-colors ${
                        formData.isActive ? "bg-green-500 text-white" : "bg-gray-500 text-white"
                      }`}
                    >
                      {formData.isActive ? (
                        <Eye className='h-4 w-4' />
                      ) : (
                        <EyeOff className='h-4 w-4' />
                      )}
                    </button>
                  </div>
                </div>

                <Button type='button' onClick={() => setActiveTab("variants")} className='w-full'>
                  Continuar con Variantes →
                </Button>
              </div>
            )}

            {/* TAB 2: VARIANTES */}
            {activeTab === "variants" && (
              <div className='space-y-6'>
                {/* GENERADOR RÁPIDO POR MATRIZ */}
                <Card className='p-4 bg-gradient-to-r from-primary/10 to-secondary border-primary/30'>
                  <div className='flex items-center gap-2 mb-3'>
                    <Zap className='h-5 w-5 text-yellow-500' />
                    <h3 className='font-semibold'>Generador Rápido por Matriz</h3>
                    <span className='text-xs text-muted-foreground'>
                      Crea todas las combinaciones de colores × talles
                    </span>
                  </div>

                  <div className='grid md:grid-cols-2 gap-4'>
                    {/* Colores */}
                    <div>
                      <Label className='text-sm mb-2 block'>Colores</Label>
                      <div className='flex flex-wrap gap-2 mb-2'>
                        {selectedColors.map((color) => (
                          <span
                            key={color.name}
                            className='inline-flex items-center gap-1 px-2 py-1 bg-primary/20 rounded-full text-xs'
                          >
                            <div
                              className='w-3 h-3 rounded-full'
                              style={{ backgroundColor: color.hex }}
                            />
                            {color.name}
                            <button
                              type='button'
                              onClick={() => removeColorFromMatrix(color.name)}
                              className='hover:text-red-500'
                            >
                              <X className='h-3 w-3' />
                            </button>
                          </span>
                        ))}
                      </div>
                      <select
                        onChange={(e) => {
                          if (e.target.value) {
                            const color = PREDEFINED_COLORS.find((c) => c.name === e.target.value);
                            if (color) addColorToMatrix(color);
                            e.target.value = "";
                          }
                        }}
                        className='w-full h-8 text-sm border rounded px-2 bg-background'
                        value=''
                      >
                        <option value=''>+ Agregar color</option>
                        {PREDEFINED_COLORS.filter(
                          (c) => !selectedColors.find((sc) => sc.name === c.name),
                        ).map((c) => (
                          <option key={c.name} value={c.name}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Talles con selector personalizado */}
                    <div>
                      <Label className='text-sm mb-2 block'>Talles</Label>

                      {/* Lista de talles seleccionados */}
                      <div className='flex flex-wrap gap-1 mb-2'>
                        {selectedSizes.map((size) => (
                          <span
                            key={size}
                            className='inline-flex items-center gap-1 px-2 py-1 bg-primary/20 rounded-full text-xs'
                          >
                            {size}
                            <button type='button' onClick={() => removeSizeFromMatrix(size)}>
                              <X className='h-3 w-3' />
                            </button>
                          </span>
                        ))}
                      </div>

                      {/* Selector con opción de talle personalizado */}
                      <div className='flex gap-2'>
                        <select
                          onChange={(e) => {
                            if (e.target.value) {
                              addSizeToMatrix(e.target.value);
                              e.target.value = "";
                            }
                          }}
                          className='flex-1 h-8 text-sm border rounded px-2 bg-background'
                          value=''
                        >
                          <option value=''>Seleccionar talle</option>
                          {predefinedSizes
                            .filter((s) => !selectedSizes.includes(s))
                            .map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                        </select>

                        {/* Input para talle personalizado */}
                        <div className='flex gap-1'>
                          <Input
                            value={customSizeInput}
                            onChange={(e) => setCustomSizeInput(e.target.value)}
                            placeholder='Custom'
                            className='w-20 h-8 text-sm'
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                addCustomSize();
                              }
                            }}
                          />
                          <Button
                            type='button'
                            size='sm'
                            variant='outline'
                            onClick={addCustomSize}
                            className='h-8 px-2'
                            title='Agregar talle personalizado'
                          >
                            <PlusCircle className='h-3 w-3' />
                          </Button>
                        </div>
                      </div>

                      {/* Lista de talles personalizados disponibles */}
                      {predefinedSizes.filter((s) => !DEFAULT_PREDEFINED_SIZES.includes(s)).length >
                        0 && (
                        <div className='mt-2 pt-2 border-t'>
                          <p className='text-xs text-muted-foreground mb-1'>
                            Talles personalizados:
                          </p>
                          <div className='flex flex-wrap gap-1'>
                            {predefinedSizes
                              .filter((s) => !DEFAULT_PREDEFINED_SIZES.includes(s))
                              .map((size) => (
                                <Badge
                                  key={size}
                                  variant='outline'
                                  className='text-xs cursor-pointer hover:bg-primary/20'
                                  onClick={() => addSizeToMatrix(size)}
                                >
                                  {size}
                                  <button
                                    type='button'
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      removeCustomSize(size);
                                    }}
                                    className='ml-1 hover:text-red-500'
                                  >
                                    <X className='h-2 w-2' />
                                  </button>
                                </Badge>
                              ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className='flex gap-2 mt-4'>
                    <Button
                      type='button'
                      size='sm'
                      onClick={generateMatrixVariants}
                      className='flex-1'
                    >
                      <Grid3x3 className='h-4 w-4 mr-2' />
                      Generar {selectedColors.length * selectedSizes.length} variantes
                    </Button>
                    <Button
                      type='button'
                      size='sm'
                      variant='outline'
                      onClick={() => {
                        setSelectedColors([]);
                        setSelectedSizes([]);
                      }}
                    >
                      Limpiar
                    </Button>
                  </div>
                </Card>

                {/* ACCIONES EN MASA */}
                {formData.variants.length > 0 && (
                  <div className='flex gap-2 p-3 bg-background/50 rounded-lg'>
                    <div className='flex-1'>
                      <Label className='text-xs'>Precio base</Label>
                      <Input
                        type='number'
                        placeholder='Precio para todas'
                        onChange={(e) => bulkUpdatePrice(Number(e.target.value))}
                        className='h-8 text-sm'
                      />
                    </div>
                    <div className='flex-1'>
                      <Label className='text-xs'>Stock base</Label>
                      <Input
                        type='number'
                        placeholder='Stock para todas'
                        onChange={(e) => bulkUpdateStock(Number(e.target.value))}
                        className='h-8 text-sm'
                      />
                    </div>
                  </div>
                )}

                {/* LISTA DE VARIANTES */}
                <div>
                  <div className='flex items-center justify-between mb-3'>
                    <Label className='font-semibold'>
                      <Layers className='h-4 w-4 inline mr-1' />
                      Variantes ({formData.variants.length})
                    </Label>
                    <div className='flex gap-2'>
                      <Button type='button' size='sm' variant='outline' onClick={addVariant}>
                        <Plus className='h-3 w-3 mr-1' />
                        Individual
                      </Button>
                      <button
                        type='button'
                        onClick={() => setViewMode(viewMode === "list" ? "grid" : "list")}
                        className='p-1.5 rounded-md hover:bg-accent'
                      >
                        {viewMode === "list" ? (
                          <Grid3x3 className='h-4 w-4' />
                        ) : (
                          <Layers className='h-4 w-4' />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Resumen */}
                  {formData.variants.length > 0 && (
                    <div className='grid grid-cols-4 gap-2 p-3 bg-primary/5 rounded-lg mb-3 text-xs'>
                      <div>
                        <span className='text-muted-foreground'>Total:</span>{" "}
                        <b>{formData.variants.length}</b>
                      </div>
                      <div>
                        <span className='text-muted-foreground'>Colores:</span>{" "}
                        <b>{getUniqueColors().length}</b>
                      </div>
                      <div>
                        <span className='text-muted-foreground'>Talles:</span>{" "}
                        <b>{getUniqueSizes().length}</b>
                      </div>
                      <div>
                        <span className='text-muted-foreground'>Stock total:</span>{" "}
                        <b>{totalStock}</b>
                      </div>
                    </div>
                  )}

                  {/* Listado */}
                  <div className='space-y-2 max-h-[400px] overflow-y-auto'>
                    {formData.variants.map((variant, idx) => (
                      <Card key={variant.id} className='p-3 bg-primary/10'>
                        <div className='flex items-center justify-between mb-2'>
                          <div className='flex items-center gap-2'>
                            <div
                              className='w-5 h-5 rounded-full border'
                              style={{ backgroundColor: variant.colorHex }}
                            />
                            <span className='text-sm font-medium'>
                              {variant.colorName || "Sin color"}
                            </span>
                            <Badge variant='outline' className='text-xs'>
                              Talle: {variant.size || "?"}
                            </Badge>
                          </div>
                          <div className='flex gap-1'>
                            <Button
                              type='button'
                              size='icon'
                              variant='ghost'
                              className='h-7 w-7'
                              onClick={() => toggleColorPicker(idx)}
                            >
                              <Palette className='h-3.5 w-3.5' />
                            </Button>
                            <Button
                              type='button'
                              size='icon'
                              variant='ghost'
                              className='h-7 w-7'
                              onClick={() => {
                                const newVariant = { ...variant, id: crypto.randomUUID() };
                                setFormData({
                                  ...formData,
                                  variants: [...formData.variants, newVariant],
                                });
                              }}
                            >
                              <Copy className='h-3.5 w-3.5' />
                            </Button>
                            <Button
                              type='button'
                              size='icon'
                              variant='ghost'
                              className='h-7 w-7 text-red-500'
                              onClick={() => removeVariant(idx)}
                            >
                              <Trash2 className='h-3.5 w-3.5' />
                            </Button>
                          </div>
                        </div>

                        <div className='grid grid-cols-4 gap-2'>
                          {/* Selector de talle con opción personalizada */}
                          <div className='relative'>
                            <select
                              value={variant.size}
                              onChange={(e) => {
                                const newSize = e.target.value;
                                if (newSize === "__custom__") {
                                  // Mostrar prompt para talle personalizado
                                  const customSize = prompt("Ingresa el talle personalizado:");
                                  if (customSize && customSize.trim()) {
                                    const upperSize = customSize.trim().toUpperCase();
                                    if (!predefinedSizes.includes(upperSize)) {
                                      setPredefinedSizes([...predefinedSizes, upperSize]);
                                    }
                                    updateVariant(idx, "size", upperSize);
                                  }
                                } else {
                                  updateVariant(idx, "size", newSize);
                                }
                              }}
                              className='h-8 text-sm border rounded px-2 bg-background w-full'
                            >
                              <option value=''>Seleccionar</option>
                              {predefinedSizes.map((s) => (
                                <option key={s} value={s}>
                                  {s}
                                </option>
                              ))}
                              <option value='__custom__'>✨ + Agregar nuevo...</option>
                            </select>
                          </div>

                          <Input
                            type='number'
                            placeholder='Precio'
                            value={variant.price || ""}
                            onChange={(e) => updateVariant(idx, "price", Number(e.target.value))}
                            className='h-8 text-sm'
                          />
                          <Input
                            type='number'
                            placeholder='Oferta'
                            value={variant.priceOffer || ""}
                            onChange={(e) =>
                              updateVariant(idx, "priceOffer", Number(e.target.value))
                            }
                            className='h-8 text-sm'
                          />
                          <Input
                            type='number'
                            placeholder='Stock'
                            value={variant.stock || ""}
                            onChange={(e) => updateVariant(idx, "stock", Number(e.target.value))}
                            className='h-8 text-sm'
                          />
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>

                <div className='flex gap-2'>
                  <Button
                    type='button'
                    variant='outline'
                    onClick={() => setActiveTab("basic")}
                    className='flex-1'
                  >
                    ← Atrás
                  </Button>
                  <Button type='button' onClick={() => setActiveTab("images")} className='flex-1'>
                    Continuar con Imágenes →
                  </Button>
                </div>
              </div>
            )}

            {/* TAB 3: IMÁGENES */}
            {activeTab === "images" && (
              <div className='space-y-4'>
                <div
                  className='border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors border-primary/50 hover:border-primary'
                  onClick={() => document.getElementById("imageFile")?.click()}
                >
                  <input
                    id='imageFile'
                    type='file'
                    accept='image/*'
                    multiple
                    onChange={handleImageFiles}
                    className='hidden'
                  />
                  <Upload className='h-10 w-10 mx-auto text-muted-foreground mb-2' />
                  <p className='text-sm font-medium'>Subir imágenes</p>
                  <p className='text-xs text-muted-foreground'>Máximo 5 imágenes</p>
                </div>

                {imagesUrl.length > 0 && (
                  <div className='grid grid-cols-3 gap-3'>
                    {imagesUrl.map((img, index) => (
                      <div
                        key={index}
                        className='relative aspect-square rounded-lg overflow-hidden border'
                      >
                        <Image
                          src={img}
                          alt={`Imagen ${index + 1}`}
                          width={200}
                          height={200}
                          className='w-full h-full object-cover'
                        />
                        <Button
                          type='button'
                          size='icon'
                          variant='danger'
                          className='absolute top-1 right-1 h-6 w-6'
                          onClick={() => removeImage(index)}
                        >
                          <X className='h-3 w-3' />
                        </Button>
                        {index === 0 && (
                          <Badge className='absolute bottom-1 left-1 text-[10px]'>Principal</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                <div className='flex gap-2 pt-4'>
                  <Button
                    type='button'
                    variant='outline'
                    onClick={() => setActiveTab("variants")}
                    className='flex-1'
                  >
                    ← Atrás
                  </Button>
                  <Button type='submit' disabled={isLoading} className='flex-1 gap-2'>
                    <Save className='h-4 w-4' />
                    {isLoading ? "Guardando..." : product ? "Actualizar" : "Crear Producto"}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </form>

        {/* Color Picker Modal */}
        {showColorPicker !== null && (
          <div
            className='fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md'
            onClick={() => setShowColorPicker(null)}
          >
            <div className='bg-primary rounded-lg p-4 w-80' onClick={(e) => e.stopPropagation()}>
              <h4 className='font-medium mb-3'>Seleccionar Color</h4>
              <div className='grid grid-cols-6 gap-2 mb-3'>
                {PREDEFINED_COLORS.map((color, idx) => (
                  <button
                    key={idx}
                    type='button'
                    onClick={() => selectPredefinedColor(showColorPicker, color)}
                    className='w-8 h-8 rounded-full border'
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  />
                ))}
              </div>
              <div className='flex gap-2 items-center'>
                <Input
                  value={colorNameInput}
                  onChange={(e) => setColorNameInput(e.target.value)}
                  placeholder='Nombre'
                  className=' w-24 text-black'
                />
                <Input
                  value={colorHexInput}
                  onChange={(e) => handleHexInputChange(e.target.value)}
                  placeholder='#000000'
                  className='w-2'
                />
                <Button
                  variant='secondary'
                  type='button'
                  onClick={() => applyCustomColor(showColorPicker)}
                  size='sm'
                >
                  OK
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
