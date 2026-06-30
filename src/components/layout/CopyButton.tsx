"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

export default function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-lg text-xs font-bold text-[hsl(var(--foreground))] hover:border-[hsl(var(--primary)/0.4)] transition-all shrink-0 hover:bg-[hsl(var(--muted))]"
      title="Copy to clipboard"
    >
      {copied ? (
        <>
          <Check className="h-3.5 w-3.5 text-emerald-500" />
          <span className="text-emerald-500 font-semibold">Copied!</span>
        </>
      ) : (
        <>
          <Copy className="h-3.5 w-3.5 text-[hsl(var(--muted-foreground))]" />
          <span>Copy Prompt</span>
        </>
      )}
    </button>
  );
}
