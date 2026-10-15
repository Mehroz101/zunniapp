export type ToolCategory = 'seo' | 'dev' | 'data' | 'security' | 'text';

export interface ToolOptionConfig {
  id: string;
  label: string;
  type: 'select' | 'boolean' | 'text';
  choices?: string[];
  defaultValue: any;
}

export interface ToolDefinition {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  category: ToolCategory;
  categoryName: string;
  categorySlug: string;
  icon: string;
  inputLabel: string;
  inputPlaceholder: string;
  outputLabel: string;
  outputLanguage?: string;
  sampleInput: string;
  options?: ToolOptionConfig[];
  features: string[];
  howToSteps: Array<{ title: string; description: string }>;
  faqs: Array<{ question: string; answer: string }>;
  seoKeywords: string[];

  // Directory Hero & Card Styling Tokens (HeyGen Design Parity)
  categoryTag?: string;
  engineSubBadge?: string;
  speedBadge?: string;
  primaryGroup?: 'code-converters' | 'ai-utilities' | 'text-web';
}

export interface ToolExecutionResult {
  success: boolean;
  output: string;
  error?: {
    message: string;
    line?: number;
    column?: number;
  };
  telemetry: {
    executionTimeMs: number;
    inputChars: number;
    outputChars: number;
  };
  meta?: Record<string, any>;
}

export type ToolExecutor = (
  input: string,
  options?: Record<string, any>
) => ToolExecutionResult | Promise<ToolExecutionResult>;
