import {index} from '@/lib/algolia';
import {NextResponse} from 'next/server';
export async function GET() {
  try {
    const data = await index.search('', {
      page: 0, // Número de página
      hitsPerPage: 50,
    });
    return NextResponse.json(data.hits);
  } catch (e) {
    return NextResponse.json(e);
  }
}
