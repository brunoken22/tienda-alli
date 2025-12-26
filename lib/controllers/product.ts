import { base } from "../airtable";

export async function searchProduct(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("q") || "";
    const typeCategory = searchParams.get("type") || "";
    const typePrice = JSON.parse(searchParams.get("price") || "");
    const limit = Number(searchParams.get("limit") || 16);
    const offset = Number(searchParams.get("offset") || 0);
    const order = searchParams.get("order") || "desc";
    const { finalLimit, finalOffset } = getOffsetAndLimitFom(limit, offset);

    const cadenaDeBusquedaPrice = `"Unit cost" >= ${typePrice[0]} AND "Unit cost" <= ${typePrice[1]}`;

    return {
      results: [],
      success: true,
      pagination: {
        limit: finalLimit,
        offset: finalOffset,
        total: 4,
        order,
      },
    };
  } catch (e: any) {
    return { success: false, message: e.message };
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
  return { finalLimit, finalOffset };
}

export async function getProducts() {
  const productBase = base("Furniture").select();
  const data = await productBase.all();
  return data.map((product) => ({ ...product.fields, id: product.id }));
}
