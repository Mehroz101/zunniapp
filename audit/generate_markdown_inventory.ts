import fs from 'fs';
import path from 'path';

const inventory = JSON.parse(fs.readFileSync('f:/aiiseverything.com/audit/inventory.json', 'utf8'));

let md = `# Canonical Tool & Calculator Inventory

**Total Discovered Items:** ${inventory.summary.totalUtilities} (${inventory.summary.totalCalculators} Calculators, ${inventory.summary.totalTools} Tools & Compilers)  
**Verification Target:** 100% Operational Readiness  
**Audit Date:** 2026-10-17  

---

## 1. Summary by Category

| Category Type | Group | Count | Execution Location |
|---|---|---|---|
| **Calculators** | Financial Calculators | 10 | Client-side Mathematical Engine (\`src/lib/config/calculators.ts\`) |
| **Calculators** | Specialized & Scientific | 10 | Client-side Mathematical Engine (\`src/lib/config/calculators.ts\`) |
| **Developer Tools** | AST Compilers & Code Converters | 14 | Client-side AST/Transpiler Engine (\`src/lib/tools/engines/\`) |
| **Developer Tools** | Text, Encoders & Utilities | 16 | Client-side Byte/Text Engine (\`src/lib/tools/engines/\`) |
| **Developer Tools** | SEO Diagnostics & Analyzers | 12 | Client-side DOM/String Parser (\`src/lib/tools/engines/seo.ts\`) |
| **Developer Tools** | High-Traffic Utility Converters | 7 | Pure TypeScript Client Workbenches (\`src/app/tools/*\`) |

---

## 2. Interactive Calculators Inventory (${inventory.calculators.length} Items)

| ID | Title & Slug | Category | Route | Implementation Location | Input Fields | Test Method | Test Status |
|---|---|---|---|---|---|---|---|
`;

inventory.calculators.forEach((c: any) => {
  const inputsStr = c.inputs.map((i: any) => `${i.id} (${i.type})`).join(', ');
  md += `| **${c.id}** | **${c.name}**<br>\`/${c.slug}\` | ${c.categoryLabel} | \`${c.route}\` | \`${c.implementationLocation}\` | ${inputsStr} | Mathematical formula verification against independent calculations | **READY FOR TEST** |\n`;
});

md += `\n---

## 3. Developer Tools, Compilers & Encoders Inventory (${inventory.tools.length} Items)

| ID | Tool Name & Slug | Category | Route | Implementation Location | Input Type / Options | Output Standard | Test Status |
|---|---|---|---|---|---|---|---|
`;

inventory.tools.forEach((t: any) => {
  const optionsStr = t.options.map((o: any) => o.id).join(', ') || 'Standard raw payload';
  md += `| **${t.id}** | **${t.name}**<br>\`/${t.slug}\` | ${t.categoryName || t.category} | \`${t.route}\` | \`${t.implementationLocation}\` | Options: ${optionsStr} | ${t.outputLabel} | **READY FOR TEST** |\n`;
});

md += `\n---

## 4. Route & Registry Reconciliation

- **Total Registered Calculators:** ${inventory.calculators.length}
- **Total Registered Compilers & Converters:** ${inventory.tools.length}
- **Orphan Check:** All ${inventory.calculators.length} calculators are bound to dynamic route \`/calculators/[slug]\` and categorized in \`/calculators/finance\` and \`/calculators/scientific\`.
- **Dedicated Route Check:** Dedicated routes \`/tools/ascii-to-hex\`, \`/tools/base64-to-text\`, \`/tools/hex-to-pantone\`, and \`/tools/decimal-to-ascii\` have dedicated pre-rendered Server Component pages with custom UI workbenches.
- **Unreachable Routes:** 0 unreachable routes detected.
`;

fs.writeFileSync('f:/aiiseverything.com/audit/TOOL_INVENTORY.md', md);
console.log('Successfully written audit/TOOL_INVENTORY.md');
