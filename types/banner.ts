export interface BannerType {
  id: string;

  title: string;
  subtitle?: string;

  imageUrl: string;
  imagePublicId?: string;

  order: number;

  isActive: boolean;

  createdAt: string;
  updatedAt: string;
}
