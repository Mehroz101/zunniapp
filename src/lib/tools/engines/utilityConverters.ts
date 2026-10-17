import { ToolExecutionResult } from '../types';
import { findNearestPantone, hexToRgb } from '../data/pantoneColors';

// ─────────────────────────────────────────────
// 1. ASCII to Hex Engine
// ─────────────────────────────────────────────
export interface AsciiToHexOptions {
  delimiter?: 'space' | 'none' | 'comma' | 'prefix-0x' | 'prefix-slash-x';
  letterCase?: 'lowercase' | 'uppercase';
  direction?: 'ascii-to-hex' | 'hex-to-ascii';
}

export function convertAsciiToHex(
  input: string,
  options: AsciiToHexOptions = {}
): { output: string; byteCount: number } {
  const delimiter = options.delimiter || 'space';
  const letterCase = options.letterCase || 'lowercase';

  // Use TextEncoder to get deterministic UTF-8 bytes
  const encoder = new TextEncoder();
  const bytes = encoder.encode(input);

  const hexArray: string[] = [];
  for (let i = 0; i < bytes.length; i++) {
    let hex = bytes[i].toString(16).padStart(2, '0');
    if (letterCase === 'uppercase') hex = hex.toUpperCase();

    if (delimiter === 'prefix-0x') {
      hexArray.push(`0x${hex}`);
    } else if (delimiter === 'prefix-slash-x') {
      hexArray.push(`\\x${hex}`);
    } else {
      hexArray.push(hex);
    }
  }

  let separator = ' ';
  if (delimiter === 'none') separator = '';
  else if (delimiter === 'comma') separator = ', ';
  else if (delimiter === 'prefix-slash-x') separator = '';
  else separator = ' ';

  return {
    output: hexArray.join(separator),
    byteCount: bytes.length,
  };
}

export function convertHexToAscii(
  input: string
): { output: string; byteCount: number } {
  // Strip 0x, \x, commas, whitespace, colons
  const cleaned = input
    .replace(/0x/gi, '')
    .replace(/\\x/gi, '')
    .replace(/[\s,:-]/g, '')
    .trim();

  if (!cleaned) {
    return { output: '', byteCount: 0 };
  }

  // Validate hex characters
  if (!/^[0-9a-fA-F]+$/.test(cleaned)) {
    throw new Error('Invalid hexadecimal string: Contains non-hex characters [0-9, a-f].');
  }

  if (cleaned.length % 2 !== 0) {
    throw new Error('Incomplete hexadecimal sequence: Hex bytes must consist of pairs of characters.');
  }

  const byteArray = new Uint8Array(cleaned.length / 2);
  for (let i = 0; i < cleaned.length; i += 2) {
    const byte = parseInt(cleaned.substring(i, i + 2), 16);
    byteArray[i / 2] = byte;
  }

  const decoder = new TextDecoder('utf-8', { fatal: false });
  return {
    output: decoder.decode(byteArray),
    byteCount: byteArray.length,
  };
}

export function runAsciiToHex(
  input: string,
  options?: AsciiToHexOptions
): ToolExecutionResult {
  const startTime = performance.now();
  const trimmed = input || '';

  if (!trimmed) {
    return {
      success: true,
      output: '',
      telemetry: { executionTimeMs: 0, inputChars: 0, outputChars: 0 },
    };
  }

  try {
    const direction = options?.direction || 'ascii-to-hex';
    let resultOutput = '';
    let bytes = 0;

    if (direction === 'hex-to-ascii') {
      const res = convertHexToAscii(trimmed);
      resultOutput = res.output;
      bytes = res.byteCount;
    } else {
      const res = convertAsciiToHex(trimmed, options);
      resultOutput = res.output;
      bytes = res.byteCount;
    }

    return {
      success: true,
      output: resultOutput,
      telemetry: {
        executionTimeMs: Math.round((performance.now() - startTime) * 100) / 100,
        inputChars: trimmed.length,
        outputChars: resultOutput.length,
      },
      meta: {
        byteCount: bytes,
        direction,
      },
    };
  } catch (err: any) {
    return {
      success: false,
      output: '',
      error: { message: err?.message || 'Hexadecimal conversion error.' },
      telemetry: {
        executionTimeMs: Math.round((performance.now() - startTime) * 100) / 100,
        inputChars: trimmed.length,
        outputChars: 0,
      },
    };
  }
}

// ─────────────────────────────────────────────
// 2. Base64 to Text Engine
// ─────────────────────────────────────────────
export interface Base64Options {
  direction?: 'base64-to-text' | 'text-to-base64';
  urlSafe?: boolean;
  wrapLines?: boolean;
}

