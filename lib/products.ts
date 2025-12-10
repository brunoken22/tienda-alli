import { Product } from "@/types/admin";

export async function getProducts(): Promise<Product[]> {
  const response = await fetch("/api/admin/product");
  const data = await response.json();
  return data.data;
}

export async function addProduct(
  formData: FormData
): Promise<{ data: Product | {}; message: string; success: boolean }> {
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
