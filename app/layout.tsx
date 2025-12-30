import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import LayoutRoot from "@/components/layout";
import { GoogleAnalytics } from "@next/third-parties/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Tienda Alli",
    template: "%s | Tienda Alli", // Para títulos dinámicos en páginas hijas
  },
  description:
    "Útiles escolares, mochilas, cartucheras, ropa y camperas importadas. Productos de calidad para todas tus necesidades",
  keywords: [
    "útiles escolares",
    "mochilas",
    "cartucheras",
    "material educativo",
    "tienda escolar",
    "ropa importada",
    "camperas importadas",
    "moda",
    "vestimenta",
  ],
  openGraph: {
    title: "Tienda Alli - Útiles Escolares y Ropa Importada",
    description:
      "Encuentra los mejores útiles escolares, mochilas, cartucheras y ropa importada de calidad",
    url: "https://tienda-alli.vercel.app",
    siteName: "Tienda Alli",
    images: [
      {
        url: "https://tienda-alli.vercel.app/tienda-alli.webp",
        width: 1200,
        height: 630,
        alt: "Tienda Alli - Productos escolares y ropa importada de calidad",
      },
    ],
    locale: "es_EC",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tienda Alli - Útiles Escolares y Moda",
    description: "Los mejores productos escolares y ropa importada para todas tus necesidades",
    images: ["https://tienda-alli.vercel.app/tienda-alli.webp"],
    creator: "@BrunoKen",
  },
  alternates: {
    canonical: "https://tienda-alli.vercel.app",
  },
  metadataBase: new URL("https://tienda-alli.vercel.app"),
  authors: [{ name: "Bruno ken", url: "https://brunoken.vercel.app/" }],
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='es'>
      <head>
        <meta
          name='google-site-verification'
          content='CnmK8AWJQTO2MYQ5J7dOu9_dhCFy-ttErrYHDEWbOyw'
        />
        <meta name='color-scheme' content='only light' />
      </head>
      <body className={`${inter.className} max-sm:bg-primary/90 bg-[#fcfcfc]`}>
        <LayoutRoot>{children}</LayoutRoot>
      </body>
      <GoogleAnalytics gaId='G-Q715Q9GQCN' />
    </html>
  );
}
