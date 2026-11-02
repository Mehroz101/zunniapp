import { dump as yamlDump, loadAll as yamlLoadAll } from 'js-yaml';
import { ToolExecutionResult } from '../types';

/* ==============================================================================
   ENGINE 1: CSS to HTML / JSX Scaffolder
   Slug: css-to-html
   ============================================================================== */

interface DomTreeNode {
  tag: string;
  id?: string;
  classes: Set<string>;
  attributes: Record<string, string>;
  children: DomTreeNode[];
  textContent?: string;
}

export function runCssToHtml(input: string, options?: Record<string, any>): ToolExecutionResult {
  const startTime = performance.now();
  const mode = (options?.mode as 'html' | 'jsx') || 'html';
  const semantic = options?.semantic !== false;
  const includeBoilerplate = Boolean(options?.includeBoilerplate);

  const trimmed = input.trim();
  if (!trimmed) {
    return {
      success: false,
      output: '',
      error: { message: 'Please provide valid CSS rules to scaffold HTML/JSX.' },
      telemetry: { executionTimeMs: 0, inputChars: 0, outputChars: 0 },
    };
  }

  try {
    // 1. Strip CSS comments and media query wrappers
    const sanitized = trimmed
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/@media[^{]*\{([\s\S]*?\}\s*)\}/g, '$1')
      .replace(/@keyframes[^{]*\{[\s\S]*?\}/g, '')
      .replace(/@font-face[^{]*\{[\s\S]*?\}/g, '');

    // 2. Extract selectors from rulesets
    const ruleRegex = /([^{]+)\{([^}]+)\}/g;
    let match: RegExpExecArray | null;
    const rawSelectors: string[] = [];

    while ((match = ruleRegex.exec(sanitized)) !== null) {
      const selectorGroup = match[1].trim();
      const parts = selectorGroup.split(',').map((s) => s.trim()).filter(Boolean);
      rawSelectors.push(...parts);
    }

    if (rawSelectors.length === 0) {
      // Fallback: If no curly braces found, treat input as list of selectors
      const lines = sanitized.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
      rawSelectors.push(...lines);
    }

    // 3. Helper to infer semantic HTML tag from identifier
    const inferTag = (name: string): string => {
      if (!semantic) return 'div';
      const lower = name.toLowerCase();
      if (/^(nav|navbar|menu|navigation)/.test(lower)) return 'nav';
      if (/^(header|topbar|app-header|masthead)/.test(lower)) return 'header';
      if (/^(footer|bottom-bar|page-footer)/.test(lower)) return 'footer';
      if (/^(sidebar|aside|drawer)/.test(lower)) return 'aside';
      if (/^(main|content-area|main-content)/.test(lower)) return 'main';
      if (/^(article|post|entry|feed-item)/.test(lower)) return 'article';
      if (/^(section|hero|features|testimonials)/.test(lower)) return 'section';
      if (/^(btn|button|cta|action)/.test(lower)) return 'button';
      if (/^(link|anchor)/.test(lower)) return 'a';
      if (/^(list|items|menu-list)/.test(lower)) return 'ul';
      if (/^(item|list-item|row)/.test(lower)) return 'li';
      if (/^(heading|title|headline)/.test(lower)) return 'h2';
      if (/^(subtitle|subheading)/.test(lower)) return 'h3';
      if (/^(desc|description|paragraph|text|copy)/.test(lower)) return 'p';
      if (/^(badge|pill|chip|tag|label|status)/.test(lower)) return 'span';
      if (/^(avatar|img|image|picture|photo|thumbnail|logo)/.test(lower)) return 'img';
      if (/^(input|field|search|textbox)/.test(lower)) return 'input';
      if (/^(form|form-container)/.test(lower)) return 'form';
      if (/^(table|datagrid)/.test(lower)) return 'table';
      return 'div';
    };

    // 4. Build Tree
    const rootNodes: DomTreeNode[] = [];

    const findOrCreateNode = (
      parentList: DomTreeNode[],
      tag: string,
      id?: string,
      className?: string
    ): DomTreeNode => {
      let existing = parentList.find(
        (n) => n.tag === tag && n.id === id && (className ? n.classes.has(className) : true)
      );
      if (!existing) {
        existing = {
          tag,
          id,
          classes: new Set(className ? [className] : []),
          attributes: {},
          children: [],
        };
        parentList.push(existing);
      } else if (className) {
        existing.classes.add(className);
      }
      return existing;
    };

    let totalElementsCount = 0;

    for (const rawSel of rawSelectors) {
      // Clean pseudo-classes and pseudo-elements
      const cleanedSel = rawSel
        .replace(/::?[a-zA-Z0-9_-]+(\([^)]*\))?/g, '')
        .trim();
      if (!cleanedSel) continue;

      // Split selector by combinators (> , + , ~ , space)
      const tokenRegex = /([>+~]|\s+)/g;
      const parts = cleanedSel.split(tokenRegex).map((s) => s.trim()).filter(Boolean);

      let currentList = rootNodes;

      for (const part of parts) {
        if (part === '>' || part === '+' || part === '~') {
          continue;
        }

        // Parse segment: e.g. "header.navbar#main-nav[data-open='true']"
        const tagMatch = part.match(/^[a-zA-Z][a-zA-Z0-9]*/);
        const idMatch = part.match(/#([a-zA-Z0-9_-]+)/);
        const classMatches = Array.from(part.matchAll(/\.([a-zA-Z0-9_-]+)/g)).map((m) => m[1]);
        const attrMatches = Array.from(
          part.matchAll(/\[([a-zA-Z0-9_-]+)(?:=["']?([^"']*)["']?)?\]/g)
        );

        const firstClass = classMatches[0];
        const tag = tagMatch ? tagMatch[0] : firstClass ? inferTag(firstClass) : idMatch ? inferTag(idMatch[1]) : 'div';
        const id = idMatch ? idMatch[1] : undefined;

        const node = findOrCreateNode(currentList, tag, id, firstClass);
        for (const cls of classMatches) {
          node.classes.add(cls);
        }
        for (const attr of attrMatches) {
          node.attributes[attr[1]] = attr[2] || '';
        }

        totalElementsCount++;
        currentList = node.children;
      }
    }

    // 5. Serialize Tree to HTML or JSX
    const serializeNode = (node: DomTreeNode, depth: number): string => {
      const indent = '  '.repeat(depth);
      const isJsx = mode === 'jsx';
      const classAttr = node.classes.size > 0
        ? ` ${isJsx ? 'className' : 'class'}="${Array.from(node.classes).join(' ')}"`
        : '';
      const idAttr = node.id ? ` id="${node.id}"` : '';

      const otherAttrs = Object.entries(node.attributes)
        .map(([k, v]) => (v ? ` ${k}="${v}"` : ` ${k}`))
        .join('');

      // Self-closing elements
      const selfClosing = ['img', 'input', 'hr', 'br', 'source'].includes(node.tag);
      if (selfClosing) {
        const extra = node.tag === 'img' ? ' alt=""' : node.tag === 'input' ? ' type="text"' : '';
        return `${indent}<${node.tag}${idAttr}${classAttr}${otherAttrs}${extra} />`;
      }

      // Generate default text content for leaf nodes
      let defaultText = '';
      if (node.children.length === 0) {
        if (node.tag === 'button') defaultText = 'Click Here';
        else if (node.tag === 'a') defaultText = 'Learn More';
        else if (/^h[1-6]$/.test(node.tag)) defaultText = `${node.tag.toUpperCase()} Heading`;
        else if (node.tag === 'p') defaultText = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.';
        else if (node.tag === 'span') defaultText = 'Label';
        else if (node.tag === 'li') defaultText = 'Item text';
      }

      if (node.children.length === 0) {
        return defaultText
          ? `${indent}<${node.tag}${idAttr}${classAttr}${otherAttrs}>${defaultText}</${node.tag}>`
          : `${indent}<${node.tag}${idAttr}${classAttr}${otherAttrs}></${node.tag}>`;
      }

      const childrenStr = node.children.map((c) => serializeNode(c, depth + 1)).join('\n');
      return `${indent}<${node.tag}${idAttr}${classAttr}${otherAttrs}>\n${childrenStr}\n${indent}</${node.tag}>`;
    };

    let output = rootNodes.map((n) => serializeNode(n, includeBoilerplate ? 2 : 0)).join('\n\n');

    if (includeBoilerplate) {
      if (mode === 'jsx') {
        output = `import React from 'react';\n\nexport default function ScaffolderComponent() {\n  return (\n    <>\n${output}\n    </>\n  );\n}\n`;
      } else {
        output = `<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>Scaffolded Layout</title>\n</head>\n<body>\n${output}\n</body>\n</html>\n`;
      }
    }

    const executionTimeMs = Math.round((performance.now() - startTime) * 100) / 100;
    return {
      success: true,
      output,
      telemetry: { executionTimeMs, inputChars: input.length, outputChars: output.length },
      meta: { mode, elementsGenerated: totalElementsCount, rootNodesCount: rootNodes.length },
    };
  } catch (err: any) {
    return {
      success: false,
      output: '',
      error: { message: `CSS AST Scaffolding failed: ${err.message}` },
      telemetry: { executionTimeMs: Math.round(performance.now() - startTime), inputChars: input.length, outputChars: 0 },
    };
  }
}

/* ==============================================================================
   ENGINE 2: HTML to Python AST / BeautifulSoup Generator
   Slug: html-to-python-ast
   ============================================================================== */

export function runHtmlToPythonAst(input: string, options?: Record<string, any>): ToolExecutionResult {
  const startTime = performance.now();
  const mode = (options?.mode as 'scraping' | 'ast') || 'scraping';
  const parser = (options?.parser as string) || 'html.parser';
  const targetUrl = (options?.url as string) || 'https://example.com';

  const trimmed = input.trim();
  if (!trimmed) {
    return {
      success: false,
      output: '',
      error: { message: 'Please provide HTML markup to generate Python extraction code.' },
      telemetry: { executionTimeMs: 0, inputChars: 0, outputChars: 0 },
    };
  }

  try {
    // 1. Discover key selectors and tags in HTML
    const tagMatches = Array.from(trimmed.matchAll(/<([a-zA-Z0-9]+)([^>]*)>/g));
    const discoveredTags = new Set<string>();
    const discoveredClasses = new Set<string>();
    const discoveredIds = new Set<string>();
    const extractedLinks: Array<{ text: string; href: string }> = [];
    const extractedImages: string[] = [];

    for (const match of tagMatches) {
      const tagName = match[1].toLowerCase();
      discoveredTags.add(tagName);
      const attrs = match[2];

      const classMatch = attrs.match(/class=["']([^"']+)["']/);
      if (classMatch) {
        classMatch[1].split(/\s+/).forEach((c) => c && discoveredClasses.add(c));
      }

      const idMatch = attrs.match(/id=["']([^"']+)["']/);
      if (idMatch) discoveredIds.add(idMatch[1]);

      if (tagName === 'a') {
        const hrefMatch = attrs.match(/href=["']([^"']+)["']/);
        if (hrefMatch) {
          extractedLinks.push({ text: 'Link Text', href: hrefMatch[1] });
        }
      }

      if (tagName === 'img') {
        const srcMatch = attrs.match(/src=["']([^"']+)["']/);
        if (srcMatch) extractedImages.push(srcMatch[1]);
      }
    }

    if (mode === 'ast') {
      // 2. Structural Python DOM AST Generator
      interface AstNode {
        type: 'element' | 'text';
        tag?: string;
        id?: string | null;
        classes?: string[];
        attributes?: Record<string, string>;
        text?: string;
        children: AstNode[];
      }

      // Lightweight DOM parser to create nested Python dictionary
      const parseDomToAst = (htmlStr: string): AstNode[] => {
        const nodes: AstNode[] = [];
        const elementRegex = /<([a-zA-Z0-9]+)([^>]*)>([\s\S]*?)<\/\1>|<([a-zA-Z0-9]+)([^>]*)\/?>/g;
        let elMatch: RegExpExecArray | null;

        while ((elMatch = elementRegex.exec(htmlStr)) !== null) {
          const tag = (elMatch[1] || elMatch[4]).toLowerCase();
          if (['script', 'style'].includes(tag)) continue;

          const attrsStr = elMatch[2] || elMatch[5] || '';
          const innerHtml = elMatch[3] || '';

          const classMatch = attrsStr.match(/class=["']([^"']+)["']/);
          const idMatch = attrsStr.match(/id=["']([^"']+)["']/);

          const attributes: Record<string, string> = {};
          const attrPairs = Array.from(attrsStr.matchAll(/([a-zA-Z0-9_-]+)=["']([^"']*)["']/g));
          for (const [, k, v] of attrPairs) {
            attributes[k] = v;
          }

          const node: AstNode = {
            type: 'element',
            tag,
            id: idMatch ? idMatch[1] : null,
            classes: classMatch ? classMatch[1].split(/\s+/).filter(Boolean) : [],
            attributes,
            children: innerHtml.includes('<') ? parseDomToAst(innerHtml) : [],
            text: !innerHtml.includes('<') ? innerHtml.trim() : undefined,
          };
          nodes.push(node);
        }
        return nodes;
      };

      const astNodes = parseDomToAst(trimmed);

      // Serialize AST nodes to valid Python dictionary literals
      const toPythonDict = (obj: any, indent = 0): string => {
        const sp = ' '.repeat(indent);
        if (obj === null || obj === undefined) return 'None';
        if (typeof obj === 'boolean') return obj ? 'True' : 'False';
        if (typeof obj === 'string') return JSON.stringify(obj);
        if (typeof obj === 'number') return String(obj);
        if (Array.isArray(obj)) {
          if (obj.length === 0) return '[]';
          const items = obj.map((i) => `${sp}  ${toPythonDict(i, indent + 2)}`).join(',\n');
          return `[\n${items}\n${sp}]`;
        }
        if (typeof obj === 'object') {
          const keys = Object.keys(obj);
          if (keys.length === 0) return '{}';
          const pairs = keys
            .map((k) => `${sp}  ${JSON.stringify(k)}: ${toPythonDict(obj[k], indent + 2)}`)
            .join(',\n');
          return `{\n${pairs}\n${sp}}`;
        }
        return 'None';
      };

      const pythonAstOutput = `# ==============================================================================
# HTML ABSTRACT SYNTAX TREE (DOM NODE SCHEMA)
# Target Document: ${targetUrl}
# Node Count: ${astNodes.length}
# ==============================================================================

DOM_AST = ${toPythonDict(astNodes, 0)}

if __name__ == "__main__":
    import pprint
    print(f"Loaded DOM AST Root Nodes: {len(DOM_AST)}")
    pprint.pprint(DOM_AST[:2] if len(DOM_AST) > 2 else DOM_AST)
`;

      const executionTimeMs = Math.round((performance.now() - startTime) * 100) / 100;
      return {
        success: true,
        output: pythonAstOutput,
        telemetry: { executionTimeMs, inputChars: input.length, outputChars: pythonAstOutput.length },
        meta: { mode: 'ast', nodesCount: astNodes.length },
      };
    }

    // 3. Mode A: Executable Python Scraping Boilerplate (requests + BeautifulSoup)
    const featuredClasses = Array.from(discoveredClasses).slice(0, 5);
    const featuredIds = Array.from(discoveredIds).slice(0, 3);

    const extractionCodeLines: string[] = [];

    // Title / Headings
    if (discoveredTags.has('h1')) {
      extractionCodeLines.push(`    # 1. Page Main Heading
    h1_elem = soup.find("h1")
    data["main_heading"] = h1_elem.get_text(strip=True) if h1_elem else None
`);
    }

    if (discoveredTags.has('h2')) {
      extractionCodeLines.push(`    # 2. Subheadings
    data["subheadings"] = [h2.get_text(strip=True) for h2 in soup.find_all("h2")]
`);
    }

    // Specific IDs
    if (featuredIds.length > 0) {
      extractionCodeLines.push(`    # 3. Targeted Unique Elements by ID`);
      for (const id of featuredIds) {
        const varName = id.replace(/[^a-zA-Z0-9_]/g, '_');
        extractionCodeLines.push(`    elem_${varName} = soup.find(id="${id}")
    if elem_${varName}:
        data["${id}"] = elem_${varName}.get_text(strip=True)
`);
      }
    }

    // Repeating Card or Product Containers
    const containerClass = featuredClasses.find((c) => /card|item|product|article|post|row/.test(c)) || featuredClasses[0];
    if (containerClass) {
      extractionCodeLines.push(`    # 4. Repeating Component Extraction (.${containerClass})
    items_data = []
    containers = soup.find_all(class_="${containerClass}")
    for item in containers:
        item_title = item.find(["h2", "h3", "h4", "strong"])
        item_link = item.find("a", href=True)
        items_data.append({
            "title": item_title.get_text(strip=True) if item_title else None,
            "url": item_link["href"] if item_link else None,
            "text": item.get_text(strip=True)[:150],
        })
    data["${containerClass}_items"] = items_data
`);
    }

    // Tables
    if (discoveredTags.has('table')) {
      extractionCodeLines.push(`    # 5. Table Data Extraction
    tables_data = []
    for table in soup.find_all("table"):
        headers = [th.get_text(strip=True) for th in table.find_all("th")]
        rows = []
        for tr in table.find_all("tr"):
            cells = [td.get_text(strip=True) for td in tr.find_all("td")]
            if cells:
                rows.append(dict(zip(headers, cells)) if headers else cells)
        tables_data.append(rows)
    data["tables"] = tables_data
`);
    }

    // Links
    if (discoveredTags.has('a')) {
      extractionCodeLines.push(`    # 6. Hyperlinks Extraction
    data["links"] = [
        {"text": a.get_text(strip=True), "href": a["href"]}
        for a in soup.find_all("a", href=True)
        if a["href"].startswith("http") or a["href"].startswith("/")
    ][:25]
`);
    }

    // Images
    if (discoveredTags.has('img')) {
      extractionCodeLines.push(`    # 7. Media & Image Assets
    data["images"] = [
        {"src": img.get("src"), "alt": img.get("alt", "")}
        for img in soup.find_all("img", src=True)
    ][:15]
`);
    }

    const pythonScript = `"""
High-Throughput Web Scraping & DOM Extraction Pipeline
Engine: BeautifulSoup4 (${parser}) + Requests
Generated by FreeToolsStore Compiler Architecture
"""

import json
import logging
from typing import Dict, Any, Optional
import requests
from bs4 import BeautifulSoup

# Setup production logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("scraper")

DEFAULT_URL = "${targetUrl}"
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
}

def parse_html(html_content: str) -> Dict[str, Any]:
    """
    Parses raw HTML string and extracts structured fields.
    """
    soup = BeautifulSoup(html_content, "${parser}")
    data: Dict[str, Any] = {}

${extractionCodeLines.join('\n')}
    return data

def scrape_endpoint(url: str = DEFAULT_URL, timeout: int = 15) -> Dict[str, Any]:
    """
    Fetches remote endpoint and triggers extraction parser.
    """
    logger.info(f"Initiating HTTP GET request to: {url}")
    response = requests.get(url, headers=HEADERS, timeout=timeout)
    response.raise_for_status()
    logger.info(f"Response received [status={response.status_code}, length={len(response.text)} bytes]")
    return parse_html(response.text)

if __name__ == "__main__":
    # Test execution with provided HTML payload
    sample_payload = """${trimmed.replace(/"""/g, '\\"\\"\\"')}"""
    result = parse_html(sample_payload)
    print(json.dumps(result, indent=2, ensure_ascii=False))
`;

    const executionTimeMs = Math.round((performance.now() - startTime) * 100) / 100;
    return {
      success: true,
      output: pythonScript,
      telemetry: { executionTimeMs, inputChars: input.length, outputChars: pythonScript.length },
      meta: { mode: 'scraping', parser, detectedTagsCount: discoveredTags.size },
    };
  } catch (err: any) {
    return {
      success: false,
      output: '',
      error: { message: `Python extraction generation failed: ${err.message}` },
      telemetry: { executionTimeMs: Math.round(performance.now() - startTime), inputChars: input.length, outputChars: 0 },
    };
  }
}

/* ==============================================================================
   ENGINE 3: JSON to YAML / YAML to JSON Stream Engine
   Slug: json-to-yaml
   ============================================================================== */

export function runJsonToYaml(input: string, options?: Record<string, any>): ToolExecutionResult {
  const startTime = performance.now();
  const requestedMode = (options?.mode as 'auto' | 'json-to-yaml' | 'yaml-to-json') || 'auto';
  const indent = options?.indent === 4 ? 4 : 2;
  const sortKeys = Boolean(options?.sortKeys);

  const trimmed = input.trim();
  if (!trimmed) {
    return {
      success: false,
      output: '',
      error: { message: 'Input buffer is empty. Please provide valid JSON or YAML content.' },
      telemetry: { executionTimeMs: 0, inputChars: 0, outputChars: 0 },
    };
  }

  try {
    let mode = requestedMode;

    // Auto-detect mode if not explicitly chosen
    if (mode === 'auto') {
      const looksLikeJson = /^[{\[]/.test(trimmed);
      if (looksLikeJson) {
        try {
          JSON.parse(trimmed);
          mode = 'json-to-yaml';
        } catch {
          // If JSON parse fails, check if valid YAML
          mode = 'yaml-to-json';
        }
      } else {
        mode = 'yaml-to-json';
      }
    }

    if (mode === 'json-to-yaml') {
      // 1. JSON -> YAML conversion
      let parsedJson: any;
      try {
        parsedJson = JSON.parse(trimmed);
      } catch (jsonErr: any) {
        return {
          success: false,
          output: '',
          error: { message: `Malformed JSON input: ${jsonErr.message}` },
          telemetry: { executionTimeMs: Math.round(performance.now() - startTime), inputChars: input.length, outputChars: 0 },
        };
      }

      // Check if multi-document stream (array of objects converted to multiple docs)
      let yamlOutput: string;
      if (Array.isArray(parsedJson) && options?.multiDocument) {
        yamlOutput = parsedJson
          .map((doc) =>
            yamlDump(doc, {
              indent,
              sortKeys,
              lineWidth: -1,
              noRefs: true,
            })
          )
          .join('---\n');
      } else {
        yamlOutput = yamlDump(parsedJson, {
          indent,
          sortKeys,
          lineWidth: -1,
          noRefs: true,
        });
      }

      const executionTimeMs = Math.round((performance.now() - startTime) * 100) / 100;
      return {
        success: true,
        output: yamlOutput,
        telemetry: { executionTimeMs, inputChars: input.length, outputChars: yamlOutput.length },
        meta: { direction: 'json-to-yaml', indent, sortKeys },
      };
    } else {
      // 2. YAML -> JSON conversion
      let documents: any[] = [];
      try {
        documents = yamlLoadAll(trimmed);
      } catch (yamlErr: any) {
        return {
          success: false,
          output: '',
          error: {
            message: `YAML Parse Error: ${yamlErr.reason || yamlErr.message}`,
            line: yamlErr.mark?.line ? yamlErr.mark.line + 1 : undefined,
            column: yamlErr.mark?.column ? yamlErr.mark.column + 1 : undefined,
          },
          telemetry: { executionTimeMs: Math.round(performance.now() - startTime), inputChars: input.length, outputChars: 0 },
        };
      }

      let jsonOutput: string;
      if (documents.length === 0) {
        jsonOutput = '{}';
      } else if (documents.length === 1) {
        jsonOutput = JSON.stringify(documents[0], null, indent);
      } else {
        jsonOutput = JSON.stringify(documents, null, indent);
      }

      const executionTimeMs = Math.round((performance.now() - startTime) * 100) / 100;
      return {
        success: true,
        output: jsonOutput,
        telemetry: { executionTimeMs, inputChars: input.length, outputChars: jsonOutput.length },
        meta: { direction: 'yaml-to-json', documentsCount: documents.length, indent },
      };
    }
  } catch (err: any) {
    return {
      success: false,
      output: '',
      error: { message: `Stream conversion failure: ${err.message}` },
      telemetry: { executionTimeMs: Math.round(performance.now() - startTime), inputChars: input.length, outputChars: 0 },
    };
  }
}

/* ==============================================================================
   ENGINE 4: JavaScript to TypeScript Strict Inferencer
   Slug: js-to-ts
   ============================================================================== */

export function runJsToTs(input: string, options?: Record<string, any>): ToolExecutionResult {
  const startTime = performance.now();
  const strict = options?.strict !== false;
  const target = (options?.target as 'interfaces' | 'types') || 'interfaces';
  const exportInterfaces = options?.exportInterfaces !== false;

  const trimmed = input.trim();
  if (!trimmed) {
    return {
      success: false,
      output: '',
      error: { message: 'Input buffer is empty. Please provide JavaScript source code to infer types.' },
      telemetry: { executionTimeMs: 0, inputChars: 0, outputChars: 0 },
    };
  }

  try {
    const generatedTypes: string[] = [];
    let transformedJs = trimmed;

    const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

    // 1. Scan and Extract Object Literals into Interfaces / Types
    const objRegex = /(?:const|let|var)\s+([a-zA-Z0-9_$]+)\s*=\s*(\{[\s\S]*?\});?/g;
    let objMatch: RegExpExecArray | null;

    while ((objMatch = objRegex.exec(trimmed)) !== null) {
      const varName = objMatch[1];
      const rawObjStr = objMatch[2];

      try {
        // Safe evaluation of standard object literal
        const fn = new Function(`return (${rawObjStr});`);
        const evaluated = fn();

        if (evaluated && typeof evaluated === 'object' && !Array.isArray(evaluated)) {
          const typeName = capitalize(varName);
          let typeDefinition = '';

          if (target === 'interfaces') {
            typeDefinition = `${exportInterfaces ? 'export ' : ''}interface ${typeName} {\n`;
            for (const [k, v] of Object.entries(evaluated)) {
              let t = 'unknown';
              if (v === null || v === undefined) t = strict ? 'unknown | null' : 'any';
              else if (typeof v === 'string') t = 'string';
              else if (typeof v === 'number') t = 'number';
              else if (typeof v === 'boolean') t = 'boolean';
              else if (Array.isArray(v)) {
                t = v.length > 0 ? `${typeof v[0]}[]` : 'unknown[]';
              } else if (typeof v === 'object') {
                t = 'Record<string, unknown>';
              }
              typeDefinition += `  ${k}: ${t};\n`;
            }
            typeDefinition += `}\n`;
          } else {
            typeDefinition = `${exportInterfaces ? 'export ' : ''}type ${typeName} = {\n`;
            for (const [k, v] of Object.entries(evaluated)) {
              let t = typeof v === 'string' ? 'string' : typeof v === 'number' ? 'number' : typeof v === 'boolean' ? 'boolean' : 'unknown';
              typeDefinition += `  ${k}: ${t};\n`;
            }
            typeDefinition += `};\n`;
          }

          generatedTypes.push(typeDefinition);
          // Annotate variable declaration with inferred type
          transformedJs = transformedJs.replace(
            new RegExp(`(const|let|var)\\s+${varName}\\s*=`),
            `$1 ${varName}: ${typeName} =`
          );
        }
      } catch {
        // Ignore objects that cannot be parsed standalone
      }
    }

    // 2. Annotate Function Parameter Signatures & Return Types
    // Regex matches standard function declarations: function foo(a, b = 10) { ... }
    transformedJs = transformedJs.replace(
      /function\s+([a-zA-Z0-9_$]+)\s*\(([^)]*)\)\s*\{/g,
      (_match, fnName, paramsStr) => {
        const params = paramsStr.split(',').map((p: string) => p.trim()).filter(Boolean);
        const typedParams = params.map((p: string) => {
          if (p.includes(':')) return p; // Already typed
          if (p.includes('=')) {
            const [name, val] = p.split('=').map((s: string) => s.trim());
            if (/^['"`]/.test(val)) return `${name}: string = ${val}`;
            if (!isNaN(Number(val))) return `${name}: number = ${val}`;
            if (val === 'true' || val === 'false') return `${name}: boolean = ${val}`;
            if (val.startsWith('[')) return `${name}: unknown[] = ${val}`;
            return `${name}: Record<string, unknown> = ${val}`;
          }
          if (p.startsWith('...')) return `${p}: unknown[]`;
          return `${p}: ${strict ? 'unknown' : 'any'}`;
        });

        return `function ${fnName}(${typedParams.join(', ')}): unknown {`;
      }
    );

    // Regex matches async functions: async function foo(a) { ... }
    transformedJs = transformedJs.replace(
      /async\s+function\s+([a-zA-Z0-9_$]+)\s*\(([^)]*)\)\s*\{/g,
      (_match, fnName, paramsStr) => {
        const params = paramsStr.split(',').map((p: string) => p.trim()).filter(Boolean);
        const typedParams = params.map((p: string) => (p.includes(':') ? p : `${p}: ${strict ? 'unknown' : 'any'}`));
        return `async function ${fnName}(${typedParams.join(', ')}): Promise<unknown> {`;
      }
    );

    // Regex matches arrow functions: const foo = (a, b) => { ... }
    transformedJs = transformedJs.replace(
      /(const|let|var)\s+([a-zA-Z0-9_$]+)\s*=\s*(?:async\s*)?\(([^)]*)\)\s*=>/g,
      (match, decl, fnName, paramsStr) => {
        const isAsync = match.includes('async');
        const params = paramsStr.split(',').map((p: string) => p.trim()).filter(Boolean);
        const typedParams = params.map((p: string) => (p.includes(':') ? p : `${p}: ${strict ? 'unknown' : 'any'}`));
        const returnType = isAsync ? 'Promise<unknown>' : 'unknown';
        return `${decl} ${fnName} = ${isAsync ? 'async ' : ''}(${typedParams.join(', ')}): ${returnType} =>`;
      }
    );

    // 3. Assemble Output with Type Header
    let output = '';
    if (generatedTypes.length > 0) {
      output = `// ── Inferred Interfaces & Types ──\n` + generatedTypes.join('\n') + `\n// ── Typed Implementation ──\n`;
    }
    output += transformedJs;

    const executionTimeMs = Math.round((performance.now() - startTime) * 100) / 100;
    return {
      success: true,
      output,
      telemetry: { executionTimeMs, inputChars: input.length, outputChars: output.length },
      meta: { interfacesCount: generatedTypes.length, strictMode: strict },
    };
  } catch (err: any) {
    return {
      success: false,
      output: '',
      error: { message: `TypeScript type inference failure: ${err.message}` },
      telemetry: { executionTimeMs: Math.round(performance.now() - startTime), inputChars: input.length, outputChars: 0 },
    };
  }
}

/* ==============================================================================
   ENGINE 5: SVG to Production JSX / TSX Component Engine
   Slug: svg-to-jsx
   ============================================================================== */

export function runSvgToJsx(input: string, options?: Record<string, any>): ToolExecutionResult {
  const startTime = performance.now();
  const componentName = (options?.componentName as string)?.trim() || 'SvgIcon';
  const isTypeScript = options?.typescript !== false;
  const useCurrentColor = options?.currentColor !== false;
  const expandProps = options?.expandProps !== false;

  const trimmed = input.trim();
  if (!trimmed || !trimmed.includes('<svg')) {
    return {
      success: false,
      output: '',
      error: { message: 'Invalid SVG markup. Ensure your input starts with or includes a root <svg> element.' },
      telemetry: { executionTimeMs: 0, inputChars: 0, outputChars: 0 },
    };
  }

  try {
    // 1. Clean XML headers, doctypes, and metadata
    let cleanSvg = trimmed
      .replace(/<\?xml[\s\S]*?\?>/gi, '')
      .replace(/<!DOCTYPE[\s\S]*?>/gi, '')
      .replace(/<!--[\s\S]*?-->/g, '')
      .replace(/<metadata>[\s\S]*?<\/metadata>/gi, '')
      .replace(/<desc>[\s\S]*?<\/desc>/gi, '')
      .replace(/<title>[\s\S]*?<\/title>/gi, '')
      .trim();

    // 2. Extract or Synthesize viewBox from root SVG
    const svgTagMatch = cleanSvg.match(/<svg([^>]*)>/i);
    if (!svgTagMatch) {
      throw new Error('Could not locate root <svg> tag.');
    }

    let rootAttrs = svgTagMatch[1];
    const viewBoxMatch = rootAttrs.match(/viewBox=["']([^"']+)["']/i);
    const widthMatch = rootAttrs.match(/width=["']([^"']+)["']/i);
    const heightMatch = rootAttrs.match(/height=["']([^"']+)["']/i);

    let viewBox = viewBoxMatch ? viewBoxMatch[1] : '0 0 24 24';
    if (!viewBoxMatch && widthMatch && heightMatch) {
      const w = parseFloat(widthMatch[1]) || 24;
      const h = parseFloat(heightMatch[1]) || 24;
      viewBox = `0 0 ${w} ${h}`;
    }

    // Strip width, height, and existing viewBox from root attributes
    rootAttrs = rootAttrs
      .replace(/width=["'][^"']*["']/gi, '')
      .replace(/height=["'][^"']*["']/gi, '')
      .replace(/viewBox=["'][^"']*["']/gi, '')
      .replace(/\s+/g, ' ')
      .trim();

    // 3. Map Hyphenated SVG Attributes to CamelCase JSX
    const attrReplacements: Record<string, string> = {
      'stroke-width': 'strokeWidth',
      'stroke-linecap': 'strokeLinecap',
      'stroke-linejoin': 'strokeLinejoin',
      'stroke-miterlimit': 'strokeMiterlimit',
      'stroke-dasharray': 'strokeDasharray',
      'stroke-dashoffset': 'strokeDashoffset',
      'stroke-opacity': 'strokeOpacity',
      'fill-rule': 'fillRule',
      'fill-opacity': 'fillOpacity',
      'clip-rule': 'clipRule',
      'clip-path': 'clipPath',
      'stop-color': 'stopColor',
      'stop-opacity': 'stopOpacity',
      'color-interpolation': 'colorInterpolation',
      'color-interpolation-filters': 'colorInterpolationFilters',
      'flood-color': 'floodColor',
      'flood-opacity': 'floodOpacity',
      'lighting-color': 'lightingColor',
      'enable-background': 'enableBackground',
      'xml:space': 'xmlSpace',
      'xmlns:xlink': 'xmlnsXlink',
      'xlink:href': 'xlinkHref',
      class: 'className',
    };

    for (const [kebab, camel] of Object.entries(attrReplacements)) {
      const regex = new RegExp(`\\b${kebab}=`, 'gi');
      cleanSvg = cleanSvg.replace(regex, `${camel}=`);
      rootAttrs = rootAttrs.replace(regex, `${camel}=`);
    }

    // 4. Convert inline style strings into JSX style objects
    cleanSvg = cleanSvg.replace(/style=["']([^"']+)["']/gi, (_m, styleContent) => {
      const rules = styleContent.split(';').map((s: string) => s.trim()).filter(Boolean);
      const styleObjEntries = rules.map((r: string) => {
        const [k, v] = r.split(':').map((s: string) => s.trim());
        const camelKey = k.replace(/-([a-z])/g, (_, char) => char.toUpperCase());
        return `${camelKey}: '${v}'`;
      });
      return `style={{ ${styleObjEntries.join(', ')} }}`;
    });

    // 5. Replace explicit dark fills/strokes with currentColor if enabled
    if (useCurrentColor) {
      cleanSvg = cleanSvg
        .replace(/fill=["']#(000|000000|111|111111|black)["']/gi, 'fill="currentColor"')
        .replace(/stroke=["']#(000|000000|111|111111|black)["']/gi, 'stroke="currentColor"');
    }

    // 6. Replace root <svg> with formatted JSX tag
    const innerContent = cleanSvg
      .replace(/<svg[^>]*>/i, '')
      .replace(/<\/svg>$/i, '')
      .trim();

    const sanitizedComponentName = componentName.replace(/[^a-zA-Z0-9_]/g, '');
    const validName = sanitizedComponentName.charAt(0).toUpperCase() + sanitizedComponentName.slice(1);

    let componentOutput = '';

    if (isTypeScript) {
      componentOutput = `import * as React from 'react';

export interface ${validName}Props extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export function ${validName}({
  size = 24,
  className = '',
  ${expandProps ? '...props' : ''}
}: ${validName}Props) {
  return (
    <svg
      viewBox="${viewBox}"
      width={size}
      height={size}
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      ${rootAttrs ? `${rootAttrs} ` : ''}${expandProps ? '{...props}' : ''}
    >
      ${innerContent}
    </svg>
  );
}

export default ${validName};
`;
    } else {
      componentOutput = `import * as React from 'react';

export function ${validName}({
  size = 24,
  className = '',
  ${expandProps ? '...props' : ''}
}) {
  return (
    <svg
      viewBox="${viewBox}"
      width={size}
      height={size}
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      ${rootAttrs ? `${rootAttrs} ` : ''}${expandProps ? '{...props}' : ''}
    >
      ${innerContent}
    </svg>
  );
}

export default ${validName};
`;
    }

    const executionTimeMs = Math.round((performance.now() - startTime) * 100) / 100;
    return {
      success: true,
      output: componentOutput,
      telemetry: { executionTimeMs, inputChars: input.length, outputChars: componentOutput.length },
      meta: { componentName: validName, viewBox, isTypeScript },
    };
  } catch (err: any) {
    return {
      success: false,
      output: '',
      error: { message: `SVG to JSX conversion failed: ${err.message}` },
      telemetry: { executionTimeMs: Math.round(performance.now() - startTime), inputChars: input.length, outputChars: 0 },
    };
  }
}

/* ==============================================================================
   ENGINE 6: SQL to Schema ORM Generator
   Slug: sql-to-schema-orm
   ============================================================================== */

interface SqlColumn {
  name: string;
  type: string;
  isPrimary: boolean;
  isNullable: boolean;
  isUnique: boolean;
  defaultValue?: string;
  references?: { table: string; column: string };
}

interface SqlTable {
  name: string;
  columns: SqlColumn[];
  primaryKeys: string[];
}

export function runSqlToSchemaOrm(input: string, options?: Record<string, any>): ToolExecutionResult {
  const startTime = performance.now();
  const target = (options?.target as 'prisma' | 'drizzle' | 'typeorm') || 'prisma';
  const casing = (options?.casing as 'camelCase' | 'snake_case') || 'camelCase';
  const includeRelations = options?.includeRelations !== false;

  const trimmed = input.trim();
  if (!trimmed) {
    return {
      success: false,
      output: '',
      error: { message: 'Input buffer is empty. Please provide SQL DDL statements (e.g. CREATE TABLE).' },
      telemetry: { executionTimeMs: 0, inputChars: 0, outputChars: 0 },
    };
  }

  try {
    // 1. Strip SQL Comments
    const cleanSql = trimmed
      .replace(/--.*$/gm, '')
      .replace(/\/\*[\s\S]*?\*\//g, '');

    // 2. Extract Enum types
    const enumRegex = /CREATE\s+TYPE\s+([a-zA-Z0-9_]+)\s+AS\s+ENUM\s*\(([^)]+)\);?/gi;
    const enums: Array<{ name: string; values: string[] }> = [];
    let enumMatch: RegExpExecArray | null;

    while ((enumMatch = enumRegex.exec(cleanSql)) !== null) {
      const enumName = enumMatch[1];
      const enumVals = enumMatch[2]
        .split(',')
        .map((v) => v.trim().replace(/^['"]|['"]$/g, ''))
        .filter(Boolean);
      enums.push({ name: enumName, values: enumVals });
    }

    // 3. Extract Tables
    const tableRegex = /CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?([a-zA-Z0-9_."`]+)\s*\(([\s\S]*?)\);/gi;
    const tables: SqlTable[] = [];
    let tableMatch: RegExpExecArray | null;

    while ((tableMatch = tableRegex.exec(cleanSql)) !== null) {
      const rawTableName = tableMatch[1].replace(/["`]/g, '').split('.').pop() || '';
      const body = tableMatch[2];

      const columns: SqlColumn[] = [];
      const primaryKeys: string[] = [];

      // Split body by lines/commas respecting parentheses
      const lines: string[] = [];
      let current = '';
      let parenCount = 0;

      for (let i = 0; i < body.length; i++) {
        const char = body[i];
        if (char === '(') parenCount++;
        else if (char === ')') parenCount--;

        if (char === ',' && parenCount === 0) {
          lines.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      if (current.trim()) lines.push(current.trim());

      for (const line of lines) {
        const upper = line.toUpperCase();

        // Table-level PRIMARY KEY constraint
        if (/^PRIMARY\s+KEY\s*\(/i.test(line) || /^CONSTRAINT\s+.*PRIMARY\s+KEY\s*\(/i.test(line)) {
          const pkMatch = line.match(/PRIMARY\s+KEY\s*\(([^)]+)\)/i);
          if (pkMatch) {
            pkMatch[1].split(',').forEach((c) => primaryKeys.push(c.trim().replace(/["`]/g, '')));
          }
          continue;
        }

        // Table-level FOREIGN KEY constraint
        if (/^FOREIGN\s+KEY\s*\(/i.test(line) || /^CONSTRAINT\s+.*FOREIGN\s+KEY\s*\(/i.test(line)) {
          const fkMatch = line.match(/FOREIGN\s+KEY\s*\(([^)]+)\)\s+REFERENCES\s+([a-zA-Z0-9_."`]+)\s*\(([^)]+)\)/i);
          if (fkMatch) {
            const colName = fkMatch[1].trim().replace(/["`]/g, '');
            const refTable = fkMatch[2].trim().replace(/["`]/g, '').split('.').pop() || '';
            const refCol = fkMatch[3].trim().replace(/["`]/g, '');
            const existingCol = columns.find((c) => c.name === colName);
            if (existingCol) {
              existingCol.references = { table: refTable, column: refCol };
            }
          }
          continue;
        }

        // Parse individual column definition
        const colTokens = line.split(/\s+/).filter(Boolean);
        if (colTokens.length < 2) continue;

        const colName = colTokens[0].replace(/["`]/g, '');
        const colType = colTokens[1].toUpperCase();

        const isPrimary = upper.includes('PRIMARY KEY');
        if (isPrimary) primaryKeys.push(colName);

        const isNullable = !upper.includes('NOT NULL') && !isPrimary;
        const isUnique = upper.includes('UNIQUE');

        let defaultValue: string | undefined;
        const defaultMatch = line.match(/DEFAULT\s+([^,]+)/i);
        if (defaultMatch) {
          defaultValue = defaultMatch[1].trim();
        }

        let references: { table: string; column: string } | undefined;
        const refMatch = line.match(/REFERENCES\s+([a-zA-Z0-9_."`]+)\s*\(([^)]+)\)/i);
        if (refMatch) {
          references = {
            table: refMatch[1].trim().replace(/["`]/g, '').split('.').pop() || '',
            column: refMatch[2].trim().replace(/["`]/g, ''),
          };
        }

        columns.push({
          name: colName,
          type: colType,
          isPrimary,
          isNullable,
          isUnique,
          defaultValue,
          references,
        });
      }

      // Mark primary keys on columns
      for (const pk of primaryKeys) {
        const col = columns.find((c) => c.name === pk);
        if (col) col.isPrimary = true;
      }

      tables.push({ name: rawTableName, columns, primaryKeys });
    }

    if (tables.length === 0) {
      return {
        success: false,
        output: '',
        error: { message: 'Could not detect any valid "CREATE TABLE" statements in input.' },
        telemetry: { executionTimeMs: Math.round(performance.now() - startTime), inputChars: input.length, outputChars: 0 },
      };
    }

    const singularize = (s: string) => {
      const lower = s.toLowerCase();
      if (lower.endsWith('ies')) return s.slice(0, -3) + (s.endsWith('IES') ? 'Y' : 'y');
      if (lower.endsWith('ses')) return s.slice(0, -2);
      if (lower.endsWith('s') && !lower.endsWith('ss')) return s.slice(0, -1);
      return s;
    };

    const toPascalCase = (s: string, shouldSingularize = false) => {
      const base = shouldSingularize ? singularize(s) : s;
      return base
        .replace(/[-_](\w)/g, (_, c) => c.toUpperCase())
        .replace(/^\w/, (c) => c.toUpperCase());
    };

    const toCamelCase = (s: string) =>
      s
        .replace(/[-_](\w)/g, (_, c) => c.toUpperCase())
        .replace(/^\w/, (c) => c.toLowerCase());

    // ── TARGET 1: PRISMA SCHEMA ──
    if (target === 'prisma') {
      let prismaOutput = `// ── Prisma Schema Definition ──\n`;
      prismaOutput += `generator client {\n  provider = "prisma-client-js"\n}\n\n`;
      prismaOutput += `datasource db {\n  provider = "postgresql"\n  url      = env("DATABASE_URL")\n}\n\n`;

      // Enums
      for (const en of enums) {
        prismaOutput += `enum ${toPascalCase(en.name)} {\n`;
        en.values.forEach((v) => (prismaOutput += `  ${v}\n`));
        prismaOutput += `}\n\n`;
      }

      // Models
      for (const table of tables) {
        const modelName = toPascalCase(table.name, true);
        prismaOutput += `model ${modelName} {\n`;

        for (const col of table.columns) {
          const fieldName = casing === 'camelCase' ? toCamelCase(col.name) : col.name;
          let prismaType = 'String';
          const t = col.type;

          if (/INT|SERIAL/.test(t)) prismaType = /BIGINT|BIGSERIAL/.test(t) ? 'BigInt' : 'Int';
          else if (/BOOLEAN|BOOL/.test(t)) prismaType = 'Boolean';
          else if (/TIMESTAMP|TIMESTAMPTZ|DATE|DATETIME/.test(t)) prismaType = 'DateTime';
          else if (/FLOAT|DOUBLE|REAL/.test(t)) prismaType = 'Float';
          else if (/NUMERIC|DECIMAL/.test(t)) prismaType = 'Decimal';
          else if (/JSON|JSONB/.test(t)) prismaType = 'Json';
          else if (/BYTEA|BLOB/.test(t)) prismaType = 'Bytes';
          else if (enums.some((e) => e.name.toUpperCase() === t)) {
            prismaType = toPascalCase(t);
          }

          if (col.isNullable && !col.isPrimary) {
            prismaType += '?';
          }

          let directives = '';
          if (col.isPrimary) directives += ' @id';
          if (col.isUnique && !col.isPrimary) directives += ' @unique';

          if (/SERIAL/i.test(col.type)) {
            directives += ' @default(autoincrement())';
          } else if (col.defaultValue) {
            if (/NOW\(\)|CURRENT_TIMESTAMP/i.test(col.defaultValue)) directives += ' @default(now())';
            else if (/UUID/i.test(col.defaultValue)) directives += ' @default(uuid())';
            else if (/GEN_RANDOM_UUID/i.test(col.defaultValue)) directives += ' @default(uuid())';
            else if (col.defaultValue === 'true' || col.defaultValue === 'false') directives += ` @default(${col.defaultValue})`;
            else if (!isNaN(Number(col.defaultValue))) directives += ` @default(${col.defaultValue})`;
            else directives += ` @default(${col.defaultValue})`;
          }

          if (fieldName !== col.name) {
            directives += ` @map("${col.name}")`;
          }

          prismaOutput += `  ${fieldName.padEnd(16)} ${prismaType.padEnd(12)}${directives}\n`;

          // Add relation field if FK present
          if (includeRelations && col.references) {
            const relModel = toPascalCase(col.references.table, true);
            const relFieldName = toCamelCase(col.references.table);
            const relKey = casing === 'camelCase' ? toCamelCase(col.references.column) : col.references.column;
            prismaOutput += `  ${relFieldName.padEnd(16)} ${relModel.padEnd(12)} @relation(fields: [${fieldName}], references: [${relKey}])\n`;
          }
        }

        if (modelName.toLowerCase() !== table.name.toLowerCase() || modelName !== table.name) {
          prismaOutput += `\n  @@map("${table.name}")\n`;
        }

        prismaOutput += `}\n\n`;
      }

      const executionTimeMs = Math.round((performance.now() - startTime) * 100) / 100;
      return {
        success: true,
        output: prismaOutput.trim(),
        telemetry: { executionTimeMs, inputChars: input.length, outputChars: prismaOutput.length },
        meta: { target: 'prisma', tablesCount: tables.length },
      };
    }

    // ── TARGET 2: DRIZZLE ORM ──
    if (target === 'drizzle') {
      let drizzleOutput = `import { pgTable, text, varchar, integer, bigint, boolean, timestamp, uuid, jsonb, decimal } from 'drizzle-orm/pg-core';\n\n`;

      for (const table of tables) {
        const tableVar = toCamelCase(table.name);
        drizzleOutput += `export const ${tableVar} = pgTable('${table.name}', {\n`;

        for (const col of table.columns) {
          const fieldName = casing === 'camelCase' ? toCamelCase(col.name) : col.name;
          let colDef = '';

          const t = col.type;
          if (/UUID/i.test(t)) colDef = `uuid('${col.name}')`;
          else if (/BIGINT/i.test(t)) colDef = `bigint('${col.name}', { mode: 'number' })`;
          else if (/INT|SERIAL/i.test(t)) colDef = `integer('${col.name}')`;
          else if (/BOOLEAN/i.test(t)) colDef = `boolean('${col.name}')`;
          else if (/TIMESTAMP|DATE/i.test(t)) colDef = `timestamp('${col.name}')`;
          else if (/JSON/i.test(t)) colDef = `jsonb('${col.name}')`;
          else if (/DECIMAL|NUMERIC/i.test(t)) colDef = `decimal('${col.name}', { precision: 10, scale: 2 })`;
          else if (/VARCHAR/i.test(t)) colDef = `varchar('${col.name}', { length: 255 })`;
          else colDef = `text('${col.name}')`;

          if (col.isPrimary) colDef += '.primaryKey()';
          if (!col.isNullable) colDef += '.notNull()';
          if (col.isUnique && !col.isPrimary) colDef += '.unique()';
          if (col.defaultValue) {
            if (/NOW|CURRENT_TIMESTAMP/i.test(col.defaultValue)) colDef += '.defaultNow()';
            else if (/UUID/i.test(col.defaultValue)) colDef += '.defaultRandom()';
          }

          drizzleOutput += `  ${fieldName}: ${colDef},\n`;
        }

        drizzleOutput += `});\n\n`;
      }

      const executionTimeMs = Math.round((performance.now() - startTime) * 100) / 100;
      return {
        success: true,
        output: drizzleOutput.trim(),
        telemetry: { executionTimeMs, inputChars: input.length, outputChars: drizzleOutput.length },
        meta: { target: 'drizzle', tablesCount: tables.length },
      };
    }

    // ── TARGET 3: TYPEORM ──
    let typeormOutput = `import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, BaseEntity } from 'typeorm';\n\n`;

    for (const table of tables) {
      const className = toPascalCase(table.name, true);
      typeormOutput += `@Entity('${table.name}')\nexport class ${className} extends BaseEntity {\n`;

      for (const col of table.columns) {
        const fieldName = casing === 'camelCase' ? toCamelCase(col.name) : col.name;

        if (col.isPrimary) {
          if (/UUID/i.test(col.type)) {
            typeormOutput += `  @PrimaryGeneratedColumn('uuid')\n  ${fieldName}: string;\n\n`;
          } else {
            typeormOutput += `  @PrimaryGeneratedColumn()\n  ${fieldName}: number;\n\n`;
          }
          continue;
        }

        if (/TIMESTAMP|DATE/i.test(col.type) && col.defaultValue && /NOW|CURRENT/i.test(col.defaultValue)) {
          typeormOutput += `  @CreateDateColumn({ name: '${col.name}' })\n  ${fieldName}: Date;\n\n`;
          continue;
        }

        let jsType = 'string';
        if (/INT|SERIAL|FLOAT|NUMERIC|DECIMAL/i.test(col.type)) jsType = 'number';
        else if (/BOOLEAN/i.test(col.type)) jsType = 'boolean';
        else if (/TIMESTAMP|DATE/i.test(col.type)) jsType = 'Date';
        else if (/JSON/i.test(col.type)) jsType = 'Record<string, unknown>';

        const colOpts: string[] = [];
        if (fieldName !== col.name) colOpts.push(`name: '${col.name}'`);
        if (col.isNullable) colOpts.push(`nullable: true`);
        if (col.isUnique) colOpts.push(`unique: true`);

        const optsStr = colOpts.length > 0 ? `{ ${colOpts.join(', ')} }` : '';
        typeormOutput += `  @Column(${optsStr})\n  ${fieldName}${col.isNullable ? '?' : ''}: ${jsType};\n\n`;
      }

      typeormOutput += `}\n\n`;
    }

    const executionTimeMs = Math.round((performance.now() - startTime) * 100) / 100;
    return {
      success: true,
      output: typeormOutput.trim(),
      telemetry: { executionTimeMs, inputChars: input.length, outputChars: typeormOutput.length },
      meta: { target: 'typeorm', tablesCount: tables.length },
    };
  } catch (err: any) {
    return {
      success: false,
      output: '',
      error: { message: `SQL parsing error: ${err.message}` },
      telemetry: { executionTimeMs: Math.round(performance.now() - startTime), inputChars: input.length, outputChars: 0 },
    };
  }
}
