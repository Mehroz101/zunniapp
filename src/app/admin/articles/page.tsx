import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Plus, Edit3, Eye, FileText, Newspaper, BookOpen, Clock } from 'lucide-react';
import { connectToDatabase } from '@/lib/db/mongodb';
import { Article } from '@/models/Article';

export const metadata: Metadata = {
  title: 'Articles & Content Studio — TOOLty Admin',
};

export const dynamic = 'force-dynamic';

export default async function AdminArticlesListPage() {
  let articles: Array<Record<string, unknown> & { _id: { toString(): string } }> = [];

  try {
    await connectToDatabase();
    const docs = await Article.find().sort({ createdAt: -1 }).limit(50).lean();
    articles = docs as unknown as Array<Record<string, unknown> & { _id: { toString(): string } }>;
  } catch (err) {
    console.error('Failed to load articles list:', err);
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070b14] text-slate-900 dark:text-slate-100 p-6 sm:p-10 transition-colors">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#FF8A00] uppercase tracking-wider mb-1">
              <FileText className="w-3.5 h-3.5" />
              <span>Editorial Studio</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 dark:text-white tracking-tight">
              Articles, Guides &amp; News
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Manage your technical publications, in-depth guides, and breaking news dispatches.
            </p>
          </div>

          <Link
            href="/admin/articles/create"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#FF8A00] hover:bg-[#ff9e2e] text-slate-950 font-bold text-xs shadow-md shadow-orange-500/20 active:scale-95 transition cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>New Article</span>
          </Link>
        </div>

        {/* Content Table / Cards */}
        {articles.length === 0 ? (
          <div className="text-center py-20 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c1220] p-8">
            <FileText className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
              No articles published yet
            </h3>
            <p className="text-xs text-slate-500 mt-1 mb-5 max-w-sm mx-auto">
              Start drafting your first technical guide or AI news dispatch in the distraction-free editor.
            </p>
            <Link
              href="/admin/articles/create"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#FF8A00] text-slate-950 text-xs font-bold shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create First Article</span>
            </Link>
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-[#0c1220] shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/50 text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    <th className="py-3 px-4">Title &amp; Slug</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs font-medium">
                  {articles.map((art) => (
                    <tr
                      key={art._id.toString()}
                      className="hover:bg-slate-50/60 dark:hover:bg-slate-850/40 transition"
                    >
                      <td className="py-3.5 px-4 max-w-xs">
                        <Link
                          href={`/admin/articles/edit/${art._id.toString()}`}
                          className="font-bold text-slate-900 dark:text-slate-100 hover:text-[#FF8A00] transition line-clamp-1 block text-sm"
                        >
                          {(art.title as string) || 'Untitled'}
                        </Link>
                        <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500 block truncate mt-0.5">
                          /blog/{(art.slug as string) || '...'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10.5px] font-bold font-mono bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {art.type === 'news' ? (
                            <Newspaper className="w-3 h-3 text-[#FF8A00]" />
                          ) : (
                            <BookOpen className="w-3 h-3 text-emerald-500" />
                          )}
                          <span className="capitalize">{String(art.type || 'guide')}</span>
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400">
                        {String(art.category || 'General')}
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold ${
                            art.status === 'published'
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                              : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              art.status === 'published' ? 'bg-emerald-500' : 'bg-amber-500'
                            }`}
                          />
                          <span className="capitalize">{String(art.status || 'draft')}</span>
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center gap-1">
                          {Boolean(art.status === 'published' && art.slug) && (
                            <a
                              href={`/blog/${String(art.slug)}`}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                              title="View Live"
                            >
                              <Eye className="w-4 h-4" />
                            </a>
                          )}
                          <Link
                            href={`/admin/articles/edit/${art._id.toString()}`}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-[#FF8A00] hover:bg-orange-500/10 transition"
                            title="Edit in Studio"
                          >
                            <Edit3 className="w-4 h-4" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
