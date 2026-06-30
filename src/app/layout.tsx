import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | AIHub",
    default: "AIHub - Ultimate AI Tools, Prompts & Resources Directory",
  },
  description: "Discover the best AI tools, prompts, tutorials, comparisons, use cases, and news. Your one-stop destination for mastering artificial intelligence.",
  keywords: ["AI tools", "AI prompts", "AI rankings", "AI comparisons", "AI directory", "AI resources", "artificial intelligence"],
  openGraph: {
    title: "AIHub - AI Discovery Platform",
    description: "Find, compare, and learn about the best AI tools, prompts, and tutorials on the web.",
    url: "https://aihub.com",
    siteName: "AIHub",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AIHub - AI Discovery Platform",
    description: "Find, compare, and learn about the best AI tools, prompts, and tutorials on the web.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${jetbrainsMono.variable} antialiased font-sans bg-background text-foreground transition-colors duration-300 min-h-screen flex flex-col`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <Header />
          <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
