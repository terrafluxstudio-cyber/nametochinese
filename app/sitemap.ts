import { MetadataRoute } from "next";
import { ARTICLE_SLUGS } from "./naming-rules/content";
import { getAllGroups } from "@/lib/ruCelebrities";
import { getAllNameSlugs } from "@/lib/englishNames";
import { getAllWordSlugs } from "@/lib/englishWords";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://nametochinese.com";
  const now = new Date();

  const namingRuleArticles: MetadataRoute.Sitemap = ARTICLE_SLUGS.map((slug) => ({
    url: `${baseUrl}/naming-rules/${slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  // 俄语名人同名聚合页（程序化 SEO）
  const ruCelebrityPages: MetadataRoute.Sitemap = getAllGroups().map((g) => ({
    url: `${baseUrl}/ru/name/${g.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  // 英文名→中文 长尾页（programmatic SEO）
  const englishNamePages: MetadataRoute.Sitemap = getAllNameSlugs().map((slug) => ({
    url: `${baseUrl}/${slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  // 英文常用词→中文 长尾页（P2，去重：词 slug 撞人名则人名优先）
  const nameSlugSet = new Set(getAllNameSlugs());
  const englishWordPages: MetadataRoute.Sitemap = getAllWordSlugs()
    .filter((slug) => !nameSlugSet.has(slug))
    .map((slug) => ({
      url: `${baseUrl}/${slug}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    }));

  return [
    ...namingRuleArticles,
    ...englishNamePages,
    ...englishWordPages,
    {
      url: `${baseUrl}/how-to-write-your-name-in-chinese`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/gov-titles-guide`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/place-names-guide`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/transliteration-characters-guide`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/names-in-chinese`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/words-in-chinese`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/ru/names`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    ...ruCelebrityPages,
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/places`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/convert`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/wade-giles`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/pinyin`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/name-to-pinyin`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/ru`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/ko`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/ja`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/naming-rules`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/zh-convert`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/gov-titles`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
