import useSWRImmutable from 'swr/immutable';

export function GetDataProduct(search?: string) {
  const {data, isLoading} = useSWRImmutable(
    `/api/product${search ? '?q=' + search : ''}`,
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