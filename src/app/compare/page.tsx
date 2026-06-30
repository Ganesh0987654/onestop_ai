import type { Metadata } from "next";
import Link from "next/link";
import { getComparisons, getTools } from "@/lib/supabase-db";
import { formatNumber } from "@/lib/utils";
import { Eye, ArrowRight, GitCompare } from "lucide-react";

export const metadata: Metadata = {
  title: "AI Tool Comparisons",
  description: "Detailed, objective comparisons of the top AI tools on features, capabilities, pricing, and winner verdicts.",
};

export default async function ComparePage() {
  const comparisonsList = await getComparisons();
  const toolsList = await getTools();

  const getToolFromList = (id: string) => toolsList.find((t) => t.id === id);

  return (
    <div className="space-y-8 pb-16">
      {/* Hero */}
      <div className="space-y-4">
        <h1 className="text-3xl font-extrabold tracking-tight text-[hsl(var(--foreground))] flex items-center gap-2">
          <GitCompare className="h-8 w-8 text-[hsl(var(--primary))]" />
          AI Tool Comparisons
        </h1>
        <p className="text-[hsl(var(--muted-foreground))] max-w-2xl">
          Deep-dive showdowns comparing features, context sizes, API structures, and verdicts of competing artificial intelligence products.
        </p>
      </div>

      {/* Grid of comparisons */}
      {comparisonsList.length === 0 ? (
        <div className="text-center p-12 bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-2xl">
          <p className="text-sm text-[hsl(var(--muted-foreground))]">No comparisons published yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {comparisonsList.map((comp) => {
            const toolA = getToolFromList(comp.tool_a_id);
            const toolB = getToolFromList(comp.tool_b_id);

            return (
              <Link
                key={comp.id}
                href={`/compare/${comp.slug}`}
                className="group flex flex-col justify-between p-6 bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-2xl hover:border-[hsl(var(--primary)/0.4)] hover:shadow-md transition-all duration-300"
              >
                <div>
                  <div className="flex items-center justify-center gap-4 text-center">
                    <span className="font-bold text-base sm:text-lg text-[hsl(var(--foreground))] flex-1 text-right truncate">
                      {toolA?.name || comp.title.split(" vs ")[0]}
                    </span>
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs font-bold text-purple-600 dark:text-purple-400 shrink-0">
                      VS
                    </div>
                    <span className="font-bold text-base sm:text-lg text-[hsl(var(--foreground))] flex-1 text-left truncate">
                      {toolB?.name || comp.title.split(" vs ")[1]}
                    </span>
                  </div>
                  <p className="mt-4 text-xs sm:text-sm text-[hsl(var(--muted-foreground))] text-center line-clamp-2 leading-relaxed">
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
            );
          })}
        </div>
      )}
    </div>
  );
}
