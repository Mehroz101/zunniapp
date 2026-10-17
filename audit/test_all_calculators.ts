import { CALCULATORS_REGISTRY } from '../aiiseverything-front/src/lib/config/calculators.ts';
import fs from 'fs';
import path from 'path';

interface CalcTestReport {
  id: string;
  slug: string;
  title: string;
  category: string;
  normalTest: { passed: boolean; input: any; output: any; notes: string };
  boundaryTest: { passed: boolean; input: any; output: any; notes: string };
  edgeCaseTest: { passed: boolean; input: any; output: any; notes: string };
  overallStatus: 'PASS' | 'FAIL';
  executionTimeMs: number;
}

const reports: CalcTestReport[] = [];

console.log('=== STARTING AUTOMATED CALCULATOR VERIFICATION SUITE (20 ENGINES) ===\n');

for (const [slug, calc] of Object.entries(CALCULATORS_REGISTRY)) {
  const t0 = performance.now();
  let normalPass = false;
  let boundaryPass = false;
  let edgePass = false;

  // 1. Establish Default / Normal Inputs
  const defaultInputs: Record<string, any> = {};
  calc.fields.forEach((f) => {
    defaultInputs[f.id] = f.defaultValue;
  });

  let normalResult: any = null;
  let normalNotes = '';
  try {
    normalResult = calc.calculate(defaultInputs);
    if (
      normalResult &&
      normalResult.primaryValue &&
      typeof normalResult.primaryValue === 'string' &&
      Array.isArray(normalResult.summary) &&
      normalResult.summary.length > 0
    ) {
      normalPass = true;
      normalNotes = `Primary: ${normalResult.primaryValue} (${normalResult.primaryLabel})`;
    } else {
      normalNotes = 'Invalid result structure';
    }
  } catch (err: any) {
    normalNotes = `Exception on normal input: ${err.message}`;
  }

  // 2. Boundary / Extreme Inputs (Min / Max / Zeros)
  const boundaryInputs: Record<string, any> = {};
  calc.fields.forEach((f) => {
    if (f.type === 'number') {
      boundaryInputs[f.id] = f.max !== undefined ? f.max : (Number(f.defaultValue) * 2 || 100000);
    } else {
      boundaryInputs[f.id] = f.defaultValue;
    }
  });

  let boundaryResult: any = null;
  let boundaryNotes = '';
  try {
    boundaryResult = calc.calculate(boundaryInputs);
    if (
      boundaryResult &&
      boundaryResult.primaryValue &&
      !boundaryResult.primaryValue.includes('NaN') &&
      !boundaryResult.primaryValue.includes('Infinity')
    ) {
      boundaryPass = true;
      boundaryNotes = `Max Boundary: ${boundaryResult.primaryValue}`;
    } else {
      boundaryNotes = `Boundary produced invalid numeric value: ${boundaryResult?.primaryValue}`;
    }
  } catch (err: any) {
    boundaryNotes = `Exception on boundary input: ${err.message}`;
  }

  // 3. Edge Case: Zero / Minimum inputs (testing zero division & negative balance safety)
  const zeroInputs: Record<string, any> = {};
  calc.fields.forEach((f) => {
    if (f.type === 'number') {
      zeroInputs[f.id] = f.min !== undefined ? Math.max(0, f.min) : 0;
    } else {
      zeroInputs[f.id] = f.defaultValue;
    }
  });

  let edgeResult: any = null;
  let edgeNotes = '';
  try {
    edgeResult = calc.calculate(zeroInputs);
    if (
      edgeResult &&
      edgeResult.primaryValue &&
      !edgeResult.primaryValue.includes('NaN') &&
      !edgeResult.primaryValue.includes('Infinity')
    ) {
      edgePass = true;
      edgeNotes = `Zero/Min Boundary: ${edgeResult.primaryValue} (No division-by-zero crash)`;
    } else {
      edgeNotes = `Zero boundary produced NaN/Infinity: ${edgeResult?.primaryValue}`;
    }
  } catch (err: any) {
    edgeNotes = `Exception on zero input: ${err.message}`;
  }

  const duration = Math.round((performance.now() - t0) * 100) / 100;
  const overall: 'PASS' | 'FAIL' = normalPass && boundaryPass && edgePass ? 'PASS' : 'FAIL';

  reports.push({
    id: `CALC-${String(reports.length + 1).padStart(3, '0')}`,
    slug,
    title: calc.title,
    category: calc.categoryLabel,
    normalTest: { passed: normalPass, input: defaultInputs, output: normalResult, notes: normalNotes },
    boundaryTest: { passed: boundaryPass, input: boundaryInputs, output: boundaryResult, notes: boundaryNotes },
    edgeCaseTest: { passed: edgePass, input: zeroInputs, output: edgeResult, notes: edgeNotes },
    overallStatus: overall,
    executionTimeMs: duration,
  });

  console.log(`[${overall}] ${calc.title} (${slug}) - ${duration}ms`);
  if (overall === 'FAIL') {
    console.error(`   Normal: ${normalNotes}`);
    console.error(`   Boundary: ${boundaryNotes}`);
    console.error(`   Edge: ${edgeNotes}`);
  }
}

const passedCount = reports.filter((r) => r.overallStatus === 'PASS').length;
console.log(`\n=== CALCULATOR SUITE COMPLETE: ${passedCount} / ${reports.length} PASSED ===\n`);

fs.writeFileSync(
  path.resolve('f:/aiiseverything.com/audit/calculator_test_results.json'),
  JSON.stringify(reports, null, 2)
);
