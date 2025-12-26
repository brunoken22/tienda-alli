export const dynamic = "force-dynamic";

import { getLatestAdditionsProductsController } from "@/features/product/product.controller";

export async function GET() {
  try {
    const data = await getLatestAdditionsProductsController();
    return Response.json(data, { status: 200 });
  } catch (e) {
    const error = e as Error;
    return Response.json({ message: error.message, success: false });
  }
}
