import { InventoryMovementType } from "@/types/inventory";
import { createInventoryMovementService, getInventoryMovementsService } from "./inventory.service";

export async function createInventoryMovementController(formData: FormData) {
  try {
    const variantId = formData.get("variantId")?.toString();

    const type = formData.get("type")?.toString();

    const quantity = Number(formData.get("quantity"));

    const note = formData.get("note")?.toString();

    if (!variantId) {
      throw new Error("Variant requerida");
    }

    const response = await createInventoryMovementService(
      variantId,
      type as InventoryMovementType,
      quantity,
      note,
    );

    return {
      success: true,
      data: response,
    };
  } catch (e) {
    const error = e as Error;
    throw new Error(error.message);
  }
}

export async function getInventoryMovementsController() {
  try {
    const response = await getInventoryMovementsService();

    return {
      success: true,
      data: response,
    };
  } catch (e) {
    const error = e as Error;
    throw new Error(error.message);
  }
}
