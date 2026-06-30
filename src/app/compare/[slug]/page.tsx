import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getComparisonBySlug,
  getComparisonFeatures,
  getToolById,
  getComparisons,
} from "@/lib/supabase-db";
import { ArrowLeft, ChevronRight, CheckCircle2, ShieldCheck } from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const comp = await getComparisonBySlug(slug);

  if (!comp) {
    return {
      title: "Comparison Not Found",
    };
  }

  return {
    title: comp.title,
    description: comp.summary,
  };
}

export async function generateStaticParams() {
  const comps = await getComparisons();
  return comps.map((comp) => ({
    slug: comp.slug,
  }));
}

export default async function CompareDetailPage({ params }: Props) {
  const { slug } = await params;
  const comp = await getComparisonBySlug(slug);

  if (!comp) {
    notFound();
  }

  const toolA = await getToolById(comp.tool_a_id);
  const toolB = await getToolById(comp.tool_b_id);
  const features = await getComparisonFeatures(comp.id);

  // Calculate totals
  const totalScoreA = features.reduce((sum, f) => sum + (f.tool_a_score || 0), 0);
  const totalScoreB = features.reduce((sum, f) => sum + (f.tool_b_score || 0), 0);

  const winner = comp.winner_id ? await getToolById(comp.winner_id) : null;

  return (
    <div className="space-y-10 pb-16">
      {/* Breadcrumbs & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[hsl(var(--border))] pb-4">
        <Link
          href="/compare"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Comparisons
        </Link>
        <nav className="flex items-center gap-1.5 text-xs text-[hsl(var(--muted-foreground))]">
          <Link href="/" className="hover:text-[hsl(var(--foreground))]">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/compare" className="hover:text-[hsl(var(--foreground))]">Compare</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-[hsl(var(--foreground))] font-semibold">{comp.title}</span>
        </nav>
      </div>

      {/* Hero Showdown Card */}
      <section className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-3xl p-8 shadow-sm relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_hsl(var(--primary)/0.03),_transparent_75%)]" />
        
        <div className="relative z-10 flex flex-col items-center gap-6">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12 w-full max-w-2xl text-center">
            {/* Tool A */}
            <div className="flex flex-col items-center gap-3 flex-1">
              <div className="h-16 w-16 rounded-2xl flex items-center justify-center bg-gradient-to-br from-[hsl(var(--primary))] to-purple-500 text-xl font-bold text-white shadow-md">
                {toolA ? toolA.name.slice(0, 2) : "A"}
              </div>
              <h2 className="text-xl font-extrabold text-[hsl(var(--foreground))] flex items-center gap-1 font-sans justify-center">
                {toolA?.name}
                {toolA?.is_verified && <ShieldCheck className="h-4.5 w-4.5 text-blue-500 fill-blue-500/10" />}
              </h2>
              <span className="text-xs text-[hsl(var(--muted-foreground))] line-clamp-1">{toolA?.tagline}</span>
            </div>

            {/* VS */}
            <div className="flex items-center justify-center h-12 w-12 rounded-full bg-purple-500/10 border border-purple-500/20 text-sm font-bold text-purple-600 dark:text-purple-400 shrink-0">
              VS
            </div>

            {/* Tool B */}
            <div className="flex flex-col items-center gap-3 flex-1">
              <div className="h-16 w-16 rounded-2xl flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 text-xl font-bold text-white shadow-md">
                {toolB ? toolB.name.slice(0, 2) : "B"}
              </div>
              <h2 className="text-xl font-extrabold text-[hsl(var(--foreground))] flex items-center gap-1 font-sans justify-center">
                {toolB?.name}
                {toolB?.is_verified && <ShieldCheck className="h-4.5 w-4.5 text-blue-500 fill-blue-500/10" />}
              </h2>
              <span className="text-xs text-[hsl(var(--muted-foreground))] line-clamp-1">{toolB?.tagline}</span>
            </div>
          </div>

          <p className="max-w-xl text-center text-sm text-[hsl(var(--muted-foreground))] leading-relaxed pt-4 border-t border-[hsl(var(--border))] w-full">
            {comp.summary}
          </p>
        </div>
      </section>

      {/* Feature Comparison Table */}
      <section className="space-y-4">
        <h3 className="text-lg font-bold text-[hsl(var(--foreground))]">
          Feature Breakdown
        </h3>
        <div className="overflow-x-auto border border-[hsl(var(--border))] rounded-2xl bg-[hsl(var(--card))]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[hsl(var(--muted))] border-b border-[hsl(var(--border))] text-xs font-semibold text-[hsl(var(--muted-foreground))]">
                <th className="p-4 w-1/3">Feature</th>
                <th className="p-4 w-1/3 text-center">{toolA?.name}</th>
                <th className="p-4 w-1/3 text-center">{toolB?.name}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[hsl(var(--border))] text-xs sm:text-sm">
              {features.map((feature) => {
                const scoreA = feature.tool_a_score || 0;
                const scoreB = feature.tool_b_score || 0;

                const getCellStyles = (s1: number, s2: number) => {
                  if (s1 > s2) return "bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 font-medium";
                  if (s1 < s2) return "text-[hsl(var(--muted-foreground))]";
                  return "text-[hsl(var(--foreground))]";
                };

                const getBadgeStyles = (s1: number, s2: number) => {
                  if (s1 > s2) return "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30";
                  if (s1 < s2) return "bg-gray-500/5 text-gray-500 border border-gray-500/10";
                  return "bg-[hsl(var(--muted))] text-[hsl(var(--foreground))] border border-[hsl(var(--border))]";
                };

                return (
                  <tr key={feature.id} className="hover:bg-[hsl(var(--muted)/0.3)] transition-colors">
                    <td className="p-4 font-semibold text-[hsl(var(--foreground))]">
                      <div>{feature.feature_name}</div>
                      <span className="text-[10px] text-[hsl(var(--muted-foreground))] font-normal">
                        {feature.category}
                      </span>
                    </td>
                    <td className={`p-4 text-center ${getCellStyles(scoreA, scoreB)}`}>
                      <div>{feature.tool_a_value}</div>
                      {scoreA > 0 && (
                        <span className={`inline-block mt-1.5 px-2 py-0.5 rounded text-[10px] font-bold ${getBadgeStyles(scoreA, scoreB)}`}>
                          Score: {scoreA}/10
                        </span>
                      )}
                    </td>
                    <td className={`p-4 text-center ${getCellStyles(scoreB, scoreA)}`}>
                      <div>{feature.tool_b_value}</div>
                      {scoreB > 0 && (
                        <span className={`inline-block mt-1.5 px-2 py-0.5 rounded text-[10px] font-bold ${getBadgeStyles(scoreB, scoreA)}`}>
                          Score: {scoreB}/10
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
              {/* Totals Row */}
              <tr className="bg-[hsl(var(--muted)/0.5)] border-t-2 border-[hsl(var(--border))] font-bold text-xs sm:text-sm">
                <td className="p-4 text-[hsl(var(--foreground))]">Aggregate Score</td>
                <td className="p-4 text-center text-[hsl(var(--foreground))]">
                  <div className="text-lg font-black">{totalScoreA}</div>
                  <span className="text-[10px] text-[hsl(var(--muted-foreground))]">Overall Points</span>
                </td>
                <td className="p-4 text-center text-[hsl(var(--foreground))]">
                  <div className="text-lg font-black">{totalScoreB}</div>
                  <span className="text-[10px] text-[hsl(var(--muted-foreground))]">Overall Points</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Verdict Section */}
      <section className="p-6 bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-2xl space-y-4">
        <h3 className="text-lg font-bold text-[hsl(var(--foreground))] border-b border-[hsl(var(--border))] pb-3 flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-emerald-500" />
          The Verdict
        </h3>
        <p className="text-sm text-[hsl(var(--muted-foreground))] leading-relaxed">
          {comp.verdict}
        </p>

        {winner && (
          <div className="mt-4 flex items-center justify-between p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
              WINNER SELECTION
            </span>
            <Link
              href={`/tools/${winner.slug}`}
              className="text-xs font-black text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-3 py-1.5 hover:bg-emerald-500/20 transition-all"
            >
              Explore {winner.name} →
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
