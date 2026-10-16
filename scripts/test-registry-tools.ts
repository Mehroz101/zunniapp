import { getAllTools, executeTool, getToolBySlug } from '../src/lib/tools/registry';

const SLUG_ALIASES_LIST = [
  'robots-txt-validator',
  'xml-sitemap-builder',
  'json-ld-schema-markup',
  'schema-markup-builder',
  'markdown-editor',
  'tailwind-class-converter',
  'minifier-pro-wasm',
  'regex-generator',
  'html-to-python',
  'html-to-python-ast-generator',
  'json-to-yaml-stream',
  'yaml-to-json',
  'svg-to-jsx-component',
  'svg-to-react',
  'sql-to-schema',
  'sql-to-prisma',
  'sql-to-drizzle',
  'sql-to-typeorm',
  'js-to-typescript',
  'javascript-to-typescript',
  'css-to-html-scaffolder',
];

async function testAll() {
  const tools = getAllTools();
  console.log(`Auditing ${tools.length} canonical tools in TOOLS_REGISTRY...`);

  let toolPassed = 0;
  for (const tool of tools) {
    const res = await executeTool(tool.slug, tool.sampleInput, {});
    if (res.success && res.output && res.output.trim().length > 0) {
      toolPassed++;
    } else {
      console.error(`[FAIL TOOL] ${tool.slug}`);
    }
  }
  console.log(`Canonical Tools Result: ${toolPassed}/${tools.length} Passed`);

  console.log(`\nAuditing ${SLUG_ALIASES_LIST.length} route aliases...`);
  let aliasPassed = 0;
  for (const alias of SLUG_ALIASES_LIST) {
    const tool = getToolBySlug(alias);
    if (!tool) {
      console.error(`[FAIL ALIAS RESOLUTION] ${alias} -> undefined tool definition!`);
      continue;
    }
    const res = await executeTool(alias, tool.sampleInput, {});
    if (res.success && res.output && res.output.trim().length > 0) {
      aliasPassed++;
    } else {
      console.error(`[FAIL ALIAS EXECUTION] ${alias} (${res.error?.message})`);
    }
  }
  console.log(`Alias Route Result: ${aliasPassed}/${SLUG_ALIASES_LIST.length} Passed`);

  if (toolPassed === tools.length && aliasPassed === SLUG_ALIASES_LIST.length) {
    console.log(`\n🎉 100% OPERATIONAL: All ${tools.length} tools and all ${SLUG_ALIASES_LIST.length} aliases are working perfectly!`);
  } else {
    process.exit(1);
  }
}

testAll();
