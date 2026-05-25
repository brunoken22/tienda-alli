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

export async function getInventoryMovementsService() {
  return await InventoryMovement.findAll({
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
  });
}
