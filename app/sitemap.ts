import type { MetadataRoute } from "next";
const URL = "https://gabii-alli.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const sitemapPages = [
    {
      url: URL,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 1,
    },
    {
      url: `${URL}/nosotros`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${URL}/productos`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
  ];

  try {
    const productsResponse = await fetch(`${URL}/api/sitemap/products`);
    const products = await productsResponse.json();
    if (products.success) {
      const productPages = products.data.map((productId: { id: string }) => ({
        url: `${URL}/productos/${productId.id}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.6,
      }));
      return [...sitemapPages, ...productPages];
    }
    return sitemapPages;
  } catch (e) {
    return sitemapPages;
  }
}