export function decodeBase64ToText(input: string): string {
  // Normalize URL-safe base64 and remove whitespace
  let clean = input
    .replace(/[\r\n\s]/g, '')
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  if (!clean) return '';

  // Add missing padding
  const pad = (4 - (clean.length % 4)) % 4;
  clean += '='.repeat(pad);

  // Validate base64 charset
  if (!/^[A-Za-z0-9+/=]+$/.test(clean)) {
    throw new Error('Invalid Base64 sequence: String contains characters outside RFC 4648 Base64 alphabet.');
  }

  try {
    const binary = atob(clean);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    const decoder = new TextDecoder('utf-8', { fatal: true });
    return decoder.decode(bytes);
  } catch (err: any) {
    // If UTF-8 decode fails, fallback to non-fatal or provide descriptive error
    try {
      const binary = atob(clean);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      return new TextDecoder('utf-8', { fatal: false }).decode(bytes);
    } catch {
      throw new Error('Malformed Base64 payload: Unable to decode binary stream.');
    }
  }
}

export function encodeTextToBase64(input: string, options: Base64Options = {}): string {
  if (!input) return '';
  const encoder = new TextEncoder();
  const bytes = encoder.encode(input);

  let binary = '';
  const chunkSize = 8192;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, i + chunkSize);
    binary += String.fromCharCode(...Array.from(chunk));
  }

  let b64 = btoa(binary);

  if (options.urlSafe) {
    b64 = b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }

  if (options.wrapLines) {
    b64 = b64.replace(/(.{76})/g, '$1\n');
  }

  return b64;
}

export function runBase64ToText(
  input: string,
  options?: Base64Options
): ToolExecutionResult {
  const startTime = performance.now();
  const trimmed = input || '';

  if (!trimmed) {
    return {
      success: true,
      output: '',
      telemetry: { executionTimeMs: 0, inputChars: 0, outputChars: 0 },
    };
  }

  try {
    const direction = options?.direction || 'base64-to-text';
    let output = '';

    if (direction === 'text-to-base64') {
      output = encodeTextToBase64(trimmed, options);
    } else {
      output = decodeBase64ToText(trimmed);
    }

    return {
      success: true,
      output,
      telemetry: {
        executionTimeMs: Math.round((performance.now() - startTime) * 100) / 100,
        inputChars: trimmed.length,
        outputChars: output.length,
      },
      meta: { direction },
    };
  } catch (err: any) {
    return {
      success: false,
      output: '',
      error: { message: err?.message || 'Base64 decoding failed. Check formatting and padding.' },
      telemetry: {
        executionTimeMs: Math.round((performance.now() - startTime) * 100) / 100,
        inputChars: trimmed.length,
        outputChars: 0,
      },
    };
  }
}

// ─────────────────────────────────────────────
// 3. Hex Code to Pantone Converter Engine
// ─────────────────────────────────────────────
export interface HexToPantoneOptions {
  maxMatches?: number;
}

