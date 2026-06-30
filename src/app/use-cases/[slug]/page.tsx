import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getUseCaseBySlug, getToolById, getUseCases } from "@/lib/supabase-db";
import { formatNumber } from "@/lib/utils";
import { ArrowLeft, ChevronRight, Eye, Layers } from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const uc = await getUseCaseBySlug(slug);

  if (!uc) {
    return {
      title: "Use Case Not Found",
    };
  }

  return {
    title: uc.title,
    description: uc.excerpt,
  };
}

export async function generateStaticParams() {
  const useCasesList = await getUseCases();
  return useCasesList.map((uc) => ({
    slug: uc.slug,
  }));
}

export default async function UseCaseDetailPage({ params }: Props) {
  const { slug } = await params;
  const uc = await getUseCaseBySlug(slug);

  if (!uc) {
    notFound();
  }

  // Get related tools
  const relatedTools = await Promise.all(
    (uc.related_tool_ids || []).map((id) => getToolById(id))
  ).then((list) => list.filter(Boolean));

  return (
    <div className="space-y-10 pb-16">
      {/* Breadcrumbs & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[hsl(var(--border))] pb-4">
        <Link
          href="/use-cases"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Use Cases
        </Link>
        <nav className="flex items-center gap-1.5 text-xs text-[hsl(var(--muted-foreground))]">
          <Link href="/" className="hover:text-[hsl(var(--foreground))]">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/use-cases" className="hover:text-[hsl(var(--foreground))]">Use Cases</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-[hsl(var(--foreground))] font-semibold truncate max-w-[200px] sm:max-w-none">
            {uc.title}
          </span>
        </nav>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column: Overview content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Header */}
          <section className="space-y-4">
            <span className="inline-block rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 px-3 py-0.5 text-[10px] font-bold capitalize">
              For {uc.audience}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[hsl(var(--foreground))]">
              {uc.title}
            </h1>
            <p className="text-base sm:text-lg text-[hsl(var(--muted-foreground))] leading-relaxed">
              {uc.excerpt}
            </p>
          </section>

          {/* Description / Content */}
          <section className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-2xl p-6 sm:p-8 space-y-4">
            <h2 className="text-xl font-bold text-[hsl(var(--foreground))] border-b border-[hsl(var(--border))] pb-3">
              Application Details
            </h2>
            <p className="text-sm sm:text-base text-[hsl(var(--muted-foreground))] leading-relaxed">
              Using the right set of AI configurations allows {uc.audience} to optimize productivity, remove bottlenecks, and automate repetitive tasks.
            </p>
            <p className="text-sm sm:text-base text-[hsl(var(--muted-foreground))] leading-relaxed pt-2">
              By deploying a workflow with verified models, users reduce time spent on manual drafting and coding by up to 80%. Discover the tools on the sidebar to get started.
            </p>
          </section>
        </div>

        {/* Right column sidebar */}
        <div className="space-y-8">
          {/* Information pane */}
          <section className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-2xl p-6 space-y-4 shadow-sm font-sans">
            <h3 className="font-bold text-sm uppercase tracking-wider text-[hsl(var(--foreground))] border-b border-[hsl(var(--border))] pb-2.5">
              Target Audience
            </h3>
            <div className="space-y-3.5 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-[hsl(var(--muted-foreground))] font-semibold">User Type</span>
                <span className="font-bold text-[hsl(var(--foreground))] capitalize">{uc.audience}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[hsl(var(--muted-foreground))] font-semibold flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  View Count
                </span>
                <span className="font-bold text-[hsl(var(--foreground))]">{formatNumber(uc.view_count)} Views</span>
              </div>
            </div>
          </section>

          {/* Featured Tools in Use Case */}
          {relatedTools.length > 0 && (
            <section className="space-y-4">
              <h3 className="font-bold text-base text-[hsl(var(--foreground))] flex items-center gap-1.5">
                <Layers className="h-4.5 w-4.5 text-[hsl(var(--primary))]" />
                Recommended Tools
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
