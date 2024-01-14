import useSWR from 'swr';

export function GetDataProduct() {
  const {data, isLoading} = useSWR('/api/product', fetcher);
  return {data, isLoading};
}

async function fetcher(api: string) {
  const response = await fetch(
    process.env.NEXT_PUBLIC_API || 'http://localhost:3000' + api
  );
  const data = await response.json();
  return data;
}
