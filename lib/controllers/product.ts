import {index} from '@/lib/algolia';
export async function searchProduct(req: Request) {
  try {
    const {searchParams} = new URL(req.url);
    const search = searchParams.get('q') || '';
    const typeCategory = searchParams.get('type') || '';
    const typePrice = JSON.parse(searchParams.get('price') || '');
    const limit = Number(searchParams.get('limit') || 15);
    const offset = Number(searchParams.get('offset') || 0);

    const {finalLimit, finalOffset} = getOffsetAndLimitFom(limit, offset);
    const cadenaDeBusquedaCategory = JSON.parse(typeCategory)
      .map((item: string) => `type:${item}`)
      .join(' OR ');

    const cadenaDeBusquedaPrice = `"Unit cost" >= ${typePrice[0]} AND "Unit cost" <= ${typePrice[1]}`;
    const data = await index.search(search, {
      hitsPerPage: finalLimit,
      offset: finalOffset,
      length: finalLimit,
      filters: ` ${cadenaDeBusquedaPrice ? cadenaDeBusquedaPrice : ''}  ${
        cadenaDeBusquedaCategory ? ' AND ' + cadenaDeBusquedaCategory : ''
      }`,
    });
    return {
      results: data.hits,
      pagination: {
        limit: finalLimit,
        offset: finalOffset,
        total: data.nbHits,
      },
    };
  } catch (e) {
    return e;
  }
}
export function getOffsetAndLimitFom(
  limit: number,
  offset: number,
  maxLimit = 100,
  maxOffset = 100000
) {
  let finalLimit = 10;
  if (limit > 0 && limit < maxLimit) {
    finalLimit = limit;
  } else if (limit > maxLimit) {
    finalLimit = maxLimit;
  }

  const finalOffset = offset < maxOffset ? offset : 0;
  return {finalLimit, finalOffset};
}