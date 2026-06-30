import type { Metadata } from "next";
import Link from "next/link";
import { getNews } from "@/lib/supabase-db";
import { formatNumber } from "@/lib/utils";
import { Newspaper, Eye, ArrowRight, Calendar } from "lucide-react";

export const metadata: Metadata = {
  title: "AI News",
  description: "Stay informed with the latest artificial intelligence news, updates, research breakthroughs, and industry announcements.",
};

export default async function NewsPage() {
  const newsList = await getNews();

  // Find featured breaking or highest view count article to show at top
  const featuredArticle = newsList.find((n) => n.is_featured && n.is_breaking) || newsList[0];
  const remainingArticles = newsList.filter((n) => n.id !== featuredArticle?.id);

  return (
    <div className="space-y-10 pb-16">
      {/* Hero */}
      <div className="space-y-4">
        <h1 className="text-3xl font-extrabold tracking-tight text-[hsl(var(--foreground))] flex items-center gap-2">
          <Newspaper className="h-8 w-8 text-[hsl(var(--primary))]" />
          AI News & Updates
        </h1>
        <p className="text-[hsl(var(--muted-foreground))] max-w-2xl">
          Get verified, objective updates on model developments, regulation, capabilities, and tech trends worldwide.
        </p>
      </div>

      {/* Featured Article Card at Top */}
      {featuredArticle && (
        <section className="relative overflow-hidden bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-3xl p-6 sm:p-8 hover:border-[hsl(var(--primary)/0.4)] transition-all duration-300 shadow-sm">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 px-3 py-0.5 text-[10px] font-bold">
                FEATURED STORY
              </span>
              {featuredArticle.is_breaking && (
                <span className="animate-pulse rounded-full bg-red-500/15 border border-red-500/30 px-2 py-0.5 text-[10px] font-bold text-red-600 dark:text-red-400">
                  BREAKING
                </span>
              )}
            </div>

            <div className="space-y-2.5 max-w-3xl">
              <Link
                href={`/news/${featuredArticle.slug}`}
                className="block text-xl sm:text-2xl font-extrabold text-[hsl(var(--foreground))] hover:text-[hsl(var(--primary))] transition-colors"
              >
                {featuredArticle.title}
              </Link>
              <p className="text-sm sm:text-base text-[hsl(var(--muted-foreground))] leading-relaxed">
                {featuredArticle.excerpt}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs text-[hsl(var(--muted-foreground))] pt-4 border-t border-[hsl(var(--border))]">
              <span className="font-semibold">{featuredArticle.source_name}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {new Date(featuredArticle.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                {formatNumber(featuredArticle.view_count)} Views
              </span>
              <Link
                href={`/news/${featuredArticle.slug}`}
                className="ml-auto inline-flex items-center gap-1 font-bold text-[hsl(var(--primary))] hover:underline"
              >
                Read story <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Grid of remaining articles */}
      <section className="space-y-6">
        <h2 className="text-xl font-bold text-[hsl(var(--foreground))] border-b border-[hsl(var(--border))] pb-3">
          Latest Stories
        </h2>
        {remainingArticles.length === 0 ? (
          <div className="text-center p-8 bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-xl">
            <p className="text-xs text-[hsl(var(--muted-foreground))]">No additional stories published.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {remainingArticles.map((article) => (
              <Link
                key={article.id}
                href={`/news/${article.slug}`}
                className="group p-6 bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-2xl hover:border-[hsl(var(--primary)/0.4)] hover:shadow-md transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="rounded-full bg-[hsl(var(--muted))] border border-[hsl(var(--border))] px-2.5 py-0.5 text-[10px] font-semibold text-[hsl(var(--muted-foreground))]">
                      {article.source_name}
                    </span>
                    {article.is_breaking && (
                      <span className="animate-pulse rounded-full bg-red-500/15 border border-red-500/30 px-2 py-0.5 text-[10px] font-bold text-red-600 dark:text-red-400">
                        BREAKING
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-base text-[hsl(var(--foreground))] group-hover:text-[hsl(var(--primary))] transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="mt-3 text-xs sm:text-sm text-[hsl(var(--muted-foreground))] line-clamp-3 leading-relaxed">
                    {article.excerpt}
                  </p>
                </div>
                <div className="mt-6 flex items-center justify-between border-t border-[hsl(var(--border))] pt-4 text-xs text-[hsl(var(--muted-foreground))]">
                  <span>{new Date(article.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                  <span className="font-semibold group-hover:text-[hsl(var(--primary))] transition-colors flex items-center gap-0.5">
                    Read article <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
