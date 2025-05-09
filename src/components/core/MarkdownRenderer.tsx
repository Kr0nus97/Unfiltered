"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Options } from 'react-markdown';

interface MarkdownRendererProps extends Options {
  // children is already part of Options as markdown content
}

export function MarkdownRenderer({ children, className, ...props }: MarkdownRendererProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      className={`prose dark:prose-invert prose-sm sm:prose-base lg:prose-lg xl:prose-xl break-words ${className || ''}`}
      {...props}
    >
      {children}
    </ReactMarkdown>
  );
}
