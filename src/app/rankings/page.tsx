import type { Metadata } from "next";
import Link from "next/link";
import { getRankings } from "@/lib/supabase-db";
import { formatNumber } from "@/lib/utils";
import { Eye, ArrowRight, Trophy } from "lucide-react";

export const metadata: Metadata = {
  title: "AI Tool Rankings",
  description: "Definitive rankings of the best AI tools by category, pricing model, and user audience.",
};

export default async function RankingsPage() {
  const rankingsList = await getRankings();

  return (
    <div className="space-y-8 pb-16">
      {/* Hero */}
      <div className="space-y-4">
        <h1 className="text-3xl font-extrabold tracking-tight text-[hsl(var(--foreground))] flex items-center gap-2">
          <Trophy className="h-8 w-8 text-yellow-500" />
          AI Tool Rankings
        </h1>
        <p className="text-[hsl(var(--muted-foreground))] max-w-2xl">
          Curated showdowns ranking artificial intelligence services by performance, features, pricing, and usability.
        </p>
      </div>

      {/* Grid */}
      {rankingsList.length === 0 ? (
        <div className="text-center p-12 bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-2xl">
          <p className="text-sm text-[hsl(var(--muted-foreground))]">No rankings published yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {rankingsList.map((rank) => (
            <Link
              key={rank.id}
              href={`/rankings/${rank.slug}`}
              className="group p-6 bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-2xl hover:border-[hsl(var(--primary)/0.4)] hover:shadow-md transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="inline-block rounded-full bg-[hsl(var(--muted))] border border-[hsl(var(--border))] px-2.5 py-0.5 text-[10px] font-bold text-[hsl(var(--muted-foreground))] capitalize">
                    {rank.category}
                  </span>
                  {rank.audience && (
                    <span className="inline-block rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 px-2 py-0.5 text-[10px] font-bold capitalize">
                      For {rank.audience}
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-bold text-[hsl(var(--foreground))] group-hover:text-[hsl(var(--primary))] transition-colors">
                  {rank.title}
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-[hsl(var(--muted-foreground))] line-clamp-2 leading-relaxed">
                  {rank.description}
                </p>
              </div>
              <div className="mt-6 flex items-center justify-between border-t border-[hsl(var(--border))] pt-4 text-xs text-[hsl(var(--muted-foreground))]">
                <span className="flex items-center gap-1 font-medium">
                  <Eye className="h-4 w-4" />
                  {formatNumber(rank.view_count)} Views
                </span>
                <span className="font-semibold group-hover:text-[hsl(var(--primary))] transition-colors flex items-center gap-0.5">
                  View ranking <ArrowRight className="h-3 w-3" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
