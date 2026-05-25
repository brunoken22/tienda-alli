import baseURL from "@/utils/baseUrl";
import { InventoryType } from "@/types/inventory";

export async function createInventoryMovement(
  movement: Omit<InventoryType, "id" | "productId" | "previousStock" | "newStock" | "createdAt">,
) {
  const formData = new FormData();

  formData.append("variantId", movement.variantId!);
  formData.append("type", movement.type);
  formData.append("quantity", movement.quantity.toString());

  if (movement.note) {
    formData.append("note", movement.note);
  }

  const response = await fetch(`${baseURL}/api/admin/inventory`, {
    method: "POST",
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Error al crear movimiento");
  }

  return data;
}

export async function getInventoryMovements() {
  const response = await fetch(`${baseURL}/api/admin/inventory`, {
    cache: "no-store",
  });

  const data = await response.json();

  return data.data ?? [];
}
