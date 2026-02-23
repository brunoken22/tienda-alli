import { ProductQueryParams, ProductType, ResponseUpload, VariantType } from "@/types/product";
import {
  createProductService,
  deleteProductService,
  editProductService,
  getCategoryProductsService,
  getLatestAdditionsProductsService,
  getMetricsService,
  getOfferProductsService,
  getPriceFilterService,
  getProductIDService,
  getProductsService,
  getShoppingCartService,
  publishedProductService,
} from "./product.service";
import { deleteImages, uploadImages } from "@/lib/cloudinary";
import { ShoppingCart } from "@/types/shopping-cart";

export async function getProductsController(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const refererIncludeAdmin = req.headers.get("referer")?.includes("/admin/dashboard/productos")
      ? undefined
      : true;
    // Extraer parámetros de la query string
    const queryParams: ProductQueryParams = {
      search: searchParams.get("search") || undefined,
      category: searchParams.get("category") || undefined,
      minPrice: searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : undefined,
      maxPrice: searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined,
      onSale: searchParams.get("onSale") === "true",
      isActive: refererIncludeAdmin,
      page: searchParams.get("page") ? Number(searchParams.get("page")) : 1,
      limit: searchParams.get("limit") ? Number(searchParams.get("limit")) : 10,
      sortBy:
        (searchParams.get("sortBy") as "title" | "price" | "priceOffer" | "createdAt") || "title",
      sortOrder: (searchParams.get("sortOrder") as "asc" | "desc") || "asc",
    };

    const result = await getProductsService(queryParams);

    return {
      data: result.products,
      pagination: result.pagination,
      success: true,
    };
  } catch (e) {
    const error = e as Error;
    console.error("getProductsController ", error);
    throw new Error(error.message);
  }
}

export async function getProductIDController(id: string) {
  try {
    const products = await getProductIDService(id);
    return { data: products, success: true };
  } catch (e) {
    const error = e as Error;
    throw new Error(error.message);
  }
}

export async function createProductController(formData: FormData) {
  let generateImg: ResponseUpload[] = [];
  try {
    const formDataImages = formData.getAll("images") as File[];
    const price = Number(formData.get("price"));
    const priceOffer = Number(formData.get("priceOffer"));

    if (!formDataImages) {
      throw new Error("Se requieren imagenes");
    }
    if (priceOffer && priceOffer > price) {
      throw new Error("El precio de oferta no debe ser mayor al precio de costo");
    }
    generateImg = await uploadImages(formDataImages);

    const variantFormData = formData.getAll("variant");
    const variant: VariantType[] = variantFormData.map((variantData) => {
      const convertVariant = JSON.parse(variantData.toString());
      return {
        ...convertVariant,
        price: Number(convertVariant.price),
        priceOffer: Number(convertVariant.priceOffer),
      };
    });

    const product: Omit<ProductType, "id" | "categories"> = {
      title: (formData.get("title") as string)?.trim(),
      price: price,
      priceOffer: priceOffer,
      description: (formData.get("description") as string)?.trim(),
      // category: formData.getAll("category") as string[],
      images: generateImg.map((image) => image.url),
      imagesId: generateImg.map((image) => image.public_id),
      variant: variant.length ? variant : [],
      sizes: formData.getAll("sizes") as string[],
      isActive: true,
      // stock: Number(formData.get("stock")),
    };
    if (
      !product.title ||
      !product.price ||
      // !product.priceOffer ||
      !product.description ||
      // !product.category ||
      //   !product.variant.length ||
      !product.images.length
      // !product.sizes.length
      // !product.stock
    ) {
      throw new Error("Se requieren todos los campos");
    }
    const categories = formData.getAll("category") as string[];
    const productService = await createProductService(product, categories);

    return { data: productService, success: true };
  } catch (e) {
    if (generateImg.length) {
      deleteImages(generateImg.map((img) => img.public_id));
    }
    const error = e as Error;
    throw new Error(error.message);
  }
}

