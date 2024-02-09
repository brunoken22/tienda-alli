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
      filters: `${cadenaDeBusquedaPrice ? cadenaDeBusquedaPrice : ''}   ${
        cadenaDeBusquedaCategory ? ' AND ' + cadenaDeBusquedaCategory : ''
      } AND (NOT fontPage:true OR NOT _exists_:fontPage)`,
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
export async function getCartShopping(dataParans: any[]) {
  const ids = dataParans.map((item) => item.id);
  const data = await index.getObjects(ids);

  const newDataFinal = data.results.map((item: any) => ({
    cantidad:
      dataParans.find((itemParams) => itemParams.id == item.objectID)
        .cantidad || 0,
    id: item?.objectID,
    title: item['Name'],
    img: item?.Images[0].url,
    price: item.priceOfert || item['Unit cost'],
  }));
  return newDataFinal;
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
