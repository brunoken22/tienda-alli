import {index} from '@/lib/algolia';

export async function GET() {
  const products = await index
    .search('', {
      filters: 'featured:true AND NOT fontPage:false',
    })
    .catch((e) => e);

  return Response.json(products.hits);
}
