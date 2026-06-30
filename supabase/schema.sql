-- ============================================================================
-- AIHub - Complete Database Schema (Regenerated)
-- 10 Normalized PostgreSQL Tables for Supabase
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Drop existing tables to ensure a clean slate
DROP TABLE IF EXISTS public.bookmarks CASCADE;
DROP TABLE IF EXISTS public.reviews CASCADE;
DROP TABLE IF EXISTS public.news CASCADE;
DROP TABLE IF EXISTS public.tutorials CASCADE;
DROP TABLE IF EXISTS public.prompts CASCADE;
DROP TABLE IF EXISTS public.comparisons CASCADE;
DROP TABLE IF EXISTS public.tool_rankings CASCADE;
DROP TABLE IF EXISTS public.tools CASCADE;
DROP TABLE IF EXISTS public.categories CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

-- ============================================================================
-- 1. USERS
-- ============================================================================
CREATE TABLE public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  username TEXT UNIQUE,
  avatar_url TEXT,
  bio TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin', 'moderator')),
  is_verified BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_username ON public.users(username);
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_role ON public.users(role);

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles are viewable by everyone" ON public.users FOR SELECT USING (TRUE);
CREATE POLICY "Users can update their own profile" ON public.users FOR UPDATE USING (auth.uid() = id);

-- ============================================================================
-- 2. CATEGORIES
-- ============================================================================
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  color TEXT DEFAULT '#6366f1',
  parent_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  tool_count INTEGER NOT NULL DEFAULT 0,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_categories_slug ON public.categories(slug);
CREATE INDEX idx_categories_parent ON public.categories(parent_id);
CREATE INDEX idx_categories_featured ON public.categories(is_featured) WHERE is_featured = TRUE;

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Categories are viewable by everyone" ON public.categories FOR SELECT USING (TRUE);
CREATE POLICY "Only admins can manage categories" ON public.categories FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);

-- ============================================================================
-- 3. TOOLS
-- ============================================================================
CREATE TABLE public.tools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  tagline TEXT NOT NULL,
  description TEXT NOT NULL,
  logo_url TEXT,
  screenshot_url TEXT,
  website_url TEXT NOT NULL,
  category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE RESTRICT,
  pricing_type TEXT NOT NULL DEFAULT 'freemium' CHECK (pricing_type IN ('free', 'freemium', 'paid', 'open_source', 'contact')),
  starting_price DECIMAL(10,2),
  currency TEXT DEFAULT 'USD',
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  is_verified BOOLEAN NOT NULL DEFAULT FALSE,
  is_published BOOLEAN NOT NULL DEFAULT TRUE,
  avg_rating DECIMAL(3,2) NOT NULL DEFAULT 0.00,
  review_count INTEGER NOT NULL DEFAULT 0,
  upvote_count INTEGER NOT NULL DEFAULT 0,
  view_count INTEGER NOT NULL DEFAULT 0,
  bookmark_count INTEGER NOT NULL DEFAULT 0,
  submitted_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  meta_title TEXT,
  meta_description TEXT,
  og_image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  published_at TIMESTAMPTZ
);

CREATE INDEX idx_tools_slug ON public.tools(slug);
CREATE INDEX idx_tools_category ON public.tools(category_id);
CREATE INDEX idx_tools_pricing ON public.tools(pricing_type);
CREATE INDEX idx_tools_featured ON public.tools(is_featured) WHERE is_featured = TRUE;
CREATE INDEX idx_tools_published ON public.tools(is_published) WHERE is_published = TRUE;
CREATE INDEX idx_tools_rating ON public.tools(avg_rating DESC);
CREATE INDEX idx_tools_upvotes ON public.tools(upvote_count DESC);
CREATE INDEX idx_tools_name_trgm ON public.tools USING gin(name gin_trgm_ops);

ALTER TABLE public.tools ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published tools are viewable by everyone" ON public.tools FOR SELECT USING (
  is_published = TRUE OR EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Only admins can manage tools" ON public.tools FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);

-- ============================================================================
-- 4. TOOL_RANKINGS
-- ============================================================================
CREATE TABLE public.tool_rankings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  audience TEXT,
  icon TEXT,
  cover_image_url TEXT,
  methodology TEXT,
  tool_id UUID NOT NULL REFERENCES public.tools(id) ON DELETE CASCADE,
  position INTEGER NOT NULL,
  score DECIMAL(5,2),
  highlights TEXT,
  pros TEXT[] DEFAULT '{}',
  cons TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(slug, tool_id),
  UNIQUE(slug, position)
);

CREATE INDEX idx_tool_rankings_slug ON public.tool_rankings(slug);
CREATE INDEX idx_tool_rankings_tool ON public.tool_rankings(tool_id);
CREATE INDEX idx_tool_rankings_position ON public.tool_rankings(slug, position);

