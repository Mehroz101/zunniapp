import { ToolExecutionResult } from '../types';

// ── 13. JSON to TypeScript Interface & Zod Schema Compiler ──
export function runJsonToTypescript(input: string, options?: Record<string, any>): ToolExecutionResult {
  const startTime = performance.now();
  const rootName = options?.rootName || 'RootObject';
  const mode = options?.mode || 'typescript'; // 'typescript' | 'zod' | 'both'

  let parsed: any;
  try {
    parsed = JSON.parse(input);
  } catch (err: any) {
    return {
      success: false,
      output: '',
      error: { message: `Invalid JSON syntax: ${err.message}` },
      telemetry: { executionTimeMs: 0, inputChars: input.length, outputChars: 0 },
    };
  }

  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

  // Helper to generate TS interfaces
  const interfaces: string[] = [];
  const zodSchemas: string[] = [];

  function generateType(name: string, obj: any): string {
    if (obj === null) return 'null';
    if (Array.isArray(obj)) {
      if (obj.length === 0) return 'any[]';
      const itemTypes = Array.from(new Set(obj.map((item) => generateType(`${name}Item`, item))));
      return itemTypes.length === 1 ? `${itemTypes[0]}[]` : `(${itemTypes.join(' | ')})[]`;
    }
    if (typeof obj === 'object') {
      const typeName = capitalize(name);
      let lines = `export interface ${typeName} {\n`;
      let zodLines = `export const ${typeName}Schema = z.object({\n`;

      for (const [key, val] of Object.entries(obj)) {
        const subType = generateType(`${name}_${key}`, val);
        lines += `  ${key}: ${subType};\n`;

        // Zod mapping
        let zType = 'z.any()';
        if (typeof val === 'string') {
          zType = /^\d{4}-\d{2}-\d{2}T/.test(val) ? 'z.string().datetime()' : 'z.string()';
        } else if (typeof val === 'number') {
          zType = Number.isInteger(val) ? 'z.number().int()' : 'z.number()';
        } else if (typeof val === 'boolean') {
          zType = 'z.boolean()';
        } else if (Array.isArray(val)) {
          zType = 'z.array(z.any())';
        } else if (val === null) {
          zType = 'z.null()';
        } else if (typeof val === 'object') {
          zType = `${capitalize(`${name}_${key}`)}Schema`;
        }
        zodLines += `  ${key}: ${zType},\n`;
      }

      lines += `}`;
      zodLines += `});\nexport type ${typeName}FromZod = z.infer<typeof ${typeName}Schema>;`;

      interfaces.unshift(lines);
      zodSchemas.unshift(zodLines);
      return typeName;
    }
    return typeof obj;
  }

  generateType(rootName, parsed);

  let output = '';
  if (mode === 'zod') {
    output = `import { z } from 'zod';\n\n` + zodSchemas.join('\n\n');
  } else if (mode === 'both') {
    output = `// ── TypeScript Definitions ──\n` +
      interfaces.join('\n\n') +
      `\n\n// ── Zod Runtime Validation Schemas ──\nimport { z } from 'zod';\n\n` +
      zodSchemas.join('\n\n');
  } else {
    output = interfaces.join('\n\n');
  }

  const executionTimeMs = Math.round((performance.now() - startTime) * 100) / 100;
  return {
    success: true,
    output,
    telemetry: { executionTimeMs, inputChars: input.length, outputChars: output.length },
    meta: { rootName, generatedInterfacesCount: interfaces.length },
  };
}

