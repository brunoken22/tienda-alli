import useSWR from 'swr';

export function GetDataProduct() {
  const {data, isLoading} = useSWR(
    process.env.API || 'http://localhost:3000/api/product',
    fetcher
  );
  return {data, isLoading};
}

async function fetcher(api: string) {
  const response = await fetch(api);
  const data = await response.json();
  return data;
}
