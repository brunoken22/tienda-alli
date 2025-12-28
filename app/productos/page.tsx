import type { Metadata } from "next";
import ProductosComponent from "@/components/productos";

export const metadata: Metadata = {
  title: "Productos ",
  description: "Los productos (Tienda Alli)",
  alternates: {
    canonical: "https://tienda-alli.vercel.app/productos",
  },
  openGraph: {
    title: "Productos | Tienda Alli",
    description: "Descubre los mejores productos en Tienda Alli",
    url: "https://tienda-alli.vercel.app/productos",
    siteName: "Tienda Alli",
    images: [
      {
        url: "/tienda-alli.webp",
        width: 1200,
        height: 630,
        alt: "Tienda Alli - Productos",
      },
    ],
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Productos | Tienda Alli",
    description: "Descubre los mejores productos en Tienda Alli",
    images: ["https://tienda-alli.vercel.app/tienda-alli.webp"], // Misma imagen que OG
  },
  authors: [{ name: "Bruno ken", url: "https://brunoken.vercel.app/" }],
};

export default function Products() {
  return <ProductosComponent />;
}
