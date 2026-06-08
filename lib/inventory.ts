import baseURL from "@/utils/baseUrl";
import { InventoryType } from "@/types/inventory";

export type AnalyticsFilters = {
  range?: "7d" | "30d" | "90d" | "month";
  startDate?: string;
  endDate?: string;
};

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

export async function getInventoryMovements(params?: { page?: number; limit?: number }) {
  let url = `${baseURL}/api/admin/inventory`;

  if (params) {
    const { page, limit } = params;
    const searchParams = new URLSearchParams();

    if (page !== undefined) {
      searchParams.append("page", page.toString());
    }

    if (limit !== undefined) {
      searchParams.append("limit", limit.toString());
    }

    url += `?${searchParams.toString()}`;
  }

  const response = await fetch(url, {
    cache: "no-store",
  });

  const data = await response.json();

  return data;
}

export async function getInventoryAnalytics(filters?: AnalyticsFilters) {
  const params = new URLSearchParams();

  if (filters?.range) {
    params.append("range", filters.range);
  }

  if (filters?.startDate) {
    params.append("startDate", filters.startDate);
  }

  if (filters?.endDate) {
    params.append("endDate", filters.endDate);
  }

  const response = await fetch(`${baseURL}/api/admin/inventory/analytics?${params.toString()}`, {
    cache: "no-store",
  });

  const data = await response.json();

  return data.data;
}