export function runHexToPantone(
  input: string,
  options?: HexToPantoneOptions
): ToolExecutionResult {
  const startTime = performance.now();
  const rawHex = (input || '').trim().replace(/^#/, '');

  if (!rawHex) {
    return {
      success: true,
      output: '',
      telemetry: { executionTimeMs: 0, inputChars: 0, outputChars: 0 },
    };
  }

  const rgb = hexToRgb(rawHex);
  if (!rgb) {
    return {
      success: false,
      output: '',
      error: {
        message: `Invalid Hex color code "${input}". Please provide a standard 3-character or 6-character hexadecimal color (e.g. #FF5733 or #00D2FF).`,
      },
      telemetry: {
        executionTimeMs: Math.round((performance.now() - startTime) * 100) / 100,
        inputChars: input.length,
        outputChars: 0,
      },
    };
  }

  const matches = findNearestPantone(`#${rawHex}`, options?.maxMatches || 4);
  if (matches.length === 0) {
    return {
      success: false,
      output: '',
      error: { message: 'No matching Pantone PMS color could be resolved.' },
      telemetry: { executionTimeMs: 0, inputChars: input.length, outputChars: 0 },
    };
  }

  const primary = matches[0];
  const normalizedHex = `#${rawHex.length === 3 ? rawHex.split('').map(c => c + c).join('') : rawHex}`.toUpperCase();

  // Build clean markdown report
  let report = `### Best Pantone Matching System (PMS) Result\n\n`;
  report += `• Matched Pantone: **${primary.pantone.name}** (${primary.pantone.code})\n`;
  report += `• Match Fidelity: **${primary.similarity}% Similarity** (Perceptual ΔE: ${primary.deltaE})\n`;
  report += `• Pantone Hex: \`${primary.pantone.hex}\`\n`;
  report += `• Pantone RGB: \`rgb(${primary.pantone.rgb.join(', ')})\`\n`;
  report += `• Pantone CMYK: \`cmyk(${primary.pantone.cmyk.join('%, ')}%)\`\n\n`;

  report += `---\n\n`;
  report += `### Top Closest Pantone Alternatives\n\n`;
  matches.forEach((m, idx) => {
    report += `${idx + 1}. **${m.pantone.name}** (\`${m.pantone.hex}\`) — ${m.similarity}% match (ΔE = ${m.deltaE})\n`;
    report += `   RGB: ${m.pantone.rgb.join(', ')} | CMYK: ${m.pantone.cmyk.join('%, ')}%\n`;
  });

  return {
    success: true,
    output: report,
    telemetry: {
      executionTimeMs: Math.round((performance.now() - startTime) * 100) / 100,
      inputChars: input.length,
      outputChars: report.length,
    },
    meta: {
      inputHex: normalizedHex,
      inputRgb: rgb,
      primaryMatch: primary,
      matches,
    },
  };
}

// ─────────────────────────────────────────────
// 4. Decimal to ASCII Converter Engine
// ─────────────────────────────────────────────
export interface DecimalToAsciiOptions {
  delimiter?: 'space' | 'comma' | 'newline';
  direction?: 'decimal-to-ascii' | 'ascii-to-decimal';
}

export function convertDecimalToAscii(input: string): string {
  // Support space, comma, newline, semicolon, or HTML entity tokens (&#72;&#101;)
  let sanitized = input
    .replace(/&#(\d+);/g, '$1 ')
    .replace(/[,;]/g, ' ')
    .replace(/\r?\n/g, ' ')
    .trim();

  if (!sanitized) return '';

  const tokens = sanitized.split(/\s+/).filter(Boolean);
  const chars: string[] = [];

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    const code = Number(token);

    if (isNaN(code) || !Number.isInteger(code)) {
      throw new Error(`Invalid decimal token "${token}" at position ${i + 1}. Decimal codes must be whole integers.`);
    }

    if (code < 0 || code > 0x10FFFF) {
      throw new Error(
        `Code value ${code} at position ${i + 1} is out of valid Unicode bounds (0 to 1,114,111 / 0x10FFFF).`
      );
    }

    try {
      chars.push(String.fromCodePoint(code));
    } catch {
      throw new Error(`Invalid Unicode code point ${code} at position ${i + 1}.`);
    }
  }

  return chars.join('');
}

export function convertAsciiToDecimal(
  input: string,
  options: DecimalToAsciiOptions = {}
): string {
  if (!input) return '';
  const delimiter = options.delimiter || 'space';
  const sep = delimiter === 'comma' ? ', ' : delimiter === 'newline' ? '\n' : ' ';

  const codepoints: number[] = [];
  for (const char of input) {
    const cp = char.codePointAt(0);
    if (cp !== undefined) codepoints.push(cp);
  }

  return codepoints.join(sep);
}

export function runDecimalToAscii(
  input: string,
  options?: DecimalToAsciiOptions
): ToolExecutionResult {
  const startTime = performance.now();
  const trimmed = input || '';

  if (!trimmed) {
    return {
      success: true,
      output: '',
      telemetry: { executionTimeMs: 0, inputChars: 0, outputChars: 0 },
    };
  }

  try {
    const direction = options?.direction || 'decimal-to-ascii';
    let output = '';

    if (direction === 'ascii-to-decimal') {
      output = convertAsciiToDecimal(trimmed, options);
    } else {
      output = convertDecimalToAscii(trimmed);
    }

    return {
      success: true,
      output,
      telemetry: {
        executionTimeMs: Math.round((performance.now() - startTime) * 100) / 100,
        inputChars: trimmed.length,
        outputChars: output.length,
      },
      meta: { direction },
    };
  } catch (err: any) {
    return {
      success: false,
      output: '',
      error: { message: err?.message || 'Decimal conversion failed.' },
      telemetry: {
        executionTimeMs: Math.round((performance.now() - startTime) * 100) / 100,
        inputChars: trimmed.length,
        outputChars: 0,
      },
    };
  }
}
