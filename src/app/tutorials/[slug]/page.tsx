import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getTutorialBySlug, getTutorialCategories, getToolById, getTutorials } from "@/lib/supabase-db";
import { formatNumber } from "@/lib/utils";
import { ArrowLeft, ChevronRight, Clock, Eye, Calendar, Layers } from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tu = await getTutorialBySlug(slug);

  if (!tu) {
    return {
      title: "Tutorial Not Found",
    };
  }

  return {
    title: tu.title,
    description: tu.excerpt,
  };
}

export async function generateStaticParams() {
  const tutorialsList = await getTutorials();
  return tutorialsList.map((tu) => ({
    slug: tu.slug,
  }));
}

// A simple local function to render raw markdown strings into clean visual HTML
function renderContent(content: string) {
  const lines = content.split("\n");
  return lines.map((line, idx) => {
    if (line.startsWith("# ")) {
      return (
        <h1 key={idx} className="text-2xl sm:text-3xl font-extrabold text-[hsl(var(--foreground))] mt-8 mb-4 border-b border-[hsl(var(--border))] pb-2">
          {line.replace("# ", "")}
        </h1>
      );
    }
    if (line.startsWith("## ")) {
      return (
        <h2 key={idx} className="text-xl sm:text-2xl font-bold text-[hsl(var(--foreground))] mt-6 mb-3">
          {line.replace("## ", "")}
        </h2>
      );
    }
    if (line.trim() === "") {
      return <div key={idx} className="h-3" />;
    }
    return (
      <p key={idx} className="text-sm sm:text-base text-[hsl(var(--muted-foreground))] leading-relaxed mb-4">
        {line}
      </p>
    );
  });
}

export default async function TutorialDetailPage({ params }: Props) {
  const { slug } = await params;
  const tu = await getTutorialBySlug(slug);

  if (!tu) {
    notFound();
  }

  const categoriesList = await getTutorialCategories();
  const category = categoriesList.find((c) => c.id === tu.category_id);
  
  // Get related tools
  const relatedTools = await Promise.all(
    (tu.related_tool_ids || []).map((id) => getToolById(id))
  ).then((list) => list.filter(Boolean));

  return (
    <div className="space-y-10 pb-16">
      {/* Breadcrumbs & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[hsl(var(--border))] pb-4">
        <Link
          href="/tutorials"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Tutorials
        </Link>
        <nav className="flex items-center gap-1.5 text-xs text-[hsl(var(--muted-foreground))]">
          <Link href="/" className="hover:text-[hsl(var(--foreground))]">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/tutorials" className="hover:text-[hsl(var(--foreground))]">Tutorials</Link>
          {category && (
            <>
              <ChevronRight className="h-3 w-3" />
              <Link href={`/tutorials?category=${category.id}`} className="hover:text-[hsl(var(--foreground))]">
                {category.name}
              </Link>
            </>
          )}
          <ChevronRight className="h-3 w-3" />
          <span className="text-[hsl(var(--foreground))] font-semibold truncate max-w-[200px] sm:max-w-none">
            {tu.title}
          </span>
        </nav>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left main tutorial body */}
        <div className="lg:col-span-2 space-y-8">
          {/* Header Card */}
          <section className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              {category && (
                <span
                  className="inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold text-white shadow-sm"
                  style={{ backgroundColor: category.color }}
                >
                  {category.name}
                </span>
              )}
              <span
                className={`rounded-full border px-2.5 py-0.5 text-[10px] font-semibold capitalize ${
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
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[hsl(var(--foreground))]">
              {tu.title}
            </h1>
            <p className="text-base sm:text-lg text-[hsl(var(--muted-foreground))] italic border-l-4 border-[hsl(var(--primary))] pl-4">
              {tu.excerpt}
            </p>
          </section>

          {/* Content Body */}
          <section className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-2xl p-6 sm:p-8 shadow-sm">
            <article className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
              {renderContent(tu.content)}
            </article>
          </section>
        </div>

        {/* Right column sidebar */}
        <div className="space-y-8">
          {/* Metadata sheet */}
          <section className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-2xl p-6 space-y-4 shadow-sm font-sans">
            <h3 className="font-bold text-sm uppercase tracking-wider text-[hsl(var(--foreground))] border-b border-[hsl(var(--border))] pb-2.5">
              Guide Information
            </h3>
            <div className="space-y-3.5 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-[hsl(var(--muted-foreground))] font-semibold flex items-center gap-1">
                  <Clock className="h-4 w-4 text-[hsl(var(--primary))]" />
                  Read Time
                </span>
                <span className="font-bold text-[hsl(var(--foreground))]">{tu.read_time_minutes} minutes</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[hsl(var(--muted-foreground))] font-semibold flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  View Count
                </span>
                <span className="font-bold text-[hsl(var(--foreground))]">{formatNumber(tu.view_count)} Views</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[hsl(var(--muted-foreground))] font-semibold flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Published On
                </span>
                <span className="font-bold text-[hsl(var(--foreground))]">
                  {new Date(tu.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </span>
              </div>
            </div>

            {/* Tags */}
            <div className="pt-4 border-t border-[hsl(var(--border))] space-y-2">
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-[hsl(var(--muted-foreground))]">
                Tags
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {tu.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] font-semibold bg-[hsl(var(--muted))] border border-[hsl(var(--border))] px-2 py-0.5 rounded-md text-[hsl(var(--muted-foreground))]"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </section>

          {/* Related Tools */}
          {relatedTools.length > 0 && (
            <section className="space-y-4">
              <h3 className="font-bold text-base text-[hsl(var(--foreground))] flex items-center gap-1.5">
                <Layers className="h-4.5 w-4.5 text-[hsl(var(--primary))]" />
                Featured Tools in Guide
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
