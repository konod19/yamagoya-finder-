import type { MetadataRoute } from "next";
import { supabase } from "@/lib/supabase";

const BASE_URL = "https://yamagoya-finder.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { data: huts } = await supabase.from("huts").select("id");

  const hutUrls: MetadataRoute.Sitemap = (huts ?? []).map((hut) => ({
    url: `${BASE_URL}/huts/${hut.id}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${BASE_URL}/gear`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/mountains`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
    ...hutUrls,
  ];
}
