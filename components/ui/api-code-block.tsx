'use client';

import React, { useState } from 'react';
import { Terminal, Copy, Check } from 'lucide-react';

interface ApiCodeBlockProps {
  codeSnippet: string;
}

export function ApiCodeBlock({ codeSnippet }: ApiCodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const copyCode = () => {
    navigator.clipboard.writeText(codeSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
          <Terminal className="size-5 text-emerald-400" /> Python Request Example
        </h3>
        <button
          onClick={copyCode}
          className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1.5 bg-card border border-border px-2.5 py-1.5 rounded-md transition-colors"
        >
          {copied ? <Check className="size-3.5 text-emerald-400" /> : <Copy className="size-3.5" />}
          <span>{copied ? 'Copied!' : 'Copy Python Snippet'}</span>
        </button>
      </div>

      <div className="rounded-xl border border-border bg-black/90 p-5 font-mono text-xs overflow-x-auto text-zinc-300 leading-relaxed shadow-xl">
        <pre>{codeSnippet}</pre>
      </div>
    </div>
  );
}
