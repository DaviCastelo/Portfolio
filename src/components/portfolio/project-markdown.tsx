"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

/** Ajusta formatos comuns colados de README (ex.: `1- Item` → `1. Item`). */
export function normalizeProjectMarkdown(text: string): string {
  return text
    .replace(/\r\n/g, "\n")
    .replace(/^(\d+)\s*-\s+/gm, "$1. ")
    .replace(/^(#{1,6})([^\s#])/gm, "$1 $2");
}

/** Texto simples para preview no card (remove sintaxe Markdown). */
export function markdownToPlainPreview(text: string): string {
  return normalizeProjectMarkdown(text)
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/__([^_]+)__/g, "$1")
    .replace(/_([^_]+)_/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/^\s*[-*+]\s+/gm, "")
    .replace(/^\s*\d+\.\s+/gm, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/\n{2,}/g, " ")
    .replace(/\n/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim();
}

interface ProjectMarkdownProps {
  content: string;
  className?: string;
}

export function ProjectMarkdown({ content, className }: ProjectMarkdownProps) {
  const normalized = normalizeProjectMarkdown(content);
  if (!normalized.trim()) return null;

  return (
    <div className={cn("project-markdown", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-primary underline-offset-2 hover:underline"
            >
              {children}
            </a>
          ),
        }}
      >
        {normalized}
      </ReactMarkdown>
    </div>
  );
}
