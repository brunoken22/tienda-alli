import baseURL from "@/utils/baseUrl";
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  console.log("Generando sitemap...", baseURL);
  const sitemapPages = [
    {
      url: baseURL,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 1,
    },
    {
      url: `${baseURL}/nosotros`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${baseURL}/productos`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
  ];

  try {
    const productsResponse = await fetch(`${baseURL}/api/sitemap/products`);
    const products = await productsResponse.json();
    if (products.success) {
      const productPages = products.data.map((productId: { id: string }) => ({
        url: `${baseURL}/productos/${productId.id}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.6,
      }));
      return [...sitemapPages, ...productPages];
    }
    return sitemapPages;
  } catch (e) {
    console.error("Error al generar sitemap: ", e);
    return sitemapPages;
  }
}
