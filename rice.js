// Ratio table and calculation. No DOM access; the page (app.js) and the tests both import this.
//
// A ratio is grams of total water per gram of dry rice, including the water that
// clings to the rice after rinsing. Every value is explained in docs/sources.md:
// change both together, and update the expected values in test/rice.test.js.
//
// Key order is the order the options appear on the page. The first type is the default.
// Every method must list the same types.

// Generic long grain cooks like basmati.
const LONG_GRAIN_RICE_COOKER = { fluffy: 1.9, grainy: 1.65 };
const LONG_GRAIN_HOB = { fluffy: 2.0, grainy: 1.8 };

// Hob and oven use the same water: a tightly covered pot, and for the oven boiling water to start.
const HOB_AND_OVEN = {
  jasmine: { fluffy: 1.65, grainy: 1.45 },
  basmati: LONG_GRAIN_HOB,
  'long-grain': LONG_GRAIN_HOB,
  sushi: { rolling: 1.4, onigiri: 1.5, poke: 1.45 },
  'short-grain': { soft: 1.55, firm: 1.45 },
};

export const RATIOS = {
  'rice-cooker': {
    jasmine: { fluffy: 1.4, grainy: 1.25 },
    basmati: LONG_GRAIN_RICE_COOKER,
    'long-grain': LONG_GRAIN_RICE_COOKER,
    sushi: { rolling: 1.25, onigiri: 1.35, poke: 1.3 },
    'short-grain': { soft: 1.4, firm: 1.3 },
  },
  hob: HOB_AND_OVEN,
  oven: HOB_AND_OVEN,
};

// Headings in the rice pick-list. Every type appears in exactly one group, in table order.
export const TYPE_GROUPS = [
  { label: 'Long grain', types: ['jasmine', 'basmati', 'long-grain'] },
  { label: 'Short grain', types: ['sushi', 'short-grain'] },
];

export const MAX_RICE = 1999;

function isValidRice(rice) {
  return Number.isInteger(rice) && rice >= 1 && rice <= MAX_RICE;
}

// Text from the input field -> whole grams, or null if it is not a whole number from 1 to MAX_RICE.
export function parseRice(input) {
  const text = String(input).trim();
  if (!/^\d+$/.test(text)) return null;
  const rice = Number(text);
  return isValidRice(rice) ? rice : null;
}

function lookupRatio(method, type, preference) {
  let node = RATIOS;
  for (const key of [method, type, preference]) {
    if (typeof node !== 'object' || !Object.hasOwn(node, key)) return null;
    node = node[key];
  }
  return typeof node === 'number' ? node : null;
}

// Returns { ratio, water, target } in whole grams, or null for invalid rice or an unknown combination.
export function calculate({ rice, method, type, preference }) {
  if (!isValidRice(rice)) return null;
  const ratio = lookupRatio(method, type, preference);
  if (ratio === null) return null;
  // Work in whole thousandths so that exact half grams round up despite floating point.
  const water = Math.round((rice * Math.round(ratio * 1000)) / 1000);
  return { ratio, water, target: rice + water };
}

// 1.25 -> "1 : 1.25". Two decimals, or three if the value has a third.
export function formatRatio(ratio) {
  const thousandths = Math.round(ratio * 1000);
  return `1 : ${(thousandths / 1000).toFixed(thousandths % 10 === 0 ? 2 : 3)}`;
}