ALTER TABLE public.tool_rankings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tool rankings are viewable by everyone" ON public.tool_rankings FOR SELECT USING (TRUE);
CREATE POLICY "Only admins can manage tool rankings" ON public.tool_rankings FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);

-- ============================================================================
-- 5. COMPARISONS
-- ============================================================================
CREATE TABLE public.comparisons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tool_a_id UUID NOT NULL REFERENCES public.tools(id) ON DELETE CASCADE,
  tool_b_id UUID NOT NULL REFERENCES public.tools(id) ON DELETE CASCADE,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  summary TEXT,
  verdict TEXT,
  winner_id UUID REFERENCES public.tools(id) ON DELETE SET NULL,
  view_count INTEGER NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT TRUE,
  meta_title TEXT,
  meta_description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT different_tools CHECK (tool_a_id != tool_b_id)
);

CREATE INDEX idx_comparisons_slug ON public.comparisons(slug);
CREATE INDEX idx_comparisons_tool_a ON public.comparisons(tool_a_id);
CREATE INDEX idx_comparisons_tool_b ON public.comparisons(tool_b_id);

ALTER TABLE public.comparisons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published comparisons are viewable by everyone" ON public.comparisons FOR SELECT USING (
  is_published = TRUE OR EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Only admins can manage comparisons" ON public.comparisons FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);

-- ============================================================================
-- 6. PROMPTS
-- ============================================================================
CREATE TABLE public.prompts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  prompt_text TEXT NOT NULL,
  example_output TEXT,
  category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE RESTRICT,
  tool_id UUID REFERENCES public.tools(id) ON DELETE SET NULL,
  author_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  tags TEXT[] DEFAULT '{}',
  difficulty TEXT DEFAULT 'beginner' CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  use_count INTEGER NOT NULL DEFAULT 0,
  save_count INTEGER NOT NULL DEFAULT 0,
  upvote_count INTEGER NOT NULL DEFAULT 0,
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  is_published BOOLEAN NOT NULL DEFAULT TRUE,
  meta_title TEXT,
  meta_description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_prompts_slug ON public.prompts(slug);
CREATE INDEX idx_prompts_category ON public.prompts(category_id);
CREATE INDEX idx_prompts_tool ON public.prompts(tool_id);
CREATE INDEX idx_prompts_featured ON public.prompts(is_featured) WHERE is_featured = TRUE;

ALTER TABLE public.prompts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published prompts are viewable by everyone" ON public.prompts FOR SELECT USING (
  is_published = TRUE OR EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Only admins can manage prompts" ON public.prompts FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);

-- ============================================================================
-- 7. TUTORIALS
-- ============================================================================
CREATE TABLE public.tutorials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT NOT NULL,
  cover_image_url TEXT,
  category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE RESTRICT,
  author_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  difficulty TEXT DEFAULT 'beginner' CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  read_time_minutes INTEGER NOT NULL DEFAULT 5,
  tags TEXT[] DEFAULT '{}',
  related_tool_ids UUID[] DEFAULT '{}',
  view_count INTEGER NOT NULL DEFAULT 0,
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  is_published BOOLEAN NOT NULL DEFAULT TRUE,
  meta_title TEXT,
  meta_description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  published_at TIMESTAMPTZ
);

CREATE INDEX idx_tutorials_slug ON public.tutorials(slug);
CREATE INDEX idx_tutorials_category ON public.tutorials(category_id);
CREATE INDEX idx_tutorials_featured ON public.tutorials(is_featured) WHERE is_featured = TRUE;
CREATE INDEX idx_tutorials_published ON public.tutorials(is_published) WHERE is_published = TRUE;

ALTER TABLE public.tutorials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published tutorials are viewable by everyone" ON public.tutorials FOR SELECT USING (
  is_published = TRUE OR EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Only admins can manage tutorials" ON public.tutorials FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);

-- ============================================================================
-- 8. NEWS
-- ============================================================================
CREATE TABLE public.news (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT NOT NULL,
  cover_image_url TEXT,
  source_name TEXT,
  source_url TEXT,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  author_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  tags TEXT[] DEFAULT '{}',
  related_tool_ids UUID[] DEFAULT '{}',
  view_count INTEGER NOT NULL DEFAULT 0,
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  is_published BOOLEAN NOT NULL DEFAULT TRUE,
  is_breaking BOOLEAN NOT NULL DEFAULT FALSE,
  meta_title TEXT,
  meta_description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  published_at TIMESTAMPTZ
);

CREATE INDEX idx_news_slug ON public.news(slug);
CREATE INDEX idx_news_featured ON public.news(is_featured) WHERE is_featured = TRUE;
CREATE INDEX idx_news_published ON public.news(is_published) WHERE is_published = TRUE;
CREATE INDEX idx_news_published_at ON public.news(published_at DESC);

ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published news are viewable by everyone" ON public.news FOR SELECT USING (
  is_published = TRUE OR EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Only admins can manage news" ON public.news FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);

