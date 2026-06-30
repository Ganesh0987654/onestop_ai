import type { Metadata } from "next";
import Link from "next/link";
import { getUseCases } from "@/lib/supabase-db";
import { formatNumber } from "@/lib/utils";
import { Users, Eye, ArrowRight, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "AI Use Cases",
  description: "Explore how professionals, students, and businesses apply artificial intelligence tools to optimize work.",
};

export default async function UseCasesPage() {
  const useCasesList = await getUseCases();

  return (
    <div className="space-y-8 pb-16">
      {/* Hero */}
      <div className="space-y-4">
        <h1 className="text-3xl font-extrabold tracking-tight text-[hsl(var(--foreground))] flex items-center gap-2">
          <Users className="h-8 w-8 text-[hsl(var(--primary))]" />
          AI For Every Role
        </h1>
        <p className="text-[hsl(var(--muted-foreground))] max-w-2xl">
          Discover how different audiences leverage artificial intelligence. Learn how builders, creators, and students save hours of work.
        </p>
      </div>

      {/* Grid */}
      {useCasesList.length === 0 ? (
        <div className="text-center p-12 bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-2xl">
          <p className="text-sm text-[hsl(var(--muted-foreground))]">No use cases published yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {useCasesList.map((uc) => (
            <Link
              key={uc.id}
              href={`/use-cases/${uc.slug}`}
              className="group p-6 bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-2xl hover:border-[hsl(var(--primary)/0.4)] hover:shadow-md transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 px-3 py-0.5 text-[10px] font-bold capitalize mb-4">
                  <Sparkles className="h-3 w-3" />
                  For {uc.audience}
                </span>
                <h3 className="font-bold text-lg text-[hsl(var(--foreground))] group-hover:text-[hsl(var(--primary))] transition-colors">
                  {uc.title}
                </h3>
                <p className="mt-2.5 text-xs sm:text-sm text-[hsl(var(--muted-foreground))] line-clamp-3 leading-relaxed">
                  {uc.excerpt}
                </p>
              </div>
              <div className="mt-6 flex items-center justify-between border-t border-[hsl(var(--border))] pt-4 text-xs text-[hsl(var(--muted-foreground))]">
                <span className="flex items-center gap-1 font-medium">
                  <Eye className="h-4 w-4" />
                  {formatNumber(uc.view_count)} Views
                </span>
                <span className="font-semibold group-hover:text-[hsl(var(--primary))] transition-colors flex items-center gap-0.5">
                  Learn more <ArrowRight className="h-3 w-3" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
