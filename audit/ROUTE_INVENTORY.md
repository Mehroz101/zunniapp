# Comprehensive Route Inventory

**Audit Target:** Complete Application URL & Endpoint Topography  
**Platforms Audited:** Frontend Web App, Admin Dashboard, Backend Microservice  
**Date:** 2026-10-17  

---

## 1. Frontend Web Platform Routes (`aiiseverything-front`)

| Route Path | Rendering Strategy | Handler Location | Purpose & Function | Auth / Access | Status |
|---|---|---|---|---|---|
| `/` | SSR / ISR (1h) | `src/app/page.tsx` | Platform Homepage & Value Grid | Public | **VERIFIED** |
| `/ai-tools` | SSR / ISR | `src/app/ai-tools/page.tsx` | AI Tools Hub & Categories | Public | **VERIFIED** |
| `/ai-tools/[category]` | Dynamic SSR | `src/app/ai-tools/[category]/page.tsx` | Category Filtered Tools View | Public | **VERIFIED** |
| `/ai-tools/[category]/[slug]` | Dynamic SSR | `src/app/ai-tools/[category]/[slug]/page.tsx` | Single AI Tool Execution View | Public | **VERIFIED** |
| `/blog` | SSR / ISR (30m) | `src/app/blog/page.tsx` | Articles & AI Dispatches Hub | Public | **VERIFIED** |
| `/blog/[slug]` | Dynamic SSR | `src/app/blog/[slug]/page.tsx` | Single Editorial Article | Public | **VERIFIED** |
| `/calculators` | SSR Prerender | `src/app/calculators/page.tsx` | Full Calculators Directory Hub | Public | **VERIFIED** |
| `/calculators/finance` | SSR Prerender | `src/app/calculators/finance/page.tsx` | 10 Financial Calculation Engines | Public | **VERIFIED** |
| `/calculators/scientific` | SSR Prerender | `src/app/calculators/scientific/page.tsx` | 10 Scientific / Specialized Engines | Public | **VERIFIED** |
| `/calculators/[slug]` | Dynamic SSR / ISR | `src/app/calculators/[slug]/page.tsx` | Individual Interactive Calculator Engine | Public | **VERIFIED** |
| `/guides` | SSR | `src/app/guides/page.tsx` | Engineering Masterclasses | Public | **VERIFIED** |
| `/toolkits` | SSR | `src/app/toolkits/page.tsx` | Curated AI Workflow Toolkits | Public | **VERIFIED** |
| `/tools` | SSR Prerender | `src/app/tools/page.tsx` | Developer & SEO Tools Directory | Public | **VERIFIED** |
| `/tools/[slug]` | Dynamic SSR | `src/app/tools/[slug]/page.tsx` | Dynamic Developer Compiler View | Public | **VERIFIED** |
| `/tools/ascii-to-hex` | SSG Prerender | `src/app/tools/ascii-to-hex/page.tsx` | Dedicated ASCII ↔ Hex Converter | Public | **VERIFIED** |
| `/tools/base64-to-text` | SSG Prerender | `src/app/tools/base64-to-text/page.tsx` | Dedicated Base64 ↔ Text Decoder | Public | **VERIFIED** |
| `/tools/hex-to-pantone` | SSG Prerender | `src/app/tools/hex-to-pantone/page.tsx` | Dedicated Hex ↔ Pantone PMS Matcher | Public | **VERIFIED** |
| `/tools/decimal-to-ascii` | SSG Prerender | `src/app/tools/decimal-to-ascii/page.tsx` | Dedicated Decimal ↔ ASCII Translator | Public | **VERIFIED** |
| `/api/health` | Edge / Node API | `src/app/api/health/route.ts` | Service Liveness & Health Probe | Public | **VERIFIED** |
| `/api/newsletter` | Route Handler | `src/app/api/newsletter/route.ts` | Newsletter Subscription Handler | Public | **VERIFIED** |
| `/api/revalidate` | Route Handler | `src/app/api/revalidate/route.ts` | On-Demand ISR Revalidation Webhook | Protected | **VERIFIED** |
| `/sitemap.xml` | Metadata Route | `src/app/sitemap.ts` | Dynamic XML Sitemap Generator | Public | **VERIFIED** |
| `/robots.txt` | Metadata Route | `src/app/robots.ts` | Search Engine Directives | Public | **VERIFIED** |
| `/manifest.webmanifest` | Metadata Route | `src/app/manifest.ts` | PWA Manifest Config | Public | **VERIFIED** |
| `/icon.svg` | Vector Asset | `src/app/icon.svg` | Bespoke Minimalist Vector Favicon | Public | **VERIFIED** |

---

## 2. Admin Dashboard Platform Routes (`aiiseverythingdashboard`)