-- ============================================================================
-- 9. REVIEWS
-- ============================================================================
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tool_id UUID NOT NULL REFERENCES public.tools(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  content TEXT NOT NULL,
  pros TEXT[] DEFAULT '{}',
  cons TEXT[] DEFAULT '{}',
  is_verified_purchase BOOLEAN NOT NULL DEFAULT FALSE,
  is_approved BOOLEAN NOT NULL DEFAULT TRUE,
  helpful_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(tool_id, user_id)
);

CREATE INDEX idx_reviews_tool ON public.reviews(tool_id);
CREATE INDEX idx_reviews_user ON public.reviews(user_id);
CREATE INDEX idx_reviews_rating ON public.reviews(rating);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Approved reviews are viewable by everyone" ON public.reviews FOR SELECT USING (
  is_approved = TRUE OR user_id = auth.uid()
);
CREATE POLICY "Authenticated users can create reviews" ON public.reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own reviews" ON public.reviews FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own reviews" ON public.reviews FOR DELETE USING (
  auth.uid() = user_id OR EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);

-- ============================================================================
-- 10. BOOKMARKS
-- ============================================================================
CREATE TABLE public.bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  bookmarkable_type TEXT NOT NULL CHECK (bookmarkable_type IN ('tool', 'tutorial', 'news', 'comparison', 'ranking')),
  bookmarkable_id UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, bookmarkable_type, bookmarkable_id)
);

CREATE INDEX idx_bookmarks_user ON public.bookmarks(user_id);
CREATE INDEX idx_bookmarks_item ON public.bookmarks(bookmarkable_type, bookmarkable_id);

ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own bookmarks" ON public.bookmarks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own bookmarks" ON public.bookmarks FOR ALL USING (auth.uid() = user_id);

-- ============================================================================
-- TRIGGERS & PROCEDURES
-- ============================================================================

-- Procedure to automatically set updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to all tables
DO $$
DECLARE
  tbl TEXT;
BEGIN
  FOREACH tbl IN ARRAY ARRAY[
    'users', 'categories', 'tools', 'tool_rankings', 'comparisons', 
    'prompts', 'tutorials', 'news', 'reviews', 'bookmarks'
  ]
  LOOP
    EXECUTE format('
      CREATE TRIGGER set_updated_at
        BEFORE UPDATE ON public.%I
        FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column()
    ', tbl);
  END LOOP;
END $$;

-- Trigger to update tool avg_rating and review_count when reviews change
CREATE OR REPLACE FUNCTION public.update_tool_rating()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    UPDATE public.tools SET
      avg_rating = COALESCE((SELECT AVG(rating)::DECIMAL(3,2) FROM public.reviews WHERE tool_id = OLD.tool_id AND is_approved = TRUE), 0),
      review_count = (SELECT COUNT(*) FROM public.reviews WHERE tool_id = OLD.tool_id AND is_approved = TRUE),
      updated_at = NOW()
    WHERE id = OLD.tool_id;
    RETURN OLD;
  ELSE
    UPDATE public.tools SET
      avg_rating = COALESCE((SELECT AVG(rating)::DECIMAL(3,2) FROM public.reviews WHERE tool_id = NEW.tool_id AND is_approved = TRUE), 0),
      review_count = (SELECT COUNT(*) FROM public.reviews WHERE tool_id = NEW.tool_id AND is_approved = TRUE),
      updated_at = NOW()
    WHERE id = NEW.tool_id;
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_review_change
  AFTER INSERT OR UPDATE OR DELETE ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION public.update_tool_rating();

-- Trigger to update category tool_count when tools are created/updated/deleted
CREATE OR REPLACE FUNCTION public.update_category_tool_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    UPDATE public.categories SET
      tool_count = (SELECT COUNT(*) FROM public.tools WHERE category_id = OLD.category_id AND is_published = TRUE)
    WHERE id = OLD.category_id;
    RETURN OLD;
  ELSIF TG_OP = 'UPDATE' AND OLD.category_id != NEW.category_id THEN
    UPDATE public.categories SET
      tool_count = (SELECT COUNT(*) FROM public.tools WHERE category_id = OLD.category_id AND is_published = TRUE)
    WHERE id = OLD.category_id;
    UPDATE public.categories SET
      tool_count = (SELECT COUNT(*) FROM public.tools WHERE category_id = NEW.category_id AND is_published = TRUE)
    WHERE id = NEW.category_id;
    RETURN NEW;
  ELSE
    UPDATE public.categories SET
      tool_count = (SELECT COUNT(*) FROM public.tools WHERE category_id = NEW.category_id AND is_published = TRUE)
    WHERE id = NEW.category_id;
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_tool_change_category_count
  AFTER INSERT OR UPDATE OR DELETE ON public.tools
  FOR EACH ROW EXECUTE FUNCTION public.update_category_tool_count();
