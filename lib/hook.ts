import useSWRImmutable from 'swr/immutable';

export function GetDataProduct(
  search?: string,
  typeSearch?: string[] | '',
  typePrice?: number[] | ''
) {
  const {data, isLoading} = useSWRImmutable(
    `/api/product${search ? '?q=' + search : ''}${
      typePrice?.length && search
        ? '&price=' + JSON.stringify(typePrice)
        : '?price=' + JSON.stringify(typePrice)
    }${
      typeSearch?.length ? '&type=' + JSON.stringify(typeSearch) : '&type=[]'
    }`,
    fetcher
  );
  return {data, isLoading};
}

async function fetcher(api: string) {
  const response = await fetch(
    (process.env.NEXT_PUBLIC_API || 'http://localhost:3000') + api
  );
  const data = await response.json();
  return data;
}
