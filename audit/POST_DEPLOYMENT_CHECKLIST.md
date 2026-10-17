# AIIsEverything / AiTools Studio — Post-Deployment Verification & Smoke Test Runbook

**Document Purpose:** Immediate post-release operational verification checklist, automated smoke test commands, monitoring protocol, and rollback runbook.  
**Platform URL:** `https://aiiseverything.com` (or preview `https://aiisevery.vercel.app`)  
**Dashboard URL:** `https://aiiseverythingdashboard.vercel.app`  
**API Gateway URL:** `https://aiiseverythingback.vercel.app`  

---

## 1. Post-Deployment Smoke Test Protocol (20 Core Checks)

Immediately upon completing production deployment, execute the following smoke tests:

| Check # | Target Endpoint | Expected Status | Validation Criteria | Verification Method |
|:---:|:---|:---:|:---|:---|
| **01** | `GET /` | `200 OK` | Hero renders with brand logo; navigation links active; dark/light theme toggle operational. | Browser / curl |
| **02** | `GET /tools` | `200 OK` | Complete directory of 49 developer compilers & SEO tools renders with icons. | Browser / curl |
| **03** | `GET /calculators` | `200 OK` | Complete directory of 20 financial & scientific calculators displays. | Browser / curl |
| **04** | `GET /ai-tools` | `200 OK` | AI tools hub displays categorized discovery cards. | Browser / curl |
| **05** | `GET /blog` | `200 OK` | Blog index loads recent editorial articles and tutorials. | Browser / curl |
| **06** | `GET /tools/ascii-to-hex` | `200 OK` | Input "Hello", output should instantly show "48 65 6c 6c 6f". | Interactive UI |
| **07** | `GET /tools/base64-to-text` | `200 OK` | Input "QUlUb29scyBTdHVkaW8=", output decodes to "AiTools Studio". | Interactive UI |
| **08** | `GET /tools/hex-to-pantone` | `200 OK` | Input "#0055B8", color swatches display and match nearest Pantone PMS 300 C. | Interactive UI |
| **09** | `GET /tools/decimal-to-ascii` | `200 OK` | Input "72 101 108 108 111", output displays "Hello". | Interactive UI |
| **10** | `GET /calculators/auto-loan-trade-in-equity-calculator` | `200 OK` | Slide trade-in to $15k, loan payoff $11k; primary balance updates instantly. | Interactive UI |
| **11** | `GET /calculators/compound-interest-wealth-accumulator` | `200 OK` | Compound interest amortization table generates with visual breakdown. | Interactive UI |
| **12** | `GET /sitemap.xml` | `200 OK` | Valid XML response containing all static, calculator, and tool routes. | curl |
| **13** | `GET /robots.txt` | `200 OK` | Contains user-agent rules for Googlebot, GPTBot, ClaudeBot; specifies sitemap URL. | curl |
| **14** | `GET /api/health` | `200 OK` | Returns JSON: `{"status":"ok","timestamp":"..."}`. | curl |
| **15** | `GET /about` | `200 OK` | Brand statement and mission page renders with bespoke logo. | Browser |
| **16** | `GET /privacy` | `200 OK` | Client-side privacy statement displays cleanly. | Browser |
| **17** | `GET /terms` | `200 OK` | Terms of service displays without formatting anomalies. | Browser |
| **18** | `GET /dashboard` | `307 / 308` | Unauthenticated request redirects cleanly to `/admin/login` without redirect loop. | curl -I |
| **19** | `GET /admin/login` | `200 OK` | Admin login form renders with email/password inputs and security badge. | Browser |
| **20** | `OPTIONS /api/v1/tools` | `204 / 200` | Preflight CORS response includes authorized access headers and origin reflection. | curl -I |

---

## 2. Automated Smoke Test Script (One-Liner)

Run the following command from PowerShell or Bash to automatically ping critical endpoints:

```bash
# PowerShell Smoke Verification
$domains = @("https://aiiseverything.com", "https://aiisevery.vercel.app")
$endpoints = @("/", "/tools", "/calculators", "/sitemap.xml", "/robots.txt", "/api/health")

foreach ($ep in $endpoints) {
  try {
    $res = Invoke-WebRequest -Uri "https://aiisevery.vercel.app$ep" -Method Head -TimeoutSec 10
    Write-Host "[PASS] $ep - HTTP $($res.StatusCode)" -ForegroundColor Green
  } catch {
    Write-Host "[FAIL] $ep - $($_.Exception.Message)" -ForegroundColor Red
  }
}
```

---

## 3. Real-Time Telemetry & Log Monitoring

During the initial 24 hours post-deployment:
1. **Vercel Runtime Logs:**
   - Navigate to Vercel Dashboard > Project > Logs.
   - Filter for `status >= 500`. Verify that zero unhandled 500 or 504 errors are occurring.
2. **Fastify API Server Logs:**
   - Monitor Pino logger output for `warn` or `error` tags.
   - Assert database connection pool health.
3. **Google Search Console Verification:**
   - Submit `https://aiiseverything.com/sitemap.xml` to Google Search Console.
   - Assert that all 69 tools are discovered without coverage errors or missing required fields in `SoftwareApplication` or `FAQPage` schemas.

---

## 4. Emergency Rollback Runbook

If any critical defect or unexpected behavioral regression is discovered post-launch:

### Option A: Instant Vercel Rollback (Zero Downtime, < 30 Seconds)
1. Open the [Vercel Dashboard](https://vercel.com).
2. Select the affected project (`aiisevery`, `aiiseverythingdashboard`, or `aiiseverythingback`).
3. Click on the **Deployments** tab.
4. Locate the previous stable production deployment.
5. Click the three dots (`...`) icon on that deployment and select **Promote to Production** (or **Instant Rollback**).
6. Production traffic instantly routes to the previous build artifact.

### Option B: CLI Instant Rollback
```bash
vercel rollback [deployment-url-or-id]
```

### Option C: Database Rollback (If Migration Was Applied)
```bash
cd apps/api
npx prisma db push --force-reset # (Only if restoring from backup)
```
*(Note: Because the client-side tool execution layer is completely decoupled from database state, rolling back frontend code requires zero database downtime or data migrations.)*
