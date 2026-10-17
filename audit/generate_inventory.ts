import fs from 'fs';
import path from 'path';
import { CALCULATORS_REGISTRY } from '../aiiseverything-front/src/lib/config/calculators.ts';
import { TOOLS_REGISTRY } from '../aiiseverything-front/src/lib/tools/registry.ts';

const outDir = path.resolve('f:/aiiseverything.com/audit');

// 1. Process Calculators
const calculators = Object.entries(CALCULATORS_REGISTRY).map(([key, calc], index) => {
  return {
    id: `CALC-${String(index + 1).padStart(3, '0')}`,
    slug: calc.slug,
    name: calc.title,
    category: calc.category,
    categoryLabel: calc.categoryLabel,
    route: `/calculators/${calc.slug}`,
    implementationLocation: 'aiiseverything-front/src/lib/config/calculators.ts',
    inputs: calc.fields.map(f => ({
      id: f.id,
      label: f.label,
      type: f.type,
      defaultValue: f.defaultValue,
      min: f.min,
      max: f.max,
      step: f.step,
      unit: f.unit,
    })),
    status: 'DISCOVERED',
    testMethod: 'Mathematical Verification against Independent Formula',
    tags: calc.tags,
    badge: calc.badge,
    faqsCount: calc.faqs?.length || 0,
    formulaStepsCount: calc.formulaSteps?.length || 0,
  };
});

// 2. Process Tools
const tools = Object.entries(TOOLS_REGISTRY).map(([key, tool], index) => {
  return {
    id: `TOOL-${String(index + 1).padStart(3, '0')}`,
    slug: tool.slug,
    name: tool.name,
    category: tool.category,
    categoryName: tool.categoryName,
    route: `/tools/${tool.slug}`,
    implementationLocation: 'aiiseverything-front/src/lib/tools/registry.ts',
    inputLabel: tool.inputLabel,
    outputLabel: tool.outputLabel,
    sampleInput: tool.sampleInput,
    options: tool.options || [],
    features: tool.features || [],
    status: 'DISCOVERED',
    testMethod: 'Deterministic Input/Output Fixture Test',
    categoryTag: tool.categoryTag,
    engineSubBadge: tool.engineSubBadge,
    primaryGroup: tool.primaryGroup,
  };
});

const inventory = {
  timestamp: new Date().toISOString(),
  summary: {
    totalCalculators: calculators.length,
    totalTools: tools.length,
    totalUtilities: calculators.length + tools.length,
  },
  calculators,
  tools,
};

fs.writeFileSync(path.join(outDir, 'inventory.json'), JSON.stringify(inventory, null, 2));
console.log('Successfully generated audit/inventory.json');
console.log(`Calculators: ${calculators.length}, Tools: ${tools.length}`);
