import { createClient } from "./supabase/server";
import * as mock from "./data";
import type {
  Category,
  Tool,
  Comparison,
  ComparisonFeature,
  Prompt,
  PromptCategory,
  Tutorial,
  TutorialCategory,
  UseCase,
  Ranking,
  RankingEntry,
  NewsArticle,
  ToolPricing,
} from "@/types";

const isConfigured = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return url && url !== "your_supabase_project_url" && key && key !== "your_supabase_anon_key";
};

// ============================================================================
// 1. CATEGORIES
// ============================================================================
export async function getCategories(): Promise<Category[]> {
  if (!isConfigured()) return mock.categories;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error("Supabase error fetching categories:", err);
    return mock.categories;
  }
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  if (!isConfigured()) return mock.getCategoryBySlug(slug) || null;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();
    if (error) throw error;
    return data;
  } catch (err) {
    console.error("Supabase error fetching category by slug:", err);
    return mock.getCategoryBySlug(slug) || null;
  }
}

export async function getCategoryById(id: string): Promise<Category | null> {
  if (!isConfigured()) return mock.getCategoryById(id) || null;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) throw error;
    return data;
  } catch (err) {
    console.error("Supabase error fetching category by id:", err);
    return mock.getCategoryById(id) || null;
  }
}

// ============================================================================
// 2. TOOLS
// ============================================================================
export async function getTools(filters?: {
  category?: string;
  pricing?: string;
  sort?: string;
  q?: string;
}): Promise<Tool[]> {
  if (!isConfigured()) {
    let result = [...mock.tools];
    if (filters?.q) {
      const query = filters.q.toLowerCase();
      result = result.filter(
        (t) =>
          t.name.toLowerCase().includes(query) ||
          t.tagline.toLowerCase().includes(query) ||
          t.description.toLowerCase().includes(query)
      );
    }
    if (filters?.category) {
      result = result.filter((t) => t.category_id === filters.category);
    }
    if (filters?.pricing) {
      result = result.filter((t) => t.pricing_type.toLowerCase() === filters.pricing?.toLowerCase());
    }
    // Sort
    result.sort((a, b) => {
      if (filters?.sort === "rating") return b.avg_rating - a.avg_rating;
      if (filters?.sort === "newest") return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      if (filters?.sort === "name") return a.name.localeCompare(b.name);
      return b.upvote_count - a.upvote_count;
    });
    return result;
  }

  try {
    const supabase = await createClient();
    let query = supabase.from("tools").select("*").eq("is_published", true);

    if (filters?.category) {
      query = query.eq("category_id", filters.category);
    }
    if (filters?.pricing) {
      query = query.eq("pricing_type", filters.pricing);
    }
    if (filters?.q) {
      query = query.or(`name.ilike.%${filters.q}%,tagline.ilike.%${filters.q}%,description.ilike.%${filters.q}%`);
    }

    // Sort order
    if (filters?.sort === "rating") {
      query = query.order("avg_rating", { ascending: false }).order("review_count", { ascending: false });
    } else if (filters?.sort === "newest") {
      query = query.order("created_at", { ascending: false });
    } else if (filters?.sort === "name") {
      query = query.order("name", { ascending: true });
    } else {
      // Default: upvotes
      query = query.order("upvote_count", { ascending: false });
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error("Supabase error fetching tools:", err);
    return mock.tools;
  }
}

export async function getToolBySlug(slug: string): Promise<Tool | null> {
  if (!isConfigured()) return mock.getToolBySlug(slug) || null;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("tools")
      .select("*")
      .eq("slug", slug)
      .eq("is_published", true)
      .maybeSingle();
    if (error) throw error;
    return data;
  } catch (err) {
    console.error("Supabase error fetching tool by slug:", err);
    return mock.getToolBySlug(slug) || null;
  }
}

export async function getFeaturedTools(): Promise<Tool[]> {
  if (!isConfigured()) return mock.getFeaturedTools();
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("tools")
      .select("*")
      .eq("is_featured", true)
      .eq("is_published", true)
      .order("upvote_count", { ascending: false });
    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error("Supabase error fetching featured tools:", err);
    return mock.getFeaturedTools();
  }
}

