'use client';

import React, { useCallback, useRef, useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import Placeholder from '@tiptap/extension-placeholder';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  FileCode,
  Link as LinkIcon,
  Unlink,
  Image as ImageIcon,
  Minus,
  Undo,
  Redo,
  Upload,
  Loader2,
  Sparkles,
} from 'lucide-react';

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
  className?: string;
  editable?: boolean;
}

/**
 * Enterprise Google Docs HTML Sanitizer & Normalizer.
 * Preserves semantic hierarchy (headings, bold, italic, underline, lists, quotes)
 * while stripping proprietary Google Docs ID wrappers and conflicting font/color spans.
 */
function cleanGoogleDocsHtml(html: string): string {
  if (!html) return html;

  let cleaned = html;

  // 1. Unwrap Google Docs internal wrapper tags
  cleaned = cleaned.replace(
    /<b\s+style="font-weight:\s*normal(?:;\s*)?"\s+id="docs-internal-guid-[^"]*">([\s\S]*?)<\/b>/gi,
    '$1'
  );
  cleaned = cleaned.replace(/<b\s+id="docs-internal-guid-[^"]*">([\s\S]*?)<\/b>/gi, '$1');

  // 2. Convert styled spans to semantic HTML tags
  cleaned = cleaned.replace(
    /<span[^>]*style="[^"]*font-weight:\s*(?:700|bold)[^"]*"[^>]*>([\s\S]*?)<\/span>/gi,
    '<strong>$1</strong>'
  );
  cleaned = cleaned.replace(
    /<span[^>]*style="[^"]*font-style:\s*italic[^"]*"[^>]*>([\s\S]*?)<\/span>/gi,
    '<em>$1</em>'
  );
  cleaned = cleaned.replace(
    /<span[^>]*style="[^"]*text-decoration:\s*underline[^"]*"[^>]*>([\s\S]*?)<\/span>/gi,
    '<u>$1</u>'
  );
  cleaned = cleaned.replace(
    /<span[^>]*style="[^"]*text-decoration:\s*line-through[^"]*"[^>]*>([\s\S]*?)<\/span>/gi,
    '<s>$1</s>'
  );

  // 3. Strip unwanted Google Docs inline styles (fonts, fixed colors)
  cleaned = cleaned.replace(/style="[^"]*font-family:[^"]*"/gi, '');
  cleaned = cleaned.replace(/style="[^"]*color:\s*rgb\(0,\s*0,\s*0\)[^"]*"/gi, '');
  cleaned = cleaned.replace(/style="[^"]*background-color:\s*transparent[^"]*"/gi, '');
  cleaned = cleaned.replace(/\s*style="\s*"\s*/gi, '');

  return cleaned;
}

