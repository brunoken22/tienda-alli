"use client";
import useSWR from "swr";
import { ShoppingCart } from "@/types/shopping-cart";

async function fetcher(dataParams: any[]) {
  const option = dataParams[1] || {};
  const response = await fetch(
    (process.env.NEXT_PUBLIC_API || "http://localhost:3000") + dataParams[0],
    option
  );
  const data = await response.json();
  return data;
}

export function GetDataProduct(
  search?: string,
  typeSearch?: string[] | "",
  typePrice?: number[] | "",
  limit?: number,
  offset?: number,
  order?: "asc" | "desc",
  onSale?: boolean,
  sortBy?: string
) {
  const { data, isLoading } = useSWR(
    [
      `/api/admin/product${search ? "?q=" + search : ""}${
        typePrice?.length && search
          ? "&price=" + JSON.stringify(typePrice)
          : "?price=" + JSON.stringify(typePrice)
      }${
        typeSearch?.length ? "&type=" + JSON.stringify(typeSearch) : "&type=[]"
      }&limit=${limit}&offset=${offset}&sortBy=${sortBy}&order=${order}&onSale=${onSale}`,
    ],
    fetcher,
    {
      revalidateOnFocus: false,
      refreshInterval: 3600000,
    }
  );
  return { data, isLoading };
}

export async function getDataCartShopping(shoppingCart: ShoppingCart[]) {
  const option = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(shoppingCart),
  };
  const data = await fetcher([`/api/product/cartShopping`, option]);
  return data;
}
