const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1';

class APIError extends Error {
  constructor(
    public status: number,
    message: string,
    public code?: string,
  ) {
    super(message);
    this.name = 'APIError';
  }
}

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  });

  const json = await res.json();

  if (!res.ok || !json.success) {
    throw new APIError(res.status, json.error?.message ?? 'Request failed', json.error?.code);
  }

  return json as T;
}

// ── Tools ─────────────────────────────────────
export const toolsApi = {
  list: (params?: { category?: string; featured?: boolean; page?: number; limit?: number }) => {
    const qs = new URLSearchParams();
    if (params?.category) qs.set('category', params.category);
    if (params?.featured !== undefined) qs.set('featured', String(params.featured));
    if (params?.page) qs.set('page', String(params.page));
    if (params?.limit) qs.set('limit', String(params.limit));
    return apiFetch<{ success: boolean; data: Tool[]; meta: PaginationMeta }>(`/tools?${qs}`);
  },
  bySlug: (slug: string) => apiFetch<{ success: boolean; data: Tool }>(`/tools/${slug}`),
  categories: () => apiFetch<{ success: boolean; data: ToolCategory[] }>('/tool-categories'),
};

// ── Posts ─────────────────────────────────────
export const postsApi = {
  list: (params?: { category?: string; contentType?: string; page?: number; limit?: number }) => {
    const qs = new URLSearchParams();
    if (params?.category) qs.set('category', params.category);
    if (params?.contentType) qs.set('contentType', params.contentType);
    if (params?.page) qs.set('page', String(params.page));
    if (params?.limit) qs.set('limit', String(params.limit));
    return apiFetch<{ success: boolean; data: Post[]; meta: PaginationMeta }>(`/posts?${qs}`);
  },
  bySlug: (slug: string) => apiFetch<{ success: boolean; data: Post }>(`/posts/${slug}`),
};

// ── Newsletter ────────────────────────────────
export const newsletterApi = {
  subscribe: (email: string) =>
    apiFetch<{ success: boolean; message: string }>('/newsletter/subscribe', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),
};

// ── Search ────────────────────────────────────
export const searchApi = {
  search: (q: string, type?: string) => {
    const qs = new URLSearchParams({ q, ...(type && { type }) });
    return apiFetch<{ success: boolean; data: SearchResults; query: string }>(`/search?${qs}`);
  },
};

// ── Types (minimal, until @aiiseverything/types is wired in) ─────────────────
interface PaginationMeta {
  page: number; limit: number; total: number; totalPages: number;
}

export interface Tool {
  id: string; name: string; slug: string; tagline: string; description: string;
  ogImage?: string; isFeatured: boolean; isFree: boolean; viewCount: number;
  renderType: string; config: Record<string, unknown>; seoMeta: Record<string, unknown>;
  publishedAt?: string;
  category: { id: string; name: string; slug: string };
  tags: Array<{ tag: { name: string; slug: string } }>;
}

export interface Post {
  id: string; title: string; slug: string; excerpt: string; ogImage?: string;
  readingTimeMins: number; publishedAt?: string; viewCount: number; contentType: string;
  contentMd?: string; contentHtml?: string;
  category: { name: string; slug: string };
  author: { name: string };
  tags: Array<{ tag: { name: string; slug: string } }>;
  seoMeta: Record<string, unknown>;
}

export interface ToolCategory {
  id: string; name: string; slug: string; description?: string; icon?: string;
  _count?: { tools: number };
  children: ToolCategory[];
}

interface SearchResults {
  tools?: Partial<Tool>[];
  posts?: Partial<Post>[];
  glossary?: Array<{ id: string; term: string; slug: string; definition: string }>;
}
