import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getNewsBySlug, getToolById, getNews } from "@/lib/supabase-db";
import { formatNumber } from "@/lib/utils";
import { ArrowLeft, ChevronRight, Eye, Calendar, Globe, Layers } from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getNewsBySlug(slug);

  if (!article) {
    return {
      title: "Article Not Found",
    };
  }

  return {
    title: article.title,
    description: article.excerpt,
  };
}

export async function generateStaticParams() {
  const newsList = await getNews();
  return newsList.map((article) => ({
    slug: article.slug,
  }));
}

export default async function NewsDetailPage({ params }: Props) {
  const { slug } = await params;
  const article = await getNewsBySlug(slug);

  if (!article) {
    notFound();
  }

  // Get related tools referenced in this article
  const relatedTools = await Promise.all(
    (article.related_tool_ids || []).map((id) => getToolById(id))
  ).then((list) => list.filter(Boolean));

  return (
    <div className="space-y-10 pb-16">
      {/* Breadcrumbs & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[hsl(var(--border))] pb-4">
        <Link
          href="/news"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to News
        </Link>
        <nav className="flex items-center gap-1.5 text-xs text-[hsl(var(--muted-foreground))]">
          <Link href="/" className="hover:text-[hsl(var(--foreground))]">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/news" className="hover:text-[hsl(var(--foreground))]">News</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-[hsl(var(--foreground))] font-semibold truncate max-w-[200px] sm:max-w-none">
            {article.title}
          </span>
        </nav>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column: Article content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Header */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-[hsl(var(--muted))] border border-[hsl(var(--border))] px-3 py-0.5 text-[10px] font-bold text-[hsl(var(--muted-foreground))]">
                {article.source_name}
              </span>
              {article.is_breaking && (
                <span className="animate-pulse rounded-full bg-red-500/15 border border-red-500/30 px-2 py-0.5 text-[10px] font-bold text-red-600 dark:text-red-400">
                  BREAKING NEWS
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-[hsl(var(--foreground))] leading-tight">
              {article.title}
            </h1>
            <p className="text-base sm:text-lg text-[hsl(var(--muted-foreground))] leading-relaxed italic border-l-4 border-[hsl(var(--primary))] pl-4">
              {article.excerpt}
            </p>
          </section>

          {/* Body Content */}
          <section className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="text-sm sm:text-base text-[hsl(var(--muted-foreground))] leading-relaxed space-y-4 font-sans">
              <p>
                In a significant development for the artificial intelligence industry, new capabilities are redefining how organizations deploy language and creative models. Industry leaders are adapting rapidly to changes in performance standards, regulation, and consumer expectations.
              </p>
              <p>
                With users demanding higher reliability and lower latency, developers are optimizing transformer attention layers and incorporating advanced search verifications to eliminate hallucinated values.
              </p>
              <p>
                This step represents a wider trend in building agents capable of multi-step logical synthesis, moving beyond simple static templates towards interactive automation loops.
              </p>
            </div>
          </section>
        </div>

        {/* Right column sidebar */}
        <div className="space-y-8">
          {/* Source and view stats */}
          <section className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-2xl p-6 space-y-4 shadow-sm font-sans">
            <h3 className="font-bold text-sm uppercase tracking-wider text-[hsl(var(--foreground))] border-b border-[hsl(var(--border))] pb-2.5">
              Article details
            </h3>
            <div className="space-y-3.5 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-[hsl(var(--muted-foreground))] font-semibold flex items-center gap-1">
                  <Calendar className="h-4 w-4 text-[hsl(var(--primary))]" />
                  Published On
                </span>
                <span className="font-bold text-[hsl(var(--foreground))]">
                  {new Date(article.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[hsl(var(--muted-foreground))] font-semibold flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  View Count
                </span>
                <span className="font-bold text-[hsl(var(--foreground))]">{formatNumber(article.view_count)} Views</span>
              </div>
              {article.source_url && (
                <div className="flex justify-between items-center">
                  <span className="text-[hsl(var(--muted-foreground))] font-semibold flex items-center gap-1">
                    <Globe className="h-4 w-4" />
                    Original Source
                  </span>
                  <a
                    href={article.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-[hsl(var(--primary))] hover:underline"
                  >
                    Link
                  </a>
                </div>
              )}
            </div>

            {/* Tags */}
            <div className="pt-4 border-t border-[hsl(var(--border))] space-y-2">
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-[hsl(var(--muted-foreground))]">
                Tags
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {article.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] font-semibold bg-[hsl(var(--muted))] border border-[hsl(var(--border))] px-2 py-0.5 rounded-md text-[hsl(var(--muted-foreground))]"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </section>

          {/* Related Tools */}
          {relatedTools.length > 0 && (
            <section className="space-y-4">
              <h3 className="font-bold text-base text-[hsl(var(--foreground))] flex items-center gap-1.5">
                <Layers className="h-4.5 w-4.5 text-[hsl(var(--primary))]" />
                Referenced AI Tools
              </h3>
              <div className="space-y-3">
                {relatedTools.map((tool) => {
                  if (!tool) return null;
                  return (
                    <Link
                      key={tool.id}
                      href={`/tools/${tool.slug}`}
                      className="block p-4 bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-xl hover:border-[hsl(var(--primary)/0.3)] hover:shadow-sm transition-all"
                    >
                      <h4 className="font-bold text-xs text-[hsl(var(--foreground))]">
                        {tool.name}
                      </h4>
                      <p className="text-[10px] text-[hsl(var(--muted-foreground))] line-clamp-1 mt-0.5">
                        {tool.tagline}
                      </p>
                    </Link>
                  );
                })}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
