export interface Variant {
  id: string;
  sizes: string[];
  color: string;
  // stock: number;
  price: number;
  priceOffer: number;
}

export interface Product {
  id: string;
  title: string;
  price: number;
  priceOffer: number;
  category: string[] | [];
  images: string[];
  imagesFormData?: File[];
  // stock: number;
  sizes: string[];
  variant: Variant[] | [];
  description: string;
}

export interface AdminType {
  id: string;
  name: string;
  email: string;
  isVerified: false;
  role: "Admin" | "User";
  isActive: Boolean;
}
