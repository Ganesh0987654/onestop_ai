import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getRankingBySlug, getRankingEntries, getRankings } from "@/lib/supabase-db";
import { formatNumber } from "@/lib/utils";
import { ArrowLeft, ChevronRight, Check, X, ShieldCheck, HelpCircle } from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const ranking = await getRankingBySlug(slug);

  if (!ranking) {
    return {
      title: "Ranking Not Found",
    };
  }

  return {
    title: ranking.title,
    description: ranking.description,
  };
}

export async function generateStaticParams() {
  const rankingsList = await getRankings();
  return rankingsList.map((rank) => ({
    slug: rank.slug,
  }));
}

export default async function RankingDetailPage({ params }: Props) {
  const { slug } = await params;
  const ranking = await getRankingBySlug(slug);

  if (!ranking) {
    notFound();
  }

  const entries = await getRankingEntries(ranking.id);

  return (
    <div className="space-y-10 pb-16">
      {/* Breadcrumbs & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[hsl(var(--border))] pb-4">
        <Link
          href="/rankings"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Rankings
        </Link>
        <nav className="flex items-center gap-1.5 text-xs text-[hsl(var(--muted-foreground))]">
          <Link href="/" className="hover:text-[hsl(var(--foreground))]">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/rankings" className="hover:text-[hsl(var(--foreground))]">Rankings</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-[hsl(var(--foreground))] font-semibold">{ranking.title}</span>
        </nav>
      </div>

      {/* Hero Header */}
      <section className="space-y-4">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[hsl(var(--foreground))]">
          {ranking.title}
        </h1>
        <p className="text-base sm:text-lg text-[hsl(var(--muted-foreground))] max-w-3xl leading-relaxed">
          {ranking.description}
        </p>
      </section>

      {/* Methodology Section */}
      {ranking.methodology && (
        <section className="p-5 bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-2xl flex items-start gap-3.5">
          <HelpCircle className="h-5 w-5 text-[hsl(var(--primary))] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h3 className="font-bold text-xs uppercase tracking-wider text-[hsl(var(--foreground))]">
              Our Methodology
            </h3>
            <p className="text-xs text-[hsl(var(--muted-foreground))] leading-relaxed">
              {ranking.methodology}
            </p>
          </div>
        </section>
      )}

      {/* Ordered Entries Grid */}
      <section className="space-y-6">
        {entries.map((entry) => {
          const position = entry.position;
          const score = entry.score || 0;
          const tool = entry.tool;

          if (!tool) return null;

          // Position colors
          const cardBorderClass =
            position === 1
              ? "border-amber-500/50 shadow-amber-500/5 shadow-md dark:border-amber-500/30"
              : position === 2
              ? "border-slate-400/50 shadow-slate-500/5 shadow-md dark:border-slate-500/30"
              : position === 3
              ? "border-amber-700/50 shadow-amber-800/5 shadow-md dark:border-amber-700/30"
              : "border-[hsl(var(--border))]";

          const positionBadgeClass =
            position === 1
              ? "bg-amber-500 text-white shadow-amber-500/20"
              : position === 2
              ? "bg-slate-400 text-white shadow-slate-500/20"
              : position === 3
              ? "bg-amber-700 text-white shadow-amber-800/20"
              : "bg-[hsl(var(--muted))] text-[hsl(var(--foreground))] border border-[hsl(var(--border))]";

          return (
            <div
              key={entry.id}
              className={`p-6 sm:p-8 bg-[hsl(var(--card))] border rounded-3xl transition-all duration-300 flex flex-col md:flex-row gap-6 ${cardBorderClass}`}
            >
              {/* Left Column: Medal / Position & Score Summary */}
              <div className="flex md:flex-col items-center justify-between md:justify-center gap-4 md:w-32 text-center border-b md:border-b-0 md:border-r border-[hsl(var(--border))] pb-4 md:pb-0 md:pr-6 shrink-0">
                <div className={`h-12 w-12 rounded-full flex items-center justify-center font-black text-lg shadow-sm ${positionBadgeClass}`}>
                  #{position}
                </div>
                
                <div className="space-y-1">
                  <div className="text-2xl font-black text-[hsl(var(--foreground))]">
                    {Number(score).toFixed(1)}
                  </div>
                  <div className="text-[10px] uppercase font-bold text-[hsl(var(--muted-foreground))]">
                    AI Score
                  </div>
                </div>
              </div>

              {/* Right Column: Content Breakdown */}
              <div className="flex-1 space-y-4">
                <div className="flex flex-wrap items-baseline gap-2">
                  <Link
                    href={`/tools/${tool.slug}`}
                    className="text-xl font-bold text-[hsl(var(--foreground))] hover:text-[hsl(var(--primary))] hover:underline flex items-center gap-1.5"
                  >
                    {tool.name}
                    {tool.is_verified && <ShieldCheck className="h-4.5 w-4.5 text-blue-500 fill-blue-500/10" />}
                  </Link>
                  <span className="text-xs text-[hsl(var(--muted-foreground))] font-normal">
                    {tool.tagline}
                  </span>
                </div>

                {/* Score Progress Bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[10px] text-[hsl(var(--muted-foreground))] font-semibold">
                    <span>Performance Rating</span>
                    <span>{Number(score) * 10}%</span>
                  </div>
                  <div className="w-full h-2 bg-[hsl(var(--muted))] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[hsl(var(--primary))] to-purple-500 rounded-full"
                      style={{ width: `${Number(score) * 10}%` }}
                    />
                  </div>
                </div>

                {/* Highlights paragraph */}
                {entry.highlights && (
                  <p className="text-sm text-[hsl(var(--muted-foreground))] bg-[hsl(var(--muted)/0.3)] border border-[hsl(var(--border))] rounded-xl p-4 leading-relaxed">
                    <strong className="text-[hsl(var(--foreground))] font-semibold">Highlights: </strong>
                    {entry.highlights}
                  </p>
                )}

                {/* Pros and Cons Columns */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Pros */}
                  <div className="space-y-2">
                    <h4 className="font-bold text-xs uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                      Pros
                    </h4>
                    <ul className="space-y-1.5 text-xs text-[hsl(var(--muted-foreground))]">
                      {entry.pros.map((pro, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{pro}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Cons */}
                  <div className="space-y-2">
                    <h4 className="font-bold text-xs uppercase tracking-wider text-red-500">
                      Cons
                    </h4>
                    <ul className="space-y-1.5 text-xs text-[hsl(var(--muted-foreground))]">
                      {entry.cons.map((con, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <X className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                          <span>{con}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
}
