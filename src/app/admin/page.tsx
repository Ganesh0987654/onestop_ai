import type { Metadata } from "next";
import Link from "next/link";
import {
  Wrench,
  FileText,
  BookOpen,
  Trophy,
  Newspaper,
  Users,
  BarChart3,
  MessageSquare,
  Settings,
  Plus,
  Eye,
  TrendingUp,
} from "lucide-react";
import { tools, prompts, tutorials, rankings, news, comparisons, useCases, categories } from "@/lib/data";
import { formatNumber } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  robots: { index: false, follow: false },
};

const stats = [
  { label: "Total Tools", value: tools.length, icon: Wrench, color: "#6366f1", href: "/admin/tools" },
  { label: "Total Prompts", value: prompts.length, icon: MessageSquare, color: "#ec4899", href: "/admin/prompts" },
  { label: "Total Tutorials", value: tutorials.length, icon: BookOpen, color: "#10b981", href: "/admin/tutorials" },
  { label: "Total Rankings", value: rankings.length, icon: Trophy, color: "#f59e0b", href: "/admin/rankings" },
  { label: "News Articles", value: news.length, icon: Newspaper, color: "#3b82f6", href: "/admin/news" },
  { label: "Comparisons", value: comparisons.length, icon: BarChart3, color: "#8b5cf6", href: "/admin/comparisons" },
  { label: "Use Cases", value: useCases.length, icon: Users, color: "#06b6d4", href: "/admin/use-cases" },
  { label: "Categories", value: categories.length, icon: Settings, color: "#f97316", href: "/admin/categories" },
];

const quickActions = [
  { label: "Add New Tool", href: "/admin/tools/new", icon: Plus, color: "#6366f1" },
  { label: "Add Prompt", href: "/admin/prompts/new", icon: Plus, color: "#ec4899" },
  { label: "Write Tutorial", href: "/admin/tutorials/new", icon: Plus, color: "#10b981" },
  { label: "Add News", href: "/admin/news/new", icon: Plus, color: "#3b82f6" },
];

