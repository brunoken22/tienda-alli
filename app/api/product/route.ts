export const dynamic = 'force-dynamic';

import {index} from '@/lib/algolia';
import {NextResponse} from 'next/server';
export async function GET(req: Request) {
  try {
    const {searchParams} = new URL(req.url);
    const search = searchParams.get('q') || '';
    const typeCategory = searchParams.get('type') || '';
    const typePrice = JSON.parse(searchParams.get('price') || '');

    const cadenaDeBusquedaCategory = JSON.parse(typeCategory)
      .map((item: string) => `type:${item}`)
      .join(' OR ');
    const cadenaDeBusquedaPrice = `"Unit cost" >= ${typePrice[0]} AND "Unit cost" <= ${typePrice[1]}`;
    const data = await index.search(search, {
      page: 0,
      hitsPerPage: 150,
      filters: ` ${cadenaDeBusquedaPrice ? cadenaDeBusquedaPrice : ''}  ${
        cadenaDeBusquedaCategory ? ' AND ' + cadenaDeBusquedaCategory : ''
      }`,
    });

    return NextResponse.json(data.hits);
  } catch (e) {
    return NextResponse.json(e);
  }
}
