import { CategoryType } from "@/types/category";

export async function getCategories(): Promise<CategoryType[]> {
  try {
    // Obtener la URL base desde las variables de entorno
    const baseUrl = process.env.NEXT_PUBLIC_API || "http://localhost:3000";

    const response = await fetch(`${baseUrl}/api/admin/category`, {
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store", // Para datos dinámicos
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data?.data || [];
  } catch (e) {
    console.error("Error en getCategories: ", e);
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
  formData.append("isActive", String(category.isActive));
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
  if (category.isActive !== undefined) formData.append("isActive", String(category.isActive));
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

export async function publishedCategory(id: string, published: boolean) {
  try {
    const response = await fetch(`/api/admin/category/${id}/published`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, published }),
    });
    const data = await response.json();
    if (!data.success) {
      throw new Error(data.message);
    }
    return data;
  } catch (e) {
    const error = e as Error;
    return { message: error.message, success: false };
  }
}
