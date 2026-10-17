export interface PantoneColor {
  code: string;       // e.g. "PMS 186 C"
  name: string;       // e.g. "Pantone Red 186 C"
  hex: string;        // e.g. "#C8102E"
  rgb: [number, number, number];
  cmyk: [number, number, number, number];
  category?: string;
}

export interface PantoneMatchResult {
  pantone: PantoneColor;
  distance: number;
  similarity: number; // 0 to 100%
  deltaE: number;
}

// ─────────────────────────────────────────────
// Standard Pantone PMS Palette (High-Fidelity)
// ─────────────────────────────────────────────
export const PANTONE_PALETTE: PantoneColor[] = [
  // Yellows & Golds
  { code: 'PMS Yellow C', name: 'Pantone Yellow C', hex: '#FED100', rgb: [254, 209, 0], cmyk: [0, 18, 100, 0], category: 'Yellow' },
  { code: 'PMS 100 C', name: 'Pantone 100 C', hex: '#F6EB61', rgb: [246, 235, 97], cmyk: [4, 4, 61, 0], category: 'Yellow' },
  { code: 'PMS 102 C', name: 'Pantone 102 C', hex: '#FCE300', rgb: [252, 227, 0], cmyk: [0, 10, 100, 0], category: 'Yellow' },
  { code: 'PMS 108 C', name: 'Pantone 108 C', hex: '#FEDB00', rgb: [254, 219, 0], cmyk: [0, 14, 100, 0], category: 'Yellow' },
  { code: 'PMS 116 C', name: 'Pantone 116 C', hex: '#FFCD00', rgb: [255, 205, 0], cmyk: [0, 20, 100, 0], category: 'Yellow' },
  { code: 'PMS 123 C', name: 'Pantone 123 C', hex: '#FFC72C', rgb: [255, 199, 44], cmyk: [0, 22, 83, 0], category: 'Yellow' },
  { code: 'PMS 129 C', name: 'Pantone 129 C', hex: '#F3CD44', rgb: [243, 205, 68], cmyk: [0, 16, 72, 5], category: 'Yellow' },
  { code: 'PMS 130 C', name: 'Pantone 130 C', hex: '#F2A900', rgb: [242, 169, 0], cmyk: [0, 30, 100, 5], category: 'Yellow' },
  { code: 'PMS 137 C', name: 'Pantone 137 C', hex: '#FFA300', rgb: [255, 163, 0], cmyk: [0, 36, 100, 0], category: 'Yellow' },

  // Oranges & Ambers
  { code: 'PMS Orange 021 C', name: 'Pantone Orange 021 C', hex: '#FE5000', rgb: [254, 80, 0], cmyk: [0, 69, 100, 0], category: 'Orange' },
  { code: 'PMS 144 C', name: 'Pantone 144 C', hex: '#ED8B00', rgb: [237, 139, 0], cmyk: [0, 41, 100, 7], category: 'Orange' },
  { code: 'PMS 151 C', name: 'Pantone 151 C', hex: '#FF8200', rgb: [255, 130, 0], cmyk: [0, 49, 100, 0], category: 'Orange' },
  { code: 'PMS 158 C', name: 'Pantone 158 C', hex: '#E87722', rgb: [232, 119, 34], cmyk: [0, 49, 85, 9], category: 'Orange' },
  { code: 'PMS 165 C', name: 'Pantone 165 C', hex: '#FF671F', rgb: [255, 103, 31], cmyk: [0, 60, 88, 0], category: 'Orange' },
  { code: 'PMS 172 C', name: 'Pantone 172 C', hex: '#FA4616', rgb: [250, 70, 22], cmyk: [0, 72, 91, 2], category: 'Orange' },

  // Reds & Corals
  { code: 'PMS Warm Red C', name: 'Pantone Warm Red C', hex: '#F9423A', rgb: [249, 66, 58], cmyk: [0, 73, 77, 2], category: 'Red' },
  { code: 'PMS Red 032 C', name: 'Pantone Red 032 C', hex: '#EF3340', rgb: [239, 51, 64], cmyk: [0, 79, 73, 6], category: 'Red' },
  { code: 'PMS 179 C', name: 'Pantone 179 C', hex: '#E03C31', rgb: [224, 60, 49], cmyk: [0, 73, 78, 12], category: 'Red' },
  { code: 'PMS 185 C', name: 'Pantone 185 C', hex: '#E4002B', rgb: [228, 0, 43], cmyk: [0, 100, 81, 11], category: 'Red' },
  { code: 'PMS 186 C', name: 'Pantone 186 C', hex: '#C8102E', rgb: [200, 16, 46], cmyk: [0, 92, 77, 22], category: 'Red' },
  { code: 'PMS 199 C', name: 'Pantone 199 C', hex: '#D50032', rgb: [213, 0, 50], cmyk: [0, 100, 77, 16], category: 'Red' },
  { code: 'PMS 200 C', name: 'Pantone 200 C', hex: '#BA0C2F', rgb: [186, 12, 47], cmyk: [0, 94, 75, 27], category: 'Red' },
  { code: 'PMS 201 C', name: 'Pantone 201 C', hex: '#9D2235', rgb: [157, 34, 53], cmyk: [0, 78, 66, 38], category: 'Red' },
  { code: 'PMS 485 C', name: 'Pantone 485 C', hex: '#DA291C', rgb: [218, 41, 28], cmyk: [0, 81, 87, 15], category: 'Red' },
  { code: 'PMS 1788 C', name: 'Pantone 1788 C', hex: '#EE2737', rgb: [238, 39, 55], cmyk: [0, 84, 77, 7], category: 'Red' },

  // Pinks & Magentas
  { code: 'PMS Rubine Red C', name: 'Pantone Rubine Red C', hex: '#CE0058', rgb: [206, 0, 88], cmyk: [0, 100, 57, 19], category: 'Pink' },
  { code: 'PMS Rhodamine Red C', name: 'Pantone Rhodamine Red C', hex: '#E10098', rgb: [225, 0, 152], cmyk: [0, 100, 32, 12], category: 'Pink' },
  { code: 'PMS Pink C', name: 'Pantone Pink C', hex: '#D62598', rgb: [214, 37, 152], cmyk: [0, 83, 29, 16], category: 'Pink' },
  { code: 'PMS 212 C', name: 'Pantone 212 C', hex: '#F55393', rgb: [245, 83, 147], cmyk: [0, 66, 40, 4], category: 'Pink' },
  { code: 'PMS 219 C', name: 'Pantone 219 C', hex: '#DA1884', rgb: [218, 24, 132], cmyk: [0, 89, 39, 15], category: 'Pink' },
  { code: 'PMS 226 C', name: 'Pantone 226 C', hex: '#D9027D', rgb: [217, 2, 125], cmyk: [0, 99, 42, 15], category: 'Pink' },
  { code: 'PMS 239 C', name: 'Pantone 239 C', hex: '#BD28A1', rgb: [189, 40, 161], cmyk: [0, 79, 15, 26], category: 'Pink' },

  // Purples & Violets
  { code: 'PMS Purple C', name: 'Pantone Purple C', hex: '#BB29BB', rgb: [187, 41, 187], cmyk: [0, 78, 0, 27], category: 'Purple' },
  { code: 'PMS Violet C', name: 'Pantone Violet C', hex: '#440099', rgb: [68, 0, 153], cmyk: [56, 100, 0, 40], category: 'Purple' },
  { code: 'PMS Medium Purple C', name: 'Pantone Medium Purple C', hex: '#872B9A', rgb: [135, 43, 154], cmyk: [12, 72, 0, 40], category: 'Purple' },
  { code: 'PMS 253 C', name: 'Pantone 253 C', hex: '#AF3F9E', rgb: [175, 63, 158], cmyk: [0, 64, 10, 31], category: 'Purple' },
  { code: 'PMS 259 C', name: 'Pantone 259 C', hex: '#6D2077', rgb: [109, 32, 119], cmyk: [8, 73, 0, 53], category: 'Purple' },
  { code: 'PMS 266 C', name: 'Pantone 266 C', hex: '#753BBD', rgb: [117, 59, 189], cmyk: [38, 69, 0, 26], category: 'Purple' },
  { code: 'PMS 268 C', name: 'Pantone 268 C', hex: '#582C83', rgb: [88, 44, 131], cmyk: [33, 66, 0, 49], category: 'Purple' },
  { code: 'PMS 2685 C', name: 'Pantone 2685 C', hex: '#330072', rgb: [51, 0, 114], cmyk: [55, 100, 0, 55], category: 'Purple' },
  { code: 'PMS 2725 C', name: 'Pantone 2725 C', hex: '#685BC7', rgb: [104, 91, 199], cmyk: [48, 54, 0, 22], category: 'Purple' },

  // Blues & Cyans
  { code: 'PMS Process Blue C', name: 'Pantone Process Blue C', hex: '#0085CA', rgb: [0, 133, 202], cmyk: [100, 34, 0, 21], category: 'Blue' },
  { code: 'PMS Reflex Blue C', name: 'Pantone Reflex Blue C', hex: '#0A1172', rgb: [10, 17, 114], cmyk: [91, 85, 0, 55], category: 'Blue' },
  { code: 'PMS Blue 072 C', name: 'Pantone Blue 072 C', hex: '#10069F', rgb: [16, 6, 159], cmyk: [90, 96, 0, 38], category: 'Blue' },
  { code: 'PMS 285 C', name: 'Pantone 285 C', hex: '#0072CE', rgb: [0, 114, 206], cmyk: [100, 45, 0, 19], category: 'Blue' },
  { code: 'PMS 286 C', name: 'Pantone 286 C', hex: '#0033A0', rgb: [0, 51, 160], cmyk: [100, 68, 0, 37], category: 'Blue' },
  { code: 'PMS 287 C', name: 'Pantone 287 C', hex: '#003087', rgb: [0, 48, 135], cmyk: [100, 64, 0, 47], category: 'Blue' },
  { code: 'PMS 288 C', name: 'Pantone 288 C', hex: '#002D62', rgb: [0, 45, 98], cmyk: [100, 54, 0, 62], category: 'Blue' },
  { code: 'PMS 293 C', name: 'Pantone 293 C', hex: '#0051BA', rgb: [0, 81, 186], cmyk: [100, 56, 0, 27], category: 'Blue' },
  { code: 'PMS 299 C', name: 'Pantone 299 C', hex: '#00A3E0', rgb: [0, 163, 224], cmyk: [100, 27, 0, 12], category: 'Blue' },
  { code: 'PMS 300 C', name: 'Pantone 300 C', hex: '#005EB8', rgb: [0, 94, 184], cmyk: [100, 49, 0, 28], category: 'Blue' },
  { code: 'PMS 306 C', name: 'Pantone 306 C', hex: '#00B5E2', rgb: [0, 181, 226], cmyk: [100, 20, 0, 11], category: 'Blue' },
  { code: 'PMS 312 C', name: 'Pantone 312 C', hex: '#0092BC', rgb: [0, 146, 188], cmyk: [100, 22, 0, 26], category: 'Blue' },
  { code: 'PMS 2174 C', name: 'Pantone 2174 C', hex: '#007A87', rgb: [0, 122, 135], cmyk: [100, 10, 0, 47], category: 'Blue' },
  { code: 'PMS 2190 C', name: 'Pantone 2190 C', hex: '#0083BE', rgb: [0, 131, 190], cmyk: [100, 31, 0, 25], category: 'Blue' },
  { code: 'PMS 2388 C', name: 'Pantone 2388 C', hex: '#0066B2', rgb: [0, 102, 178], cmyk: [100, 43, 0, 30], category: 'Blue' },
  { code: 'PMS 3145 C', name: 'Pantone 3145 C', hex: '#007A87', rgb: [0, 122, 135], cmyk: [100, 10, 0, 47], category: 'Cyan' },
  { code: 'PMS 320 C', name: 'Pantone 320 C', hex: '#009CA6', rgb: [0, 156, 166], cmyk: [100, 6, 0, 35], category: 'Cyan' },

  // Greens & Teals
  { code: 'PMS Green C', name: 'Pantone Green C', hex: '#00AB84', rgb: [0, 171, 132], cmyk: [100, 0, 23, 33], category: 'Green' },
  { code: 'PMS 327 C', name: 'Pantone 327 C', hex: '#008770', rgb: [0, 135, 112], cmyk: [100, 0, 17, 47], category: 'Green' },
  { code: 'PMS 330 C', name: 'Pantone 330 C', hex: '#004B49', rgb: [0, 75, 73], cmyk: [100, 0, 3, 71], category: 'Green' },
  { code: 'PMS 340 C', name: 'Pantone 340 C', hex: '#00965E', rgb: [0, 150, 94], cmyk: [100, 0, 37, 41], category: 'Green' },
  { code: 'PMS 347 C', name: 'Pantone 347 C', hex: '#009A44', rgb: [0, 154, 68], cmyk: [100, 0, 56, 40], category: 'Green' },
  { code: 'PMS 354 C', name: 'Pantone 354 C', hex: '#00B140', rgb: [0, 177, 64], cmyk: [100, 0, 64, 31], category: 'Green' },
  { code: 'PMS 355 C', name: 'Pantone 355 C', hex: '#009639', rgb: [0, 150, 57], cmyk: [100, 0, 62, 41], category: 'Green' },
  { code: 'PMS 361 C', name: 'Pantone 361 C', hex: '#43B02A', rgb: [67, 176, 42], cmyk: [62, 0, 76, 31], category: 'Green' },
  { code: 'PMS 368 C', name: 'Pantone 368 C', hex: '#78BE20', rgb: [120, 190, 32], cmyk: [37, 0, 83, 25], category: 'Green' },
  { code: 'PMS 375 C', name: 'Pantone 375 C', hex: '#97D700', rgb: [151, 215, 0], cmyk: [30, 0, 100, 16], category: 'Green' },
  { code: 'PMS 382 C', name: 'Pantone 382 C', hex: '#C4D600', rgb: [196, 214, 0], cmyk: [8, 0, 100, 16], category: 'Green' },

  // Neutrals, Grays & Blacks
  { code: 'PMS Black C', name: 'Pantone Black C', hex: '#2D2926', rgb: [45, 41, 38], cmyk: [0, 9, 16, 82], category: 'Black' },
  { code: 'PMS Black 6 C', name: 'Pantone Black 6 C', hex: '#101820', rgb: [16, 24, 32], cmyk: [50, 25, 0, 87], category: 'Black' },
  { code: 'PMS Black 7 C', name: 'Pantone Black 7 C', hex: '#3D3935', rgb: [61, 57, 53], cmyk: [0, 7, 13, 76], category: 'Black' },
  { code: 'PMS Cool Gray 1 C', name: 'Pantone Cool Gray 1 C', hex: '#D9D9D6', rgb: [217, 217, 214], cmyk: [0, 0, 1, 15], category: 'Gray' },
  { code: 'PMS Cool Gray 3 C', name: 'Pantone Cool Gray 3 C', hex: '#C8C9C7', rgb: [200, 201, 199], cmyk: [0, 0, 1, 21], category: 'Gray' },
  { code: 'PMS Cool Gray 5 C', name: 'Pantone Cool Gray 5 C', hex: '#B1B3B3', rgb: [177, 179, 179], cmyk: [1, 0, 0, 30], category: 'Gray' },
  { code: 'PMS Cool Gray 7 C', name: 'Pantone Cool Gray 7 C', hex: '#97999B', rgb: [151, 153, 155], cmyk: [3, 1, 0, 39], category: 'Gray' },
  { code: 'PMS Cool Gray 9 C', name: 'Pantone Cool Gray 9 C', hex: '#75787B', rgb: [117, 120, 123], cmyk: [5, 2, 0, 52], category: 'Gray' },
  { code: 'PMS Cool Gray 11 C', name: 'Pantone Cool Gray 11 C', hex: '#53565A', rgb: [83, 86, 90], cmyk: [8, 4, 0, 65], category: 'Gray' },
  { code: 'PMS Warm Gray 1 C', name: 'Pantone Warm Gray 1 C', hex: '#D7D2CB', rgb: [215, 210, 203], cmyk: [0, 2, 6, 16], category: 'Gray' },
  { code: 'PMS Warm Gray 3 C', name: 'Pantone Warm Gray 3 C', hex: '#BFB8AF', rgb: [191, 184, 175], cmyk: [0, 4, 8, 25], category: 'Gray' },
  { code: 'PMS Warm Gray 5 C', name: 'Pantone Warm Gray 5 C', hex: '#ACA39A', rgb: [172, 163, 154], cmyk: [0, 5, 10, 33], category: 'Gray' },
  { code: 'PMS Warm Gray 7 C', name: 'Pantone Warm Gray 7 C', hex: '#968C83', rgb: [150, 140, 131], cmyk: [0, 7, 13, 41], category: 'Gray' },
  { code: 'PMS Warm Gray 9 C', name: 'Pantone Warm Gray 9 C', hex: '#83786F', rgb: [131, 120, 111], cmyk: [0, 8, 15, 49], category: 'Gray' },
  { code: 'PMS Warm Gray 11 C', name: 'Pantone Warm Gray 11 C', hex: '#6E6259', rgb: [110, 98, 89], cmyk: [0, 11, 19, 57], category: 'Gray' },

  // Browns, Earth & Tans
  { code: 'PMS 469 C', name: 'Pantone 469 C', hex: '#5B341F', rgb: [91, 52, 31], cmyk: [0, 43, 66, 64], category: 'Brown' },
  { code: 'PMS 476 C', name: 'Pantone 476 C', hex: '#4E3629', rgb: [78, 54, 41], cmyk: [0, 31, 47, 69], category: 'Brown' },
  { code: 'PMS 464 C', name: 'Pantone 464 C', hex: '#8A5D3B', rgb: [138, 93, 59], cmyk: [0, 33, 57, 46], category: 'Brown' },
  { code: 'PMS 465 C', name: 'Pantone 465 C', hex: '#B99B6B', rgb: [185, 155, 107], cmyk: [0, 16, 42, 27], category: 'Tan' },
  { code: 'PMS 468 C', name: 'Pantone 468 C', hex: '#D7C4A5', rgb: [215, 196, 165], cmyk: [0, 9, 23, 16], category: 'Tan' },
  { code: 'PMS 7527 C', name: 'Pantone 7527 C', hex: '#D6D2C4', rgb: [214, 210, 196], cmyk: [0, 2, 8, 16], category: 'Tan' },

  // Modern Pastels & Metallics
  { code: 'PMS 871 C', name: 'Pantone 871 C Metallic Gold', hex: '#84754E', rgb: [132, 117, 78], cmyk: [0, 11, 41, 48], category: 'Metallic' },
  { code: 'PMS 877 C', name: 'Pantone 877 C Metallic Silver', hex: '#8A8D8F', rgb: [138, 141, 143], cmyk: [3, 1, 0, 44], category: 'Metallic' },
  { code: 'PMS 9043 C', name: 'Pantone 9043 C Pastel Peach', hex: '#FAD2B8', rgb: [250, 210, 184], cmyk: [0, 16, 26, 2], category: 'Pastel' },
  { code: 'PMS 9180 C', name: 'Pantone 9180 C Pastel Mint', hex: '#D1E8D5', rgb: [209, 232, 213], cmyk: [10, 0, 8, 9], category: 'Pastel' },
  { code: 'PMS 9225 C', name: 'Pantone 9225 C Pastel Lavender', hex: '#DCCCE6', rgb: [220, 204, 230], cmyk: [4, 11, 0, 10], category: 'Pastel' },
  { code: 'PMS 9283 C', name: 'Pantone 9283 C Pastel Sky', hex: '#CCE2ED', rgb: [204, 226, 237], cmyk: [14, 5, 0, 7], category: 'Pastel' },
];

