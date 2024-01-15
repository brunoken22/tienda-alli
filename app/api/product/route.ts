export const dynamic = 'force-dynamic';

import {index} from '@/lib/algolia';
import {NextResponse} from 'next/server';
export async function GET(req: Request) {
  try {
    const {searchParams} = new URL(req.url);
    const search = searchParams.get('q');
    const data = await index.search(search || '', {
      page: 0, // Número de página
      hitsPerPage: 100,
    });
    return NextResponse.json(data.hits);
  } catch (e) {
    return NextResponse.json(e);
  }
}
