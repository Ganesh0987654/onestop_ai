import {
  getCategories,
  getFeaturedTools,
  getComparisons,
  getNews,
  getPrompts,
  getUseCases,
  getTutorials,
  getTools,
} from "@/lib/supabase-db";
import { formatNumber, getInitials } from "@/lib/utils";
import {
  ArrowRight,
  ArrowUpRight,
  Layers,
  BookOpen,
  Zap,
  Trophy,
  Eye,
  Search,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Award,
} from "lucide-react";
import Link from "next/link";

export default async function Home() {
  const categoriesList = await getCategories();
  const featuredTools = (await getFeaturedTools()).slice(0, 6);
  const featuredCategories = categoriesList.filter((c) => c.is_featured);
  const popularComparisons = (await getComparisons()).slice(0, 4);
  const latestNews = (await getNews()).slice(0, 3);
  const promptsList = await getPrompts();
  const popularPrompts = promptsList.filter((p) => p.is_featured).slice(0, 4);
  const useCasesList = await getUseCases();
  const featuredUseCases = useCasesList.filter((uc) => uc.is_featured).slice(0, 4);
  
  const toolsCount = (await getTools()).length;
  const promptsCount = promptsList.length;
  const tutorialsCount = (await getTutorials()).length;

  const stats = [
    { label: "AI Tools Directory", value: toolsCount, icon: Layers, href: "/tools" },
    { label: "Categories", value: categoriesList.length, icon: Zap, href: "/tools" },
    { label: "AI Prompts", value: promptsCount, icon: BookOpen, href: "/prompts" },
    { label: "Tutorials & Guides", value: tutorialsCount, icon: Trophy, href: "/tutorials" },
  ];

  return (
    <div className="space-y-20 pb-16">
      {/* 1. Hero Section */}
      <section className="relative px-6 pt-16 pb-20 text-center overflow-hidden rounded-3xl bg-[radial-gradient(circle_at_center,_hsl(var(--primary)/0.08),_transparent_70%)] border border-[hsl(var(--border))]">
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0),hsl(var(--background)))] pointer-events-none" />
        
        <div className="relative z-10 max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[hsl(var(--primary)/0.3)] bg-[hsl(var(--primary)/0.05)] text-xs font-semibold text-[hsl(var(--primary))] animate-fadeIn">
            <Sparkles className="h-4 w-4" />
            Discover the future of productivity
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-none text-foreground">
            Discover the Best{" "}
            <span className="bg-gradient-to-r from-[hsl(var(--primary))] via-purple-500 to-indigo-500 bg-clip-text text-transparent">
              AI Tools
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-[hsl(var(--muted-foreground))] max-w-2xl mx-auto">
            The ultimate SaaS-style hub to find, compare, and master artificial intelligence applications powering the future of work.
          </p>

          {/* Search Link */}
          <div className="max-w-md mx-auto pt-4">
            <Link
              href="/tools"
              className="flex items-center gap-3 w-full px-5 py-4 bg-[hsl(var(--card))] border border-[hsl(var(--border))] hover:border-[hsl(var(--primary)/0.5)] rounded-2xl shadow-sm text-left transition-all duration-300 text-[hsl(var(--muted-foreground))] hover:shadow-md hover:scale-[1.01]"
            >
              <Search className="h-5 w-5 text-[hsl(var(--primary))]" />
              <span className="flex-1 text-sm sm:text-base">Search thousands of AI tools...</span>
              <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border border-[hsl(var(--border))] bg-[hsl(var(--muted))] px-1.5 font-mono text-[10px] font-medium text-[hsl(var(--muted-foreground))]">
                <span>⌘</span>K
              </kbd>
            </Link>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-10">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <Link
                  key={stat.label}
                  href={stat.href}
                  className="flex flex-col items-center p-4 bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-2xl hover:border-[hsl(var(--primary)/0.3)] hover:-translate-y-1 transition-all duration-300 shadow-sm"
                >
                  <Icon className="h-6 w-6 text-[hsl(var(--primary))] mb-2" />
                  <span className="text-2xl font-bold text-[hsl(var(--foreground))]">
                    {stat.value}+
                  </span>
                  <span className="text-xs text-[hsl(var(--muted-foreground))] mt-1 text-center font-medium">
                    {stat.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 2. Featured Tools Section */}
      <section className="space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-[hsl(var(--foreground))] flex items-center gap-2">
              <Award className="h-7 w-7 text-yellow-500" />
              Featured AI Tools
            </h2>
            <p className="text-[hsl(var(--muted-foreground))]">
              Handpicked top-tier AI applications representing outstanding quality.
            </p>
          </div>
          <Link
            href="/tools"
            className="flex items-center gap-1 text-sm font-semibold text-[hsl(var(--primary))] hover:underline"
          >
            View All Tools
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredTools.map((tool) => {
            const initial = getInitials(tool.name);
            const pricingLabel = {
              free: "Free",
              freemium: "Freemium",
              paid: "Paid",
              open_source: "Open Source",
              contact: "Contact",
            }[tool.pricing_type];

            const pricingColorClass = {
              free: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
              freemium: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
              paid: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
              open_source: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
              contact: "bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20",
            }[tool.pricing_type];

            return (
              <Link
                key={tool.id}
                href={`/tools/${tool.slug}`}
                className="group relative flex flex-col justify-between p-6 bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-2xl hover:border-[hsl(var(--primary)/0.4)] hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
              >
                <div>
                  <div className="flex items-center gap-3.5">
                    {/* Circle avatar logo */}
                    <div className="flex items-center justify-center h-12 w-12 rounded-xl text-lg font-bold text-white bg-gradient-to-br from-[hsl(var(--primary))] to-purple-500 shadow-sm">
                      {initial}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-[hsl(var(--foreground))] flex items-center gap-1.5">
                        {tool.name}
                        {tool.is_verified && (
                          <ShieldCheck className="h-4.5 w-4.5 text-blue-500 fill-blue-500/10" />
                        )}
                      </h3>
                      <span className="inline-block rounded-full bg-[hsl(var(--muted))] border border-[hsl(var(--border))] px-2 py-0.5 text-[10px] font-semibold text-[hsl(var(--muted-foreground))]">
                        {categoriesList.find((c) => c.id === tool.category_id)?.name}
                      </span>
                    </div>
                  </div>
                  <p className="mt-4 text-sm text-[hsl(var(--muted-foreground))] line-clamp-2 leading-relaxed">
                    {tool.tagline}
                  </p>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-[hsl(var(--border))] pt-4">
                  <div className="flex items-center gap-2">
                    <span className="text-amber-500 text-sm font-semibold">★</span>
                    <span className="text-xs font-bold text-[hsl(var(--foreground))]">
                      {tool.avg_rating.toFixed(1)}
                    </span>
                    <span className="text-[10px] text-[hsl(var(--muted-foreground))]">
                      ({formatNumber(tool.review_count)})
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${pricingColorClass}`}>
                      {pricingLabel}
                    </span>
                    <div className="flex flex-col items-end">
                      <span className="text-[10px] text-[hsl(var(--muted-foreground))] font-semibold">Upvotes</span>
                      <span className="text-xs font-bold text-[hsl(var(--foreground))]">
                        ▲ {formatNumber(tool.upvote_count)}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 3. Browse by Category Section */}
      <section className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-[hsl(var(--foreground))]">
            Browse by Category
          </h2>
          <p className="text-[hsl(var(--muted-foreground))]">
            Find the right tools based on specific functionalities.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {featuredCategories.map((category) => (
            <Link
              key={category.id}
              href={`/tools?category=${category.id}`}
              className="group p-5 bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-2xl hover:border-[hsl(var(--primary)/0.4)] transition-all duration-300 flex flex-col justify-between"
              style={{ borderLeftWidth: "4px", borderLeftColor: category.color }}
            >
              <div>
                <h3 className="font-bold text-[hsl(var(--foreground))] group-hover:text-[hsl(var(--primary))] transition-colors">
                  {category.name}
                </h3>
                <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1 line-clamp-1">
                  {category.description}
                </p>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-[10px] font-semibold text-[hsl(var(--muted-foreground))] bg-[hsl(var(--muted))] border border-[hsl(var(--border))] rounded-full px-2.5 py-0.5">
                  {category.tool_count} Tools
                </span>
                <ChevronRight className="h-4 w-4 text-[hsl(var(--muted-foreground))] group-hover:text-[hsl(var(--primary))] group-hover:translate-x-1 transition-all" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. Trending Comparisons Section */}
      <section className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-[hsl(var(--foreground))]">
            Popular Comparisons
          </h2>
          <p className="text-[hsl(var(--muted-foreground))]">
            Decide between competing AI tools with side-by-side breakdowns.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {popularComparisons.map((comp) => (
            <Link
              key={comp.id}
              href={`/compare/${comp.slug}`}
              className="group p-6 bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-2xl hover:border-[hsl(var(--primary)/0.4)] hover:shadow-md transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-center gap-4 text-center">
                  <span className="font-bold text-lg text-[hsl(var(--foreground))] flex-1 text-right truncate">
                    {comp.title.split(" vs ")[0]}
                  </span>
                  <div className="flex items-center justify-center h-8 w-8 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs font-bold text-purple-600 dark:text-purple-400">
                    VS
                  </div>
                  <span className="font-bold text-lg text-[hsl(var(--foreground))] flex-1 text-left truncate">
                    {comp.title.split(" vs ")[1]}
                  </span>
                </div>
                <p className="mt-4 text-sm text-[hsl(var(--muted-foreground))] text-center line-clamp-2">
                  {comp.summary}
                </p>
              </div>
              <div className="mt-6 flex items-center justify-between border-t border-[hsl(var(--border))] pt-4 text-xs text-[hsl(var(--muted-foreground))]">
                <span className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  {formatNumber(comp.view_count)} Views
                </span>
                <span className="font-semibold group-hover:text-[hsl(var(--primary))] transition-colors flex items-center gap-0.5">
                  Read comparison <ArrowRight className="h-3 w-3" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 5. Prompt Library Preview */}
      <section className="space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-[hsl(var(--foreground))]">
              Popular Prompts
            </h2>
            <p className="text-[hsl(var(--muted-foreground))]">
              Copy curated prompts engineered for maximum effectiveness.
            </p>
          </div>
          <Link
            href="/prompts"
            className="flex items-center gap-1 text-sm font-semibold text-[hsl(var(--primary))] hover:underline"
          >
            Browse Library
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {popularPrompts.map((prompt) => (
            <Link
              key={prompt.id}
              href={`/prompts/${prompt.slug}`}
              className="group p-6 bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-2xl hover:border-[hsl(var(--primary)/0.4)] hover:shadow-md transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="inline-block rounded-full bg-[hsl(var(--primary)/0.05)] border border-[hsl(var(--primary)/0.15)] px-2 py-0.5 text-[10px] font-semibold text-[hsl(var(--primary))]">
                    Featured Prompt
                  </span>
                  <span
                    className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold capitalize ${
                      prompt.difficulty === "beginner"
                        ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                        : prompt.difficulty === "intermediate"
                        ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                        : "bg-red-500/10 text-red-600 border-red-500/20"
                    }`}
                  >
                    {prompt.difficulty}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-[hsl(var(--foreground))] group-hover:text-[hsl(var(--primary))] transition-colors">
                  {prompt.title}
                </h3>
                <p className="mt-2 text-sm text-[hsl(var(--muted-foreground))] line-clamp-2">
                  {prompt.description}
                </p>
                <div className="mt-4 bg-[hsl(var(--muted))] rounded-xl p-4 border border-[hsl(var(--border))] font-mono text-xs text-[hsl(var(--muted-foreground))] line-clamp-3">
                  {prompt.prompt_text}
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-[hsl(var(--border))] pt-4 text-xs text-[hsl(var(--muted-foreground))]">
                <div className="flex gap-2">
                  {prompt.tags.slice(0, 2).map((tag) => (
                    <span key={tag} className="text-[10px]">
                      #{tag}
                    </span>
                  ))}
                </div>
                <span className="font-semibold">
                  Used {formatNumber(prompt.use_count)} times
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 6. AI News Section */}
      <section className="space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-[hsl(var(--foreground))]">
              AI News & Updates
            </h2>
            <p className="text-[hsl(var(--muted-foreground))]">
              Stay ahead of the curve with the latest developments in tech.
            </p>
          </div>
          <Link
            href="/news"
            className="flex items-center gap-1 text-sm font-semibold text-[hsl(var(--primary))] hover:underline"
          >
            Read News
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {latestNews.map((article) => (
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
                <h3 className="font-bold text-[hsl(var(--foreground))] group-hover:text-[hsl(var(--primary))] transition-colors line-clamp-2">
                  {article.title}
                </h3>
                <p className="mt-3 text-sm text-[hsl(var(--muted-foreground))] line-clamp-3">
                  {article.excerpt}
                </p>
              </div>
              <div className="mt-6 flex items-center justify-between border-t border-[hsl(var(--border))] pt-4 text-xs text-[hsl(var(--muted-foreground))]">
                <span>{new Date(article.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                <span className="flex items-center gap-0.5 group-hover:text-[hsl(var(--primary))] transition-colors font-medium">
                  Read article <ArrowUpRight className="h-3 w-3" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 7. Use Cases Hub Section */}
      <section className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-[hsl(var(--foreground))]">
            AI For Every Role
          </h2>
          <p className="text-[hsl(var(--muted-foreground))]">
            See how professionals and students apply artificial intelligence.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredUseCases.map((uc) => (
            <Link
              key={uc.id}
              href={`/use-cases/${uc.slug}`}
              className="group p-5 bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-2xl hover:border-[hsl(var(--primary)/0.4)] transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <span className="inline-block rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 px-2.5 py-0.5 text-[10px] font-bold capitalize mb-4">
                  For {uc.audience}
                </span>
                <h3 className="font-bold text-base text-[hsl(var(--foreground))] group-hover:text-[hsl(var(--primary))] transition-colors">
                  {uc.title}
                </h3>
                <p className="mt-2 text-xs text-[hsl(var(--muted-foreground))] line-clamp-3">
                  {uc.excerpt}
                </p>
              </div>
              <div className="mt-6 flex items-center justify-between border-t border-[hsl(var(--border))] pt-3 text-[10px] text-[hsl(var(--muted-foreground))]">
                <span className="flex items-center gap-1 font-medium">
                  <Eye className="h-3.5 w-3.5" />
                  {formatNumber(uc.view_count)} Views
                </span>
                <span className="font-bold text-[hsl(var(--primary))] opacity-0 group-hover:opacity-100 transition-opacity">
                  Learn More →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 8. CTA Section */}
      <section className="p-8 sm:p-12 bg-gradient-to-br from-[hsl(var(--primary))] to-purple-600 rounded-3xl text-center text-white space-y-6 shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent_50%)]" />
        <div className="relative z-10 max-w-2xl mx-auto space-y-4">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Ready to Discover Your Next AI Tool?
          </h2>
          <p className="text-white/80 text-sm sm:text-base max-w-lg mx-auto">
            Browse through our directory, compare tools side-by-side, and find copy-paste prompts to unlock your peak workflow efficiency.
          </p>
          <div className="flex flex-wrap gap-4 justify-center pt-4">
            <Link
              href="/tools"
              className="bg-white text-[hsl(var(--primary))] hover:bg-neutral-50 px-6 py-3 rounded-xl font-bold transition-all shadow-md text-sm hover:scale-105"
            >
              Explore All Tools
            </Link>
            <Link
              href="/prompts"
              className="bg-white/10 hover:bg-white/20 border border-white/20 px-6 py-3 rounded-xl font-bold transition-all text-sm hover:scale-105"
            >
              Browse Prompts
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
