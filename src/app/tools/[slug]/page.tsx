import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getToolBySlug,
  getToolPricing,
  getCategoryById,
  getTools,
} from "@/lib/supabase-db";
import { formatNumber, getInitials } from "@/lib/utils";
import {
  ArrowLeft,
  ArrowUpRight,
  ShieldCheck,
  Check,
  Zap,
  Globe,
  Layers,
  ChevronRight,
} from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tool = await getToolBySlug(slug);

  if (!tool) {
    return {
      title: "Tool Not Found",
    };
  }

  return {
    title: tool.name,
    description: tool.meta_description || tool.tagline,
  };
}

export async function generateStaticParams() {
  const toolsList = await getTools();
  return toolsList.map((tool) => ({
    slug: tool.slug,
  }));
}

export default async function ToolDetailPage({ params }: Props) {
  const { slug } = await params;
  const tool = await getToolBySlug(slug);

  if (!tool) {
    notFound();
  }

  const category = await getCategoryById(tool.category_id);
  const pricingTiers = await getToolPricing(tool.id);
  
  // Find alternatives in the same category (exclude current tool)
  const toolsList = await getTools();
  const alternatives = toolsList
    .filter((t) => t.category_id === tool.category_id && t.id !== tool.id)
    .slice(0, 3);

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
    <div className="space-y-10 pb-16">
      {/* Back navigation & Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[hsl(var(--border))] pb-4">
        <Link
          href="/tools"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Directory
        </Link>
        <nav className="flex items-center gap-1.5 text-xs text-[hsl(var(--muted-foreground))]">
          <Link href="/" className="hover:text-[hsl(var(--foreground))]">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/tools" className="hover:text-[hsl(var(--foreground))]">Tools</Link>
          {category && (
            <>
              <ChevronRight className="h-3 w-3" />
              <Link href={`/tools?category=${category.id}`} className="hover:text-[hsl(var(--foreground))]">
                {category.name}
              </Link>
            </>
          )}
          <ChevronRight className="h-3 w-3" />
          <span className="text-[hsl(var(--foreground))] font-semibold">{tool.name}</span>
        </nav>
      </div>

      {/* Hero Header Card */}
      <section className="p-6 sm:p-8 bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-2xl shadow-sm relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4 sm:gap-6">
          {/* Avatar Logo */}
          <div
            className="flex items-center justify-center h-16 w-16 sm:h-20 sm:w-20 rounded-2xl text-2xl font-bold text-white shadow-md shrink-0"
            style={{
              background: `linear-gradient(135deg, ${category?.color || "var(--primary)"}, ${category?.color || "var(--primary)"}dd)`,
            }}
          >
            {getInitials(tool.name)}
          </div>
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[hsl(var(--foreground))]">
                {tool.name}
              </h1>
              {tool.is_verified && (
                <span className="inline-flex items-center gap-1 bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded-full text-[10px] font-bold">
                  <ShieldCheck className="h-3.5 w-3.5 fill-blue-500/5" />
                  Verified
                </span>
              )}
            </div>
            <p className="text-sm sm:text-base text-[hsl(var(--muted-foreground))]">
              {tool.tagline}
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-1.5 text-xs text-[hsl(var(--muted-foreground))]">
              <div className="flex items-center gap-1 font-semibold text-amber-500">
                <span>★</span>
                <span>{tool.avg_rating.toFixed(2)}</span>
                <span className="text-[hsl(var(--muted-foreground))] font-normal">
                  ({formatNumber(tool.review_count)} reviews)
                </span>
              </div>
              <span>•</span>
              <span className={`rounded-full border px-2.5 py-0.5 font-bold text-[10px] ${pricingColorClass}`}>
                {pricingLabel}
              </span>
              <span>•</span>
              <span className="font-semibold text-[hsl(var(--foreground))]">
                ▲ {formatNumber(tool.upvote_count)} Upvotes
              </span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex flex-wrap gap-3 w-full md:w-auto">
          <a
            href={tool.website_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full md:w-auto px-5 py-3 bg-[hsl(var(--primary))] text-white rounded-xl text-sm font-bold shadow-md hover:opacity-90 hover:-translate-y-0.5 transition-all"
          >
            Visit Website
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>
      </section>

      {/* Main Details Structure */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side: Overview & Pricing */}
        <div className="lg:col-span-2 space-y-8">
          {/* Overview */}
          <section className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-2xl p-6 sm:p-8 space-y-4">
            <h2 className="text-xl font-bold text-[hsl(var(--foreground))] border-b border-[hsl(var(--border))] pb-3">
              Overview
            </h2>
            <p className="text-sm text-[hsl(var(--muted-foreground))] leading-relaxed whitespace-pre-line">
              {tool.description}
            </p>
          </section>

          {/* Pricing Grid */}
          <section className="space-y-6">
            <h2 className="text-xl font-bold text-[hsl(var(--foreground))] flex items-center gap-2">
              <Zap className="h-5 w-5 text-[hsl(var(--primary))]" />
              Pricing & Plans
            </h2>
            {pricingTiers.length === 0 ? (
              <div className="p-6 bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-2xl text-center text-xs text-[hsl(var(--muted-foreground))]">
                No detailed pricing plans available. Check the official website for details.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {pricingTiers.map((tier) => (
                  <div
                    key={tier.id}
                    className={`p-6 bg-[hsl(var(--card))] border rounded-2xl flex flex-col justify-between relative ${
                      tier.is_popular
                        ? "border-[hsl(var(--primary))] shadow-md"
                        : "border-[hsl(var(--border))]"
                    }`}
                  >
                    {tier.is_popular && (
                      <span className="absolute top-3 right-3 rounded-full bg-[hsl(var(--primary))] text-white text-[9px] font-extrabold uppercase px-2 py-0.5 tracking-wider">
                        Popular
                      </span>
                    )}
                    <div>
                      <h3 className="text-base font-bold text-[hsl(var(--foreground))]">
                        {tier.plan_name}
                      </h3>
                      <div className="mt-3 flex items-baseline gap-1 text-[hsl(var(--foreground))]">
                        <span className="text-3xl font-extrabold">
                          {tier.price === null ? "Contact" : `$${tier.price}`}
                        </span>
                        {tier.price !== null && tier.billing_period && (
                          <span className="text-xs text-[hsl(var(--muted-foreground))] lowercase">
                            /{tier.billing_period}
                          </span>
                        )}
                      </div>
                      
                      {/* Features */}
                      <ul className="mt-6 space-y-2.5 text-xs text-[hsl(var(--muted-foreground))]">
                        {tier.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Right Side: Sidebar Meta & Alternatives */}
        <div className="space-y-8">
          {/* Metadata Specs Panel */}
          <section className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-2xl p-6 space-y-4">
            <h3 className="font-bold text-sm uppercase tracking-wider text-[hsl(var(--foreground))] border-b border-[hsl(var(--border))] pb-2.5">
              Tool Metadata
            </h3>
            <div className="space-y-3.5 text-xs">
              <div className="flex justify-between">
                <span className="text-[hsl(var(--muted-foreground))] font-semibold">Category</span>
                <span className="font-bold text-[hsl(var(--foreground))]">{category?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[hsl(var(--muted-foreground))] font-semibold">Pricing Model</span>
                <span className="font-bold text-[hsl(var(--foreground))] capitalize">{tool.pricing_type}</span>
              </div>
              {tool.starting_price !== null && (
                <div className="flex justify-between">
                  <span className="text-[hsl(var(--muted-foreground))] font-semibold">Starting Price</span>
                  <span className="font-bold text-[hsl(var(--foreground))]">
                    ${tool.starting_price} {tool.currency}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-[hsl(var(--muted-foreground))] font-semibold">Website</span>
                <a
                  href={tool.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-[hsl(var(--primary))] hover:underline flex items-center gap-0.5"
                >
                  Visit <Globe className="h-3 w-3" />
                </a>
              </div>
            </div>
          </section>

          {/* Alternatives */}
          <section className="space-y-4">
            <h3 className="font-bold text-base text-[hsl(var(--foreground))] flex items-center gap-1.5">
              <Layers className="h-4.5 w-4.5 text-[hsl(var(--primary))]" />
              Similar Alternatives
            </h3>
            {alternatives.length === 0 ? (
              <div className="p-4 bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-xl text-center text-xs text-[hsl(var(--muted-foreground))]">
                No alternatives found.
              </div>
            ) : (
              <div className="space-y-3">
                {alternatives.map((alt) => (
                  <Link
                    key={alt.id}
                    href={`/tools/${alt.slug}`}
                    className="flex items-center gap-3 p-4 bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-xl hover:border-[hsl(var(--primary)/0.3)] hover:shadow-sm transition-all"
                  >
                    <div
                      className="flex items-center justify-center h-10 w-10 rounded-lg text-xs font-bold text-white shrink-0"
                      style={{
                        background: `linear-gradient(135deg, ${category?.color || "var(--primary)"}, ${category?.color || "var(--primary)"}dd)`,
                      }}
                    >
                      {getInitials(alt.name)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-bold text-xs text-[hsl(var(--foreground))] truncate">
                        {alt.name}
                      </h4>
                      <p className="text-[10px] text-[hsl(var(--muted-foreground))] truncate">
                        {alt.tagline}
                      </p>
                    </div>
                    <span className="text-xs text-amber-500 font-bold">★ {alt.avg_rating.toFixed(1)}</span>
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
