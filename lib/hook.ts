"use client";
import useSWR from "swr";
import { useMemo } from "react";
import { TypeCompra } from "./atom";

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
  order?: "asc" | "desc"
) {
  const { data, isLoading } = useSWR(
    [
      `/api/admin/product${search ? "?q=" + search : ""}${
        typePrice?.length && search
          ? "&price=" + JSON.stringify(typePrice)
          : "?price=" + JSON.stringify(typePrice)
      }${
        typeSearch?.length ? "&type=" + JSON.stringify(typeSearch) : "&type=[]"
      }&limit=${limit}&offset=${offset}&order=${order}`,
    ],
    fetcher,
    {
      revalidateOnFocus: false,
      refreshInterval: 3600000,
    }
  );
  return { data, isLoading };
}

export async function getDataCartShopping(ids: string | null) {
  const option = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ids }),
  };
  const data = await fetcher([`/api/product/cartShopping`, option]);
  return data.length ? data : [];
}

export function useCartCalculations(items: TypeCompra[]) {
  return useMemo(() => {
    const total = items.reduce(
      (accumulator, item) => accumulator + item.price * (item.cantidad || 1),
      0
    );

    const formattedTotal = total.toLocaleString("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });

    const orderText = `Mi pedido:
${items.map((item) => `🖌 ${item.cantidad} ${item.title}`).join("\n")}
🛒 *Total: ${formattedTotal}*`;

    return { total, formattedTotal, orderText };
  }, [items]);
}