export async function editProductController(id: string, formData: FormData) {
  let generateImg: ResponseUpload[] = [];

  try {
    const formDataImagesFilter = formData.getAll("images") as File[];
    const formDataImages = formDataImagesFilter.filter((img) => typeof img !== null);
    const price = Number(formData.get("price"));
    const priceOffer = Number(formData.get("priceOffer"));

    if (!formDataImages) {
      throw new Error("Se requieren imagenes");
    }

    if (priceOffer && priceOffer > price) {
      throw new Error("El precio de oferta no debe ser mayor al precio de costo");
    }

    const options = {
      attributes: ["id", "imagesId"],
    };
    const productSearch = await getProductIDService(id, options);
    if (!productSearch?.id) {
      throw new Error("Esta producto no existe");
    }

    generateImg = await uploadImages(formDataImages);

    const variantFormData = formData.getAll("variant");

    const variant: VariantType[] = variantFormData.map((variantData) => {
      const convertVariant = JSON.parse(variantData.toString());
      return {
        ...convertVariant,
        price: Number(convertVariant.price),
        priceOffer: Number(convertVariant.priceOffer),
      };
    });
    const product: Omit<ProductType, "id" | "categories"> = {
      title: formData.get("title") as string,
      price: price,
      priceOffer: priceOffer,
      description: formData.get("description") as string,
      images: generateImg.map((image) => image?.url),
      imagesId: generateImg.map((image) => image?.public_id),
      variant: variant,
      sizes: formData.getAll("sizes") as string[],
      isActive: true,
      // stock: Number(formData.get("stock")),
    };
    if (
      !product.title ||
      !product.price ||
      // !product.priceOffer ||
      !product.description ||
      // !product.category ||
      //   !product.variant.length ||
      !product.images.length
      // ||!product.stock
    ) {
      throw new Error("Se requieren todos los campos");
    }
    const categories = formData.getAll("category") as string[];
    const productService = await editProductService(id, product, categories);

    if (productService) {
      await deleteImages(productSearch.imagesId);
    }
    return { data: { id, product: productService }, success: true };
  } catch (e) {
    const error = e as Error;
    if (generateImg.length) {
      deleteImages(generateImg.map((img) => img.public_id));
    }
    console.error("Esto es el error rel controller: ", error);
    throw new Error(error.message);
  }
}

export async function deleteProductController(id: string) {
  try {
    const option = {
      attributes: ["id", "imagesId"],
    };

    const productSearch = await getProductIDService(id, option);
    if (!productSearch?.id) {
      throw new Error("Esta producto no existe");
    }

    const productService = await deleteProductService(id);

    if (productService > 0 && productSearch.imagesId.length) {
      await deleteImages(productSearch.imagesId);
    }
    return { data: { delete: true }, success: true };
  } catch (e) {
    const error = e as Error;
    throw new Error(error.message);
  }
}

export async function getLatestAdditionsProductsController() {
  try {
    const productsService = await getLatestAdditionsProductsService();
    return { data: productsService, success: true };
  } catch (e) {
    const error = e as Error;
    throw new Error(error.message);
  }
}

export async function getOfferProductsController() {
  try {
    const productsService = await getOfferProductsService();
    return { data: productsService, success: true };
  } catch (e) {
    const error = e as Error;
    throw new Error(error.message);
  }
}

export async function getShoppingCartController(shoppingCart: Omit<ShoppingCart, "variant">[]) {
  try {
    const shoppingCartIds: string[] = shoppingCart.map((item) => item.id);
    const responseService = await getShoppingCartService(shoppingCartIds);
    if (!responseService.length) return { data: [], success: true };
    const data: (ShoppingCart | null)[] = shoppingCart.map((product) => {
      const findProduct = responseService.find((p) => p.dataValues.id === product.id);
      if (!findProduct) return null;
      if (!product.variantId) {
        return {
          ...findProduct.dataValues,
          quantity: product.quantity,
          // variant: [],
        };
      }

      const variant = (findProduct.dataValues.variant as VariantType[]).find(
        (variantItem: VariantType) => variantItem.id === product.variantId,
      );
      const size = variant?.sizes.find((size) => size === product.variantSize);

      if (!variant && !size) {
        return null;
      }

      return {
        ...product,
        title: findProduct.dataValues.title,
        price: variant?.price || findProduct.dataValues.price,
        priceOffer: variant?.priceOffer || findProduct.dataValues.priceOffer,
        images: findProduct.dataValues.images,
        quantity: product.quantity,
        // variant,
        // varinatSize: size,
        // variant: filteredVariant,
      };
    });
    const filteredData = data.filter((item) => item !== null) as ShoppingCart[];
    return { data: filteredData, success: true };
  } catch (e) {
    const error = e as Error;
    console.error("Esto es el error: ", error);
    throw new Error(error.message);
  }
}

export async function getPriceFilterController() {
  try {
    const response = await getPriceFilterService();
    return { data: response, success: false };
  } catch (e) {
    const error = e as Error;
    console.error("getPriceFilterController", e);
    throw new Error(error.message);
  }
}

export async function getMetricsController() {
  try {
    const response = await getMetricsService();
    return { data: response, success: true };
  } catch (e) {
    const error = e as Error;
    console.error("getMetricsController", e);
    throw new Error(error.message);
  }
}

export async function publishedProductController(id: string, published: boolean) {
  try {
    const response = await publishedProductService(id, published);
    return { data: response, success: true };
  } catch (e) {
    const error = e as Error;
    console.error("getMetricsController", e);
    throw new Error(error.message);
  }
}

export async function getCategoryProductsController() {
  try {
    const responseService = await getCategoryProductsService();

    return { data: responseService, success: true };
  } catch (e) {
    const error = e as Error;
    console.error("Esto es el error: ", error);
    throw new Error(error.message);
  }
}
