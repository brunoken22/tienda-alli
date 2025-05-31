import { base } from '@/lib/airtable';
import { NextResponse } from 'next/server';

const TABLE_NAME = 'Productos';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json();

  try {
    const updated = await base(TABLE_NAME).update([
      {
        id: params.id,
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
    console.error('Error al actualizar:', err);
    return NextResponse.json({ error: 'Error al actualizar el producto' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await base(TABLE_NAME).destroy(params.id);
    return NextResponse.json({ success: true, message: 'Producto eliminado correctamente.' });
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    return NextResponse.json(
      { success: false, error: 'No se pudo eliminar el producto.' },
      { status: 500 }
    );
  }
}
