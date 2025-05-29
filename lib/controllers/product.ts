import { index } from '@/lib/algolia';
export async function searchProduct(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('q') || '';
    const typeCategory = searchParams.get('type') || '';
    const typePrice = JSON.parse(searchParams.get('price') || '');
    const limit = Number(searchParams.get('limit') || 16);
    const offset = Number(searchParams.get('offset') || 0);
    const order = searchParams.get('order') || 'desc';
    const { finalLimit, finalOffset } = getOffsetAndLimitFom(limit, offset);
    const cadenaDeBusquedaCategory = JSON.parse(typeCategory)
      .map((item: string) => `type:${item}`)
      .join(' OR ');

    const cadenaDeBusquedaPrice = `"Unit cost" >= ${typePrice[0]} AND "Unit cost" <= ${typePrice[1]}`;

    await index.setSettings({
      customRanking: [`${order}(Unit cost)`],
    });
    await new Promise((resolve) => setTimeout(resolve, 3000));

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
        order,
      },
    };
  } catch (e) {
    return e;
  }
}
export async function getCartShopping(dataParans: any[]) {
  const newDataFinalPromises = dataParans.map(async (item) => {
    const data: any = await index.getObject(item.id);
    return {
      cantidad: item.cantidad,
      id: item?.id,
      title: item.title,
      price: item.price,
      talla: item.talla,
      img: data.Images[0].url,
    };
  });

  const newDataFinal = await Promise.all(newDataFinalPromises);
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
  return { finalLimit, finalOffset };
}
export function suma(num1: number, num2: number): number {
  return num1 + num2;
}
