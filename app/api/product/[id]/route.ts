import { getProductIDController } from "@/features/product/product.controller";
import { base } from "@/lib/airtable";
import { NextResponse } from "next/server";

const TABLE_NAME = "Productos";

type Params = {
  id: string;
};

export async function GET(_: Request, { params }: { params: Promise<Params> }){
  try{
    const {id} = await params
    const response = await getProductIDController(id)
    return NextResponse.json(response,{status:200}) 

  }catch(e){
    const error = e as Error
    return NextResponse.json({message:error.message,success:false}) 
  }
}

export async function PUT(req: Request, { params }: { params: Promise<Params> }) {
  const body = await req.json();
  const id = (await params).id;
  try {
    const updated = await base(TABLE_NAME).update([
      {
        id: id,
        fields: {
          name: body.name,
          price: body.price,
          stock: body.stock,
          category: body.category,
          status: body.status,
        },
      },
    ]);

    return NextResponse.json({ success: true, record: updated[0] });
  } catch (err) {
    console.error("Error al actualizar:", err);
    return NextResponse.json({ error: "Error al actualizar el producto" }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<Params> }) {
  try {
    const id = (await params).id;
    await base(TABLE_NAME).destroy(id);
    return NextResponse.json({ success: true, message: "Producto eliminado correctamente." });
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    return NextResponse.json(
      { success: false, error: "No se pudo eliminar el producto." },
      { status: 500 }
    );
  }
}
