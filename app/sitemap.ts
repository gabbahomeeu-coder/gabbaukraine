import type { MetadataRoute } from "next";

const BASE_URL = "https://www.gabbaukraine.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const collections = ["madrid", "luna", "montana", "leora", "moka"];
  const now = new Date().toISOString();

  return [
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/collections`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...collections.map((slug) => ({
      url: `${BASE_URL}/collections/${slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    {
      url: `${BASE_URL}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/faq`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.8,
    },
  ];
}
