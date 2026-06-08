import { InventoryMovementType } from "@/types/inventory";
import Variant from "../variant/variant.model";
import InventoryMovement from "./inventory.model";
import Product from "../product/product.model";

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

export async function getInventoryAnalyticsService() {
  const days = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

  const fullDays = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

  const salesByDay: Record<
    string,
    {
      ventas: number;
      ingresos: number;
    }
  > = {};

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

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    salesByDay[date.getDay()] = {
      ventas: 0,
      ingresos: 0,
    };
  }

  const movements = await InventoryMovement.findAll({
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
    where: {
      type: "SALE",
    },
    order: [["createdAt", "DESC"]],
  });

  movements.forEach((movement: any) => {
    const movementDate = new Date(movement.createdAt);
    const dayIndex = movementDate.getDay();

    const price =
      Number(movement.variant?.priceOffer) > 0
        ? Number(movement.variant.priceOffer)
        : Number(movement.variant?.price) > 0
          ? Number(movement.variant.price)
          : Number(movement.product?.priceOffer) > 0
            ? Number(movement.product.priceOffer)
            : Number(movement.product?.price) || 0;

    if (salesByDay[dayIndex]) {
      salesByDay[dayIndex].ventas += movement.quantity;
      salesByDay[dayIndex].ingresos += movement.quantity * price;
    }

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
          colorName: movement.variant.colorName,
          colorHex: movement.variant.colorHex,
          size: movement.variant.size,
          totalSold: 0,
          currentStock: movement.variant.stock ?? 0,
        };
      }

      productSales[productId].variants[variantId].totalSold += movement.quantity;

      productSales[productId].variants[variantId].currentStock =
        movement.newStock ?? movement.variant.stock ?? 0;
    }
  });

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

  const topProducts = Object.entries(productSales)
    .map(([productId, data]) => {
      const avgDailySales = data.totalSold / 7;

      const recommendation = Math.max(0, Math.ceil(avgDailySales * 14) - data.currentStock);

      const variants = Object.values(data.variants)
        .map((variant) => {
          const avgVariantDailySales = variant.totalSold / 7;

          return {
            ...variant,
            recommendation: Math.max(
              0,
              Math.ceil(avgVariantDailySales * 14) - variant.currentStock,
            ),
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
