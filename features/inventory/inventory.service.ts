import { InventoryMovementType } from "@/types/inventory";
import Variant from "../variant/variant.model";
import InventoryMovement from "./inventory.model";
import Product from "../product/product.model";
import { Op } from "sequelize";

export async function createInventoryMovementService(
  variantId: string,
  type: InventoryMovementType,
  quantity: number,
  note?: string,
) {
  try {
    const variant = await Variant.findByPk(variantId);

    if (!variant) {
      throw new Error("La variante no existe");
    }

    const previousStock = variant.dataValues.stock;

    let newStock = previousStock;

    switch (type) {
      case "PURCHASE":
      case "RETURN":
        newStock += quantity;
        break;

      case "SALE":
      case "DAMAGED":
        if (previousStock < quantity) {
          throw new Error("Stock insuficiente");
        }

        newStock -= quantity;
        break;

      case "ADJUSTMENT":
        newStock = quantity; // stock final deseado
        break;

      default:
        throw new Error("Tipo de movimiento inválido");
    }

    await variant.update({
      stock: newStock,
    });

    return await InventoryMovement.create({
      productId: variant.dataValues.productId,
      variantId,
      type,
      quantity,
      previousStock,
      newStock,
      note,
    });
  } catch (e) {
    const error = e as Error;
    throw new Error(error.message);
  }
}

export async function getInventoryMovementsService({
  page = 1,
  limit = 12,
}: {
  page?: number;
  limit?: number;
}) {
  const offset = (page - 1) * limit;

  const { rows, count } = await InventoryMovement.findAndCountAll({
    include: [
      {
        model: Variant,
        as: "variant",
      },
      {
        model: Product,
        as: "product",
      },
    ],
    order: [["createdAt", "DESC"]],
    limit,
    offset,
  });

  const totalPages = Math.ceil(count / limit);

  return {
    data: rows,
    pagination: {
      total: count,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };
}

type AnalyticsParams = {
  range?: string;
  startDate?: string | null;
  endDate?: string | null;
};

export async function getInventoryAnalyticsService({
  range = "7d",
  startDate,
  endDate,
}: AnalyticsParams) {
  const today = new Date();
  let fromDate = new Date();

  if (startDate && endDate) {
    fromDate = new Date(`${startDate}T00:00:00`);
  } else {
    switch (range) {
      case "30d":
        fromDate.setDate(today.getDate() - 30);
        break;

      case "90d":
        fromDate.setDate(today.getDate() - 90);
        break;

      case "month":
        fromDate = new Date(today.getFullYear(), today.getMonth(), 1);
        break;

      default:
        fromDate.setDate(today.getDate() - 7);
    }
  }

  const finalEndDate = endDate ? new Date(`${endDate}T23:59:59.999`) : today;

  const movements = await InventoryMovement.findAll({
    where: {
      type: "SALE",
      createdAt: {
        [Op.between]: [fromDate, finalEndDate],
      },
    },
    include: [
      {
        model: Variant,
        as: "variant",
      },
      {
        model: Product,
        as: "product",
      },
    ],
    order: [["createdAt", "ASC"]],
  });

  const dailySalesMap: Record<
    string,
    {
      ventas: number;
      ingresos: number;
    }
  > = {};

  const hourlySalesMap: Record<number, number> = {};

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
          recommendation: number;
        }
      >;
    }
  > = {};

  movements.forEach((movement: any) => {
    const date = new Date(movement.createdAt);

    const dateKey = date.toLocaleDateString("es-AR");

    const hour = date.getHours();

    const price =
      Number(movement.variant?.priceOffer) > 0
        ? Number(movement.variant.priceOffer)
        : Number(movement.variant?.price) > 0
          ? Number(movement.variant.price)
          : Number(movement.product?.priceOffer) > 0
            ? Number(movement.product.priceOffer)
            : Number(movement.product?.price) || 0;

    if (!dailySalesMap[dateKey]) {
      dailySalesMap[dateKey] = {
        ventas: 0,
        ingresos: 0,
      };
    }

    dailySalesMap[dateKey].ventas += movement.quantity;
    dailySalesMap[dateKey].ingresos += movement.quantity * price;

    hourlySalesMap[hour] = (hourlySalesMap[hour] || 0) + movement.quantity;

    const productId = movement.productId;

    if (!productSales[productId]) {
      productSales[productId] = {
        title: movement.product?.title || "Producto",
        totalSold: 0,
        currentStock: movement.variant?.stock || 0,
        price,
        variants: {},
      };
    }

    productSales[productId].totalSold += movement.quantity;

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
          recommendation: 0,
        };
      }

      productSales[productId].variants[variantId].totalSold += movement.quantity;

      productSales[productId].variants[variantId].currentStock =
        movement.newStock ?? movement.variant.stock ?? 0;
    }
  });

  const dailySales = [];

  for (let d = new Date(fromDate); d <= finalEndDate; d.setDate(d.getDate() + 1)) {
    const dateKey = d.toLocaleDateString("es-AR");

    dailySales.push({
      day: dateKey,
      dayShort: range === "90d" || range === "30d" ? `${d.getDate()}/${d.getMonth() + 1}` : dateKey,
      ventas: dailySalesMap[dateKey]?.ventas || 0,
      ingresos: dailySalesMap[dateKey]?.ingresos || 0,
    });
  }

  const daysCount =
    Math.ceil((finalEndDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;

  const topProducts = Object.entries(productSales)
    .map(([productId, product]) => {
      const avgDailySales = product.totalSold / daysCount;

      const recommendation = Math.max(0, Math.ceil(avgDailySales * 14) - product.currentStock);

      const variants = Object.values(product.variants).map((variant) => {
        const avgVariantDailySales = variant.totalSold / daysCount;

        const variantRecommendation = Math.max(
          0,
          Math.ceil(avgVariantDailySales * 14) - variant.currentStock,
        );

        return {
          ...variant,
          recommendation: variantRecommendation,
        };
      });

      return {
        productId,
        title: product.title,
        totalSold: product.totalSold,
        currentStock: product.currentStock,
        avgDailySales: Number(avgDailySales.toFixed(1)),
        recommendation,
        price: product.price,
        variants,
      };
    })
    .sort((a, b) => b.totalSold - a.totalSold);

  const totalSales = dailySales.reduce((acc, item) => acc + item.ventas, 0);

  const totalRevenue = dailySales.reduce((acc, item) => acc + item.ingresos, 0);

  const bestDay = [...dailySales].sort((a, b) => b.ventas - a.ventas)[0] || null;

  const bestProduct =
    topProducts.length > 0
      ? {
          productId: topProducts[0].productId,
          title: topProducts[0].title,
          totalSold: topProducts[0].totalSold,
        }
      : null;
  const averageDailySales =
    dailySales.length > 0 ? Number((totalSales / dailySales.length).toFixed(1)) : 0;

  const bestRevenueDay = [...dailySales].sort((a, b) => b.ingresos - a.ingresos)[0] || null;
  return {
    totalSales,
    totalRevenue,
    averageDailySales,

    bestDay,
    bestRevenueDay,
    bestProduct,

    dailySales,
    topProducts,
  };
}
