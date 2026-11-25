'use client';

import { useMemo, useEffect, useRef } from 'react';
import { Marked, type Tokens } from 'marked';
import { slugify } from '@/lib/utils';
import Prism from 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-markdown';

interface ArticleContentProps {
  contentMd: string;
}

function highlightCode(code: string, language?: string): string {
  const cleanLang = (language?.toLowerCase().trim() || 'typescript').replace(/^language-/, '');
  const grammar =
    Prism.languages[cleanLang] ||
    Prism.languages.typescript ||
    Prism.languages.javascript ||
    Prism.languages.text;
  const langKey = Prism.languages[cleanLang] ? cleanLang : 'code';

  try {
    return Prism.highlight(code, grammar, langKey);
  } catch {
    return code;
  }
}

export function ArticleContent({ contentMd }: ArticleContentProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Configure marked instance with custom renderer (supports both Markdown and Tiptap HTML)
  const htmlContent = useMemo(() => {
    const markedInstance = new Marked();

    markedInstance.use({
      renderer: {
        heading(
          this: { parser: { parseInline: (t: Tokens.Heading['tokens']) => string } },
          token: Tokens.Heading
        ) {
          const content = this.parser.parseInline(token.tokens);
          const plainText = content.replace(/<[^>]*>/g, '');
          const slug = slugify(plainText);

          if (token.depth === 2) {
            return `<h2 id="${slug}" class="scroll-mt-28 mt-12 mb-4 text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-950 dark:text-white group flex items-center gap-2"><a href="#${slug}" class="text-inherit hover:text-orange-600 transition">${content}</a></h2>\n`;
          }
          if (token.depth === 3) {
            return `<h3 id="${slug}" class="scroll-mt-28 mt-8 mb-3 text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100 group flex items-center gap-2"><a href="#${slug}" class="text-inherit hover:text-orange-600 transition">${content}</a></h3>\n`;
          }
          if (token.depth === 4) {
            return `<h4 id="${slug}" class="scroll-mt-28 mt-6 mb-2 text-lg font-semibold text-slate-900 dark:text-slate-100">${content}</h4>\n`;
          }
          return `<h${token.depth} class="mt-6 mb-2 text-base font-semibold text-slate-900 dark:text-slate-100">${content}</h${token.depth}>\n`;
        },

        code(token: Tokens.Code) {
          const lang = (token.lang || 'code').trim();
          const highlighted = highlightCode(token.text, lang);
          const encoded = encodeURIComponent(token.text);

          return `
<div class="code-block-wrapper relative my-6 overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 shadow-lg">
  <div class="flex items-center justify-between border-b border-slate-800 bg-slate-900 px-4 py-2 text-xs text-slate-400">
    <span class="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#FF8A00]">${lang}</span>
    <button type="button" class="copy-code-btn flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1 text-[11px] font-medium text-slate-300 hover:bg-slate-700 hover:text-white transition cursor-pointer" data-code="${encoded}">
      <span>Copy</span>
    </button>
  </div>
  <pre class="overflow-x-auto p-4 font-mono text-xs sm:text-sm leading-relaxed text-slate-200"><code>${highlighted}</code></pre>
</div>
`;
        },

        blockquote(
          this: { parser: { parse: (t: Tokens.Blockquote['tokens']) => string } },
          token: Tokens.Blockquote
        ) {
          const body = this.parser.parse(token.tokens);
          return `<blockquote class="my-6 border-l-4 border-orange-500 bg-orange-50/70 dark:bg-orange-950/30 px-6 py-4 rounded-r-2xl text-slate-700 dark:text-slate-300 italic text-sm sm:text-base leading-relaxed">${body}</blockquote>\n`;
        },

        link(
          this: { parser: { parseInline: (t: Tokens.Link['tokens']) => string } },
          token: Tokens.Link
        ) {
          const text = this.parser.parseInline(token.tokens);
          const isExternal = token.href.startsWith('http');
          return `<a href="${token.href}" ${token.title ? `title="${token.title}"` : ''} class="text-orange-600 dark:text-[#FF8A00] hover:text-orange-700 underline underline-offset-4 decoration-orange-300 hover:decoration-orange-600 font-semibold transition" ${isExternal ? 'target="_blank" rel="noopener noreferrer"' : ''}>${text}</a>`;
        },

        table(token: Tokens.Table) {
          const headerCells = token.header
            .map(
              (cell) =>
                `<th class="border-b border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 px-4 py-3 text-left font-bold text-slate-900 dark:text-white text-xs sm:text-sm">${cell.text}</th>`
            )
            .join('');

          const rows = token.rows
            .map((row) => {
              const cells = row
                .map(
                  (cell) =>
                    `<td class="border-b border-slate-100 dark:border-slate-800/70 px-4 py-3 text-slate-700 dark:text-slate-300 text-xs sm:text-sm">${cell.text}</td>`
                )
                .join('');
              return `<tr class="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition">${cells}</tr>`;
            })
            .join('');

          return `
<div class="my-8 overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0b101b] shadow-xs">
  <table class="w-full border-collapse text-left">
    <thead><tr>${headerCells}</tr></thead>
    <tbody>${rows}</tbody>
  </table>
</div>
`;
        },

        list(
          this: { parser: { parse: (t: Tokens.List['items']) => string } },
          token: Tokens.List
        ) {
          const body = this.parser.parse(token.items);
          const tag = token.ordered ? 'ol' : 'ul';
          const listClass = token.ordered
            ? 'list-decimal list-outside pl-6 space-y-2.5 my-4 text-slate-700 dark:text-slate-300 text-sm sm:text-base leading-relaxed'
            : 'list-disc list-outside pl-6 space-y-2.5 my-4 text-slate-700 dark:text-slate-300 text-sm sm:text-base leading-relaxed';
          return `<${tag} class="${listClass}">${body}</${tag}>\n`;
        },

        paragraph(
          this: { parser: { parseInline: (t: Tokens.Paragraph['tokens']) => string } },
          token: Tokens.Paragraph
        ) {
          const body = this.parser.parseInline(token.tokens);
          return `<p class="my-4 text-slate-700 dark:text-slate-300 text-sm sm:text-base leading-relaxed font-normal">${body}</p>\n`;
        },

        codespan(token: Tokens.Codespan) {
          return `<code class="rounded-md border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 px-1.5 py-0.5 font-mono text-xs sm:text-sm text-orange-700 dark:text-orange-400 font-semibold">${token.text}</code>`;
        },
      },
    });

    const parsed = markedInstance.parse(contentMd || '') as string;

    // Ensure raw HTML <h2>/<h3> tags (from Tiptap) also carry id anchors for TOC navigation
    return parsed.replace(/<h([23])([^>]*)>(.*?)<\/h\1>/gi, (full, level, attrs, inner) => {
      if (/\bid\s*=/.test(attrs)) return full;
      const text = inner.replace(/<[^>]*>/g, '').trim();
      const id = slugify(text);
      if (!id) return full;
      return `<h${level} id="${id}" class="scroll-mt-28"${attrs}>${inner}</h${level}>`;
    });
  }, [contentMd]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const copyButtons = container.querySelectorAll<HTMLButtonElement>('.copy-code-btn');

    const handleCopyClick = async (btn: HTMLButtonElement) => {
      const codeEncoded = btn.getAttribute('data-code');
      if (!codeEncoded) return;
      const code = decodeURIComponent(codeEncoded);

      try {
        await navigator.clipboard.writeText(code);
        const originalHtml = btn.innerHTML;
        btn.innerHTML = '<span>Copied!</span>';
        btn.classList.add('text-emerald-400');

        setTimeout(() => {
          btn.innerHTML = originalHtml;
          btn.classList.remove('text-emerald-400');
        }, 2000);
      } catch (err) {
        console.error('Failed to copy code snippet:', err);
      }
    };

    const listeners: Array<{ btn: HTMLButtonElement; handler: () => void }> = [];

    copyButtons.forEach((btn) => {
      const handler = () => handleCopyClick(btn);
      btn.addEventListener('click', handler);
      listeners.push({ btn, handler });
    });

    return () => {
      listeners.forEach(({ btn, handler }) => {
        btn.removeEventListener('click', handler);
      });
    };
  }, [htmlContent]);

  return (
    <div
      ref={containerRef}
      className="article-body tiptap prose dark:prose-invert max-w-none font-sans text-slate-800 dark:text-slate-200 antialiased"
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
}
