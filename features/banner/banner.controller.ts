import { BannerType } from "@/types/banner";
import {
  createBannerService,
  deleteBannerService,
  getBannersService,
  getBannerByIdService,
  toggleBannerStatusService,
  updateBannerService,
} from "./banner.service";
import { deleteImages, uploadImages } from "@/lib/cloudinary";
import isResponseUpload from "@/utils/isResponseUpload";
import { ResponseUpload } from "@/types/product";

export async function getBannersController(req: Request) {
  try {
    const isActive = req.headers.get("referer")?.includes("/admin/dashboard/banner")
      ? undefined
      : true;

    const banners = await getBannersService(isActive);

    return { data: banners, success: true };
  } catch (e) {
    const error = e as Error;
    throw new Error(error.message);
  }
}

export async function createBannerController(formData: FormData) {
  let imgFilter: ResponseUpload[] = [];

  try {
    const formDataImage = formData.get("image") as File;

    if (!formDataImage) {
      throw new Error("Se requiere una imagen");
    }

    const optionUpload = {
      folder: "tienda-alli-banners",
      transformation: [
        {
          width: 1920,
          height: 900,
          crop: "fill",
          gravity: "auto",
        },
      ],
    };

    const generateImg = await uploadImages(formDataImage, optionUpload);
    imgFilter = generateImg.filter(isResponseUpload);

    const data: Omit<BannerType, "id" | "createdAt" | "updatedAt"> = {
      title: formData.get("title")?.toString() || "",
      subtitle: formData.get("subtitle")?.toString() || "",
      imageUrl: generateImg.length ? imgFilter[0].url : "",
      imagePublicId: generateImg.length ? imgFilter[0].public_id : "",
      order: Number(formData.get("order")) || 0,
      isActive: formData.get("isActive") === "true",
    };

    if (!data.title || !data.imageUrl || !data.imagePublicId) {
      throw new Error("Es necesario llenar todos los campos requeridos.");
    }

    const banner = await createBannerService(data);

    return { data: banner, success: true };
  } catch (e) {
    const error = e as Error;

    if (imgFilter.length) {
      const idsImage = imgFilter.map((img) => img.public_id);
      await deleteImages(idsImage);
    }

    console.error("createBannerController:", error);
    throw new Error(error.message);
  }
}

export async function updateBannerController(id: string, formData: FormData) {
  let imgFilter: ResponseUpload[] = [];

  try {
    const formDataImage = formData.get("image") as File;

    const option = {
      attributes: ["id", "imageUrl", "imagePublicId"],
    };

    const banner = await getBannerByIdService(id, option);

    if (!banner || !banner.imagePublicId) {
      throw new Error("Este banner no existe");
    }

    let generateImg: any[] = [];

    if (formDataImage) {
      const optionUpload = {
        folder: "tienda-alli-banners",
      };

      generateImg = await uploadImages(formDataImage, optionUpload);
      imgFilter = generateImg.filter(isResponseUpload);
    }

    const data: Omit<BannerType, "id" | "createdAt" | "updatedAt"> = {
      title: formData.get("title")?.toString() || "",
      subtitle: formData.get("subtitle")?.toString() || "",
      imageUrl: generateImg.length ? imgFilter[0].url : banner.imageUrl,
      imagePublicId: generateImg.length ? imgFilter[0].public_id : banner.imagePublicId,
      order: Number(formData.get("order")) || 0,
      isActive: formData.get("isActive") === "true",
    };

    if (!data.title || !data.imageUrl || !data.imagePublicId) {
      throw new Error("Es necesario llenar todos los campos requeridos.");
    }

    const updated = await updateBannerService(id, data);

    if (updated > 0 && formDataImage) {
      await deleteImages([banner.imagePublicId]);
    }

    return {
      data: { update: updated, banner: data },
      success: true,
    };
  } catch (e) {
    const error = e as Error;

    if (imgFilter.length) {
      const idsImage = imgFilter.map((img) => img.public_id);
      await deleteImages(idsImage);
    }

    console.error("updateBannerController:", error);
    throw new Error(error.message);
  }
}

export async function deleteBannerController(id: string) {
  try {
    const option = {
      attributes: ["id", "imagePublicId"],
    };

    const banner = await getBannerByIdService(id, option);

    if (!banner?.imagePublicId) {
      throw new Error("Este banner no existe.");
    }

    const deleted = await deleteBannerService(id);

    if (deleted) {
      await deleteImages([banner.imagePublicId]);
    }

    return { data: { delete: deleted }, success: true };
  } catch (e) {
    const error = e as Error;
    throw new Error(error.message);
  }
}

export async function toggleBannerStatusController(id: string, isActive: boolean) {
  try {
    const response = await toggleBannerStatusService(id, isActive);

    return { data: response, success: true };
  } catch (e) {
    const error = e as Error;
    console.error("toggleBannerStatusController:", error);
    throw new Error(error.message);
  }
}
