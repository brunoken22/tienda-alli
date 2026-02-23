import { api } from "@/lib/api";

/* ============================
   GET
============================ */

export const getBanners = async () => {
  const response = await api.get("/admin/banner");
  return response;
};

/* ============================
   CREATE
   (envía FormData)
============================ */

export const createBanner = async (formData: FormData) => {
  const response = await api.post("/admin/banner", formData);
  return response;
};

/* ============================
   UPDATE
   (envía FormData)
============================ */

export const updateBanner = async (id: string, formData: FormData) => {
  const response = await api.patch(`/admin/banner/${id}`, formData);
  return response;
};

/* ============================
   DELETE
============================ */

export const deleteBanner = async (id: string) => {
  const response = await api.delete(`/admin/banner/${id}`);
  return response;
};

/* ============================
   TOGGLE ACTIVE
============================ */

export const publishBanner = async (id: string, published: boolean) => {
  const response = await api.patch(`/admin/banner/${id}/published`, {
    published,
  });

  return response;
};
