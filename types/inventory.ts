import { ProductType, VariantType } from "@/types/product";

export type InventoryMovementType =
  | "SALE" // Venta
  | "RETURN" // Devolución / revertir una venta
  | "PURCHASE" // Ingreso de mercadería
  | "DAMAGED" // Producto roto o perdido
  | "ADJUSTMENT"; // Corrección manual

export type InventoryType = {
  id: string;

  productId: string;

  variantId?: string;

  type: InventoryMovementType;

  quantity: number;

  previousStock: number;
  newStock: number;

  variant?: VariantType;
  product?: ProductType;

  note?: string;

  createdAt: Date;
};
