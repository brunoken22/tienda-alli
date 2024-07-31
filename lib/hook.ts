import useSWR from 'swr';

export function GetDataProduct(
  search?: string,
  typeSearch?: string[] | '',
  typePrice?: number[] | '',
  limit?: number,
  offset?: number,
  order?: 'asc' | 'desc'
) {
  const {data, isLoading} = useSWR(
    [
      `/api/product${search ? '?q=' + search : ''}${
        typePrice?.length && search
          ? '&price=' + JSON.stringify(typePrice)
          : '?price=' + JSON.stringify(typePrice)
      }${
        typeSearch?.length ? '&type=' + JSON.stringify(typeSearch) : '&type=[]'
      }&limit=${limit}&offset=${offset}&order=${order}`,
    ],
    fetcher,
    {
      revalidateOnFocus: false,
      refreshInterval: 3600000,
    }
  );
  return {data, isLoading};
}
export async function getDataCartShopping(ids: string | null) {
  const option = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ids}),
  };
  const data = await fetcher([`/api/product/cartShopping`, option]);
  return data;
}
export async function getProductFeatured() {
  const data = await fetcher([`/api/product/featured`]);
  return data;
}
export async function getFrontPage() {
  const response = await fetch(
    (process.env.NEXT_PUBLIC_API || 'http://localhost:3000') +
      '/api/product/frontPage',
    {cache: 'no-cache'}
  );
  const data = await response.json();
  return data;
}

async function fetcher(dataParams: any[]) {
  const option = dataParams[1] || {};
  const response = await fetch(
    (process.env.NEXT_PUBLIC_API || 'http://localhost:3000') + dataParams[0],
    option
  );
  const data = await response.json();
  return data;
}