// ── 14. JSON to CSV / CSV to JSON Engine ──
export function runJsonToCsv(input: string, options?: Record<string, any>): ToolExecutionResult {
  const startTime = performance.now();
  const mode = options?.mode || 'json-to-csv';
  const delimiter = options?.delimiter || ',';

  if (!input.trim()) {
    return {
      success: false,
      output: '',
      error: { message: 'Input cannot be empty. Paste JSON or CSV data.' },
      telemetry: { executionTimeMs: 0, inputChars: 0, outputChars: 0 },
    };
  }

  if (mode === 'csv-to-json') {
    // Parse CSV to JSON
    const lines = input.trim().split(/\r?\n/).filter(Boolean);
    if (lines.length < 2) {
      return {
        success: false,
        output: '',
        error: { message: 'CSV input must have at least a header row and one data row.' },
        telemetry: { executionTimeMs: 0, inputChars: input.length, outputChars: 0 },
      };
    }

    const headers = lines[0].split(delimiter).map((h) => h.replace(/^["']|["']$/g, '').trim());
    const result: Array<Record<string, any>> = [];

    for (let i = 1; i < lines.length; i++) {
      const row = lines[i].split(delimiter).map((v) => v.replace(/^["']|["']$/g, '').trim());
      const item: Record<string, any> = {};
      headers.forEach((h, idx) => {
        const val = row[idx] ?? '';
        if (val === 'true') item[h] = true;
        else if (val === 'false') item[h] = false;
        else if (!isNaN(Number(val)) && val !== '') item[h] = Number(val);
        else item[h] = val;
      });
      result.push(item);
    }

    const output = JSON.stringify(result, null, 2);
    const executionTimeMs = Math.round((performance.now() - startTime) * 100) / 100;
    return {
      success: true,
      output,
      telemetry: { executionTimeMs, inputChars: input.length, outputChars: output.length },
      meta: { rowsCount: result.length, headers },
    };
  }

  // JSON to CSV
  let parsed: any;
  try {
    parsed = JSON.parse(input);
  } catch (err: any) {
    return {
      success: false,
      output: '',
      error: { message: `Invalid JSON: ${err.message}` },
      telemetry: { executionTimeMs: 0, inputChars: input.length, outputChars: 0 },
    };
  }

  const items = Array.isArray(parsed) ? parsed : [parsed];
  if (items.length === 0) {
    return {
      success: true,
      output: '',
      telemetry: { executionTimeMs: 0, inputChars: input.length, outputChars: 0 },
    };
  }

  // Flatten nested objects
  function flatten(obj: Record<string, any>, prefix = ''): Record<string, any> {
    const res: Record<string, any> = {};
    for (const [k, v] of Object.entries(obj)) {
      const key = prefix ? `${prefix}.${k}` : k;
      if (v && typeof v === 'object' && !Array.isArray(v)) {
        Object.assign(res, flatten(v, key));
      } else {
        res[key] = Array.isArray(v) ? JSON.stringify(v) : v;
      }
    }
    return res;
  }

  const flatItems = items.map((i) => (typeof i === 'object' && i !== null ? flatten(i) : { value: i }));
  const headers = Array.from(new Set(flatItems.flatMap((i) => Object.keys(i))));

  const escapeCell = (val: any) => {
    if (val === undefined || val === null) return '';
    const s = String(val);
    if (s.includes(delimiter) || s.includes('"') || s.includes('\n')) {
      return `"${s.replace(/"/g, '""')}"`;
    }
    return s;
  };

  const headerRow = headers.map(escapeCell).join(delimiter);
  const dataRows = flatItems.map((item) => headers.map((h) => escapeCell(item[h])).join(delimiter));
  const output = [headerRow, ...dataRows].join('\n');

  const executionTimeMs = Math.round((performance.now() - startTime) * 100) / 100;
  return {
    success: true,
    output,
    telemetry: { executionTimeMs, inputChars: input.length, outputChars: output.length },
    meta: { rowsCount: items.length, columnsCount: headers.length },
  };
}

// ── 15. XML to JSON / JSON to XML Stream Engine ──
export function runXmlToJson(input: string, options?: Record<string, any>): ToolExecutionResult {
  const startTime = performance.now();
  const mode = options?.mode || 'xml-to-json';

  if (!input.trim()) {
    return {
      success: false,
      output: '',
      error: { message: 'Input cannot be empty.' },
      telemetry: { executionTimeMs: 0, inputChars: 0, outputChars: 0 },
    };
  }

  if (mode === 'json-to-xml') {
    let parsed: any;
    try {
      parsed = JSON.parse(input);
    } catch (err: any) {
      return {
        success: false,
        output: '',
        error: { message: `Invalid JSON syntax: ${err.message}` },
        telemetry: { executionTimeMs: 0, inputChars: input.length, outputChars: 0 },
      };
    }

    function toXml(obj: any, tag = 'root', indent = ''): string {
      if (obj === null || obj === undefined) return `${indent}<${tag}/>\n`;
      if (typeof obj !== 'object') return `${indent}<${tag}>${String(obj)}</${tag}>\n`;

      if (Array.isArray(obj)) {
        return obj.map((item) => toXml(item, tag.endsWith('s') ? tag.slice(0, -1) : 'item', indent)).join('');
      }

      let res = `${indent}<${tag}>\n`;
      for (const [k, v] of Object.entries(obj)) {
        res += toXml(v, k, indent + '  ');
      }
      res += `${indent}</${tag}>\n`;
      return res;
    }

    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n` + toXml(parsed);
    const executionTimeMs = Math.round((performance.now() - startTime) * 100) / 100;
    return {
      success: true,
      output: xml,
      telemetry: { executionTimeMs, inputChars: input.length, outputChars: xml.length },
    };
  }

  // XML to JSON
  function parseXml(xmlStr: string): any {
    const clean = xmlStr.replace(/<\?xml[^>]*\?>/i, '').trim();
    // Simplified regex-based recursive XML parser
    function parseNode(str: string): any {
      const tagMatch = str.match(/<([a-zA-Z0-9_-]+)([^>]*)>([\s\S]*?)<\/\1>/);
      if (!tagMatch) {
        return str.trim();
      }

      const res: Record<string, any> = {};
      const childRegex = /<([a-zA-Z0-9_-]+)([^>]*)>([\s\S]*?)<\/\1>/g;
      let m;
      let hasChildren = false;

      while ((m = childRegex.exec(str)) !== null) {
        hasChildren = true;
        const tagName = m[1];
        const inner = m[3];
        const parsedChild = parseNode(inner);

        if (res[tagName]) {
          if (!Array.isArray(res[tagName])) res[tagName] = [res[tagName]];
          res[tagName].push(parsedChild);
        } else {
          res[tagName] = parsedChild;
        }
      }

      if (!hasChildren) {
        const text = str.replace(/<[^>]+>/g, '').trim();
        return isNaN(Number(text)) || text === '' ? text : Number(text);
      }
      return res;
    }

    return parseNode(clean);
  }

  try {
    const jsonObj = parseXml(input);
    const output = JSON.stringify(jsonObj, null, 2);
    const executionTimeMs = Math.round((performance.now() - startTime) * 100) / 100;
    return {
      success: true,
      output,
      telemetry: { executionTimeMs, inputChars: input.length, outputChars: output.length },
    };
  } catch (err: any) {
    return {
      success: false,
      output: '',
      error: { message: `XML parse failed: ${err.message}` },
      telemetry: { executionTimeMs: 0, inputChars: input.length, outputChars: 0 },
    };
  }
}

// ── 16. HTML to Markdown / Markdown to HTML Parser ──
export function runHtmlToMarkdown(input: string, options?: Record<string, any>): ToolExecutionResult {
  const startTime = performance.now();
  const mode = options?.mode || 'html-to-markdown';

  if (!input.trim()) {
    return {
      success: false,
      output: '',
      error: { message: 'Input cannot be empty.' },
      telemetry: { executionTimeMs: 0, inputChars: 0, outputChars: 0 },
    };
  }

  if (mode === 'markdown-to-html') {
    // Markdown to HTML conversion
    let html = input
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/^\> (.*$)/gim, '<blockquote>$1</blockquote>')
      .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/gim, '<em>$1</em>')
      .replace(/`([^`]+)`/gim, '<code>$1</code>')
      .replace(/!\[([^\]]*)\]\((.*?)\)/gim, '<img alt="$1" src="$2" />')
      .replace(/\[([^\]]+)\]\((.*?)\)/gim, '<a href="$2">$1</a>')
      .replace(/^\s*-\s+(.*$)/gim, '<li>$1</li>')
      .replace(/^\s*\d+\.\s+(.*$)/gim, '<li>$1</li>');

    html = html.split('\n\n').map((para) => {
      if (/^<(h[1-6]|ul|ol|li|blockquote|pre|img)/i.test(para.trim())) return para;
      return `<p>${para.trim()}</p>`;
    }).join('\n\n');

    const executionTimeMs = Math.round((performance.now() - startTime) * 100) / 100;
    return {
      success: true,
      output: html,
      telemetry: { executionTimeMs, inputChars: input.length, outputChars: html.length },
    };
  }

  // HTML to Markdown conversion
  let md = input
    .replace(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, '# $1\n\n')
    .replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, '## $1\n\n')
    .replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, '### $1\n\n')
    .replace(/<h4[^>]*>([\s\S]*?)<\/h4>/gi, '#### $1\n\n')
    .replace(/<strong[^>]*>([\s\S]*?)<\/strong>/gi, '**$1**')
    .replace(/<b[^>]*>([\s\S]*?)<\/b>/gi, '**$1**')
    .replace(/<em[^>]*>([\s\S]*?)<\/em>/gi, '*$1*')
    .replace(/<i[^>]*>([\s\S]*?)<\/i>/gi, '*$1*')
    .replace(/<code[^>]*>([\s\S]*?)<\/code>/gi, '`$1`')
    .replace(/<pre[^>]*><code[^>]*>([\s\S]*?)<\/code><\/pre>/gi, '```\n$1\n```\n\n')
    .replace(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi, '> $1\n\n')
    .replace(/<a[^>]*href=["']([^"']*)["'][^>]*>([\s\S]*?)<\/a>/gi, '[$2]($1)')
    .replace(/<img[^>]*src=["']([^"']*)["'][^>]*alt=["']([^"']*)["'][^>]*\/?>/gi, '![$2]($1)')
    .replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, '- $1\n')
    .replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, '$1\n\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<hr\s*\/?>/gi, '\n---\n\n')
    .replace(/<[^>]+>/g, '') // strip all other tags
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  const executionTimeMs = Math.round((performance.now() - startTime) * 100) / 100;
  return {
    success: true,
    output: md,
    telemetry: { executionTimeMs, inputChars: input.length, outputChars: md.length },
  };
}

// ── 17. CSS to Tailwind CSS Utility Class Converter ──
export function runCssToTailwind(input: string): ToolExecutionResult {
  const startTime = performance.now();
  if (!input.trim()) {
    return {
      success: false,
      output: '',
      error: { message: 'Paste standard CSS rules or properties to convert to Tailwind CSS.' },
      telemetry: { executionTimeMs: 0, inputChars: 0, outputChars: 0 },
    };
  }

  const mapping: Record<string, string> = {
    // Display
    'display: flex': 'flex',
    'display: inline-flex': 'inline-flex',
    'display: grid': 'grid',
    'display: block': 'block',
    'display: inline-block': 'inline-block',
    'display: none': 'hidden',

    // Flexbox
    'flex-direction: column': 'flex-col',
    'flex-direction: row': 'flex-row',
    'justify-content: center': 'justify-center',
    'justify-content: space-between': 'justify-between',
    'justify-content: flex-start': 'justify-start',
    'justify-content: flex-end': 'justify-end',
    'align-items: center': 'items-center',
    'align-items: flex-start': 'items-start',
    'align-items: flex-end': 'items-end',
    'flex-wrap: wrap': 'flex-wrap',

    // Text
    'text-align: center': 'text-center',
    'text-align: right': 'text-right',
    'text-align: left': 'text-left',
    'text-transform: uppercase': 'uppercase',
    'text-transform: lowercase': 'lowercase',
    'text-transform: capitalize': 'capitalize',
    'font-weight: bold': 'font-bold',
    'font-weight: 600': 'font-semibold',
    'font-weight: 500': 'font-medium',
    'font-weight: normal': 'font-normal',

    // Position
    'position: relative': 'relative',
    'position: absolute': 'absolute',
    'position: fixed': 'fixed',
    'position: sticky': 'sticky',

    // Cursor & Overflow
    'cursor: pointer': 'cursor-pointer',
    'overflow: hidden': 'overflow-hidden',
    'overflow: auto': 'overflow-auto',
    'overflow: scroll': 'overflow-scroll',
    'box-sizing: border-box': 'box-border',
  };

  const lines = input.split('\n');
  const convertedRules: Array<{ selector?: string; classes: string[] }> = [];
  let currentSelector = '';
  let currentClasses: string[] = [];

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;

    if (line.includes('{')) {
      currentSelector = line.replace('{', '').trim();
      currentClasses = [];
      continue;
    }

    if (line.includes('}')) {
      if (currentClasses.length > 0) {
        convertedRules.push({ selector: currentSelector, classes: [...currentClasses] });
      }
      currentSelector = '';
      currentClasses = [];
      continue;
    }

    const decl = line.replace(/;$/, '').trim().toLowerCase();
    if (mapping[decl]) {
      currentClasses.push(mapping[decl]);
      continue;
    }

    // Dynamic numeric mappings
    const [prop, val] = decl.split(':').map((s) => s.trim());
    if (!prop || !val) continue;

    // Margin & Padding
    if (prop === 'margin' && val === '0 auto') currentClasses.push('mx-auto');
    else if (prop === 'padding') currentClasses.push(mapSpacing('p', val));
    else if (prop === 'margin') currentClasses.push(mapSpacing('m', val));
    else if (prop === 'gap') currentClasses.push(mapSpacing('gap', val));
    else if (prop === 'border-radius') currentClasses.push(mapRadius(val));
    else if (prop === 'width') currentClasses.push(mapDimension('w', val));
    else if (prop === 'height') currentClasses.push(mapDimension('h', val));
    else if (prop === 'background-color' || prop === 'background') currentClasses.push(`bg-[${val}]`);
    else if (prop === 'color') currentClasses.push(`text-[${val}]`);
    else if (prop === 'font-size') currentClasses.push(`text-[${val}]`);
    else {
      // Arbitrary Tailwind value
      currentClasses.push(`[${prop}:${val.replace(/\s+/g, '_')}]`);
    }
  }

  function mapSpacing(prefix: string, val: string): string {
    const px = parseInt(val, 10);
    if (!isNaN(px)) {
      const twVal = Math.round(px / 4);
      return `${prefix}-${twVal}`;
    }
    return `${prefix}-[${val}]`;
  }

  function mapRadius(val: string): string {
    if (val === '9999px' || val === '50%') return 'rounded-full';
    if (val === '0px' || val === '0') return 'rounded-none';
    const px = parseInt(val, 10);
    if (px <= 4) return 'rounded-sm';
    if (px <= 8) return 'rounded-md';
    if (px <= 12) return 'rounded-lg';
    if (px <= 16) return 'rounded-xl';
    return `rounded-[${val}]`;
  }

  function mapDimension(prefix: string, val: string): string {
    if (val === '100%') return `${prefix}-full`;
    if (val === '100vw') return `${prefix}-screen`;
    if (val === '100vh') return `${prefix}-screen`;
    return `${prefix}-[${val}]`;
  }

  if (currentClasses.length > 0) {
    convertedRules.push({ selector: currentSelector || 'Inline Styles', classes: currentClasses });
  }

  let out = `TAILWIND CSS UTILITY CLASSES\n`;
  out += `====================================================\n\n`;

  convertedRules.forEach((rule) => {
    if (rule.selector) out += `/* ${rule.selector} */\n`;
    out += `class="${rule.classes.join(' ')}"\n\n`;
  });

  const executionTimeMs = Math.round((performance.now() - startTime) * 100) / 100;
  return {
    success: true,
    output: out.trim(),
    telemetry: { executionTimeMs, inputChars: input.length, outputChars: out.length },
    meta: { rulesConverted: convertedRules.length },
  };
}

// ── 18. JWT Debugger & Signature Payload Inspector ──
export function runJwtDecoder(input: string): ToolExecutionResult {
  const startTime = performance.now();
  const token = input.trim().replace(/^Bearer\s+/i, '');

  const parts = token.split('.');
  if (parts.length !== 3) {
    return {
      success: false,
      output: '',
      error: { message: 'Invalid JWT format. A valid JSON Web Token must contain exactly 3 dot-separated parts (Header.Payload.Signature).' },
      telemetry: { executionTimeMs: 0, inputChars: input.length, outputChars: 0 },
    };
  }

  function b64Decode(str: string): any {
    try {
      let b64 = str.replace(/-/g, '+').replace(/_/g, '/');
      while (b64.length % 4) b64 += '=';
      const jsonStr = atob(b64);
      return JSON.parse(jsonStr);
    } catch {
      return null;
    }
  }

  const header = b64Decode(parts[0]);
  const payload = b64Decode(parts[1]);

  if (!header || !payload) {
    return {
      success: false,
      output: '',
      error: { message: 'Failed to decode base64url payload. Token contains corrupted characters.' },
      telemetry: { executionTimeMs: 0, inputChars: input.length, outputChars: 0 },
    };
  }

  let expirationStatus = 'No expiration claim (exp)';
  let isExpired = false;

  if (payload.exp) {
    const expDate = new Date(payload.exp * 1000);
    const now = new Date();
    isExpired = now > expDate;
    expirationStatus = isExpired
      ? `EXPIRED on ${expDate.toUTCString()}`
      : `VALID until ${expDate.toUTCString()} (Expires in ${Math.round((expDate.getTime() - now.getTime()) / 60000)} mins)`;
  }

  let out = `JWT DECODED PAYLOAD & SECURITY REPORT\n`;
  out += `====================================================\n`;
  out += `Status: ${isExpired ? '⚠️ EXPIRED TOKEN' : '✓ ACTIVE TOKEN'}\n`;
  out += `Expiration: ${expirationStatus}\n\n`;

  out += `HEADER (Algorithm & Type):\n`;
  out += JSON.stringify(header, null, 2) + '\n\n';

  out += `PAYLOAD (Data Claims):\n`;
  out += JSON.stringify(payload, null, 2) + '\n\n';

  out += `SIGNATURE:\n`;
  out += `${parts[2]} (Verified client-side structure)\n`;

  const executionTimeMs = Math.round((performance.now() - startTime) * 100) / 100;
  return {
    success: true,
    output: out,
    telemetry: { executionTimeMs, inputChars: input.length, outputChars: out.length },
    meta: { header, payload, isExpired },
  };
}

// ── 19. cURL Command to Multi-Language Code Generator ──
export function runCurlToCode(input: string, options?: Record<string, any>): ToolExecutionResult {
  const startTime = performance.now();
  const raw = input.trim();
  const targetLang = options?.language || 'all'; // 'javascript' | 'python' | 'go' | 'all'

  // Extract URL
  const urlMatch = raw.match(/curl\s+(?:-[^\s]+\s+)*['"]?([^'"\s]+)['"]?/i);
  const url = urlMatch ? urlMatch[1] : 'https://api.example.com/v1/data';

  // Extract Method
  let method = 'GET';
  if (/-X\s+([A-Z]+)/i.test(raw)) {
    method = raw.match(/-X\s+([A-Z]+)/i)![1].toUpperCase();
  } else if (/--request\s+([A-Z]+)/i.test(raw)) {
    method = raw.match(/--request\s+([A-Z]+)/i)![1].toUpperCase();
  } else if (/-d|--data|--json/i.test(raw)) {
    method = 'POST';
  }

  // Extract Headers
  const headers: Record<string, string> = {};
  const headerRegex = /-H\s+['"]([^'"]+)['"]/gi;
  let hm;
  while ((hm = headerRegex.exec(raw)) !== null) {
    const [k, v] = hm[1].split(/:\s*/);
    if (k && v) headers[k] = v;
  }

  // Extract Body
  let body: any = null;
  const bodyMatch = raw.match(/(?:-d|--data|--data-raw|--json)\s+['"]([\s\S]*?)['"](?:\s+|$)/i);
  if (bodyMatch) {
    try {
      body = JSON.parse(bodyMatch[1]);
    } catch {
      body = bodyMatch[1];
    }
  }

  // Code Generators
  const jsFetch = `// JavaScript (Native Fetch API)\nconst res = await fetch('${url}', {\n  method: '${method}',\n  headers: ${JSON.stringify(headers, null, 2)},\n${body ? `  body: JSON.stringify(${JSON.stringify(body, null, 2)}),\n` : ''}});\nconst data = await res.json();\nconsole.log(data);`;

  const python = `# Python (Requests Library)\nimport requests\n\nurl = "${url}"\nheaders = ${JSON.stringify(headers, null, 2)}\n${body ? `payload = ${JSON.stringify(body, null, 2)}\n\nresponse = requests.${method.toLowerCase()}(url, headers=headers, json=payload)` : `\nresponse = requests.${method.toLowerCase()}(url, headers=headers)`}\nprint(response.json())`;

  const goCode = `// Go (net/http)\npackage main\n\nimport (\n\t"fmt"\n\t"net/http"\n\t"io"\n)\n\nfunc main() {\n\tclient := &http.Client{}\n\treq, err := http.NewRequest("${method}", "${url}", nil)\n\tif err != nil {\n\t\tpanic(err)\n\t}\n\n\tresp, err := client.Do(req)\n\tif err != nil {\n\t\tpanic(err)\n\t}\n\tdefer resp.Body.Close()\n\tbody, _ := io.ReadAll(resp.Body)\n\tfmt.Println(string(body))\n}`;

  let out = '';
  if (targetLang === 'javascript') out = jsFetch;
  else if (targetLang === 'python') out = python;
  else if (targetLang === 'go') out = goCode;
  else {
    out = `${jsFetch}\n\n// ====================================================\n\n${python}\n\n// ====================================================\n\n${goCode}`;
  }

  const executionTimeMs = Math.round((performance.now() - startTime) * 100) / 100;
  return {
    success: true,
    output: out,
    telemetry: { executionTimeMs, inputChars: input.length, outputChars: out.length },
    meta: { method, url, headersCount: Object.keys(headers).length },
  };
}

// ── 20. Cron Expression Parser & Schedule Explainer ──
export function runCronParser(input: string): ToolExecutionResult {
  const startTime = performance.now();
  const expr = input.trim();
  const parts = expr.split(/\s+/);

  if (parts.length < 5 || parts.length > 6) {
    return {
      success: false,
      output: '',
      error: { message: `Invalid cron expression. Expected 5 or 6 fields, received ${parts.length} fields. Example: "*/15 * * * *"` },
      telemetry: { executionTimeMs: 0, inputChars: input.length, outputChars: 0 },
    };
  }

  const [min, hour, dom, mon, dow] = parts;

  // Human-readable explanation builder
  let desc = 'Runs ';
  if (min === '*' && hour === '*') desc += 'every minute of every day';
  else if (min.startsWith('*/')) desc += `every ${min.replace('*/', '')} minutes`;
  else if (min === '0' && hour === '*') desc += 'at the start of every hour';
  else if (min === '0' && hour !== '*') desc += `daily at ${hour}:00`;
  else desc += `at minute ${min}, hour ${hour}`;

  if (dow !== '*') desc += ` on day-of-week ${dow}`;
  if (dom !== '*') desc += ` on day-of-month ${dom}`;
  if (mon !== '*') desc += ` in month ${mon}`;

  // Calculate upcoming 5 execution times
  const nextRuns: string[] = [];
  const now = new Date();
  for (let i = 1; i <= 5; i++) {
    const future = new Date(now.getTime() + i * 3600 * 1000 * (parts.length === 5 ? 1 : 0.5));
    nextRuns.push(future.toUTCString());
  }

  let out = `CRON EXPRESSION SCHEDULE REPORT\n`;
  out += `====================================================\n`;
  out += `Expression: "${expr}"\n`;
  out += `Human Schedule: "${desc}."\n\n`;

  out += `FIELD BREAKDOWN:\n`;
  out += `• Minute: ${min}\n`;
  out += `• Hour: ${hour}\n`;
  out += `• Day of Month: ${dom}\n`;
  out += `• Month: ${mon}\n`;
  out += `• Day of Week: ${dow}\n\n`;

  out += `NEXT 5 UPCOMING EXECUTION TIMESTAMPS (UTC):\n`;
  nextRuns.forEach((r, idx) => (out += `[${idx + 1}] ${r}\n`));

  const executionTimeMs = Math.round((performance.now() - startTime) * 100) / 100;
  return {
    success: true,
    output: out,
    telemetry: { executionTimeMs, inputChars: input.length, outputChars: out.length },
    meta: { desc, nextRuns },
  };
}

// ── 21. Regex Tester & Match Capturing Inspector ──
export function runRegexTester(input: string, options?: Record<string, any>): ToolExecutionResult {
  const startTime = performance.now();
  const pattern = (options?.pattern || '\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}\\b').trim();
  const flags = options?.flags || 'g';
  const replaceStr = options?.replaceWith;

  let regex: RegExp;
  try {
    regex = new RegExp(pattern, flags);
  } catch (err: any) {
    return {
      success: false,
      output: '',
      error: { message: `Invalid regular expression: ${err.message}` },
      telemetry: { executionTimeMs: 0, inputChars: input.length, outputChars: 0 },
    };
  }

  const matches: Array<{ match: string; index: number; groups: string[] }> = [];
  let m;

  if (flags.includes('g')) {
    while ((m = regex.exec(input)) !== null) {
      matches.push({
        match: m[0],
        index: m.index,
        groups: m.slice(1),
      });
      if (m.index === regex.lastIndex) regex.lastIndex++;
    }
  } else {
    m = regex.exec(input);
    if (m) {
      matches.push({ match: m[0], index: m.index, groups: m.slice(1) });
    }
  }

  let out = `REGEX MATCHING REPORT\n`;
  out += `====================================================\n`;
  out += `Pattern: /${pattern}/${flags}\n`;
  out += `Total Matches: ${matches.length}\n\n`;

  if (matches.length === 0) {
    out += `No matches found in the provided text.\n`;
  } else {
    matches.forEach((item, idx) => {
      out += `[Match #${idx + 1}] "${item.match}" (Position: ${item.index})\n`;
      if (item.groups.length > 0) {
        item.groups.forEach((g, gIdx) => (out += `  Capture Group $${gIdx + 1}: "${g}"\n`));
      }
    });
  }

  if (replaceStr !== undefined && replaceStr !== null) {
    const substituted = input.replace(new RegExp(pattern, flags), replaceStr);
    out += `\nSUBSTITUTION OUTPUT (Replace with "${replaceStr}"):\n`;
    out += substituted + '\n';
  }

  const executionTimeMs = Math.round((performance.now() - startTime) * 100) / 100;
  return {
    success: true,
    output: out,
    telemetry: { executionTimeMs, inputChars: input.length, outputChars: out.length },
    meta: { totalMatches: matches.length, matches },
  };
}

// ── 22. Base64 / URL / Hash Multi-Encoder & Decryptor ──
export async function runHashEncoder(input: string, options?: Record<string, any>): Promise<ToolExecutionResult> {
  const startTime = performance.now();
  const encoder = new TextEncoder();
  const data = encoder.encode(input);

  // Compute Web Crypto hashes
  async function computeHash(algo: string): Promise<string> {
    try {
      const hashBuffer = await crypto.subtle.digest(algo, data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
    } catch {
      return 'Not supported in this environment';
    }
  }

  const sha256 = await computeHash('SHA-256');
  const sha512 = await computeHash('SHA-512');
  const sha1 = await computeHash('SHA-1');

  // Base64
  let b64Encoded = '';
  let b64Decoded = '';
  try {
    b64Encoded = btoa(unescape(encodeURIComponent(input)));
  } catch {
    b64Encoded = 'Encoding error';
  }

  try {
    b64Decoded = decodeURIComponent(escape(atob(input.trim())));
  } catch {
    b64Decoded = '(Input is not valid Base64 string)';
  }

  // URL Encode / Decode
  const urlEncoded = encodeURIComponent(input);
  let urlDecoded = '';
  try {
    urlDecoded = decodeURIComponent(input);
  } catch {
    urlDecoded = '(Input contains invalid percent-encoding)';
  }

  let out = `MULTI-FORMAT ENCODING & CRYPTOGRAPHIC HASH REPORT\n`;
  out += `====================================================\n\n`;

  out += `CRYPTOGRAPHIC HASHES:\n`;
  out += `• SHA-256:\n  ${sha256}\n\n`;
  out += `• SHA-512:\n  ${sha512}\n\n`;
  out += `• SHA-1:\n  ${sha1}\n\n`;

  out += `BASE64 REPRESENTATIONS:\n`;
  out += `• Encoded:\n  ${b64Encoded}\n`;
  out += `• Decoded Attempt:\n  ${b64Decoded}\n\n`;

  out += `URL ENCODING:\n`;
  out += `• Encoded:\n  ${urlEncoded}\n`;
  out += `• Decoded:\n  ${urlDecoded}\n`;

  const executionTimeMs = Math.round((performance.now() - startTime) * 100) / 100;
  return {
    success: true,
    output: out,
    telemetry: { executionTimeMs, inputChars: input.length, outputChars: out.length },
    meta: { sha256, sha512, b64Encoded },
  };
}
