import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getPromptBySlug, getPromptCategories, getPrompts } from "@/lib/supabase-db";
import { formatNumber } from "@/lib/utils";
import CopyButton from "@/components/layout/CopyButton";
import { ArrowLeft, ChevronRight, BookOpen, ThumbsUp, Save, Star } from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const prompt = await getPromptBySlug(slug);

  if (!prompt) {
    return {
      title: "Prompt Not Found",
    };
  }

  return {
    title: prompt.title,
    description: prompt.description,
  };
}

export async function generateStaticParams() {
  const promptsList = await getPrompts();
  return promptsList.map((p) => ({
    slug: p.slug,
  }));
}

export default async function PromptDetailPage({ params }: Props) {
  const { slug } = await params;
  const prompt = await getPromptBySlug(slug);

  if (!prompt) {
    notFound();
  }

  const categoriesList = await getPromptCategories();
  const category = categoriesList.find((c) => c.id === prompt.category_id);
  
  // Find related prompts
  const promptsList = await getPrompts();
  const relatedPrompts = promptsList
    .filter((p) => p.category_id === prompt.category_id && p.id !== prompt.id)
    .slice(0, 2);

  return (
    <div className="space-y-10 pb-16">
      {/* Breadcrumbs & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[hsl(var(--border))] pb-4">
        <Link
          href="/prompts"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Prompt Library
        </Link>
        <nav className="flex items-center gap-1.5 text-xs text-[hsl(var(--muted-foreground))]">
          <Link href="/" className="hover:text-[hsl(var(--foreground))]">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/prompts" className="hover:text-[hsl(var(--foreground))]">Prompts</Link>
          {category && (
            <>
              <ChevronRight className="h-3 w-3" />
              <Link href={`/prompts?category=${category.id}`} className="hover:text-[hsl(var(--foreground))]">
                {category.name}
              </Link>
            </>
          )}
          <ChevronRight className="h-3 w-3" />
          <span className="text-[hsl(var(--foreground))] font-semibold">{prompt.title}</span>
        </nav>
      </div>

      {/* Main Container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column: Full prompt details */}
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
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[hsl(var(--foreground))]">
              {prompt.title}
            </h1>
            <p className="text-sm sm:text-base text-[hsl(var(--muted-foreground))] leading-relaxed">
              {prompt.description}
            </p>
          </section>

          {/* Prompt template content */}
          <section className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-2xl p-6 sm:p-8 space-y-4 shadow-sm relative">
            <div className="flex items-center justify-between border-b border-[hsl(var(--border))] pb-3">
              <h2 className="font-bold text-xs uppercase tracking-wider text-[hsl(var(--foreground))] flex items-center gap-1.5">
                <BookOpen className="h-4.5 w-4.5 text-[hsl(var(--primary))]" />
                Prompt Template
              </h2>
              <CopyButton text={prompt.prompt_text} />
            </div>
            <pre className="bg-[hsl(var(--muted))] rounded-xl p-5 border border-[hsl(var(--border))] font-mono text-xs sm:text-sm text-[hsl(var(--foreground))] whitespace-pre-wrap leading-relaxed select-text overflow-x-auto">
              {prompt.prompt_text}
            </pre>
          </section>

          {/* Example Output */}
          {prompt.example_output && (
            <section className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-2xl p-6 sm:p-8 space-y-4 shadow-sm">
              <h2 className="font-bold text-xs uppercase tracking-wider text-[hsl(var(--foreground))] border-b border-[hsl(var(--border))] pb-3">
                Expected Output Example
              </h2>
              <div className="bg-[hsl(var(--muted)/0.3)] border border-[hsl(var(--border))] rounded-xl p-5 text-xs sm:text-sm text-[hsl(var(--muted-foreground))] whitespace-pre-line leading-relaxed">
                {prompt.example_output}
              </div>
            </section>
          )}
        </div>

        {/* Right column: Specs & Related prompts */}
        <div className="space-y-8">
          {/* Metadata spec sheet */}
          <section className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-2xl p-6 space-y-4 font-sans">
            <h3 className="font-bold text-sm uppercase tracking-wider text-[hsl(var(--foreground))] border-b border-[hsl(var(--border))] pb-2.5">
              Stats & Info
            </h3>
            <div className="space-y-3.5 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-[hsl(var(--muted-foreground))] font-semibold flex items-center gap-1">
                  <Star className="h-4 w-4 text-[hsl(var(--primary))]" />
                  Uses Count
                </span>
                <span className="font-extrabold text-[hsl(var(--foreground))]">{formatNumber(prompt.use_count)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[hsl(var(--muted-foreground))] font-semibold flex items-center gap-1">
                  <Save className="h-4 w-4 text-blue-500" />
                  Saved Count
                </span>
                <span className="font-extrabold text-[hsl(var(--foreground))]">{formatNumber(prompt.save_count)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[hsl(var(--muted-foreground))] font-semibold flex items-center gap-1">
                  <ThumbsUp className="h-4 w-4 text-emerald-500" />
                  Upvotes Count
                </span>
                <span className="font-extrabold text-[hsl(var(--foreground))]">{formatNumber(prompt.upvote_count)}</span>
              </div>
            </div>

            {/* Tags display */}
            <div className="pt-4 border-t border-[hsl(var(--border))] space-y-2">
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-[hsl(var(--muted-foreground))]">
                Tags
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {prompt.tags.map((tag) => (
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

          {/* Related Prompts list */}
          <section className="space-y-4">
            <h3 className="font-bold text-base text-[hsl(var(--foreground))]">
              Related Prompts
            </h3>
            {relatedPrompts.length === 0 ? (
              <div className="p-4 bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-xl text-center text-xs text-[hsl(var(--muted-foreground))]">
                No related prompts found.
              </div>
            ) : (
              <div className="space-y-3">
                {relatedPrompts.map((p) => (
                  <Link
                    key={p.id}
                    href={`/prompts/${p.slug}`}
                    className="block p-4 bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-xl hover:border-[hsl(var(--primary)/0.3)] hover:shadow-sm transition-all"
                  >
                    <h4 className="font-bold text-xs text-[hsl(var(--foreground))] truncate group-hover:text-[hsl(var(--primary))]">
                      {p.title}
                    </h4>
                    <p className="text-[10px] text-[hsl(var(--muted-foreground))] line-clamp-2 mt-1">
                      {p.description}
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
