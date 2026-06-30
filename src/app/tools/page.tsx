import type { Metadata } from "next";
import Link from "next/link";
import { getTools, getCategories } from "@/lib/supabase-db";
import { formatNumber, getInitials } from "@/lib/utils";
import { Star, ShieldCheck, Search, SlidersHorizontal, ArrowUpDown } from "lucide-react";

export const metadata: Metadata = {
  title: "AI Tools Directory",
  description: "Browse the ultimate directory of AI tools categorized by category, pricing type, and user reviews.",
};

interface SearchParams {
  category?: string;
  pricing?: string;
  sort?: string;
  q?: string;
}

export default async function ToolsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const activeCategory = params.category || "";
  const activePricing = params.pricing || "";
  const activeSort = params.sort || "upvotes";
  const searchQuery = params.q || "";

  // 1. Fetch categories and filtered/sorted tools from Database
  const categoriesList = await getCategories();
  const allTools = await getTools();
  const filteredTools = await getTools({
    category: activeCategory,
    pricing: activePricing,
    sort: activeSort,
    q: searchQuery,
  });

  const pricingTiers = [
    { label: "All Pricing", value: "" },
    { label: "Free", value: "free" },
    { label: "Freemium", value: "freemium" },
    { label: "Paid", value: "paid" },
    { label: "Open Source", value: "open_source" },
  ];

  const sortingOptions = [
    { label: "Most Upvotes", value: "upvotes" },
    { label: "Highest Rating", value: "rating" },
    { label: "Newest", value: "newest" },
    { label: "Alphabetical", value: "name" },
  ];

  // Build helper function to create query URLs
  const createQueryUrl = (newParams: Partial<SearchParams>) => {
    const updated = { ...params, ...newParams };
    // Remove empty values
    Object.keys(updated).forEach((key) => {
      const k = key as keyof SearchParams;
      if (!updated[k]) delete updated[k];
    });
    const queryString = new URLSearchParams(updated as Record<string, string>).toString();
    return `/tools${queryString ? `?${queryString}` : ""}`;
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Hero / Header */}
      <div className="space-y-4">
        <h1 className="text-3xl font-extrabold tracking-tight text-[hsl(var(--foreground))]">
          AI Tools Directory
        </h1>
        <p className="text-[hsl(var(--muted-foreground))] max-w-2xl">
          Browse and filter {allTools.length} hand-vetted AI tools. Finding the best tools for your writing, coding, video generation, and design work starts here.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Sidebar filters */}
        <div className="lg:col-span-1 space-y-6 bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-2xl p-6">
          <div className="flex items-center gap-2 border-b border-[hsl(var(--border))] pb-3 mb-4">
            <SlidersHorizontal className="h-4.5 w-4.5 text-[hsl(var(--primary))]" />
            <h2 className="font-bold text-sm uppercase tracking-wider text-[hsl(var(--foreground))]">
              Filters & Search
            </h2>
          </div>

          {/* Search Form */}
          <form action="/tools" method="GET" className="space-y-2">
            <label className="text-xs font-semibold text-[hsl(var(--muted-foreground))]">
              Search
            </label>
            <div className="relative">
              <input
                type="text"
                name="q"
                defaultValue={searchQuery}
                placeholder="Search tools..."
                className="w-full bg-[hsl(var(--muted))] border border-[hsl(var(--border))] rounded-xl py-2 pl-9 pr-4 text-sm focus:outline-none focus:border-[hsl(var(--primary))] text-[hsl(var(--foreground))]"
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-[hsl(var(--muted-foreground))]" />
              {activeCategory && <input type="hidden" name="category" value={activeCategory} />}
              {activePricing && <input type="hidden" name="pricing" value={activePricing} />}
              {activeSort && <input type="hidden" name="sort" value={activeSort} />}
            </div>
            <button
              type="submit"
              className="w-full py-2 bg-[hsl(var(--primary))] text-white rounded-xl text-xs font-semibold hover:opacity-90 transition-opacity"
            >
              Apply Search
            </button>
          </form>

          {/* Pricing Filters */}
          <div className="space-y-2 pt-2 border-t border-[hsl(var(--border))]">
            <label className="text-xs font-semibold text-[hsl(var(--muted-foreground))]">
              Pricing Model
            </label>
            <div className="flex flex-col gap-1.5">
              {pricingTiers.map((tier) => {
                const isActive = activePricing === tier.value;
                return (
                  <Link
                    key={tier.label}
                    href={createQueryUrl({ pricing: tier.value })}
                    className={`text-xs py-1.5 px-3 rounded-lg border text-left font-medium transition-all ${
                      isActive
                        ? "bg-[hsl(var(--primary)/0.15)] border-[hsl(var(--primary)/0.3)] text-[hsl(var(--primary))]"
                        : "bg-transparent border-transparent text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))]"
                    }`}
                  >
                    {tier.label}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Sort By */}
          <div className="space-y-2 pt-2 border-t border-[hsl(var(--border))]">
            <label className="text-xs font-semibold text-[hsl(var(--muted-foreground))] flex items-center gap-1">
              <ArrowUpDown className="h-3.5 w-3.5" />
              Sort By
            </label>
            <div className="flex flex-col gap-1.5">
              {sortingOptions.map((opt) => {
                const isActive = activeSort === opt.value;
                return (
                  <Link
                    key={opt.value}
                    href={createQueryUrl({ sort: opt.value })}
                    className={`text-xs py-1.5 px-3 rounded-lg border text-left font-medium transition-all ${
                      isActive
                        ? "bg-[hsl(var(--primary)/0.15)] border-[hsl(var(--primary)/0.3)] text-[hsl(var(--primary))]"
                        : "bg-transparent border-transparent text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))]"
                    }`}
                  >
                    {opt.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Results directory listing */}
        <div className="lg:col-span-3 space-y-6">
          {/* Categories Horizontal flex pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-[hsl(var(--border))]">
            <Link
              href={createQueryUrl({ category: "" })}
              className={`text-xs px-3 py-1.5 rounded-full border shrink-0 transition-all font-semibold ${
                !activeCategory
                  ? "bg-[hsl(var(--primary))] text-white border-[hsl(var(--primary))]"
                  : "bg-[hsl(var(--card))] border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
              }`}
            >
              All Categories
            </Link>
            {categoriesList.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <Link
                  key={cat.id}
                  href={createQueryUrl({ category: cat.id })}
                  className={`text-xs px-3 py-1.5 rounded-full border shrink-0 transition-all font-semibold`}
                  style={{
                    backgroundColor: isActive ? cat.color : "var(--card)",
                    color: isActive ? "#ffffff" : "var(--muted-foreground)",
                    borderColor: isActive ? cat.color : "hsl(var(--border))",
                  }}
                >
                  {cat.name}
                </Link>
              );
            })}
          </div>

          {/* Results Count & Tools Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-[hsl(var(--muted-foreground))] px-1">
              <span>Showing {filteredTools.length} of {allTools.length} tools</span>
              {(searchQuery || activeCategory || activePricing) && (
                <Link href="/tools" className="text-[hsl(var(--primary))] hover:underline font-semibold">
                  Clear all filters
                </Link>
              )}
            </div>

            {filteredTools.length === 0 ? (
              <div className="text-center p-12 bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-2xl space-y-3">
                <Search className="h-8 w-8 text-[hsl(var(--muted-foreground))] mx-auto" />
                <h3 className="font-bold text-[hsl(var(--foreground))]">No tools found</h3>
                <p className="text-sm text-[hsl(var(--muted-foreground))] max-w-sm mx-auto">
                  Try adjusting your search terms or filters to find what you are looking for.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTools.map((tool) => {
                  const initial = getInitials(tool.name);
                  const catColor = categoriesList.find((c) => c.id === tool.category_id)?.color || "#6366f1";
                  
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
                      className="group flex flex-col justify-between p-5 bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-2xl hover:border-[hsl(var(--primary)/0.4)] hover:-translate-y-0.5 hover:shadow-md transition-all duration-300"
                    >
                      <div>
                        <div className="flex items-center gap-3">
                          <div
                            className="flex items-center justify-center h-10 w-10 rounded-xl text-sm font-bold text-white shadow-sm shrink-0"
                            style={{
                              background: `linear-gradient(135deg, ${catColor}, ${catColor}bb)`,
                            }}
                          >
                            {initial}
                          </div>
                          <div className="min-w-0">
                            <h3 className="font-bold text-[hsl(var(--foreground))] group-hover:text-[hsl(var(--primary))] transition-colors flex items-center gap-1 truncate text-sm">
                              {tool.name}
                              {tool.is_verified && (
                                <ShieldCheck className="h-4 w-4 text-blue-500 fill-blue-500/10 shrink-0" />
                              )}
                            </h3>
                            <span className="inline-block rounded-full bg-[hsl(var(--muted))] border border-[hsl(var(--border))] px-2 py-0.5 text-[9px] font-semibold text-[hsl(var(--muted-foreground))]">
                              {categoriesList.find((c) => c.id === tool.category_id)?.name}
                            </span>
                          </div>
                        </div>
                        <p className="mt-3 text-xs text-[hsl(var(--muted-foreground))] line-clamp-2 leading-relaxed">
                          {tool.tagline}
                        </p>
                      </div>

                      <div className="mt-4 flex items-center justify-between border-t border-[hsl(var(--border))] pt-3 text-xs">
                        <div className="flex items-center gap-1.5">
                          <span className="text-amber-500">★</span>
                          <span className="font-bold text-[hsl(var(--foreground))]">
                            {tool.avg_rating.toFixed(1)}
                          </span>
                          <span className="text-[10px] text-[hsl(var(--muted-foreground))]">
                            ({formatNumber(tool.review_count)})
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`rounded-full border px-2 py-0.5 text-[9px] font-semibold ${pricingColorClass}`}>
                            {pricingLabel}
                          </span>
                          <span className="text-[10px] font-bold text-[hsl(var(--foreground))]">
                            ▲ {formatNumber(tool.upvote_count)}
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
