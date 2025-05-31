import { base } from '@/lib/airtable';
import cloudinary from '@/lib/cloudinary';
import { NextResponse } from 'next/server';

export const config = {
  api: {
    bodyParser: false,
  },
};

const TABLE_NAME = 'Furniture';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const fields: Record<string, any> = {};
    const attachments: any[] = [];

    // Procesar campos y archivos
    for (const [key, value] of formData.entries()) {
      console.log(key);
      if (value instanceof File) {
        // Subir imagen a Cloudinary forzándola a WebP
        const buffer = await value.arrayBuffer();
        const result = await cloudinary.uploader.upload(
          `data:${value.type};base64,${Buffer.from(buffer).toString('base64')}`,
          {
            folder: 'furniture',
            resource_type: 'image',
            format: 'webp', // Fuerza conversión a WebP
            quality: 'auto:good', // Calidad optimizada
            fetch_format: 'webp', // Asegura entrega en WebP
            transformation: [
              {
                width: 1200,
                height: 1200,
                crop: 'limit', // Mantiene proporciones sin recortar
                quality: 80,
              },
            ],
          }
        );

        // Obtener URL específica para WebP
        const webpUrl = result.secure_url.replace(/\.(jpg|png|jpeg)$/, '.webp');

        attachments.push({
          url: webpUrl,
          // filename: `${value.name.split('.')[0]}.webp`, // Cambia extensión a .webp
          // thumbnails: {
          //   small: {
          //     url: webpUrl.replace('/upload/', '/upload/w_500,q_80,f_webp/'),
          //   },
          //   large: {
          //     url: webpUrl.replace('/upload/', '/upload/q_80,f_webp/'),
          //   },
          // },
        });
      } else if (key === 'category') {
        if (!Array.isArray(fields[key])) {
          fields[key] = [];
        }
        fields[key].push(value);
      } else {
        fields[key] = value;
      }
    }
    console.log(fields);
    // Crear registro en Airtable
    const created = await base(TABLE_NAME).create([
      {
        fields: {
          Name: fields.name,
          'Unit cost': parseFloat(fields.price),
          type: fields.category,
          Images: attachments, // URLs en formato WebP
        },
      },
    ]);

    return NextResponse.json({ success: true, record: created[0] }, { status: 201 });
  } catch (err: any) {
    console.error('Error al crear:', err);
    return NextResponse.json(
      { error: 'Error al crear el producto: ' + err.message },
      { status: 500 }
    );
  }
}
