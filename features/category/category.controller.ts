import { CategoryType } from "@/types/category";
import {
  createCategoryService,
  deleteCategoryService,
  getCategoriesService,
  getCategoryIdService,
  publishedCategoryService,
  updateCategoryService,
} from "./category.service";
import { deleteImages, uploadImages } from "@/lib/cloudinary";
import isResponseUpload from "@/utils/isResponseUpload";
import { ResponseUpload } from "@/types/product";

export async function getCategoriesController(req: Request) {
  try {
    const isActive = req.headers.get("referer")?.includes("/admin/dashboard/category")
      ? undefined
      : true;
    const categoriesController = await getCategoriesService(isActive);
    return { data: categoriesController, success: true };
  } catch (e) {
    const error = e as Error;
    throw new Error(error.message);
  }
}

export async function createCategoryController(formData: FormData) {
  let imgFilter: ResponseUpload[] = [];
  try {
    const formDataImages = formData.get("image") as File;
    if (!formDataImages) {
      throw new Error("Se requieren imagenes");
    }
    const optionUpload = {
      folder: "tienda-alli-ecommerce-categories",
    };
    const generateImg = await uploadImages(formDataImages, optionUpload);
    imgFilter = generateImg.filter(isResponseUpload);

    const data: Omit<CategoryType, "id" | "createdAt" | "updatedAt"> = {
      title: formData.get("title")?.toString() || "",
      description: formData.get("description")?.toString() || "",
      image: generateImg.length ? imgFilter[0].url : "",
      imageId: generateImg.length ? imgFilter[0].public_id : "",
      featured: formData.get("featured") === "true" ? true : false,
      isActive: formData.get("isActive") === "true" ? true : false,
    };
    if (
      !data.title ||
      !data.description ||
      !data.image ||
      !data.imageId ||
      typeof data.featured !== "boolean" ||
      typeof data.isActive !== "boolean"
    ) {
      throw new Error("Es necesario llenaron todo los campos.");
    }
    const categoriesController = await createCategoryService(data);
    return { data: categoriesController, success: true };
  } catch (e) {
    const error = e as Error;
    if (imgFilter.length) {
      const idsImage = imgFilter.map((img) => img.public_id);
      await deleteImages(idsImage);
    }
    console.error("createCategoryController: ", error);
    throw new Error(error.message);
  }
}

export async function updateCategoryController(id: string, formData: FormData) {
  let imgFilter: ResponseUpload[] = [];
  try {
    const formDataImages = formData.get("image") as File;

    const option = {
      attributes: ["id", "image", "imageId"],
    };
    const category = await getCategoryIdService(id, option);
    if (!category || !category.imageId || !category.id) {
      throw new Error("Esta categoria no existe");
    }

    let generateImg = [];
    if (formDataImages) {
      const optionUpload = {
        folder: "tienda-alli-ecommerce-categories",
      };
      generateImg = await uploadImages(formDataImages, optionUpload);
      imgFilter = generateImg.filter(isResponseUpload);
    }

    const data: Omit<CategoryType, "id" | "createdAt" | "updatedAt"> = {
      title: formData.get("title")?.toString() || "",
      description: formData.get("description")?.toString() || "",
      image: generateImg.length ? imgFilter[0].url : category.image,
      imageId: generateImg.length ? imgFilter[0].public_id : category.imageId,
      featured: formData.get("featured") === "true" ? true : false,
      isActive: formData.get("isActive") === "true" ? true : false,
    };
    if (
      !data.title ||
      !data.description ||
      !data.image ||
      !data.imageId ||
      typeof data.featured !== "boolean" ||
      typeof data.isActive !== "boolean"
    ) {
      throw new Error("Es necesario llenaron todo los campos.");
    }
    const categoriesController = await updateCategoryService(id, data);
    if (categoriesController > 0) {
      if (formDataImages) {
        await deleteImages([category.imageId]);
      }
    }

    return { data: { update: categoriesController, category: data }, success: true };
  } catch (e) {
    const error = e as Error;
    if (imgFilter.length) {
      const idsImage = imgFilter.map((img) => img.public_id);
      await deleteImages(idsImage);
    }
    console.error("updateCategoryController: ", error);
    throw new Error(error.message);
  }
}

export async function deleteCategoryController(id: string) {
  try {
    const option = {
      attributes: ["id", "imageId"],
    };
    const category = await getCategoryIdService(id, option);
    if (!category?.imageId) {
      throw new Error("Esta categoria no existe.");
    }
    const categoriesController = await deleteCategoryService(id);
    if (categoriesController) {
      await deleteImages([category.imageId]);
    }
    return { data: { delete: categoriesController }, success: true };
  } catch (e) {
    const error = e as Error;
    throw new Error(error.message);
  }
}

export async function publishedCategoryController(id: string, published: boolean) {
  try {
    const response = await publishedCategoryService(id, published);
    return { data: response, success: true };
  } catch (e) {
    const error = e as Error;
    console.error("publishedProductController", e);
    throw new Error(error.message);
  }
}
