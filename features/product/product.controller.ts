import { ProductType, VariantType } from "@/types/product";
import {
  createProductService,
  deleteProductService,
  editProductService,
  getProductIdService,
  getProductsService,
} from "./product.service";
import { deleteImages, uploadImages } from "@/lib/cloudinary";

export async function getProductsController() {
  try {
    const products = await getProductsService();
    return { data: products, success: true };
  } catch (e) {
    const error = e as Error;
    throw new Error(error.message);
  }
}

export async function createProductController(formData: FormData) {
  try {
    const formDataImages = formData.getAll("images") as File[];
    if (!formDataImages) {
      throw new Error("Se requieren imagenes");
    }

    const generateImg = await uploadImages(formDataImages);
    const variantFormData = formData.getAll("variant");
    const variant: VariantType[] = variantFormData.map((variantData) => {
      const convertVariant = JSON.parse(variantData.toString());
      return {
        ...convertVariant,
        price: Number(convertVariant.price),
        priceOffer: Number(convertVariant.priceOffer),
      };
    });

    const product: Omit<ProductType, "id"> = {
      title: (formData.get("title") as string)?.trim(),
      price: Number(formData.get("price")),
      priceOffer: Number(formData.get("priceOffer")),
      description: (formData.get("description") as string)?.trim(),
      category: formData.getAll("category") as string[],
      images: generateImg.map((image) => image?.url),
      imagesId: generateImg.map((image) => image?.public_id),
      variant: variant.length ? variant : [],
      sizes: formData.getAll("sizes") as string[],
      // stock: Number(formData.get("stock")),
    };
    if (
      !product.title ||
      !product.price ||
      // !product.priceOffer ||
      !product.description ||
      !product.category ||
      //   !product.variant.length ||
      !product.images.length
      // !product.sizes.length
      // !product.stock
    ) {
      throw new Error("Se requieren todos los campos");
    }

    const productService = await createProductService(product);
    return { data: productService, success: true };
  } catch (e) {
    const error = e as Error;
    throw new Error(error.message);
  }
}

export async function editProductController(id: string, formData: FormData) {
  try {
    const formDataImagesFilter = formData.getAll("images") as File[];
    const formDataImages = formDataImagesFilter.filter((img) => typeof img !== null);

    if (!formDataImages) {
      throw new Error("Se requieren imagenes");
    }

    // console.log("Estasn son las aimgenes", formDataImages);

    const option = {
      attributes: ["id", "imagesId"],
    };
    const productSearch = await getProductIdService(id, option);
    if (!productSearch?.id) {
      throw new Error("Esta producto no existe");
    }

    const generateImg = await uploadImages(formDataImages);

    const variantFormData = formData.getAll("variant");

    const variant: VariantType[] = variantFormData.map((variantData) => {
      const convertVariant = JSON.parse(variantData.toString());
      return {
        ...convertVariant,
        price: Number(convertVariant.price),
        priceOffer: Number(convertVariant.priceOffer),
      };
    });
    const product: Omit<ProductType, "id"> = {
      title: formData.get("title") as string,
      price: Number(formData.get("price")),
      priceOffer: Number(formData.get("priceOffer")),
      description: formData.get("description") as string,
      category: formData.getAll("category") as string[],
      images: generateImg.map((image) => image?.url),
      imagesId: generateImg.map((image) => image?.public_id),
      variant: variant,
      sizes: formData.getAll("sizes") as string[],
      // stock: Number(formData.get("stock")),
    };
    if (
      !product.title ||
      !product.price ||
      // !product.priceOffer ||
      !product.description ||
      !product.category ||
      //   !product.variant.length ||
      !product.images.length
      // ||!product.stock
    ) {
      throw new Error("Se requieren todos los campos");
    }
    const productService = await editProductService(id, product);

    if (productService > 0) {
      const public_ids = productSearch.imagesId.filter((id: void) => typeof id === "string");
      await deleteImages(public_ids);
    }
    return { data: { id, product }, success: true };
  } catch (e) {
    const error = e as Error;
    console.log("Esto es el error rel controller: ", error);
    throw new Error(error.message);
  }
}

export async function deleteProductController(id: string) {
  try {
    const option = {
      attributes: ["id", "imagesId"],
    };

    const productSearch = await getProductIdService(id, option);
    if (!productSearch?.id) {
      throw new Error("Esta producto no existe");
    }

    const productService = await deleteProductService(id);

    if (productService > 0 && productSearch.imagesId.length) {
      const public_ids = productSearch.imagesId.filter((id: void) => typeof id === "string");
      await deleteImages(public_ids);
    }
    return { data: { delete: true }, success: true };
  } catch (e) {
    const error = e as Error;
    throw new Error(error.message);
  }
}
