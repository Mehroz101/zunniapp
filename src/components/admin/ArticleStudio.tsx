'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import slugify from 'slugify';
import {
  ArrowLeft,
  Save,
  Globe,
  Upload,
  Lock,
  Unlock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Eye,
  Trash2,
  BookOpen,
  Newspaper,
  Sparkles,
  Search,
  ExternalLink,
} from 'lucide-react';
import { RichTextEditor } from '@/components/admin/RichTextEditor';

interface ArticleStudioProps {
  initialData?: {
    id?: string;
    title?: string;
    slug?: string;
    content?: string;
    type?: 'guide' | 'news';
    category?: string;
    featuredImage?: string;
    seo?: {
      title?: string;
      description?: string;
    };
    status?: 'draft' | 'published';
  };
  isEditMode?: boolean;
}

const PRESET_CATEGORIES = [
  'AI Utilities',
  'Coding Tools',
  'Industry News',
  'Tech Tutorials',
  'Guides & Frameworks',
  'Developer Workflow',
];

export function ArticleStudio({ initialData, isEditMode = false }: ArticleStudioProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Core Form State
  const [title, setTitle] = useState(initialData?.title || '');
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [isSlugLocked, setIsSlugLocked] = useState(true);
  const [content, setContent] = useState(initialData?.content || '');
  const [type, setType] = useState<'guide' | 'news'>(initialData?.type || 'guide');
  const [category, setCategory] = useState(initialData?.category || 'AI Utilities');
  const [featuredImage, setFeaturedImage] = useState(initialData?.featuredImage || '');
  const [seoTitle, setSeoTitle] = useState(initialData?.seo?.title || '');
  const [seoDescription, setSeoDescription] = useState(initialData?.seo?.description || '');
  const [status, setStatus] = useState<'draft' | 'published'>(initialData?.status || 'draft');

  // UI / Async State
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Auto-slug generation from title when locked
  useEffect(() => {
    if (isSlugLocked && title && !isEditMode) {
      setSlug(slugify(title, { lower: true, strict: true, trim: true }));
    }
  }, [title, isSlugLocked, isEditMode]);

  // Featured Image Direct Upload to /api/admin/upload
  const handleImageUpload = async (file: File) => {
    setIsUploadingImage(true);
    setNotification(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to upload featured image');
      }

      setFeaturedImage(data.url);
      setNotification({ type: 'success', message: 'Featured image uploaded to MongoDB successfully!' });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Upload failed';
      setNotification({ type: 'error', message: msg });
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      handleImageUpload(file);
    }
  };

  // Submit Handler
  const handleSubmit = async (submitStatus?: 'draft' | 'published') => {
    const finalStatus = submitStatus || status;

    // Validation Guards
    if (!title.trim()) {
      setNotification({ type: 'error', message: 'Article title cannot be empty.' });
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (!slug.trim()) {
      setNotification({ type: 'error', message: 'Article slug is required.' });
      return;
    }

    if (!content.trim() || content === '<p></p>') {
      setNotification({ type: 'error', message: 'Article content cannot be empty.' });
      return;
    }

    setIsSaving(true);
    setNotification(null);

    try {
      const payload = {
        title: title.trim(),
        slug: slug.trim(),
        content,
        type,
        category: category.trim(),
        featuredImage: featuredImage.trim(),
        seo: {
          title: seoTitle.trim() || title.trim(),
          description: seoDescription.trim(),
        },
        status: finalStatus,
      };

      const url = isEditMode
        ? `/api/admin/articles/${initialData?.id || initialData?.slug}`
        : '/api/admin/articles';

      const method = isEditMode ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to save article.');
      }

      setStatus(finalStatus);
      setNotification({
        type: 'success',
        message: isEditMode
          ? 'Article updated successfully!'
          : 'Article created and saved successfully!',
      });

      if (!isEditMode && data.article?.id) {
        setTimeout(() => {
          router.push(`/admin/articles/edit/${data.article.id}`);
        }, 800);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An unexpected error occurred.';
      setNotification({ type: 'error', message: msg });
    } finally {
      setIsSaving(false);
    }
  };

  const currentOrigin =
    typeof window !== 'undefined'
      ? window.location.origin
      : 'https://toolty.online';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070b14] text-slate-900 dark:text-slate-100 pb-24 transition-colors">
      {/* Top Floating App Bar */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-[#090e1a]/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 px-4 sm:px-8 py-3.5 transition-colors">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/admin/articles"
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              title="Back to Articles"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#FF8A00]">
                {isEditMode ? 'Editorial Studio / Edit' : 'Editorial Studio / Create'}
              </span>
              <div className="text-sm font-semibold truncate max-w-[240px] sm:max-w-md">
                {title || 'Untitled Article'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {isEditMode && slug && (
              <a
                href={`${currentOrigin}/blog/${slug}`}
                target="_blank"
                rel="noreferrer"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700 transition"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>View Live</span>
                <ExternalLink className="w-3 h-3 opacity-60" />
              </a>
            )}

            <button
              type="button"
              onClick={() => handleSubmit('draft')}
              disabled={isSaving}
              className="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition disabled:opacity-50 cursor-pointer"
            >
              Save Draft
            </button>

            <button
              type="button"
              onClick={() => handleSubmit('published')}
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-xl bg-[#FF8A00] hover:bg-[#ff9e2e] text-slate-950 text-xs font-bold shadow-md shadow-orange-500/20 active:scale-95 transition disabled:opacity-50 cursor-pointer"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>{status === 'published' ? 'Update Live' : 'Publish Article'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Notification Toast Banner */}
      {notification && (
        <div className="max-w-7xl mx-auto px-4 sm:px-8 mt-4">
          <div
            className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl text-xs sm:text-sm font-medium border shadow-xs animate-fadeIn ${
              notification.type === 'success'
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300'
                : 'bg-rose-500/10 border-rose-500/30 text-rose-700 dark:text-rose-300'
            }`}
          >
            {notification.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
            )}
            <span className="flex-1">{notification.message}</span>
            <button
              type="button"
              onClick={() => setNotification(null)}
              className="text-xs opacity-70 hover:opacity-100"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Main 2-Column Notion-Style Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 mt-6 sm:mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ==============================================================
              1. LEFT CANVAS (MAIN EDITOR - 70% WIDTH = 8 COLS)
              ============================================================== */}
          <div className="lg:col-span-8 space-y-6">
            <div className="rounded-3xl border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-[#0c1220] p-6 sm:p-10 shadow-sm">
              {/* Clean Notion-Style Borderless Title Input */}
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Article Title..."
                className="w-full bg-transparent border-none text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-950 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-700 focus:outline-none focus:ring-0 tracking-tight leading-tight mb-6"
              />

              {/* Tiptap Rich Text Editor with Native Media & Google Docs Parsing */}
              <RichTextEditor
                content={content}
                onChange={(html) => setContent(html)}
                placeholder="Write your article, guides, or paste directly from Google Docs..."
              />
            </div>
          </div>

          {/* ==============================================================
              2. RIGHT SIDEBAR (PUBLISHING & SEO DRAWER - 30% WIDTH = 4 COLS - STICKY)
              ============================================================== */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
            {/* Box 1: Section & Publish Status */}
            <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-[#0c1220] p-5 shadow-sm space-y-4">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Publishing Controls
              </h3>

              {/* Section Type Segmented Pills */}
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Content Section
                </label>
                <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setType('guide')}
                    className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                      type === 'guide'
                        ? 'bg-white dark:bg-slate-800 text-[#FF8A00] shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Guide</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setType('news')}
                    className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                      type === 'news'
                        ? 'bg-white dark:bg-slate-800 text-[#FF8A00] shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <Newspaper className="w-3.5 h-3.5" />
                    <span>News</span>
                  </button>
                </div>
              </div>

              {/* Status Segmented Pills */}
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Visibility
                </label>
                <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setStatus('draft')}
                    className={`py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                      status === 'draft'
                        ? 'bg-white dark:bg-slate-800 text-amber-500 shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    Draft
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatus('published')}
                    className={`py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                      status === 'published'
                        ? 'bg-white dark:bg-slate-800 text-emerald-500 shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    Published
                  </button>
                </div>
              </div>

              {/* Category Selector */}
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Taxonomy Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-[#FF8A00] transition"
                >
                  {PRESET_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Slug Management with Lock/Edit Toggle */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                    URL Slug
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsSlugLocked((prev) => !prev)}
                    className="inline-flex items-center gap-1 text-[11px] text-[#FF8A00] hover:underline cursor-pointer"
                  >
                    {isSlugLocked ? (
                      <>
                        <Lock className="w-3 h-3" />
                        <span>Locked</span>
                      </>
                    ) : (
                      <>
                        <Unlock className="w-3 h-3" />
                        <span>Manual</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    value={slug}
                    disabled={isSlugLocked}
                    onChange={(e) =>
                      setSlug(slugify(e.target.value, { lower: true, strict: true, trim: true }))
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs font-mono text-slate-900 dark:text-white disabled:opacity-60 focus:outline-none focus:border-[#FF8A00] transition"
                  />
                </div>
                <span className="text-[10.5px] text-slate-400 dark:text-slate-500 font-mono mt-1 block truncate">
                  /blog/{slug || '...'}
                </span>
              </div>
            </div>

            {/* Box 2: Featured Image Upload Dropzone */}
            <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-[#0c1220] p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Featured Graphic
                </h3>
                {featuredImage && (
                  <button
                    type="button"
                    onClick={() => setFeaturedImage('')}
                    className="text-[11px] text-rose-500 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Remove</span>
                  </button>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleImageUpload(file);
                }}
                className="hidden"
              />

              {featuredImage ? (
                <div className="relative group rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 aspect-video bg-slate-100 dark:bg-slate-900">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={featuredImage}
                    alt="Featured preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-1.5 rounded-lg bg-white/90 text-slate-900 text-xs font-bold shadow-md cursor-pointer"
                    >
                      Change Graphic
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-[#FF8A00]/80 rounded-xl p-6 text-center transition cursor-pointer bg-slate-50/50 dark:bg-slate-900/40"
                >
                  {isUploadingImage ? (
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 className="w-6 h-6 animate-spin text-[#FF8A00]" />
                      <span className="text-xs text-slate-500 font-medium">Uploading to MongoDB...</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <Upload className="w-6 h-6 text-slate-400 group-hover:text-[#FF8A00]" />
                      <div className="text-xs font-medium text-slate-700 dark:text-slate-300">
                        Drop OG graphic or <span className="text-[#FF8A00]">browse</span>
                      </div>
                      <span className="text-[10px] text-slate-400">PNG, WebP, JPG up to 12MB</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Box 3: SEO Tuning & Live SERP Preview */}
            <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-[#0c1220] p-5 shadow-sm space-y-4">
              <div className="flex items-center gap-1.5">
                <Search className="w-3.5 h-3.5 text-[#FF8A00]" />
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  SEO &amp; Search Engine Tuning
                </h3>
              </div>

              {/* SEO Title */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                    SEO Meta Title
                  </label>
                  <span
                    className={`text-[10.5px] font-mono ${
                      seoTitle.length >= 50 && seoTitle.length <= 60
                        ? 'text-emerald-500 font-bold'
                        : seoTitle.length > 60
                        ? 'text-rose-500'
                        : 'text-slate-400'
                    }`}
                  >
                    {seoTitle.length}/60
                  </span>
                </div>
                <input
                  type="text"
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  placeholder={title || 'Primary search title...'}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#FF8A00] transition"
                />
              </div>

              {/* SEO Description */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                    SEO Meta Description
                  </label>
                  <span
                    className={`text-[10.5px] font-mono ${
                      seoDescription.length >= 140 && seoDescription.length <= 160
                        ? 'text-emerald-500 font-bold'
                        : seoDescription.length > 160
                        ? 'text-rose-500'
                        : 'text-slate-400'
                    }`}
                  >
                    {seoDescription.length}/160
                  </span>
                </div>
                <textarea
                  value={seoDescription}
                  onChange={(e) => setSeoDescription(e.target.value)}
                  rows={3}
                  placeholder="Compelling organic search snippet..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#FF8A00] transition resize-none"
                />
              </div>

              {/* Live Google SERP Card Preview */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80">
                <span className="text-[10.5px] font-mono font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2 block">
                  Live Google SERP Simulator
                </span>
                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-black/30 space-y-1">
                  <div className="flex items-center gap-2 text-[11px] text-slate-600 dark:text-slate-400 font-sans">
                    <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#FF8A00] text-[9px] text-black font-bold">
                      T
                    </span>
                    <span className="truncate">toolty.online</span>
                    <span>›</span>
                    <span className="truncate">{type}</span>
                  </div>
                  <div className="text-[15px] font-medium text-[#1a0dab] dark:text-[#8ab4f8] hover:underline cursor-pointer leading-tight truncate">
                    {seoTitle || title || 'Title Preview in Google Search Results'}
                  </div>
                  <div className="text-[12px] text-[#4d5156] dark:text-[#bdc1c6] line-clamp-2 leading-snug">
                    {seoDescription ||
                      content.replace(/<[^>]*>/g, '').slice(0, 150) ||
                      'Search description will appear here as users find your article on Google search.'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ArticleStudio;
