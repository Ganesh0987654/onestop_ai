import type { Metadata } from "next";
import Link from "next/link";
import { getTutorials, getTutorialCategories } from "@/lib/supabase-db";
import { formatNumber } from "@/lib/utils";
import { GraduationCap, Clock, Eye, Calendar, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "AI Tutorials & Guides",
  description: "Master artificial intelligence with our detailed tutorials, step-by-step guides, and workflow walkthroughs.",
};

interface SearchParams {
  category?: string;
  difficulty?: string;
}

export default async function TutorialsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const activeCategory = params.category || "";
  const activeDifficulty = params.difficulty || "";

  // Fetch from database
  const categoriesList = await getTutorialCategories();
  const filteredTutorials = await getTutorials({
    category: activeCategory,
    difficulty: activeDifficulty,
  });

  const difficulties = [
    { label: "All Difficulties", value: "" },
    { label: "Beginner", value: "beginner" },
    { label: "Intermediate", value: "intermediate" },
    { label: "Advanced", value: "advanced" },
  ];

  // Helper for query parameters
  const createQueryUrl = (newParams: Partial<SearchParams>) => {
    const updated = { ...params, ...newParams };
    Object.keys(updated).forEach((key) => {
      const k = key as keyof SearchParams;
      if (!updated[k]) delete updated[k];
    });
    const queryString = new URLSearchParams(updated as Record<string, string>).toString();
    return `/tutorials${queryString ? `?${queryString}` : ""}`;
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Hero */}
      <div className="space-y-4">
        <h1 className="text-3xl font-extrabold tracking-tight text-[hsl(var(--foreground))] flex items-center gap-2">
          <GraduationCap className="h-8 w-8 text-[hsl(var(--primary))]" />
          AI Tutorials & Guides
        </h1>
        <p className="text-[hsl(var(--muted-foreground))] max-w-2xl">
          Learn how to integrate AI tools into your daily workflow, automate repetitive processes, and structure advanced models.
        </p>
      </div>

      {/* Filter Options */}
      <div className="flex flex-wrap gap-4 border-b border-[hsl(var(--border))] pb-6 items-center">
        {/* Categories scroll container */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none flex-1">
          <Link
            href={createQueryUrl({ category: "" })}
            className={`text-xs px-3.5 py-1.5 rounded-full border font-bold transition-all ${
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
                className="text-xs px-3.5 py-1.5 rounded-full border font-bold transition-all"
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

        {/* Difficulties selection */}
        <div className="flex items-center gap-1.5 shrink-0 bg-[hsl(var(--muted))] border border-[hsl(var(--border))] rounded-full p-1">
          {difficulties.map((diff) => {
            const isActive = activeDifficulty === diff.value;
            return (
              <Link
                key={diff.label}
                href={createQueryUrl({ difficulty: diff.value })}
                className={`text-[10px] sm:text-xs px-3 py-1 rounded-full font-semibold transition-all ${
                  isActive
                    ? "bg-[hsl(var(--card))] text-[hsl(var(--foreground))] shadow-sm"
                    : "text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
                }`}
              >
                {diff.label.split(" ")[0]}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Count Info */}
      <div className="text-xs text-[hsl(var(--muted-foreground))] font-semibold">
        Showing {filteredTutorials.length} tutorials & guides
      </div>

      {/* Grid */}
      {filteredTutorials.length === 0 ? (
        <div className="text-center p-12 bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-2xl">
          <p className="text-sm text-[hsl(var(--muted-foreground))]">No tutorials found matching these filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTutorials.map((tu) => {
            const cat = categoriesList.find((c) => c.id === tu.category_id);
            return (
              <Link
                key={tu.id}
                href={`/tutorials/${tu.slug}`}
                className="group p-6 bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-2xl hover:border-[hsl(var(--primary)/0.4)] hover:shadow-md transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    {cat && (
                      <span
                        className="inline-block rounded-full px-2 py-0.5 text-[10px] font-bold text-white shadow-sm"
                        style={{ backgroundColor: cat.color }}
                      >
                        {cat.name}
                      </span>
                    )}
                    <span
                      className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold capitalize ${
                        tu.difficulty === "beginner"
                          ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                          : tu.difficulty === "intermediate"
                          ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                          : "bg-red-500/10 text-red-600 border-red-500/20"
                      }`}
                    >
                      {tu.difficulty}
                    </span>
                  </div>

                  <h3 className="font-bold text-base sm:text-lg text-[hsl(var(--foreground))] group-hover:text-[hsl(var(--primary))] transition-colors line-clamp-2">
                    {tu.title}
                  </h3>
                  <p className="mt-3 text-xs sm:text-sm text-[hsl(var(--muted-foreground))] line-clamp-3 leading-relaxed">
                    {tu.excerpt}
                  </p>
                </div>

                <div className="mt-6 flex flex-col gap-3.5 border-t border-[hsl(var(--border))] pt-4">
                  <div className="flex items-center justify-between text-xs text-[hsl(var(--muted-foreground))] font-semibold">
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-[hsl(var(--primary))]" />
                      {tu.read_time_minutes} min read
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      {formatNumber(tu.view_count)} Views
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-[hsl(var(--muted-foreground))]">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {new Date(tu.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                    <span className="font-bold group-hover:text-[hsl(var(--primary))] transition-colors flex items-center gap-0.5">
                      Read guide <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
