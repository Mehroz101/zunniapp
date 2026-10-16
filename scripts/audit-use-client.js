const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '..', 'src');
const useClientFiles = [];
const noUseClientPageFiles = [];

function scan(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) { scan(full); continue; }
    if (!entry.name.match(/\.(tsx|ts)$/)) continue;

    const content = fs.readFileSync(full, 'utf8');
    const firstLine = content.split('\n')[0].trim();
    const rel = full.replace(srcDir, '').replace(/\\/g, '/');

    const isPage = entry.name === 'page.tsx' || entry.name === 'layout.tsx';
    const hasUseClient = firstLine === "'use client'" || firstLine === '"use client"';

    if (hasUseClient) {
      useClientFiles.push({ rel, isPage });
    } else if (isPage) {
      noUseClientPageFiles.push(rel);
    }
  }
}

scan(srcDir);

console.log('\n=== FILES WITH "use client" ===');
console.log('PAGE/LAYOUT files (potential SSR blockers):');
useClientFiles.filter(f => f.isPage).forEach(f => console.log('  [PAGE]      ', f.rel));
console.log('\nComponent files (expected to have use client):');
useClientFiles.filter(f => !f.isPage).forEach(f => console.log('  [COMPONENT] ', f.rel));

console.log('\n=== PAGE/LAYOUT FILES WITHOUT "use client" (Server Components) ===');
noUseClientPageFiles.forEach(f => console.log(' ', f));

console.log(`\n=== SUMMARY ===`);
console.log(`Total use-client files: ${useClientFiles.length}`);
console.log(`Page/layout files with use-client (should be 0): ${useClientFiles.filter(f => f.isPage).length}`);
console.log(`Server Component pages (good): ${noUseClientPageFiles.length}`);