export function RichTextEditor({
  content,
  onChange,
  placeholder = 'Write content or paste directly from Google Docs...',
  className = '',
  editable = true,
}: RichTextEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  /**
   * Upload binary image directly to MongoDB via native /api/images endpoint.
   */
  const uploadImage = useCallback(async (file: File): Promise<string | null> => {
    setIsUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/images', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to upload image');
      }

      return data.url as string;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Upload failed';
      setUploadError(message);
      console.error('❌ [RichTextEditor] Media upload failed:', err);
      return null;
    } finally {
      setIsUploading(false);
    }
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-[#FF8A00] underline underline-offset-2 hover:text-[#ff9e2e] transition',
          rel: 'noopener noreferrer',
          target: '_blank',
        },
      }),
      Image.configure({
        inline: false,
        allowBase64: false,
        HTMLAttributes: {
          class: 'rounded-xl max-w-full h-auto mx-auto my-4 shadow-md border border-slate-200 dark:border-slate-800',
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content,
    editable,
    editorProps: {
      attributes: {
        class:
          'tiptap prose dark:prose-invert max-w-none focus:outline-none min-h-[400px] p-4 sm:p-6 text-slate-900 dark:text-slate-100 font-sans text-sm sm:text-base leading-relaxed',
      },
      // Transform Google Docs pasted content for zero-loss fidelity
      transformPastedHTML(html) {
        return cleanGoogleDocsHtml(html);
      },
      // Handle pasted images directly from clipboard (e.g. screenshots)
      handlePaste(view, event) {
        const items = event.clipboardData?.items;
        if (!items) return false;

        for (const item of items) {
          if (item.type.startsWith('image/')) {
            const file = item.getAsFile();
            if (file) {
              uploadImage(file).then((url) => {
                if (url && editor) {
                  editor.chain().focus().setImage({ src: url }).run();
                }
              });
              return true; // Handled
            }
          }
        }
        return false;
      },
      // Handle drag & drop images into editor
      handleDrop(view, event) {
        const files = event.dataTransfer?.files;
        if (!files || files.length === 0) return false;

        for (const file of Array.from(files)) {
          if (file.type.startsWith('image/')) {
            uploadImage(file).then((url) => {
              if (url && editor) {
                editor.chain().focus().setImage({ src: url }).run();
              }
            });
            return true;
          }
        }
        return false;
      },
    },
    onUpdate: ({ editor: activeEditor }) => {
      onChange(activeEditor.getHTML());
    },
  });

  // Keep editor content synchronized if content prop changes externally
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  // Handle manual file selection from button
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && editor) {
      const url = await uploadImage(file);
      if (url) {
        editor.chain().focus().setImage({ src: url }).run();
      }
    }
    // Reset file input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Set / Unset Link
  const setLink = () => {
    if (!editor) return;
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('Enter hyperlink URL:', previousUrl);

    if (url === null) return;

    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  if (!editor) {
    return (
      <div className="flex h-64 items-center justify-center rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c1220]">
        <Loader2 className="h-6 w-6 animate-spin text-[#FF8A00]" />
      </div>
    );
  }

  const isButtonActive = (name: string, attributes?: Record<string, unknown>) => {
    return editor.isActive(name, attributes)
      ? 'bg-[#FF8A00] text-slate-950 font-bold shadow-xs'
      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/80';
  };

  return (
    <div
      className={`rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c1220] shadow-sm transition-all focus-within:border-orange-500/80 dark:focus-within:border-[#FF8A00]/80 ${className}`}
    >
      {/* Hidden File Input for Native Image Uploads */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml,image/avif"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Editor Sticky Toolbar */}
      <div className="flex flex-wrap items-center gap-1 border-b border-slate-100 dark:border-slate-800 p-2 sm:p-2.5 bg-slate-50/70 dark:bg-slate-900/50 rounded-t-2xl">
        {/* Headings */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`p-1.5 rounded-lg text-xs font-mono transition cursor-pointer ${isButtonActive('heading', { level: 1 })}`}
          title="Heading 1"
        >
          <Heading1 className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-1.5 rounded-lg text-xs font-mono transition cursor-pointer ${isButtonActive('heading', { level: 2 })}`}
          title="Heading 2"
        >
          <Heading2 className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`p-1.5 rounded-lg text-xs font-mono transition cursor-pointer ${isButtonActive('heading', { level: 3 })}`}
          title="Heading 3"
        >
          <Heading3 className="w-4 h-4" />
        </button>

        <div className="h-4 w-[1px] bg-slate-200 dark:bg-slate-800 mx-1" />

        {/* Text Formats */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-1.5 rounded-lg text-xs transition cursor-pointer ${isButtonActive('bold')}`}
          title="Bold (Ctrl+B)"
        >
          <Bold className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-1.5 rounded-lg text-xs transition cursor-pointer ${isButtonActive('italic')}`}
          title="Italic (Ctrl+I)"
        >
          <Italic className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`p-1.5 rounded-lg text-xs transition cursor-pointer ${isButtonActive('underline')}`}
          title="Underline (Ctrl+U)"
        >
          <UnderlineIcon className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`p-1.5 rounded-lg text-xs transition cursor-pointer ${isButtonActive('strike')}`}
          title="Strikethrough"
        >
          <Strikethrough className="w-4 h-4" />
        </button>

        <div className="h-4 w-[1px] bg-slate-200 dark:bg-slate-800 mx-1" />

        {/* Lists & Quotes */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-1.5 rounded-lg text-xs transition cursor-pointer ${isButtonActive('bulletList')}`}
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-1.5 rounded-lg text-xs transition cursor-pointer ${isButtonActive('orderedList')}`}
          title="Numbered List"
        >
          <ListOrdered className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-1.5 rounded-lg text-xs transition cursor-pointer ${isButtonActive('blockquote')}`}
          title="Blockquote"
        >
          <Quote className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={`p-1.5 rounded-lg text-xs transition cursor-pointer ${isButtonActive('codeBlock')}`}
          title="Code Block"
        >
          <FileCode className="w-4 h-4" />
        </button>

        <div className="h-4 w-[1px] bg-slate-200 dark:bg-slate-800 mx-1" />

        {/* Links & Native Media Upload */}
        <button
          type="button"
          onClick={setLink}
          className={`p-1.5 rounded-lg text-xs transition cursor-pointer ${isButtonActive('link')}`}
          title="Insert Link (Ctrl+K)"
        >
          <LinkIcon className="w-4 h-4" />
        </button>

        {editor.isActive('link') && (
          <button
            type="button"
            onClick={() => editor.chain().focus().unsetLink().run()}
            className="p-1.5 rounded-lg text-xs text-rose-500 hover:bg-rose-500/10 transition cursor-pointer"
            title="Remove Link"
          >
            <Unlink className="w-4 h-4" />
          </button>
        )}

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-orange-600 dark:hover:text-[#FF8A00] hover:bg-orange-500/10 border border-slate-200/80 dark:border-slate-700/80 transition cursor-pointer disabled:opacity-50"
          title="Upload image directly to MongoDB (/api/images)"
        >
          {isUploading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin text-[#FF8A00]" />
          ) : (
            <Upload className="w-3.5 h-3.5 text-[#FF8A00]" />
          )}
          <span>{isUploading ? 'Uploading...' : 'Upload Media'}</span>
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          className="p-1.5 rounded-lg text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition cursor-pointer"
          title="Divider Line"
        >
          <Minus className="w-4 h-4" />
        </button>

        <div className="ml-auto flex items-center gap-1">
          <button
            type="button"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            className="p-1.5 rounded-lg text-xs text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition cursor-pointer disabled:opacity-30"
            title="Undo (Ctrl+Z)"
          >
            <Undo className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            className="p-1.5 rounded-lg text-xs text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition cursor-pointer disabled:opacity-30"
            title="Redo (Ctrl+Y)"
          >
            <Redo className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Upload Error Banner */}
      {uploadError && (
        <div className="px-4 py-2 bg-rose-500/10 border-b border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs">
          {uploadError}
        </div>
      )}

      {/* Editor Content Surface */}
      <EditorContent editor={editor} />

      {/* Status Bar / Word Count */}
      <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80 px-4 py-2 text-[11px] font-mono text-slate-400 dark:text-slate-500">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-3 h-3 text-[#FF8A00]" />
          <span>Google Docs Zero-Loss Parser Active</span>
        </div>
        <div>
          {editor.storage.characterCount?.words?.() ??
            editor.getText().trim().split(/\s+/).filter(Boolean).length}{' '}
          words
        </div>
      </div>
    </div>
  );
}

export default RichTextEditor;
