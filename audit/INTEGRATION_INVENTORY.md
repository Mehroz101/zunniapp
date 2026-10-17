# External Integrations & Infrastructure Inventory

**Audit Date:** 2026-10-17  
**Scope:** Third-Party APIs, Databases, Caching, Authentication, Edge CDN, and Infrastructure  

---

## 1. Integrations Topology

| Integration Category | Provider / Service | Protocol / Driver | Environment Binding | Production Dependency Level | Status |
|---|---|---|---|---|---|
| **Primary Database** | MongoDB Atlas / Compatible | Prisma Client 6.19 (`mongodb://`) | `DATABASE_URL` | Non-blocking (Static Fallback Active) | **CONFIGURED** |
| **In-Memory Caching** | Redis | `ioredis` (TCP / `redis://`) | `REDIS_URL` | Optional (Degrades to In-Memory / Pass-through) | **CONFIGURED** |
| **Edge CDN & Hosting** | Vercel Edge Network | HTTP/2, HTTP/3, Anycast DNS | Built-in Vercel CI/CD | Critical | **OPERATIONAL** |
| **JWT Session Engine** | `jose` (v6.2) & `@fastify/jwt` | HMAC SHA-256 | `JWT_SECRET` / `JWT_ACCESS_SECRET` | Critical for Dashboard Admin Auth | **CONFIGURED** |
| **ISR Cache Invalidation** | Next.js `revalidatePath` | HTTP POST Webhook | `REVALIDATE_SECRET` | Operational | **CONFIGURED** |
| **API Documentation** | OpenAPI 3.0 / Swagger | `@fastify/swagger-ui` | `/docs` | Development & Staging | **CONFIGURED** |
| **Web Typography** | Google Fonts API | `next/font/google` (Self-hosted) | Built-in Build Pipeline | Non-blocking (Zero External Roundtrips) | **OPTIMIZED** |
| **Web Analytics** | Google Analytics 4 | GA4 gtag / GTM | `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Optional (Non-blocking) | **PREPARED** |

---

## 2. Secrets & Environment Variables Matrix

| Variable Name | Subsystem | Purpose | Secret Sensitivity | Required for Boot |
|---|---|---|---|---|
| `DATABASE_URL` | Frontend & API | MongoDB connection string | **HIGH (Private)** | No (Static Registries available) |
| `NEXT_PUBLIC_SITE_URL` | Frontend | Canonical URL generation | Public | Yes (Default: `https://aiisevery.vercel.app`) |
| `NEXT_PUBLIC_API_URL` | Frontend | Backend Fastify endpoint | Public | Optional |
| `JWT_SECRET` | Dashboard | Cookie signing for admin auth | **CRITICAL (Private)** | Yes (for admin access) |
| `JWT_ACCESS_SECRET` | Backend API | Fastify JWT authentication | **CRITICAL (Private)** | Yes (for backend admin routes) |
| `JWT_REFRESH_SECRET` | Backend API | Token refresh rotation | **CRITICAL (Private)** | Yes |
| `REVALIDATE_SECRET` | Frontend & API | Protected ISR cache purging | **HIGH (Private)** | Yes |
| `REDIS_URL` | Backend API | Redis cache endpoint | Medium | No (Graceful fallback) |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Frontend | GA4 tracking ID | Public | No |
| `NEXT_PUBLIC_GTM_ID` | Frontend | Google Tag Manager ID | Public | No |

---

## 3. Resilience & Graceful Degradation Audit

1. **Database Decoupling:**
   - Both the public frontend and developer tools suite operate via self-contained deterministic registries (`CALCULATORS_REGISTRY`, `TOOLS_REGISTRY`).
   - If `DATABASE_URL` is unavailable or experiencing latency, the public platform executes calculations and conversions locally in browser memory without crashing.
2. **Redis Lazy Connection:**
   - `ioredis` is initialized with `lazyConnect: true` and non-fatal error logging. If Redis is down, API endpoints bypass cache and query the database directly.
3. **Secret Leakage Audit:**
   - Zero sensitive server secrets (`DATABASE_URL`, `JWT_SECRET`, `REVALIDATE_SECRET`) are prefixed with `NEXT_PUBLIC_` or exposed in client bundles.
