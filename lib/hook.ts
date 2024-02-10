import useSWR from 'swr';

export function GetDataProduct(
  search?: string,
  typeSearch?: string[] | '',
  typePrice?: number[] | '',
  limit?: number,
  offset?: number
) {
  const {data, isLoading} = useSWR(
    [
      `/api/product${search ? '?q=' + search : ''}${
        typePrice?.length && search
          ? '&price=' + JSON.stringify(typePrice)
          : '?price=' + JSON.stringify(typePrice)
      }${
        typeSearch?.length ? '&type=' + JSON.stringify(typeSearch) : '&type=[]'
      }&limit=${limit}&offset=${offset}`,
    ],
    fetcher,
    {
      revalidateOnFocus: false,
      refreshInterval: 3600000,
    }
  );
  return {data, isLoading};
}
export function GetDataCartShopping(ids: string | null) {
  const option = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ids}),
  };
  const {data, isLoading} = useSWR(
    ids ? [`/api/product/cartShopping`, option] : null,
    fetcher,
    {
      revalidateOnFocus: false,
      refreshInterval: 3600000,
    }
  );
  return {dataCartShopping: data};
}
export function GetProductFeatured() {
  const {data} = useSWR([`/api/product/featured`], fetcher, {
    revalidateOnFocus: false,
    refreshInterval: 3600000,
  });
  return {data};
}
export function GetFrontPage() {
  const {data} = useSWR([`/api/product/frontPage`], fetcher, {
    revalidateOnFocus: false,
    refreshInterval: 3600000,
  });
  return {data};
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