// ─────────────────────────────────────────────
// Color Math & Algorithmic Matching
// ─────────────────────────────────────────────

/** Parse 3-digit or 6-digit hex string into [R, G, B] */
export function hexToRgb(hexStr: string): [number, number, number] | null {
  const clean = hexStr.replace(/^#/, '').trim();
  if (clean.length === 3) {
    const r = parseInt(clean[0] + clean[0], 16);
    const g = parseInt(clean[1] + clean[1], 16);
    const b = parseInt(clean[2] + clean[2], 16);
    if (isNaN(r) || isNaN(g) || isNaN(b)) return null;
    return [r, g, b];
  }
  if (clean.length === 6) {
    const r = parseInt(clean.substring(0, 2), 16);
    const g = parseInt(clean.substring(2, 4), 16);
    const b = parseInt(clean.substring(4, 6), 16);
    if (isNaN(r) || isNaN(g) || isNaN(b)) return null;
    return [r, g, b];
  }
  return null;
}

/** Weighted perceptual RGB distance (Redmean approximation for human vision) */
export function calculateColorDistance(
  rgb1: [number, number, number],
  rgb2: [number, number, number]
): number {
  const rMean = (rgb1[0] + rgb2[0]) / 2;
  const dR = rgb1[0] - rgb2[0];
  const dG = rgb1[1] - rgb2[1];
  const dB = rgb1[2] - rgb2[2];
  const weightR = 2 + rMean / 256;
  const weightG = 4.0;
  const weightB = 2 + (255 - rMean) / 256;
  return Math.sqrt(weightR * dR * dR + weightG * dG * dG + weightB * dB * dB);
}

/**
 * Finds the top nearest Pantone matches for a given Hex color.
 * Returns array of matches sorted by closest distance.
 */
export function findNearestPantone(hex: string, limit: number = 4): PantoneMatchResult[] {
  const rgb = hexToRgb(hex);
  if (!rgb) return [];

  // Theoretical max redmean distance ~764.83
  const maxDistance = 765;

  const results: PantoneMatchResult[] = PANTONE_PALETTE.map((p) => {
    const dist = calculateColorDistance(rgb, p.rgb);
    // Similarity percentage: 100% when distance is 0
    const similarity = Math.max(0, Math.min(100, Math.round((1 - dist / maxDistance) * 1000) / 10));
    // Approximate deltaE from distance
    const deltaE = Math.round((dist / 10) * 10) / 10;
    return {
      pantone: p,
      distance: Math.round(dist * 10) / 10,
      similarity,
      deltaE,
    };
  });

  results.sort((a, b) => a.distance - b.distance);
  return results.slice(0, limit);
}
