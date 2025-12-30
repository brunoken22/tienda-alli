"use client";

import type React from "react";
import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus, Upload, X } from "lucide-react";
import type { CategoryType } from "@/types/category";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  publishedCategory,
} from "@/lib/category";
import { ProductCardSkeletonGrid } from "@/components/ui/EsqueletonCardSwiper";
import TemplateCategory from "@/components/TemplateCategory";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Image from "next/image";

export default function CategoriasPage() {
  const [categories, setCategories] = useState<{ isLoading: boolean; data: CategoryType[] }>({
    isLoading: true,
    data: [],
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<CategoryType | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
    imageId: "",
    featured: false,
    isActive: true,
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    const data = await getCategories();
    setCategories({ isLoading: false, data });
  };

  const handleOpenDialog = (category?: CategoryType) => {
    if (category) {
      setSelectedCategory(category);
      setFormData({
        title: category.title,
        description: category.description,
        featured: category.featured,
        image: category.image,
        imageId: category.imageId,
        isActive: category.isActive,
      });
      setImagePreview(category.image);
    } else {
      setSelectedCategory(null);
      setFormData({
        title: "",
        description: "",
        featured: false,
        image: "",
        imageId: "",
        isActive: true,
      });
      setImagePreview("");
    }
    setImageFile(null);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedCategory(null);
    setImageFile(null);
    setImagePreview("");
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (selectedCategory) {
        // Update existing category
        await updateCategory(selectedCategory.id, formData, imageFile || undefined);
      } else {
        // Create new category
        if (!imageFile) {
          alert("Por favor selecciona una imagen");
          setIsLoading(false);
          return;
        }
        await createCategory(formData, imageFile);
      }

      await loadCategories();
      handleCloseDialog();
    } catch (error) {
      console.error("Error saving category:", error);
      alert("Error al guardar la categoría");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = (category: CategoryType) => {
    setCategoryToDelete(category);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!categoryToDelete) return;

    setIsLoading(true);
    try {
      await deleteCategory(categoryToDelete.id);
      await loadCategories();
      setIsDeleteDialogOpen(false);
      setCategoryToDelete(null);
    } catch (error) {
      console.error("Error deleting category:", error);
      alert("Error al eliminar la categoría");
    } finally {
      setIsLoading(false);
    }
  };

  const handleActiveCategory = async (
    active: boolean,
    id: string,
    setIsActive: Dispatch<SetStateAction<boolean>>
  ) => {
    if (
      active === false &&
      confirm(
        "¿Desactivar esta categoría? Los productos relacionados dejarán de aparecer en la tienda."
      ) === false
    ) {
      return;
    }
    setIsActive((prev) => !prev);
    const updatePublished = await publishedCategory(id, active);
    if (updatePublished.success) {
      toast.success(active ? "¡Se activo la categoria!" : "¡Se desactivo la categoria!", {
        position: "bottom-right",
        autoClose: 3000,
      });
      return;
    }
    setIsActive((prev) => !prev);
    toast.error(updatePublished.message || "¡Algo salio mal!", {
      position: "bottom-right",
      autoClose: 3000,
    });
  };
  return (
    <div className='container mx-auto py-8 px-4'>
      <div className='flex max-sm:flex-col max-sm:text-center max-md:gap-4 items-center justify-between mb-8'>
        <div>
          <h1 className='text-3xl font-bold text-foreground'>Gestión de Categorías</h1>
          <p className='text-muted-foreground mt-1'>
            Administra las categorías de productos de tu tienda
          </p>
        </div>
        <Button onClick={() => handleOpenDialog()} size='lg'>
          <Plus className='h-5 w-5 mr-2' />
          Nueva Categoría
        </Button>
      </div>

      {/* Categories Grid */}

      {categories.isLoading ? (
        <ProductCardSkeletonGrid />
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {categories.data.map((category) => (
            <TemplateCategory
              key={category.id}
              category={category}
              handleDeleteClick={handleDeleteClick}
              handleOpenDialog={handleOpenDialog}
              handleActiveCategory={handleActiveCategory}
            />
          ))}
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
        <DialogContent className='sm:max-w-[700px] max-h-[90vh] overflow-y-auto bg-secondary border-border'>
          <DialogHeader>
            <DialogTitle>{selectedCategory ? "Editar Categoría" : "Nueva Categoría"}</DialogTitle>
            <DialogDescription>
              {selectedCategory
                ? "Actualiza la información de la categoría"
                : "Completa los datos de la nueva categoría"}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit}>
            <div className='grid gap-6 py-4'>
              {/* Title */}
              <div className='space-y-2'>
                <Label htmlFor='title'>
                  Título <span className='text-red-500'>*</span>
                </Label>
                <Input
                  id='title'
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder='Ej: Ropa Deportiva'
                  required
                />
              </div>

              {/* Description */}
              <div className='space-y-2'>
                <Label htmlFor='description'>
                  Descripción <span className='text-red-500'>*</span>
                </Label>
                <Textarea
                  id='description'
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder='Describe la categoría...'
                  rows={3}
                  required
                />
              </div>

              {/* Image Upload */}
              <div className='space-y-2'>
                <Label>
                  Imagen <span className='text-red-500'>*</span>
                </Label>

                {imagePreview ? (
                  <div className='relative w-full h-48 rounded-lg overflow-hidden border-2 border-primary'>
                    <Image
                      src={imagePreview || "/tienda-alli-webp"}
                      alt='Preview'
                      title='Preview'
                      width={200}
                      height={200}
                      className='w-full h-full object-cover'
                    />
                    <Button
                      type='button'
                      size='icon'
                      variant='danger'
                      className='absolute top-2 right-2'
                      onClick={removeImage}
                    >
                      <X className='h-4 w-4' />
                    </Button>
                  </div>
                ) : (
                  <div
                    className='border-2 border-dashed border-primary/50 rounded-lg p-8 text-center cursor-pointer transition-colors hover:border-primary'
                    onClick={() => document.getElementById("categoryImage")?.click()}
                  >
                    <input
                      id='categoryImage'
                      type='file'
                      accept='image/*'
                      onChange={handleImageChange}
                      className='hidden'
                    />
                    <Upload className='h-12 w-12 mx-auto text-muted-foreground mb-3' />
                    <p className='font-medium'>Haz clic para seleccionar una imagen</p>
                    <p className='text-sm text-muted-foreground mt-1'>JPG, PNG, WebP hasta 5MB</p>
                  </div>
                )}
              </div>

              {/* Switches */}
              <div className='space-y-4'>
                <div className='flex items-center justify-between rounded-lg border border-primary p-4'>
                  <div className='space-y-0.5'>
                    <Label htmlFor='featured' className='text-base'>
                      Categoría Destacada
                    </Label>
                    <p className='text-sm text-muted-foreground'>
                      Aparecerá en la sección destacada de la tienda
                    </p>
                  </div>
                  <Switch
                    id='featured'
                    checked={formData.featured}
                    onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
                  />
                </div>

                <div className='flex items-center justify-between rounded-lg border border-primary p-4'>
                  <div className='space-y-0.5'>
                    <Label htmlFor='active' className='text-base'>
                      Categoría Activa
                    </Label>
                    <p className='text-sm text-muted-foreground'>
                      Solo las categorías activas se muestran en la tienda
                    </p>
                  </div>
                  <Switch
                    id='active'
                    checked={formData.isActive}
                    onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                  />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button type='button' variant='outline' onClick={handleCloseDialog}>
                Cancelar
              </Button>
              <Button variant='primary' type='submit' disabled={isLoading}>
                {isLoading ? "Guardando..." : selectedCategory ? "Actualizar" : "Agregar"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center ${
          isDeleteDialogOpen ? "visible" : "invisible"
        }`}
      >
        {/* Backdrop */}
        <div
          className={`fixed inset-0 bg-black/50 transition-opacity duration-300 ${
            isDeleteDialogOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setIsDeleteDialogOpen(false)}
        />

        {/* Dialog */}
        <div
          className={`relative z-50 w-full max-w-lg rounded-lg bg-white p-6 shadow-lg transition-all duration-300 ${
            isDeleteDialogOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"
          }`}
        >
          {/* Header */}
          <div className='mb-4'>
            <h2 className='text-lg font-semibold text-gray-900'>¿Estás seguro?</h2>
            <p className='mt-2 text-sm text-gray-600'>
              Esta acción eliminará permanentemente la categoría "{categoryToDelete?.title}". Los
              productos asociados no se eliminarán, pero perderán esta categoría.
            </p>
          </div>

          {/* Footer */}
          <div className='mt-6 flex justify-end space-x-3'>
            <button
              type='button'
              onClick={() => setIsDeleteDialogOpen(false)}
              className='rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2'
            >
              Cancelar
            </button>
            <button
              type='button'
              onClick={handleConfirmDelete}
              disabled={isLoading}
              className='rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {isLoading ? (
                <span className='flex items-center'>
                  <svg className='mr-2 h-4 w-4 animate-spin' fill='none' viewBox='0 0 24 24'>
                    <circle
                      className='opacity-25'
                      cx='12'
                      cy='12'
                      r='10'
                      stroke='currentColor'
                      strokeWidth='4'
                    />
                    <path
                      className='opacity-75'
                      fill='currentColor'
                      d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z'
                    />
                  </svg>
                  Eliminando...
                </span>
              ) : (
                "Eliminar"
              )}
            </button>
          </div>

          {/* Close button */}
          <button
            type='button'
            onClick={() => setIsDeleteDialogOpen(false)}
            className='absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2'
          >
            <svg className='h-4 w-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M6 18L18 6M6 6l12 12'
              />
            </svg>
            <span className='sr-only'>Cerrar</span>
          </button>
        </div>
      </div>
      <ToastContainer
        position='bottom-right'
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme='light'
      />
    </div>
  );
}
