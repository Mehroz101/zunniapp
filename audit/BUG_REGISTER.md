# AIIsEverything / AiTools Studio — Quality & Defect Bug Register

**Audit Date:** October 17, 2026  
**Auditor:** Principal Full-Stack Engineer, Lead QA Automation Architect, Application Security Reviewer  
**Total Defect Records:** 6 Items  
**Current Open Critical / High Defects:** 0  

---

## Defect Summary by Severity

| Severity Level | Total Logged | Resolved & Verified | Mitigated / Accepted | Open Actionable |
|:---|:---:|:---:|:---:|:---:|
| **CRITICAL** | 0 | 0 | 0 | **0** |
| **HIGH** | 2 | 2 | 0 | **0** |
| **MEDIUM** | 3 | 3 | 0 | **0** |
| **LOW / INFO** | 1 | 0 | 1 | **0** |
| **TOTAL** | **6** | **5** | **1** | **0** |

---

## Detailed Defect & Remediation Register

### DEF-001: Vercel Serverless Invocation Timeout on Fastify Listen
- **Category:** Infrastructure / Server Runtime
- **Severity:** **HIGH**
- **Affected Component:** `apps/api/src/server.ts`
- **Root Cause Analysis:** Fastify's native `app.listen({ port, host })` blocks the main thread in long-polling daemon mode. When deployed to Vercel's serverless environment, Vercel manages the HTTP socket lifecycle externally; attempting to bind to a local port causes `FUNCTION_INVOCATION_FAILED` and immediate gateway timeout (504).
- **Remediation:**
  1. Wrapped `app.listen` in an environmental guard: `if (!process.env.VERCEL) { app.listen(...) }`.
  2. Implemented and exported the default serverless request handler:
     ```typescript
     export default async function handler(req: any, res: any) {
       await app.ready();
       app.server.emit('request', req, res);
     }
     ```
  3. Added query string normalization for `__path` rewrites and header-based route mapping.
- **Verification:** Typecheck passes with zero errors; Vercel serverless deployment builds cleanly without hanging processes.
- **Status:** **RESOLVED & VERIFIED**

---

### DEF-002: Dynamic Sitemap & Route Crashing on Database Connection Latency
- **Category:** Reliability & Resilience
- **Severity:** **HIGH**
- **Affected Component:** `apps/web/src/app/sitemap.ts`, `apps/web/src/app/tools/[slug]/page.tsx`
- **Root Cause Analysis:** Initial Next.js dynamic sitemap generator directly queried MongoDB Atlas via Prisma. If MongoDB experienced connection throttling, network cold-starts, or credential unavailability, the entire sitemap route threw an unhandled 500 exception, dropping all static and tool URLs from Googlebot's index.
- **Remediation:**
  1. Wrapped database queries in `try/catch` fallbacks.
  2. Grounded sitemap generation in the static tool and calculator registries (`CALCULATORS_REGISTRY` and `getAllTools()`), guaranteeing that all 20 calculators and 49 developer tools are emitted into `/sitemap.xml` regardless of database state.
  3. In `ToolDetailPage`, added dynamic fallback synthesizing a complete `ToolDefinition` from the database if absent from static registry, and gracefully falling back to static registry if database is unreachable.
- **Verification:** Simulated database disconnection in `audit/test_all_tools.ts` and confirmed 100% sitemap route generation without fatal crashes.
- **Status:** **RESOLVED & VERIFIED**

---

### DEF-003: Open Redirect Exposure via Unvalidated Callback Parameters
- **Category:** Application Security
- **Severity:** **MEDIUM**
- **Affected Component:** `apps/dashboard/src/middleware.ts`
- **Root Cause Analysis:** Authentication redirect logic accepted `callbackUrl` and `from` search parameters without validating the target URL. An attacker could craft a phishing link (`/login?callbackUrl=https://malicious-domain.com`) that redirects authenticated administrators to an external counterfeit site upon login.
- **Remediation:**
  Implemented strict validation guard:
  ```typescript
  const isSafeRedirect =
    callbackParam &&
    callbackParam.startsWith('/') &&
    !callbackParam.startsWith('//') &&
    !callbackParam.startsWith('/admin/login') &&
    !callbackParam.startsWith('/login');

  const redirectDestination = isSafeRedirect ? callbackParam : '/dashboard';
  return NextResponse.redirect(new URL(redirectDestination, request.url));
  ```
