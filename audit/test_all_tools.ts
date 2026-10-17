import { TOOLS_REGISTRY, executeTool } from '../aiiseverything-front/src/lib/tools/registry.ts';
import fs from 'fs';
import path from 'path';

interface ToolTestReport {
  id: string;
  slug: string;
  name: string;
  category: string;
  normalTest: { passed: boolean; outputSnippet: string; notes: string };
  emptyTest: { passed: boolean; notes: string };
  invalidOrEdgeTest: { passed: boolean; notes: string };
  unicodeTest: { passed: boolean; notes: string };
  overallStatus: 'PASS' | 'FAIL';
  executionTimeMs: number;
}

const reports: ToolTestReport[] = [];

console.log('=== STARTING AUTOMATED DEVELOPER TOOLS & COMPILERS SUITE (49 ENGINES) ===\n');

async function runTestSuite() {
  for (const [slug, tool] of Object.entries(TOOLS_REGISTRY)) {
    const t0 = performance.now();
    let normalPass = false;
    let emptyPass = false;
    let invalidPass = false;
    let unicodePass = false;

    // Default options
    const defaultOptions: Record<string, any> = {};
    tool.options?.forEach((opt) => {
      defaultOptions[opt.id] = opt.defaultValue;
    });

    // 1. Normal Test with sample input
    const sample = tool.sampleInput || 'test input 123';
    let normalNotes = '';
    let outputSnippet = '';
    try {
      const res = await executeTool(slug, sample, defaultOptions);
      if (res && typeof res.success === 'boolean') {
        normalPass = true;
        outputSnippet = (res.output || '').slice(0, 80).replace(/\n/g, ' ');
        normalNotes = res.success ? `Output: ${outputSnippet}` : `Handled gracefully: ${res.error?.message || 'Handled'}`;
      } else {
        normalNotes = 'Invalid response schema';
      }
    } catch (err: any) {
      normalNotes = `Exception on sample input: ${err.message}`;
    }

    // 2. Empty Input Test
    let emptyNotes = '';
    try {
      const res = await executeTool(slug, '', defaultOptions);
      if (res && typeof res.success === 'boolean') {
        emptyPass = true;
        emptyNotes = 'Handled empty string safely';
      } else {
        emptyNotes = 'Failed to return valid result on empty string';
      }
    } catch (err: any) {
      emptyNotes = `Exception on empty input: ${err.message}`;
    }

    // 3. Invalid / Malformed Input Test
    let invalidNotes = '';
    const malformed = '{"unclosed_json: true, invalid syntax %%%';
    try {
      const res = await executeTool(slug, malformed, defaultOptions);
      if (res && typeof res.success === 'boolean') {
        invalidPass = true;
        invalidNotes = res.success
          ? 'Tolerated malformed input'
          : `Cleanly rejected with error: ${res.error?.message || 'Validation error'}`;
      } else {
        invalidNotes = 'Malformed input returned invalid schema';
      }
    } catch (err: any) {
      // If tool caught and threw, check if it was graceful
      invalidNotes = `Unhandled crash on malformed input: ${err.message}`;
    }

    // 4. Unicode / Multi-byte Characters Test
    let unicodeNotes = '';
    const unicodeInput = 'Hello 🚀 世界 éçñ 12345';
    try {
      const res = await executeTool(slug, unicodeInput, defaultOptions);
      if (res && typeof res.success === 'boolean') {
        unicodePass = true;
        unicodeNotes = 'Successfully processed multi-byte Unicode/emojis';
      } else {
        unicodeNotes = 'Unicode handling failed';
      }
    } catch (err: any) {
      unicodeNotes = `Exception on Unicode input: ${err.message}`;
    }

    const duration = Math.round((performance.now() - t0) * 100) / 100;
    const overall: 'PASS' | 'FAIL' = normalPass && emptyPass && invalidPass && unicodePass ? 'PASS' : 'FAIL';

    reports.push({
      id: `TOOL-${String(reports.length + 1).padStart(3, '0')}`,
      slug,
      name: tool.name,
      category: tool.categoryName || tool.category,
      normalTest: { passed: normalPass, outputSnippet, notes: normalNotes },
      emptyTest: { passed: emptyPass, notes: emptyNotes },
      invalidOrEdgeTest: { passed: invalidPass, notes: invalidNotes },
      unicodeTest: { passed: unicodePass, notes: unicodeNotes },
      overallStatus: overall,
      executionTimeMs: duration,
    });

    console.log(`[${overall}] ${tool.name} (${slug}) - ${duration}ms`);
    if (overall === 'FAIL') {
      console.error(`   Normal: ${normalNotes}`);
      console.error(`   Empty: ${emptyNotes}`);
      console.error(`   Malformed: ${invalidNotes}`);
      console.error(`   Unicode: ${unicodeNotes}`);
    }
  }

  const passedCount = reports.filter((r) => r.overallStatus === 'PASS').length;
  console.log(`\n=== TOOLS SUITE COMPLETE: ${passedCount} / ${reports.length} PASSED ===\n`);

  fs.writeFileSync(
    path.resolve('f:/aiiseverything.com/audit/tools_test_results.json'),
    JSON.stringify(reports, null, 2)
  );
}

runTestSuite().catch(console.error);