| Route Path | Rendering Strategy | Handler Location | Purpose & Function | Access Level | Status |
|---|---|---|---|---|---|
| `/admin/login` | SSG Prerender | `src/app/admin/login/page.tsx` | Secure Admin Authentication Portal | Public | **VERIFIED** |
| `/login` | SSG Prerender | `src/app/login/page.tsx` | Alternate Login Entry | Public | **VERIFIED** |
| `/dashboard` | Dynamic SSR | `src/app/dashboard/page.tsx` | Metrics & System Overview | Protected (JWT) | **VERIFIED** |
| `/blogs` | Dynamic SSR | `src/app/(admin)/blogs/page.tsx` | Blog Content CMS Directory | Protected (JWT) | **VERIFIED** |
| `/blogs/create` | Client Form | `src/app/(admin)/blogs/create/page.tsx` | Create New Blog Post | Protected (JWT) | **VERIFIED** |
| `/blogs/edit/[id]` | Dynamic SSR | `src/app/(admin)/blogs/edit/[id]/page.tsx` | Edit Existing Blog Post | Protected (JWT) | **VERIFIED** |
| `/posts` | Dynamic SSR | `src/app/(admin)/posts/page.tsx` | Posts Management View | Protected (JWT) | **VERIFIED** |
| `/posts/new` | Client Form | `src/app/(admin)/posts/new/page.tsx` | Markdown Article Authoring | Protected (JWT) | **VERIFIED** |
| `/posts/[id]` | Dynamic SSR | `src/app/(admin)/posts/[id]/page.tsx` | Single Post Inspector | Protected (JWT) | **VERIFIED** |
| `/tools` | Dynamic SSR | `src/app/(admin)/tools/page.tsx` | Production Tool Catalog CMS | Protected (JWT) | **VERIFIED** |
| `/tools/new` | Client Form | `src/app/(admin)/tools/new/page.tsx` | Register New Tool Definition | Protected (JWT) | **VERIFIED** |
| `/tools/[id]` | Dynamic SSR | `src/app/(admin)/tools/[id]/page.tsx` | Tool Configuration Editor | Protected (JWT) | **VERIFIED** |
| `/subscribers` | Dynamic SSR | `src/app/(admin)/subscribers/page.tsx` | Newsletter Subscribers Manager | Protected (JWT) | **VERIFIED** |
| `/api/auth/login` | Route Handler | `src/app/api/auth/login/route.ts` | JWT Login & Cookie Issuer | Public | **VERIFIED** |
| `/api/auth/logout` | Route Handler | `src/app/api/auth/logout/route.ts` | Session Invalidation | Public | **VERIFIED** |
| `/api/auth/me` | Route Handler | `src/app/api/auth/me/route.ts` | Current Session Verification | Protected | **VERIFIED** |
| `/api/posts` | Route Handler | `src/app/api/posts/route.ts` | Posts List & Creation CRUD | Protected | **VERIFIED** |
| `/api/posts/[id]` | Route Handler | `src/app/api/posts/[id]/route.ts` | Single Post CRUD Operations | Protected | **VERIFIED** |
| `/api/tools` | Route Handler | `src/app/api/tools/route.ts` | Tools List & Creation CRUD | Protected | **VERIFIED** |
| `/api/tools/[id]` | Route Handler | `src/app/api/tools/[id]/route.ts` | Single Tool CRUD Operations | Protected | **VERIFIED** |

---

## 3. Backend Microservice API Routes (`aiiseverythingback`)

| HTTP Method | Route Endpoint | Fastify Handler | Function & Data Contract |
|---|---|---|---|
| `GET` | `/api/v1/health` | `src/routes/health.ts` | Liveness and database connectivity probe |
| `POST` | `/api/v1/auth/login` | `src/routes/auth.ts` | Admin authentication & JWT token generation |
| `POST` | `/api/v1/auth/register` | `src/routes/auth.ts` | Admin user registration |
| `POST` | `/api/v1/auth/refresh` | `src/routes/auth.ts` | Refresh access token via refresh token |
| `GET` | `/api/v1/tools` | `src/routes/tools.ts` | Cached list of published tools with filtering |
| `GET` | `/api/v1/tools/:slug` | `src/routes/tools.ts` | Single tool retrieval & view count increment |
| `GET` | `/api/v1/tool-categories` | `src/routes/tools.ts` | Hierarchical categories with tool counts |
| `POST` | `/api/v1/tools` | `src/routes/tools.ts` | Create new tool (Admin authenticated) |
| `PUT` | `/api/v1/tools/:id` | `src/routes/tools.ts` | Update tool configuration & invalidate cache |
| `PUT` | `/api/v1/tools/:id/publish` | `src/routes/tools.ts` | Change tool status to published |
| `DELETE` | `/api/v1/tools/:id` | `src/routes/tools.ts` | Soft or hard deletion of tool record |
| `GET` | `/api/v1/posts` | `src/routes/posts.ts` | Paginated blog posts filtered by tag/category |
| `GET` | `/api/v1/posts/:slug` | `src/routes/posts.ts` | Single article view by slug |
| `POST` | `/api/v1/posts` | `src/routes/posts.ts` | Create post with markdown content |
| `POST` | `/api/v1/newsletter/subscribe` | `src/routes/newsletter.ts` | Subscribe email to newsletter |
| `POST` | `/api/v1/newsletter/unsubscribe`| `src/routes/newsletter.ts` | Unsubscribe email from newsletter |
| `GET` | `/api/v1/glossary` | `src/routes/glossary.ts` | Alphabetical list of AI glossary terms |
| `GET` | `/api/v1/glossary/:slug` | `src/routes/glossary.ts` | Single glossary term definition |
| `GET` | `/api/v1/search` | `src/routes/search.ts` | Full-text search across tools, posts, glossary |
| `POST` | `/api/v1/revalidate` | `src/routes/revalidate.ts` | Trigger frontend ISR cache revalidation |
| `GET` | `/api/v1/tags` | `src/routes/tags.ts` | All content and tool tags with counts |
| `GET` | `/docs` | Fastify Swagger UI | Interactive OpenAPI documentation portal |
| `GET` | `/status` | `src/routes/status-ui.ts` | Visual service status dashboard |

---

## 4. Route Coverage & Health Analysis

- **Total Web Pages:** 25 routes
- **Total Admin Dashboard Routes:** 20 routes
- **Total Backend API Routes:** 23 endpoints
- **Broken / 404 Routes Detected:** 0
- **Orphan Pages:** 0 (all routes accessible via navigation mega-menus, sitemap, or directory indexes).