export async function getTrendingTools(): Promise<Tool[]> {
  if (!isConfigured()) return mock.getTrendingTools();
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("tools")
      .select("*")
      .eq("is_published", true)
      .order("upvote_count", { ascending: false })
      .limit(10);
    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error("Supabase error fetching trending tools:", err);
    return mock.getTrendingTools();
  }
}

export async function getToolPricing(toolId: string): Promise<ToolPricing[]> {
  if (!isConfigured()) return mock.getToolPricing(toolId);
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("tool_pricing")
      .select("*")
      .eq("tool_id", toolId)
      .order("sort_order", { ascending: true });
    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error("Supabase error fetching tool pricing:", err);
    return mock.getToolPricing(toolId);
  }
}

// ============================================================================
// 3. COMPARISONS
// ============================================================================
export async function getComparisons(): Promise<Comparison[]> {
  if (!isConfigured()) return mock.comparisons;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("comparisons")
      .select("*")
      .eq("is_published", true)
      .order("view_count", { ascending: false });
    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error("Supabase error fetching comparisons:", err);
    return mock.comparisons;
  }
}

export async function getComparisonBySlug(slug: string): Promise<Comparison | null> {
  if (!isConfigured()) return mock.getComparisonBySlug(slug) || null;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("comparisons")
      .select("*")
      .eq("slug", slug)
      .eq("is_published", true)
      .maybeSingle();
    if (error) throw error;
    return data;
  } catch (err) {
    console.error("Supabase error fetching comparison by slug:", err);
    return mock.getComparisonBySlug(slug) || null;
  }
}

export async function getComparisonFeatures(comparisonId: string): Promise<ComparisonFeature[]> {
  if (!isConfigured()) return mock.getComparisonFeatures(comparisonId);
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("comparison_features")
      .select("*")
      .eq("comparison_id", comparisonId)
      .order("sort_order", { ascending: true });
    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error("Supabase error fetching comparison features:", err);
    return mock.getComparisonFeatures(comparisonId);
  }
}

// ============================================================================
// 4. RANKINGS
// ============================================================================
export async function getRankings(): Promise<Ranking[]> {
  if (!isConfigured()) return mock.rankings;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("rankings")
      .select("*")
      .eq("is_published", true)
      .order("view_count", { ascending: false });
    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error("Supabase error fetching rankings:", err);
    return mock.rankings;
  }
}

export async function getRankingBySlug(slug: string): Promise<Ranking | null> {
  if (!isConfigured()) return mock.getRankingBySlug(slug) || null;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("rankings")
      .select("*")
      .eq("slug", slug)
      .eq("is_published", true)
      .maybeSingle();
    if (error) throw error;
    return data;
  } catch (err) {
    console.error("Supabase error fetching ranking by slug:", err);
    return mock.getRankingBySlug(slug) || null;
  }
}

export async function getRankingEntries(rankingId: string): Promise<(RankingEntry & { tool: Tool })[]> {
  if (!isConfigured()) return mock.getRankingEntries(rankingId);
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("ranking_entries")
      .select("*, tool:tools(*)")
      .eq("ranking_id", rankingId)
      .order("position", { ascending: true });
    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error("Supabase error fetching ranking entries:", err);
    return mock.getRankingEntries(rankingId);
  }
}

// ============================================================================
// 5. PROMPTS
// ============================================================================
export async function getPrompts(filters?: {
  category?: string;
  difficulty?: string;
}): Promise<Prompt[]> {
  if (!isConfigured()) {
    let result = [...mock.prompts];
    if (filters?.category) {
      result = result.filter((p) => p.category_id === filters.category);
    }
    if (filters?.difficulty) {
      result = result.filter((p) => p.difficulty.toLowerCase() === filters.difficulty?.toLowerCase());
    }
    return result;
  }

  try {
    const supabase = await createClient();
    let query = supabase.from("prompts").select("*").eq("is_published", true);

    if (filters?.category) {
      query = query.eq("category_id", filters.category);
    }
    if (filters?.difficulty) {
      query = query.eq("difficulty", filters.difficulty.toLowerCase());
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error("Supabase error fetching prompts:", err);
    return mock.prompts;
  }
}

export async function getPromptBySlug(slug: string): Promise<Prompt | null> {
  if (!isConfigured()) return mock.prompts.find((p) => p.slug === slug) || null;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("prompts")
      .select("*")
      .eq("slug", slug)
      .eq("is_published", true)
      .maybeSingle();
    if (error) throw error;
    return data;
  } catch (err) {
    console.error("Supabase error fetching prompt by slug:", err);
    return mock.prompts.find((p) => p.slug === slug) || null;
  }
}

