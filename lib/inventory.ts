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

export async function getWeeklySalesData() {
  const days = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
  const fullDays = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

  const salesByDay: Record<string, { ventas: number; ingresos: number }> = {};

  const productSales: Record<
    string,
    {
      title: string;
      totalSold: number;
      currentStock: number;
      price: number;
      variants: Record<
        string,
        {
          variantId: string;
          colorName: string;
          colorHex: string;
          size: string;
          totalSold: number;
          currentStock: number;
        }
      >;
    }
  > = {};

  const today = new Date();

  // Inicializar últimos 7 días
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    salesByDay[date.getDay()] = {
      ventas: 0,
      ingresos: 0,
    };
  }

  const movements = await getInventoryMovements();

  movements.forEach((movement: InventoryType) => {
    if (movement.type !== "SALE") return;

    const movementDate = new Date(movement.createdAt);
    const dayIndex = movementDate.getDay();

    const price =
      Number(movement.variant?.priceOffer) > 0
        ? Number(movement.variant?.priceOffer)
        : Number(movement.variant?.price) > 0
          ? Number(movement.variant?.price)
          : Number(movement.product?.priceOffer) > 0
            ? Number(movement.product?.priceOffer)
            : Number(movement.product?.price) || 0;
    // Ventas por día
    if (salesByDay[dayIndex]) {
      salesByDay[dayIndex].ventas += movement.quantity;
      salesByDay[dayIndex].ingresos += movement.quantity * price;
    }

    const productId = movement.productId;

    // Crear producto si no existe
    if (!productSales[productId]) {
      productSales[productId] = {
        title: movement.product?.title || "Producto",
        totalSold: 0,
        currentStock: movement.product?.stock || 0,
        price,
        variants: {},
      };
    }

    productSales[productId].totalSold += movement.quantity;

    // Acumular ventas por variante
    if (movement.variant && movement.variantId) {
      const variantId = movement.variantId;

      if (!productSales[productId].variants[variantId]) {
        productSales[productId].variants[variantId] = {
          variantId,
          colorName: movement.variant.colorName || "",
          colorHex: movement.variant.colorHex || "#cccccc",
          size: movement.variant.size || "",
          totalSold: 0,
          currentStock: movement.variant.stock ?? 0,
        };
      }

      productSales[productId].variants[variantId].totalSold += movement.quantity;

      productSales[productId].variants[variantId].currentStock =
        movement.newStock ?? movement.variant.stock ?? 0;
    }
  });

  // Construir datos para gráfico
  const dailySales = [];

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    const dayIndex = date.getDay();

    dailySales.push({
      day: fullDays[dayIndex],
      dayShort: days[dayIndex],
      ventas: salesByDay[dayIndex]?.ventas || 0,
      ingresos: salesByDay[dayIndex]?.ingresos || 0,
    });
  }

  // Top productos
  const topProducts = Object.entries(productSales)
    .map(([productId, data]) => {
      const avgDailySales = data.totalSold / 7;

      const recommendation = Math.max(0, Math.ceil(avgDailySales * 14) - data.currentStock);

      const variants = Object.values(data.variants)
        .map((variant) => {
          const avgVariantDailySales = variant.totalSold / 7;

          const variantRecommendation = Math.max(
            0,
            Math.ceil(avgVariantDailySales * 14) - variant.currentStock,
          );

          return {
            ...variant,
            recommendation: variantRecommendation,
          };
        })
        .sort((a, b) => b.totalSold - a.totalSold);

      return {
        productId,
        title: data.title,
        totalSold: data.totalSold,
        currentStock: data.currentStock,
        avgDailySales: Number(avgDailySales.toFixed(1)),
        recommendation,
        price: data.price,
        variants,
      };
    })
    .sort((a, b) => b.totalSold - a.totalSold);

  const totalSales = Object.values(productSales).reduce(
    (acc, product) => acc + product.totalSold,
    0,
  );

  const totalRevenue = dailySales.reduce((acc, day) => acc + day.ingresos, 0);

  return {
    dailySales,
    topProducts,
    totalSales,
    totalRevenue,
  };
}
