import type { MetadataRoute } from "next";
import {
  getTools,
  getComparisons,
  getPrompts,
  getTutorials,
  getUseCases,
  getRankings,
  getNews,
} from "@/lib/supabase-db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://aihub.com";

  // Fetch lists asynchronously from Supabase / fallback
  const tools = await getTools();
  const comparisons = await getComparisons();
  const prompts = await getPrompts();
  const tutorials = await getTutorials();
  const useCases = await getUseCases();
  const rankings = await getRankings();
  const news = await getNews();

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${siteUrl}/tools`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/compare`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/rankings`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/prompts`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/tutorials`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/use-cases`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/news`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
  ];

  // Tool pages
  const toolPages: MetadataRoute.Sitemap = tools.map((tool) => ({
    url: `${siteUrl}/tools/${tool.slug}`,
    lastModified: new Date(tool.updated_at),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // Comparison pages
  const comparisonPages: MetadataRoute.Sitemap = comparisons.map((c) => ({
    url: `${siteUrl}/compare/${c.slug}`,
    lastModified: new Date(c.updated_at),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  // Prompt pages
  const promptPages: MetadataRoute.Sitemap = prompts.map((p) => ({
    url: `${siteUrl}/prompts/${p.slug}`,
    lastModified: new Date(p.updated_at),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  // Tutorial pages
  const tutorialPages: MetadataRoute.Sitemap = tutorials.map((t) => ({
    url: `${siteUrl}/tutorials/${t.slug}`,
    lastModified: new Date(t.updated_at),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  // Use case pages
  const useCasePages: MetadataRoute.Sitemap = useCases.map((u) => ({
    url: `${siteUrl}/use-cases/${u.slug}`,
    lastModified: new Date(u.updated_at),
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  // Ranking pages
  const rankingPages: MetadataRoute.Sitemap = rankings.map((r) => ({
    url: `${siteUrl}/rankings/${r.slug}`,
    lastModified: new Date(r.updated_at),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // News pages
  const newsPages: MetadataRoute.Sitemap = news.map((n) => ({
    url: `${siteUrl}/news/${n.slug}`,
    lastModified: new Date(n.updated_at),
    changeFrequency: "daily" as const,
    priority: 0.6,
  }));

  return [
    ...staticPages,
    ...toolPages,
    ...comparisonPages,
    ...promptPages,
    ...tutorialPages,
    ...useCasePages,
    ...rankingPages,
    ...newsPages,
  ];
}
