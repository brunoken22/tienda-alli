import {index} from '@/lib/algolia';

export async function GET() {
  const products = await index
    .search('', {
      filters: 'frontPage:true',
    })
    .catch((e) => e);
  return Response.json(products.hits);
}
