"use client";
import useSWR from "swr";
import { useMemo } from "react";
import { TypeCompra } from "./atom";

export type ProductFrontPage = {
  Name: string;
  Images: { url: string }[]; // Puedes ajustar esto según cómo venga exactamente
  "Unit cost": number;
  type: string[];
  featured: boolean;
  frontPage: boolean;
  talla: string[];
  objectID: string;
  _highlightResult?: any; // Puedes tipar esto mejor si lo usas
};
type Thumbnail = {
  url: string;
  width: number;
  height: number;
};

type Thumbnails = {
  small: Thumbnail;
  large: Thumbnail;
  full: Thumbnail;
};

type ProductImage = {
  id: string;
  filename: string;
  size: number;
  type: string;
  url: string;
  width: number;
  height: number;
  thumbnails: Thumbnails;
};

export type Product = {
  Name: string;
  "Unit cost": number;
  priceOfert: number;
  oferta: string;
  talla: string[];
  type: string[];
  objectID: string;
  Images: ProductImage[];
};

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
      `/api/product${search ? "?q=" + search : ""}${
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
