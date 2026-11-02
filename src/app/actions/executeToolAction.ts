'use server';

import { executeTool } from '@/lib/tools/registry';
import type { ToolExecutionResult } from '@/lib/tools/types';

/**
 * Next.js Server Action: Executes AST parsing, syntax transpilation, and code conversions
 * strictly on the server to completely strip heavy compiler engines from client-side bundles.
 */
export async function executeToolServerAction(
  slug: string,
  input: string,
  options?: Record<string, any>
): Promise<ToolExecutionResult> {
  const startTime = performance.now();

  try {
    const result = await executeTool(slug, input, options);
    const duration = Math.round((performance.now() - startTime) * 100) / 100;

    return {
      ...result,
      telemetry: {
        ...result.telemetry,
        executionTimeMs: result.telemetry?.executionTimeMs || duration,
      },
    };
  } catch (err: any) {
    return {
      success: false,
      output: '',
      error: { message: err?.message || 'Server execution error occurred.' },
      telemetry: {
        executionTimeMs: Math.round((performance.now() - startTime) * 100) / 100,
        inputChars: input.length,
        outputChars: 0,
      },
    };
  }
}
