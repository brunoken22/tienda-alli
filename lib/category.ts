import { CategoryType } from "@/types/category";
import baseURL from "@/utils/baseUrl";

export async function getCategories(): Promise<CategoryType[]> {
  try {
    const response = await fetch(`${baseURL}/api/admin/category`);
    const data = await response.json();
    return data?.data || [];
  } catch (e) {
    console.error("Este es el error del getCategories: ", e);
    return [];
  }
}

export async function createCategory(
  category: Omit<CategoryType, "id" | "createdAt" | "updatedAt">,
  image: File
): Promise<CategoryType> {
  const formData = new FormData();
  formData.append("title", category.title);
  formData.append("description", category.description);
  formData.append("featured", String(category.featured));
  formData.append("active", String(category.active));
  formData.append("image", image);

  const response = await fetch("/api/admin/category", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) throw new Error("Failed to create category");
  return response.json();
}

export async function updateCategory(
  id: string,
  category: Partial<Omit<CategoryType, "id">>,
  image?: File
): Promise<CategoryType> {
  const formData = new FormData();

  if (category.title) formData.append("title", category.title);
  if (category.description) formData.append("description", category.description);
  if (category.featured !== undefined) formData.append("featured", String(category.featured));
  if (category.active !== undefined) formData.append("active", String(category.active));
  if (image) formData.append("image", image);

  const response = await fetch(`/api/admin/category/${id}`, {
    method: "PATCH",
    body: formData,
  });

  if (!response.ok) throw new Error("Failed to update category");
  return response.json();
}

export async function deleteCategory(id: string): Promise<void> {
  const response = await fetch(`/api/admin/category/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) throw new Error("Failed to delete category");
  const data = await response.json();
  return data.data;
}
