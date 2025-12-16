import { CategoryType } from "./category";

export type VariantType = {
  id: string;
  sizes: string[];
  color: string;
  // stock: number;
  price: number;
  priceOffer: number;
};

export type ProductType = {
  id: string;
  title: string;
  description: string;
  price: number;
  priceOffer: number;
  categoryFormData?: string[];
  categories: CategoryType[];
  images: string[];
  imagesId: string[];
  imagesFormData?: File[];
  // stock: number;
  sizes: string[];
  variant: VariantType[] | [];
  isActive: boolean;
};

export type ProductQueryParams = {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  onSale?: boolean; // Para productos con oferta
  isActive?: boolean;
  page?: number;
  limit?: number;
  sortBy?: "title" | "price" | "priceOffer" | "createdAt";
  sortOrder?: "asc" | "desc";
};

export type ResponseUpload = { public_id: string; url: string };
