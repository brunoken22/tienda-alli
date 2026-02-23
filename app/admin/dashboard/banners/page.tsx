"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { ImageIcon, Plus, Upload, X } from "lucide-react";
import Image from "next/image";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import type { BannerType } from "@/types/banner";
import { getBanners, createBanner, updateBanner, deleteBanner, publishBanner } from "@/lib/banner";

export default function BannersPage() {
  const [banners, setBanners] = useState<BannerType[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState<BannerType | null>(null);

  const [imagePreview, setImagePreview] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    order: 1,
    isActive: true,
  });

  useEffect(() => {
    loadBanners();
  }, []);

  const loadBanners = async () => {
    try {
      setLoadingData(true);
      const res = await getBanners();
      if (res.success) {
        setBanners(res.data);
      } else {
        toast.error("Error cargando banners");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error cargando banners");
    } finally {
      setLoadingData(false);
    }
  };

  const openDialog = (banner?: BannerType) => {
    if (banner) {
      setSelectedBanner(banner);
      setFormData({
        title: banner.title,
        subtitle: banner.subtitle || "",
        order: banner.order,
        isActive: banner.isActive,
      });
      setImagePreview(banner.imageUrl);
    } else {
      setSelectedBanner(null);
      setFormData({
        title: "",
        subtitle: "",
        order: banners.length + 1,
        isActive: true,
      });
      setImagePreview("");
    }

    setImageFile(null);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setSelectedBanner(null);
    setImageFile(null);
    setImagePreview("");
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const data = new FormData();

      data.append("title", formData.title);
      data.append("subtitle", formData.subtitle);
      data.append("order", String(formData.order));
      data.append("isActive", String(formData.isActive));

      if (imageFile) {
        data.append("image", imageFile);
      }

      let res;

      if (selectedBanner) {
        res = await updateBanner(selectedBanner.id, data);
        toast.success("Banner actualizado");
      } else {
        if (!imageFile) {
          toast.error("Selecciona una imagen");
          setIsSaving(false);
          return;
        }

        res = await createBanner(data);
        toast.success("Banner creado");
      }

      if (!res.success) {
        toast.error("Error al guardar");
        return;
      }

      await loadBanners();
      closeDialog();
    } catch (error) {
      console.error(error);
      toast.error("Error al guardar");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar banner?")) return;

    try {
      const res = await deleteBanner(id);

      if (res.success) {
        toast.success("Banner eliminado");
        loadBanners();
      } else {
        toast.error("Error al eliminar");
      }
    } catch (error) {
      toast.error("Error al eliminar");
    }
  };

  const toggleActive = async (banner: BannerType) => {
    try {
      const res = await publishBanner(banner.id, !banner.isActive);

      if (res.success) {
        toast.success(!banner.isActive ? "Activado" : "Desactivado");
        loadBanners();
      } else {
        toast.error("Error");
      }
    } catch (error) {
      toast.error("Error");
    }
  };

  return (
    <div className='container mx-auto py-8 px-4'>
      <div className='flex max-sm:flex-col max-sm:text-center max-md:gap-4 items-center justify-between mb-8'>
        <div>
          <h1 className='text-3xl font-bold'>Gestión de Banners</h1>
          <p className='text-muted-foreground mt-1'>Administra los banners de tu tienda</p>
        </div>
        <Button onClick={() => openDialog()}>
          <Plus className='w-4 h-4 mr-2' />
          Nuevo Banner
        </Button>
      </div>

      {loadingData ? (
        <p>Cargando...</p>
      ) : banners.length === 0 ? (
        <div className='flex flex-col items-center justify-center py-16 text-center border rounded-xl'>
          <div className='bg-muted p-6 rounded-full mb-4'>
            <ImageIcon className='w-10 h-10 text-muted-foreground' />
          </div>

          <h3 className='text-lg font-semibold mb-2'>No hay banners creados</h3>

          <p className='text-sm text-muted-foreground mb-6'>
            Crea tu primer banner para que aparezca en la página principal.
          </p>

          <Button onClick={() => openDialog()}>
            <Plus className='w-4 h-4 mr-2' />
            Crear Banner
          </Button>
        </div>
      ) : (
        <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {banners
            .sort((a, b) => a.order - b.order)
            .map((banner) => (
              <div key={banner.id} className='border rounded-xl overflow-hidden shadow-sm'>
                <div className='relative h-48'>
                  <Image src={banner.imageUrl} alt={banner.title} fill className='object-cover' />
                </div>

                <div className='p-4 space-y-2'>
                  <h3 className='font-semibold'>{banner.title}</h3>
                  <p className='text-sm text-muted-foreground'>{banner.subtitle}</p>

                  <div className='flex justify-between items-center pt-2'>
                    <Switch
                      checked={banner.isActive}
                      onCheckedChange={() => toggleActive(banner)}
                    />

                    <div className='flex gap-2'>
                      <Button size='sm' onClick={() => openDialog(banner)}>
                        Editar
                      </Button>

                      <Button size='sm' variant='danger' onClick={() => handleDelete(banner.id)}>
                        Eliminar
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={closeDialog}>
        <DialogContent className='sm:max-w-[600px] bg-white'>
          <DialogHeader>
            <DialogTitle>{selectedBanner ? "Editar Banner" : "Nuevo Banner"}</DialogTitle>
            <DialogDescription>Configura el banner principal</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className='space-y-4'>
            <Input
              placeholder='Título'
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />

            <Textarea
              placeholder='Subtítulo'
              value={formData.subtitle}
              onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
            />
            <Input
              type='number'
              min={1}
              placeholder='Orden'
              value={formData.order}
              onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
              required
            />

            {imagePreview ? (
              <div className='relative h-40'>
                <Image src={imagePreview} alt='Preview' fill className='object-cover rounded-lg' />
                <Button
                  type='button'
                  size='icon'
                  variant='danger'
                  className='absolute top-2 right-2'
                  onClick={() => {
                    setImageFile(null);
                    setImagePreview("");
                  }}
                >
                  <X className='w-4 h-4' />
                </Button>
              </div>
            ) : (
              <div
                className='border-2 border-dashed rounded-lg p-6 text-center cursor-pointer'
                onClick={() => document.getElementById("bannerImage")?.click()}
              >
                <input
                  id='bannerImage'
                  type='file'
                  accept='image/*'
                  onChange={handleImageChange}
                  className='hidden'
                />
                <Upload className='mx-auto mb-2' />
                <p>Haz clic para subir imagen</p>
              </div>
            )}

            <DialogFooter>
              <Button type='submit' disabled={isSaving}>
                {isSaving ? "Guardando..." : "Guardar"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

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