- **Verification:** Unit tests confirmed that external protocol-relative URLs (`//evil.com`) and absolute URLs (`https://evil.com`) are stripped and safely redirected to `/dashboard`.
- **Status:** **RESOLVED & VERIFIED**

---

### DEF-004: Potential Division-by-Zero Arithmetic Anomalies in Calculators
- **Category:** Algorithmic Safety & Numerical Precision
- **Severity:** **MEDIUM**
- **Affected Component:** `apps/web/src/lib/config/calculators.ts`
- **Root Cause Analysis:** Actuarial formulas for Debt Service Coverage Ratio (DSCR), Cap Rate, and Loan Amortization divide by Debt Service, Property Price, or Interest Rate. If a user inputs 0 (or clears the field), standard JavaScript operations produce `Infinity` or `NaN`, which breaks currency formatters and throws UI rendering errors.
- **Remediation:**
  Added defensive zero-divisor guards across all 20 calculation formulas:
  ```typescript
  const monthlyRate = annualRate > 0 ? annualRate / 100 / 12 : 0;
  const dscr = totalDebtService > 0 ? netOperatingIncome / totalDebtService : 0;
  ```
- **Verification:** Verified via Suite 2 of `audit/test_all_calculators.ts` where all 20 calculators were tested with zero values across all fields; 20/20 passed with zero `NaN` or unhandled exceptions.
- **Status:** **RESOLVED & VERIFIED**

---

### DEF-005: Unhandled Exceptions in Data Decoders on Corrupted Input
- **Category:** Code Quality & User Experience
- **Severity:** **MEDIUM**
- **Affected Component:** `apps/web/src/lib/tools/engines/utilities.ts`, `developer.ts`
- **Root Cause Analysis:** Standard JavaScript `atob()`, `JSON.parse()`, or string hexadecimal byte slicing throw fatal syntax exceptions (`DOMException: The string to be decoded is not correctly encoded`) when users paste incomplete or corrupt strings.
- **Remediation:**
  All parsing engines wrapped with defensive input validation and localized `try/catch` error telemetry:
  - Base64 decoder cleans whitespace and checks for valid character set before calling `atob()`.
  - Hex converter sanitizes prefix `0x` and asserts even length before conversion.
  - JSON formatter returns formatted syntax error line and column numbers.
- **Verification:** Verified via Suite 5 of `audit/test_all_tools.ts` with malformed strings across all 49 tools; 100% of tools caught syntax errors cleanly.
- **Status:** **RESOLVED & VERIFIED**

---

### DEF-006: Dev-Dependency Transitive Advisory in Prisma CLI (`deepmerge-ts`)
- **Category:** Supply Chain & Dependency Security
- **Severity:** **LOW / INFORMATIONAL**
- **Affected Component:** Monorepo root devDependencies (`prisma` CLI tooling)
- **Root Cause Analysis:** `npm audit` flagged a prototype pollution advisory in `deepmerge-ts` bundled as an internal transitive dependency within `@prisma/generator-helper` / `@prisma/internals`.
- **Impact Assessment:**
  - `prisma` is strictly a build-time development CLI (`devDependencies`) used to generate Prisma client artifacts and run schema migrations.
  - It is NOT included in the Next.js client-side bundle or browser distribution.
  - Runtime code uses the standalone generated `@prisma/client`, which does not execute the affected CLI merging routines.
- **Remediation & Action Plan:**
  - Upgraded `@prisma/client` and `prisma` to latest `^6.1.0`.
  - Scheduled automated Dependabot / Renovate updates to consume upstream Prisma patch upon release.
- **Status:** **MITIGATED & MONITORED**

---

## Defect Resolution Verdict

All high and medium severity defects have been resolved, verified with automated test suites, and audited against regression risks. The platform exhibits zero blocking defects.
