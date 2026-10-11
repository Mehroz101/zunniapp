// ─────────────────────────────────────────────
// @aiiseverything/types — Shared Type Definitions
// ─────────────────────────────────────────────

// ── API Response Envelope ────────────────────
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: ApiError;
  meta?: PaginationMeta;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// ── User & Auth ───────────────────────────────
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export type UserRole = 'super_admin' | 'admin' | 'editor' | 'viewer' | 'user';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

// ── SEO Metadata ──────────────────────────────
export interface SeoMeta {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'product';
  noIndex?: boolean;
  structuredData?: Record<string, unknown>;
}

// ── Content Types ─────────────────────────────
export interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  author: Pick<User, 'id' | 'name' | 'avatar'>;
  tags: string[];
  seo: SeoMeta;
  publishedAt?: string;
  status: 'draft' | 'published' | 'archived';
  createdAt: string;
  updatedAt: string;
}

// ── Environment ───────────────────────────────
export type AppEnv = 'development' | 'staging' | 'production';
