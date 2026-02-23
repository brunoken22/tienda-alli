import { BannerType } from "@/types/banner";
import Banner from "./banner.model";

export async function getBannersService(isActive?: boolean) {
  try {
    const whereConditions: any = {};

    if (isActive && isActive !== undefined) {
      whereConditions.isActive = isActive;
    }

    const banners = await Banner.findAll({
      where: whereConditions,
      order: [["order", "ASC"]],
    });
    return banners;
  } catch (e) {
    const error = e as Error;
    throw new Error(error.message);
  }
}

export async function getBannerByIdService(id: string, options?: object) {
  try {
    const banner = await Banner.findByPk(id, options || {});
    return banner?.dataValues;
  } catch (e) {
    const error = e as Error;
    throw new Error(error.message);
  }
}

export async function createBannerService(
  banner: Omit<BannerType, "id" | "createdAt" | "updatedAt">,
) {
  try {
    const newBanner = await Banner.create(banner);
    return newBanner;
  } catch (e) {
    const error = e as Error;
    console.error("createBannerService:", error);
    throw new Error(error.message);
  }
}

export async function updateBannerService(
  id: string,
  banner: Omit<BannerType, "id" | "createdAt" | "updatedAt">,
) {
  try {
    const [updated] = await Banner.update(banner, {
      where: { id },
    });

    return updated;
  } catch (e) {
    const error = e as Error;
    console.error("updateBannerService:", error);
    throw new Error(error.message);
  }
}

export async function deleteBannerService(id: string) {
  try {
    const deleted = await Banner.destroy({
      where: { id },
    });

    return deleted;
  } catch (e) {
    const error = e as Error;
    console.error("deleteBannerService:", error);
    throw new Error(error.message);
  }
}

export async function toggleBannerStatusService(id: string, isActive: boolean) {
  try {
    const [updated] = await Banner.update({ isActive }, { where: { id } });

    return { updated };
  } catch (e) {
    const error = e as Error;
    throw new Error(error.message);
  }
}
