// ============================================================================
// AIHub - TypeScript Type Definitions
// ============================================================================

export interface User {
  id: string;
  email: string;
  full_name: string | null;
  username: string | null;
  avatar_url: string | null;
  bio: string | null;
  role: "user" | "admin" | "moderator";
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  color: string;
  parent_id: string | null;
  tool_count: number;
  sort_order: number;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface Tool {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  logo_url: string | null;
  screenshot_url: string | null;
  website_url: string;
  category_id: string;
  pricing_type: "free" | "freemium" | "paid" | "open_source" | "contact";
  starting_price: number | null;
  currency: string;
  is_featured: boolean;
  is_verified: boolean;
  is_published: boolean;
  avg_rating: number;
  review_count: number;
  upvote_count: number;
  view_count: number;
  bookmark_count: number;
  submitted_by: string | null;
  meta_title: string | null;
  meta_description: string | null;
  og_image_url: string | null;
  created_at: string;
  updated_at: string;
  published_at: string | null;
  // Joined fields
  category?: Category;
  features?: ToolFeature[];
  pricing?: ToolPricing[];
  reviews?: Review[];
}

export interface ToolFeature {
  id: string;
  tool_id: string;
  feature_name: string;
  feature_value: string | null;
  is_available: boolean;
  sort_order: number;
  created_at: string;
}

export interface ToolPricing {
  id: string;
  tool_id: string;
  plan_name: string;
  price: number | null;
  currency: string;
  billing_period: "monthly" | "yearly" | "one_time" | "custom" | null;
  features: string[];
  is_popular: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: string;
  tool_id: string;
  user_id: string;
  rating: number;
  title: string | null;
  content: string;
  pros: string[];
  cons: string[];
  is_verified_purchase: boolean;
  is_approved: boolean;
  helpful_count: number;
  created_at: string;
  updated_at: string;
  // Joined
  user?: User;
}

export interface Comparison {
  id: string;
  tool_a_id: string;
  tool_b_id: string;
  slug: string;
  title: string;
  summary: string | null;
  verdict: string | null;
  winner_id: string | null;
  view_count: number;
  is_published: boolean;
  meta_title: string | null;
  meta_description: string | null;
  created_at: string;
  updated_at: string;
  // Joined
  tool_a?: Tool;
  tool_b?: Tool;
  features?: ComparisonFeature[];
}

export interface ComparisonFeature {
  id: string;
  comparison_id: string;
  feature_name: string;
  category: string | null;
  tool_a_value: string | null;
  tool_b_value: string | null;
  tool_a_score: number | null;
  tool_b_score: number | null;
  sort_order: number;
  created_at: string;
}

export interface PromptCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  color: string;
  prompt_count: number;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Prompt {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  prompt_text: string;
  example_output: string | null;
  category_id: string;
  tool_id: string | null;
  author_id: string | null;
  tags: string[];
  difficulty: "beginner" | "intermediate" | "advanced";
  use_count: number;
  save_count: number;
  upvote_count: number;
  is_featured: boolean;
  is_published: boolean;
  meta_title: string | null;
  meta_description: string | null;
  created_at: string;
  updated_at: string;
  // Joined
  category?: PromptCategory;
  tool?: Tool;
}

export interface TutorialCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  color: string;
  tutorial_count: number;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Tutorial {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  cover_image_url: string | null;
  category_id: string;
  author_id: string | null;
  difficulty: "beginner" | "intermediate" | "advanced";
  read_time_minutes: number;
  tags: string[];
  related_tool_ids: string[];
  view_count: number;
  is_featured: boolean;
  is_published: boolean;
  meta_title: string | null;
  meta_description: string | null;
  created_at: string;
  updated_at: string;
  published_at: string | null;
  // Joined
  category?: TutorialCategory;
}

export interface UseCase {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  cover_image_url: string | null;
  audience: "students" | "teachers" | "marketers" | "developers" | "creators" | "business" | "general";
  icon: string | null;
  related_tool_ids: string[];
  tags: string[];
  view_count: number;
  is_featured: boolean;
  is_published: boolean;
  meta_title: string | null;
  meta_description: string | null;
  author_id: string | null;
  created_at: string;
  updated_at: string;
  published_at: string | null;
}

export interface Ranking {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  category: string;
  audience: string | null;
  icon: string | null;
  cover_image_url: string | null;
  methodology: string | null;
  view_count: number;
  is_featured: boolean;
  is_published: boolean;
  meta_title: string | null;
  meta_description: string | null;
  created_at: string;
  updated_at: string;
  published_at: string | null;
  // Joined
  entries?: RankingEntry[];
}

export interface RankingEntry {
  id: string;
  ranking_id: string;
  tool_id: string;
  position: number;
  score: number | null;
  highlights: string | null;
  pros: string[];
  cons: string[];
  created_at: string;
  updated_at: string;
  // Joined
  tool?: Tool;
}

export interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  cover_image_url: string | null;
  source_name: string | null;
  source_url: string | null;
  author_id: string | null;
  tags: string[];
  related_tool_ids: string[];
  view_count: number;
  is_featured: boolean;
  is_published: boolean;
  is_breaking: boolean;
  meta_title: string | null;
  meta_description: string | null;
  created_at: string;
  updated_at: string;
  published_at: string | null;
}

export interface Bookmark {
  id: string;
  user_id: string;
  bookmarkable_type: "tool" | "tutorial" | "news" | "comparison" | "ranking" | "use_case";
  bookmarkable_id: string;
  created_at: string;
}

export interface SavedPrompt {
  id: string;
  user_id: string;
  prompt_id: string;
  notes: string | null;
  created_at: string;
  // Joined
  prompt?: Prompt;
}

// Search & Filter types
export interface ToolFilters {
  category?: string;
  pricing_type?: string;
  min_rating?: number;
  search?: string;
  sort_by?: "rating" | "upvotes" | "newest" | "name";
  page?: number;
  per_page?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}