const recentTools = tools.slice(0, 8);

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-[hsl(var(--background))]">
      {/* Admin Header */}
      <div className="border-b border-[hsl(var(--border))] bg-[hsl(var(--card))]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/" className="text-lg font-bold text-[hsl(var(--foreground))]">
                ← AIHub
              </Link>
              <span className="text-[hsl(var(--muted-foreground))]">/</span>
              <span className="text-[hsl(var(--foreground))] font-semibold">Admin Dashboard</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center rounded-full bg-[hsl(var(--primary)/.1)] px-3 py-1 text-xs font-medium text-[hsl(var(--primary))]">
                Admin
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[hsl(var(--foreground))]">Dashboard Overview</h1>
          <p className="mt-2 text-[hsl(var(--muted-foreground))]">
            Manage your AI tools directory, prompts, tutorials, and more.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 mb-8">
          {stats.map((stat) => (
            <Link
              key={stat.label}
              href={stat.href}
              className="group rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-[hsl(var(--primary)/.3)]"
            >
              <div className="flex items-center justify-between mb-3">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-lg"
                  style={{ backgroundColor: stat.color + "20" }}
                >
                  <stat.icon className="h-5 w-5" style={{ color: stat.color }} />
                </div>
                <Eye className="h-4 w-4 text-[hsl(var(--muted-foreground))] opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-2xl font-bold text-[hsl(var(--foreground))]">{stat.value}</p>
              <p className="text-sm text-[hsl(var(--muted-foreground))]">{stat.label}</p>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-[hsl(var(--foreground))] mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {quickActions.map((action) => (
              <Link
                key={action.label}
                href={action.href}
                className="flex items-center gap-3 rounded-xl border border-dashed border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4 transition-all duration-300 hover:border-[hsl(var(--primary))] hover:bg-[hsl(var(--primary)/.05)]"
              >
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-lg"
                  style={{ backgroundColor: action.color + "20" }}
                >
                  <action.icon className="h-4 w-4" style={{ color: action.color }} />
                </div>
                <span className="text-sm font-medium text-[hsl(var(--foreground))]">{action.label}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Recent Tools */}
          <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]">
            <div className="flex items-center justify-between border-b border-[hsl(var(--border))] px-6 py-4">
              <h2 className="text-lg font-semibold text-[hsl(var(--foreground))]">Recent Tools</h2>
              <Link
                href="/admin/tools"
                className="text-sm text-[hsl(var(--primary))] hover:underline"
              >
                View All →
              </Link>
            </div>
            <div className="divide-y divide-[hsl(var(--border))]">
              {recentTools.map((tool) => (
                <div key={tool.id} className="flex items-center justify-between px-6 py-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold text-white"
                      style={{ backgroundColor: categories.find(c => c.id === tool.category_id)?.color || "#6366f1" }}
                    >
                      {tool.name[0]}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[hsl(var(--foreground))]">{tool.name}</p>
                      <p className="text-xs text-[hsl(var(--muted-foreground))]">{tool.pricing_type}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[hsl(var(--muted-foreground))]">
                      ★ {tool.avg_rating}
                    </span>
                    <TrendingUp className="h-3 w-3 text-[hsl(var(--success))]" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Platform Stats */}
          <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]">
            <div className="border-b border-[hsl(var(--border))] px-6 py-4">
              <h2 className="text-lg font-semibold text-[hsl(var(--foreground))]">Platform Overview</h2>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-[hsl(var(--muted-foreground))]">Total Views</span>
                  <span className="font-medium text-[hsl(var(--foreground))]">
                    {formatNumber(tools.reduce((acc, t) => acc + t.view_count, 0))}
                  </span>
                </div>
                <div className="h-2 rounded-full bg-[hsl(var(--muted))]">
                  <div className="h-2 rounded-full bg-[hsl(var(--primary))]" style={{ width: "78%" }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-[hsl(var(--muted-foreground))]">Total Upvotes</span>
                  <span className="font-medium text-[hsl(var(--foreground))]">
                    {formatNumber(tools.reduce((acc, t) => acc + t.upvote_count, 0))}
                  </span>
                </div>
                <div className="h-2 rounded-full bg-[hsl(var(--muted))]">
                  <div className="h-2 rounded-full bg-green-500" style={{ width: "65%" }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-[hsl(var(--muted-foreground))]">Total Reviews</span>
                  <span className="font-medium text-[hsl(var(--foreground))]">
                    {formatNumber(tools.reduce((acc, t) => acc + t.review_count, 0))}
                  </span>
                </div>
                <div className="h-2 rounded-full bg-[hsl(var(--muted))]">
                  <div className="h-2 rounded-full bg-amber-500" style={{ width: "52%" }} />
                </div>
              </div>

              {/* Category Breakdown */}
              <div className="pt-4 border-t border-[hsl(var(--border))]">
                <h3 className="text-sm font-medium text-[hsl(var(--foreground))] mb-3">Top Categories</h3>
                <div className="space-y-2">
                  {categories.slice(0, 5).map((cat) => (
                    <div key={cat.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full" style={{ backgroundColor: cat.color }} />
                        <span className="text-sm text-[hsl(var(--muted-foreground))]">{cat.name}</span>
                      </div>
                      <span className="text-sm font-medium text-[hsl(var(--foreground))]">
                        {cat.tool_count} tools
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Management Links */}
        <div className="mt-8 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6">
          <h2 className="text-lg font-semibold text-[hsl(var(--foreground))] mb-4">Content Management</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Manage Tools", count: tools.length, href: "/admin/tools", icon: Wrench },
              { label: "Manage Prompts", count: prompts.length, href: "/admin/prompts", icon: MessageSquare },
              { label: "Manage Tutorials", count: tutorials.length, href: "/admin/tutorials", icon: BookOpen },
              { label: "Manage Rankings", count: rankings.length, href: "/admin/rankings", icon: Trophy },
              { label: "Manage News", count: news.length, href: "/admin/news", icon: Newspaper },
              { label: "Manage Comparisons", count: comparisons.length, href: "/admin/comparisons", icon: BarChart3 },
              { label: "Manage Use Cases", count: useCases.length, href: "/admin/use-cases", icon: Users },
              { label: "Manage Categories", count: categories.length, href: "/admin/categories", icon: Settings },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="flex items-center gap-3 rounded-lg border border-[hsl(var(--border))] p-3 transition-colors hover:bg-[hsl(var(--muted))]"
              >
                <item.icon className="h-5 w-5 text-[hsl(var(--muted-foreground))]" />
                <div>
                  <p className="text-sm font-medium text-[hsl(var(--foreground))]">{item.label}</p>
                  <p className="text-xs text-[hsl(var(--muted-foreground))]">{item.count} items</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
