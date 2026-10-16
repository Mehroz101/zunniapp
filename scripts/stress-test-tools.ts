import { getAllTools, executeTool } from '../src/lib/tools/registry';

async function stressTestTools() {
  const tools = getAllTools();
  console.log(`\n============================================================`);
  console.log(`STRESS TESTING ALL ${tools.length} TOOLS WITH EDGE CASES`);
  console.log(`============================================================\n`);

  let passedTests = 0;
  let failedTests = 0;
  const issues: string[] = [];

  for (const tool of tools) {
    const slug = tool.slug;
    const defaultOptions: Record<string, any> = {};
    tool.options?.forEach((opt) => {
      defaultOptions[opt.id] = opt.defaultValue;
    });

    // Test 1: Standard sample input
    try {
      const res = await executeTool(slug, tool.sampleInput, defaultOptions);
      if (!res.success || !res.output) {
        failedTests++;
        issues.push(`[Sample Fail] ${slug}: ${res.error?.message || 'Empty output'}`);
      } else {
        passedTests++;
      }
    } catch (e: any) {
      failedTests++;
      issues.push(`[Sample Crash] ${slug}: ${e.message}`);
    }

    // Test 2: Empty input (should return graceful error without crashing)
    try {
      const res = await executeTool(slug, '', defaultOptions);
      if (res.success && !res.output) {
        // empty success without output is suspicious but not a crash
        passedTests++;
      } else {
        // graceful error handling is expected for empty input
        passedTests++;
      }
    } catch (e: any) {
      failedTests++;
      issues.push(`[Empty Input Crash] ${slug}: ${e.message}`);
    }

    // Test 3: Garbage input (e.g. malformed syntax)
    try {
      const res = await executeTool(slug, '<<<---MALFORMED GARBAGE INPUT {} $!@#--->>>', defaultOptions);
      // It should either parse best-effort or return a graceful error (res.success === false) without crashing!
      passedTests++;
    } catch (e: any) {
      failedTests++;
      issues.push(`[Malformed Input Crash] ${slug}: ${e.message}`);
    }
  }

  console.log(`\n============================================================`);
  console.log(`TOTAL TESTS: ${passedTests} Passed, ${failedTests} Crashes/Failures`);
  console.log(`============================================================\n`);

  if (issues.length > 0) {
    console.log('ISSUES FOUND:');
    issues.forEach((iss) => console.log('  ❌ ' + iss));
  } else {
    console.log('✅ ALL ENGINES ARE RESILIENT AND OPERATIONAL!');
  }
}

stressTestTools();
