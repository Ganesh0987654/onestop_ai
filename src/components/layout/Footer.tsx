import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const sections = [
    {
      title: "Platform",
      links: [
        { name: "AI Tools Directory", href: "/tools" },
        { name: "Rankings Hub", href: "/rankings" },
        { name: "Comparisons Hub", href: "/compare" },
        { name: "Prompt Library", href: "/prompts" },
      ],
    },
    {
      title: "Resources",
      links: [
        { name: "Tutorials & Guides", href: "/tutorials" },
        { name: "AI Use Cases", href: "/use-cases" },
        { name: "AI News Hub", href: "/news" },
      ],
    },
    {
      title: "Legal",
      links: [
        { name: "Privacy Policy", href: "/privacy" },
        { name: "Terms of Service", href: "/terms" },
      ],
    },
  ];

  return (
    <footer className="border-t border-[hsl(var(--border))] bg-[hsl(var(--background))] text-[hsl(var(--foreground))] transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          {/* Brand Info */}
          <div className="space-y-4 xl:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-[hsl(var(--primary))]" />
              <span className="bg-gradient-to-r from-[hsl(var(--primary))] to-purple-500 bg-clip-text text-xl font-bold tracking-tight text-transparent">
                AIHub
              </span>
            </Link>
            <p className="max-w-md text-sm text-[hsl(var(--muted-foreground))]">
              The ultimate SaaS-style platform to discover, compare, and master artificial intelligence tools and prompt engineering templates.
            </p>
          </div>

          {/* Links Grid */}
          <div className="mt-12 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0 sm:grid-cols-3">
            {sections.map((section) => (
              <div key={section.title}>
                <h3 className="text-sm font-semibold tracking-wider text-[hsl(var(--foreground))] uppercase">
                  {section.title}
                </h3>
                <ul className="mt-4 space-y-2">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-sm text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors duration-200"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-[hsl(var(--border))] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[hsl(var(--muted-foreground))]">
            &copy; {currentYear} AIHub. Built for the future of AI. All rights reserved.
          </p>
          <div className="flex gap-4">
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
            >
              Twitter
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
