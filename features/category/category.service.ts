import { CategoryType } from "@/types/category";
import Category from "./category.model";

export async function getCategoriesService(isActive: boolean | undefined) {
  try {
    const whereConditions: any = {};
    if (isActive !== undefined) {
      whereConditions.isActive = isActive;
    }
    const categories = await Category.findAll({
      where: whereConditions,
    });
    return categories;
  } catch (e) {
    const error = e as Error;
    throw new Error(error.message);
  }
}

export async function getCategoryIdService(id: string, option: Object) {
  try {
    const category = await Category.findByPk(id, option || {});
    return category?.dataValues;
  } catch (e) {
    const error = e as Error;
    throw new Error(error.message);
  }
}

export async function createCategoryService(
  category: Omit<CategoryType, "id" | "createdAt" | "updatedAt">
) {
  try {
    const categories = await Category.create(category);
    return categories;
  } catch (e) {
    const error = e as Error;
    console.error("createCategoryService: ", error);

    throw new Error(error.message);
  }
}

export async function updateCategoryService(
  id: string,
  category: Omit<CategoryType, "id" | "createdAt" | "updatedAt">
) {
  try {
    const [categories] = await Category.update(category, { where: { id } });
    return categories;
  } catch (e) {
    const error = e as Error;
    console.error("updateCategoryService: ", error);
    throw new Error(error.message);
  }
}

export async function deleteCategoryService(id: string) {
  try {
    const category = await Category.destroy({ where: { id } });
    return category;
  } catch (e) {
    const error = e as Error;
    console.error("deleteCategoryService: ", error);
    throw new Error(error.message);
  }
}

export async function publishedCategoryService(id: string, published: boolean) {
  try {
    const [categoryUpdate] = await Category.update(
      {
        isActive: published,
      },
      {
        where: {
          id,
        },
      }
    );
    return { update: categoryUpdate };
  } catch (e) {
    const error = e as Error;
    throw new Error(error.message);
  }
}
