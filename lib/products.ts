import { ProductType } from "@/types/product";
import baseURL from "@/utils/baseUrl";

export async function getProducts(queryParams?: {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  onSale?: boolean;
  isActive?: boolean;
  page?: number;
  limit?: number;
  sortBy?: "title" | "price" | "priceOffer" | "createdAt";
  sortOrder?: "asc" | "desc";
}) {
  // Construir la URL con parámetros
  let url = "/api/admin/product";

  if (queryParams) {
    const params = new URLSearchParams();

    if (queryParams.search) params.append("search", queryParams.search);
    if (queryParams.category) params.append("category", queryParams.category);
    if (queryParams.minPrice !== undefined)
      params.append("minPrice", queryParams.minPrice.toString());
    if (queryParams.maxPrice !== undefined)
      params.append("maxPrice", queryParams.maxPrice.toString());
    if (queryParams.onSale) params.append("onSale", "true");
    if (queryParams.isActive !== undefined)
      params.append("isActive", queryParams.isActive.toString());
    if (queryParams.page !== undefined) params.append("page", queryParams.page.toString());
    if (queryParams.limit !== undefined) params.append("limit", queryParams.limit.toString());
    if (queryParams.sortBy) params.append("sortBy", queryParams.sortBy);
    if (queryParams.sortOrder) params.append("sortOrder", queryParams.sortOrder);

    if (params.toString()) {
      url += `?${params.toString()}`;
    }
  }

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Error ${response.status}: ${response.statusText}`);
  }

  const data = await response.json();
  return data;
}

export async function getProductID(id: string): Promise<ProductType> {
  try {
    const response = await fetch(`${baseURL}/api/product/${id}`);
    const data = await response.json();
    return data.data;
  } catch (e) {
    console.error("Error getProductID: ", e);
    return {
      id: "",
      title: "",
      price: 0,
      priceOffer: 0,
      images: [],
      imagesId: [],
      categories: [],
      sizes: [],
      variant: [],
      description: "",
      isActive: false,
    };
  }
}

export async function addProduct(
  formData: FormData
): Promise<{ data: ProductType | {}; message: string; success: boolean }> {
  const response = await fetch("/api/admin/product", {
    method: "POST",
    body: formData,
  });
  const data = await response.json();
  return data;
}

export async function updateProduct(id: string, formData: FormData) {
  const response = await fetch(`/api/admin/product/${id}`, {
    method: "PATCH",
    body: formData,
  });
  const data = await response.json();
  return data;
}

export async function deleteProduct(id: string) {
  const response = await fetch(`/api/admin/product/${id}`, {
    method: "DELETE",
  });
  const data = await response.json();
  return data;
}
