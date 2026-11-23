import type { MetadataRoute } from "next";
import { getPublishedHqs } from "@/lib/catalog";
import { getSiteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const site = getSiteUrl();
  const fixas = ["", "/sobre", "/contribuir"].map((p) => ({ url: `${site}${p}` }));
  const hqs = getPublishedHqs().map((hq) => ({ url: `${site}/hqs/${hq.slug}` }));
  return [...fixas, ...hqs];
}
