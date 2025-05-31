// app/api/products/route.ts

import { NextResponse } from 'next/server';
import { base } from '@/lib/airtable';
export const runtime = 'nodejs';

interface AirtableResponse {
  records: Array<{
    id: string;
    createdTime: string;
    fields: Record<string, any>;
  }>;
  offset?: string;
}

interface FurnitureRecord {
  id: string;
  createdTime: string;
  fields: {
    Name?: string;
    Description?: string;
    Price?: number;
    Category?: string;
    Images?: Array<{ url: string }>;
    [key: string]: any;
  };
}

export async function POST(req: Request) {
  const body = await req.json();
  const TABLE_NAME = 'Productos';

  try {
    const created = await base(TABLE_NAME).create([
      {
        fields: {
          name: body.name,
          sku: body.sku,
          price: body.price,
          category: body.category,
          stock: body.stock,
          status: body.status,
          description: body.description,
          brand: body.brand,
        },
      },
    ]);

    return NextResponse.json({ success: true, record: created[0] }, { status: 201 });
  } catch (err: any) {
    console.error('Error al crear:', err);
    return NextResponse.json({ error: 'Error al crear el producto' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const AIRTABLE_ENDPOINT = `https://api.airtable.com/v0/${process.env.AIRTABLE_ID}/Furniture`;
  const { searchParams } = new URL(request.url);
  console.log('ESTA ES LA URL DEL ENDPOINT', AIRTABLE_ENDPOINT);
  // Parámetros con validación
  const limit = Math.min(parseInt(searchParams.get('limit') || '10', 10), 100);
  const offset = searchParams.get('offset') || undefined;
  const category = searchParams.get('category');
  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');
  const sortField = searchParams.get('sort') || 'Name';
  const sortDirection = searchParams.get('sortDirection') === 'desc' ? 'desc' : 'asc';
  const fields = searchParams.get('fields')?.split(',');

  try {
    const headers = {
      Authorization: `Bearer ${process.env.AIRTABLE}`,
      'Content-Type': 'application/json',
    };

    // Construir parámetros de consulta
    const queryParams = new URLSearchParams();
    queryParams.append('pageSize', Math.min(100, limit).toString());

    if (offset) queryParams.append('offset', offset);
    // queryParams.append('sort[0][field]', sortField);
    // queryParams.append('sort[0][direction]', sortDirection);

    // // Añadir filtros
    // const filterFormulaParts = [];
    // if (category) filterFormulaParts.push(`{Category} = '${category}'`);
    // if (minPrice) filterFormulaParts.push(`{Price} >= ${minPrice}`);
    // if (maxPrice) filterFormulaParts.push(`{Price} <= ${maxPrice}`);

    // if (filterFormulaParts.length > 0) {
    //   queryParams.append('filterByFormula', `AND(${filterFormulaParts.join(', ')})`);
    // }

    // // Campos específicos si se solicitan
    // if (fields && fields.length > 0) {
    //   fields.forEach((field) => queryParams.append('fields[]', field));
    // }

    const apiUrl = `${AIRTABLE_ENDPOINT}?${queryParams.toString()}`;
    console.log(`[GET] Fetching from Airtable API: ${apiUrl}`);

    const response = await fetch(apiUrl, { headers });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to fetch from Airtable');
    }

    const data: AirtableResponse = await response.json();
    const records = data.records;
    console.log(records[0].fields);
    // Paginación manual si es necesario (cuando limit < pageSize)
    const paginatedRecords = records.slice(0, limit);

    // Transformar datos si se solicitaron campos específicos
    const result =
      fields && fields.length > 0
        ? paginatedRecords.map((record) => {
            const transformed: any = { id: record.id };
            fields.forEach((field) => {
              if (field in record.fields) {
                transformed[field] = record.fields[field];
              }
            });
            return transformed;
          })
        : paginatedRecords;

    return NextResponse.json(
      {
        records: result,
        pagination: {
          limit,
          offset: data.offset || null,
          total: records.length,
        },
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, max-age=300, stale-while-revalidate=60',
        },
      }
    );
  } catch (err: any) {
    console.error('[GET] Error:', err);
    return NextResponse.json(
      {
        error: 'Failed to fetch furniture items',
        details: err.message,
        ...(process.env.NODE_ENV === 'development' && {
          stack: err.stack,
        }),
      },
      { status: err.status || 500 }
    );
  }
}
