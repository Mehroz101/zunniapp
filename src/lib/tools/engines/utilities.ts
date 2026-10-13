import { ToolExecutionResult } from '../types';

// ── 23. HTML to CSS Converter ──
export function runHtmlToCssConverter(input: string, options?: Record<string, any>): ToolExecutionResult {
  const startTime = performance.now();
  if (!input.trim()) {
    return {
      success: false,
      output: '',
      error: { message: 'Paste HTML markup to extract classes and generate scoped CSS.' },
      telemetry: { executionTimeMs: 0, inputChars: 0, outputChars: 0 },
    };
  }

  const prefix = options?.prefix || '';
  const classMatches = input.match(/class=["']([^"']+)["']/gi) || [];
  const idMatches = input.match(/id=["']([^"']+)["']/gi) || [];
  const tagMatches = input.match(/<(h[1-6]|p|button|a|input|form|table|section|article|nav|header|footer)\b/gi) || [];

  const classes = new Set<string>();
  const ids = new Set<string>();
  const tags = new Set<string>();

  classMatches.forEach((m) => {
    const val = m.replace(/class=["']|["']/gi, '');
    val.split(/\s+/).forEach((c) => {
      if (c.trim() && !c.includes('{')) classes.add(c.trim());
    });
  });

  idMatches.forEach((m) => {
    const val = m.replace(/id=["']|["']/gi, '').trim();
    if (val) ids.add(val);
  });

  tagMatches.forEach((t) => {
    tags.add(t.replace('<', '').toLowerCase());
  });

  let css = `/* ====================================================\n`;
  css += `   SCOPED STYLESHEET GENERATED FROM HTML\n`;
  css += `   ==================================================== */\n\n`;

  if (classes.size === 0 && ids.size === 0) {
    css += `/* Base Element Defaults */\n`;
    tags.forEach((tag) => {
      css += `${tag} {\n  display: block;\n  box-sizing: border-box;\n}\n\n`;
    });
  }

  // IDs
  if (ids.size > 0) {
    css += `/* Unique Element IDs */\n`;
    ids.forEach((id) => {
      css += `#${id} {\n  position: relative;\n}\n\n`;
    });
  }

  // Classes
  if (classes.size > 0) {
    css += `/* Extracted Component Classes (${classes.size} selectors) */\n`;
    classes.forEach((c) => {
      const selector = prefix ? `${prefix} .${c}` : `.${c}`;
      css += `${selector} {\n`;
      if (/btn|button/i.test(c)) {
        css += `  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  padding: 0.5rem 1rem;\n  border-radius: 0.375rem;\n  cursor: pointer;\n  transition: all 0.2s ease;\n`;
      } else if (/card|box|panel/i.test(c)) {
        css += `  background-color: #ffffff;\n  border-radius: 0.5rem;\n  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);\n  padding: 1.5rem;\n`;
      } else if (/container|wrapper/i.test(c)) {
        css += `  width: 100%;\n  max-width: 1200px;\n  margin-left: auto;\n  margin-right: auto;\n  padding-left: 1rem;\n  padding-right: 1rem;\n`;
      } else if (/title|heading|header/i.test(c)) {
        css += `  font-weight: 700;\n  line-height: 1.25;\n  letter-spacing: -0.025em;\n`;
      } else if (/flex|row/i.test(c)) {
        css += `  display: flex;\n  align-items: center;\n  gap: 1rem;\n`;
      } else if (/grid/i.test(c)) {
        css += `  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));\n  gap: 1.5rem;\n`;
      } else {
        css += `  /* Styles for ${selector} */\n`;
      }
      css += `}\n\n`;
    });
  }

  const executionTimeMs = Math.round((performance.now() - startTime) * 100) / 100;
  return {
    success: true,
    output: css.trim(),
    telemetry: { executionTimeMs, inputChars: input.length, outputChars: css.length },
    meta: { classesCount: classes.size, idsCount: ids.size },
  };
}

// ── 24. JSON Formatter, Minifier & Validator ──
export function runJsonFormatter(input: string, options?: Record<string, any>): ToolExecutionResult {
  const startTime = performance.now();
  const mode = options?.mode || 'format'; // 'format' | 'minify'
  const indentSize = Number(options?.indent) || 2;

  if (!input.trim()) {
    return {
      success: false,
      output: '',
      error: { message: 'JSON input is empty. Paste a JSON payload to validate.' },
      telemetry: { executionTimeMs: 0, inputChars: 0, outputChars: 0 },
    };
  }

  try {
    const parsed = JSON.parse(input);
    const output = mode === 'minify' ? JSON.stringify(parsed) : JSON.stringify(parsed, null, indentSize);
    const executionTimeMs = Math.round((performance.now() - startTime) * 100) / 100;

    return {
      success: true,
      output,
      telemetry: { executionTimeMs, inputChars: input.length, outputChars: output.length },
      meta: {
        keysCount: typeof parsed === 'object' && parsed !== null ? Object.keys(parsed).length : 1,
        isArray: Array.isArray(parsed),
      },
    };
  } catch (err: any) {
    // Extract line/column from error message if available
    let line: number | undefined;
    let column: number | undefined;
    const posMatch = err.message.match(/position\s+(\d+)/i);
    if (posMatch) {
      const pos = parseInt(posMatch[1], 10);
      const lines = input.slice(0, pos).split('\n');
      line = lines.length;
      column = lines[lines.length - 1].length + 1;
    }

    return {
      success: false,
      output: '',
      error: {
        message: err.message,
        line,
        column,
      },
      telemetry: { executionTimeMs: 0, inputChars: input.length, outputChars: 0 },
    };
  }
}

// ── 25. AI Text Summarizer (Extractive Intelligence) ──
export function runAiSummarizer(input: string, options?: Record<string, any>): ToolExecutionResult {
  const startTime = performance.now();
  if (!input.trim()) {
    return {
      success: false,
      output: '',
      error: { message: 'Provide article or document text to generate an executive summary.' },
      telemetry: { executionTimeMs: 0, inputChars: 0, outputChars: 0 },
    };
  }

  const lengthOption = options?.length || 'medium'; // 'short' | 'medium' | 'detailed'
  const sentences = input
    .replace(/([.?!])\s*(?=[A-Z])/g, '$1|')
    .split('|')
    .map((s) => s.trim())
    .filter((s) => s.length > 20);

  if (sentences.length === 0) {
    return {
      success: true,
      output: input,
      telemetry: { executionTimeMs: 0, inputChars: input.length, outputChars: input.length },
    };
  }

  // Frequency-based scoring
  const words = input.toLowerCase().split(/\s+/).filter((w) => w.length > 3);
  const freqMap = new Map<string, number>();
  words.forEach((w) => freqMap.set(w, (freqMap.get(w) || 0) + 1));

  const scoredSentences = sentences.map((sent, idx) => {
    const sWords = sent.toLowerCase().split(/\s+/);
    let score = 0;
    sWords.forEach((w) => {
      score += freqMap.get(w) || 0;
    });
    // Position bonus for leading and concluding sentences
    if (idx === 0) score *= 1.5;
    if (idx === sentences.length - 1) score *= 1.2;
    return { text: sent, score: score / (sWords.length || 1), index: idx };
  });

  let topCount = 3;
  if (lengthOption === 'short') topCount = Math.min(2, sentences.length);
  else if (lengthOption === 'detailed') topCount = Math.min(5, sentences.length);
  else topCount = Math.min(3, sentences.length);

  const topSentences = scoredSentences
    .sort((a, b) => b.score - a.score)
    .slice(0, topCount)
    .sort((a, b) => a.index - b.index);

  let out = `EXECUTIVE SUMMARY & ACTIONABLE TAKEAWAYS\n`;
  out += `====================================================\n\n`;
  out += `Key Synthesis:\n`;
  topSentences.forEach((s) => (out += `• ${s.text}\n\n`));

  out += `DOCUMENT METRICS:\n`;
  out += `• Original Sentence Count: ${sentences.length}\n`;
  out += `• Original Word Count: ${words.length}\n`;
  out += `• Summary Ratio: ${Math.round((topCount / sentences.length) * 100)}% of original length\n`;

  const executionTimeMs = Math.round((performance.now() - startTime) * 100) / 100;
  return {
    success: true,
    output: out.trim(),
    telemetry: { executionTimeMs, inputChars: input.length, outputChars: out.length },
    meta: { sentencesCount: sentences.length, topSentencesCount: topCount },
  };
}

// ── 26. Readability Checker (Flesch-Kincaid & Index Engine) ──
export function runReadabilityChecker(input: string): ToolExecutionResult {
  const startTime = performance.now();
  if (!input.trim()) {
    return {
      success: false,
      output: '',
      error: { message: 'Provide content to analyze reading score and comprehension grade level.' },
      telemetry: { executionTimeMs: 0, inputChars: 0, outputChars: 0 },
    };
  }

  const clean = input.replace(/<[^>]+>/g, ' ');
  const words = clean.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  const sentences = clean.split(/[.?!]+/).filter((s) => s.trim().length > 0);
  const sentenceCount = Math.max(1, sentences.length);

  // Approximate syllable count
  function countSyllables(word: string): number {
    const w = word.toLowerCase().replace(/[^a-z]/g, '');
    if (w.length <= 3) return 1;
    const matched = w.match(/[aeiouy]{1,2}/g);
    let count = matched ? matched.length : 1;
    if (w.endsWith('e') && !w.endsWith('le')) count--;
    return Math.max(1, count);
  }

  let totalSyllables = 0;
  let complexWordsCount = 0;
  words.forEach((w) => {
    const syl = countSyllables(w);
    totalSyllables += syl;
    if (syl >= 3) complexWordsCount++;
  });

  const avgWordsPerSentence = wordCount / sentenceCount;
  const avgSyllablesPerWord = totalSyllables / Math.max(1, wordCount);

  // Flesch Reading Ease Formula: 206.835 - 1.015 * (total_words / total_sentences) - 84.6 * (total_syllables / total_words)
  const fleschReadingEase = Math.round(
    206.835 - 1.015 * avgWordsPerSentence - 84.6 * avgSyllablesPerWord
  );

  // Flesch-Kincaid Grade Level: 0.39 * (total_words / total_sentences) + 11.8 * (total_syllables / total_words) - 15.59
  const fleschKincaidGrade = Math.max(
    1,
    Math.round((0.39 * avgWordsPerSentence + 11.8 * avgSyllablesPerWord - 15.59) * 10) / 10
  );

  let readingLevel = 'Standard (8th - 9th Grade)';
  if (fleschReadingEase >= 90) readingLevel = 'Very Easy (5th Grade)';
  else if (fleschReadingEase >= 80) readingLevel = 'Easy (6th Grade)';
  else if (fleschReadingEase >= 70) readingLevel = 'Fairly Easy (7th Grade)';
  else if (fleschReadingEase >= 60) readingLevel = 'Standard (8th - 9th Grade)';
  else if (fleschReadingEase >= 50) readingLevel = 'Fairly Difficult (10th - 12th Grade)';
  else if (fleschReadingEase >= 30) readingLevel = 'Difficult (College Level)';
  else readingLevel = 'Very Difficult (Professional / Academic)';

  let out = `READABILITY AUDIT & COMPREHENSION METRICS\n`;
  out += `====================================================\n\n`;
  out += `• Flesch Reading Ease Score: ${fleschReadingEase} / 100\n`;
  out += `• Reading Grade Level: Grade ${fleschKincaidGrade} (${readingLevel})\n`;
  out += `• Estimated Reading Time: ${Math.ceil(wordCount / 200)} min\n\n`;

  out += `STATISTICAL BREAKDOWN:\n`;
  out += `• Total Words: ${wordCount}\n`;
  out += `• Total Sentences: ${sentenceCount}\n`;
  out += `• Total Syllables: ${totalSyllables}\n`;
  out += `• Complex Words (3+ Syllables): ${complexWordsCount} (${((complexWordsCount / Math.max(1, wordCount)) * 100).toFixed(1)}%)\n`;
  out += `• Average Sentence Length: ${avgWordsPerSentence.toFixed(1)} words\n`;

  const executionTimeMs = Math.round((performance.now() - startTime) * 100) / 100;
  return {
    success: true,
    output: out,
    telemetry: { executionTimeMs, inputChars: input.length, outputChars: out.length },
    meta: { fleschReadingEase, fleschKincaidGrade, wordCount, sentenceCount },
  };
}