export async function getPromptCategories(): Promise<PromptCategory[]> {
  if (!isConfigured()) return mock.promptCategories;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("prompt_categories")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error("Supabase error fetching prompt categories:", err);
    return mock.promptCategories;
  }
}

// ============================================================================
// 6. TUTORIALS
// ============================================================================
export async function getTutorials(filters?: {
  category?: string;
  difficulty?: string;
}): Promise<Tutorial[]> {
  if (!isConfigured()) {
    let result = [...mock.tutorials];
    if (filters?.category) {
      result = result.filter((tu) => tu.category_id === filters.category);
    }
    if (filters?.difficulty) {
      result = result.filter((tu) => tu.difficulty.toLowerCase() === filters.difficulty?.toLowerCase());
    }
    return result;
  }

  try {
    const supabase = await createClient();
    let query = supabase.from("tutorials").select("*").eq("is_published", true);

    if (filters?.category) {
      query = query.eq("category_id", filters.category);
    }
    if (filters?.difficulty) {
      query = query.eq("difficulty", filters.difficulty.toLowerCase());
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error("Supabase error fetching tutorials:", err);
    return mock.tutorials;
  }
}

export async function getTutorialBySlug(slug: string): Promise<Tutorial | null> {
  if (!isConfigured()) return mock.tutorials.find((tu) => tu.slug === slug) || null;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("tutorials")
      .select("*")
      .eq("slug", slug)
      .eq("is_published", true)
      .maybeSingle();
    if (error) throw error;
    return data;
  } catch (err) {
    console.error("Supabase error fetching tutorial by slug:", err);
    return mock.tutorials.find((tu) => tu.slug === slug) || null;
  }
}

export async function getTutorialCategories(): Promise<TutorialCategory[]> {
  if (!isConfigured()) return mock.tutorialCategories;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("tutorial_categories")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error("Supabase error fetching tutorial categories:", err);
    return mock.tutorialCategories;
  }
}

// ============================================================================
// 7. USE CASES
// ============================================================================
export async function getUseCases(): Promise<UseCase[]> {
  if (!isConfigured()) return mock.useCases;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("use_cases")
      .select("*")
      .eq("is_published", true)
      .order("view_count", { ascending: false });
    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error("Supabase error fetching use cases:", err);
    return mock.useCases;
  }
}

export async function getUseCaseBySlug(slug: string): Promise<UseCase | null> {
  if (!isConfigured()) return mock.useCases.find((uc) => uc.slug === slug) || null;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("use_cases")
      .select("*")
      .eq("slug", slug)
      .eq("is_published", true)
      .maybeSingle();
    if (error) throw error;
    return data;
  } catch (err) {
    console.error("Supabase error fetching use case by slug:", err);
    return mock.useCases.find((uc) => uc.slug === slug) || null;
  }
}

// ============================================================================
// 8. NEWS
// ============================================================================
export async function getNews(): Promise<NewsArticle[]> {
  if (!isConfigured()) return mock.news;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("news")
      .select("*")
      .eq("is_published", true)
      .order("published_at", { ascending: false });
    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error("Supabase error fetching news:", err);
    return mock.news;
  }
}

export async function getNewsBySlug(slug: string): Promise<NewsArticle | null> {
  if (!isConfigured()) return mock.news.find((n) => n.slug === slug) || null;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("news")
      .select("*")
      .eq("slug", slug)
      .eq("is_published", true)
      .maybeSingle();
    if (error) throw error;
    return data;
  } catch (err) {
    console.error("Supabase error fetching news by slug:", err);
    return mock.news.find((n) => n.slug === slug) || null;
  }
}

export async function getToolById(id: string): Promise<Tool | null> {
  if (!isConfigured()) return mock.getToolById(id) || null;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("tools")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) throw error;
    return data;
  } catch (err) {
    console.error("Supabase error fetching tool by id:", err);
    return mock.getToolById(id) || null;
  }
}
