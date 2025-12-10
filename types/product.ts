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
  price: number;
  priceOffer: number;
  category: string[] | [];
  images: (string | null | undefined)[];
  imagesId: (string | null | undefined)[];
  // stock: number;
  sizes: string[];
  variant: VariantType[] | [];
  description: string;
};
