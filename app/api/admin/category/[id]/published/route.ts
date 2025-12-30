import { publishedCategoryController } from "@/features/category/category.controller";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    if (!id) {
      return Response.json({ error: "Se requiere el id del la categoría" }, { status: 400 });
    }

    const { published } = await req.json();
    const data = await publishedCategoryController(id, published);
    return Response.json(data, { status: 200 });
  } catch (e) {
    const error = e as Error;
    return Response.json({ message: error.message, success: false }, { status: 500 });
  }
}
