import { publishedProductController } from "@/features/product/product.controller";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    if (!id) {
      return Response.json({ error: "Se requiere el id del producto" }, { status: 400 });
    }

    const { published } = await req.json();
    const data = await publishedProductController(id, published);
    return Response.json(data, { status: 200 });
  } catch (e) {
    const error = e as Error;
    console.error("Error in PATCH /api/admin/product/[id]/published: ", e);
    return Response.json({ message: error.message, success: false }, { status: 500 });
  }
}
